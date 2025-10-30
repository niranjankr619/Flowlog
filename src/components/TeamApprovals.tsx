import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  ChevronRight,
  Calendar,
  Briefcase,
  Users,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockTeamMembers, mockTimeEntries, categories } from '../lib/mockData';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { BottomNav } from './BottomNav';

export const TeamApprovals = () => {
  const { setCurrentScreen } = useApp();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [approvalStates, setApprovalStates] = useState<Record<string, 'approved' | 'pending' | 'rejected'>>(
    Object.fromEntries(mockTeamMembers.map(m => [m.id, m.status as 'approved' | 'pending']))
  );

  const approvedCount = Object.values(approvalStates).filter(s => s === 'approved').length;
  const pendingCount = Object.values(approvalStates).filter(s => s === 'pending').length;
  const approvedPercentage = ((approvedCount / mockTeamMembers.length) * 100).toFixed(0);

  const handleApprove = (memberId: string, memberName: string) => {
    setApprovalStates(prev => ({ ...prev, [memberId]: 'approved' }));
    toast.success(`Approved ${memberName}'s time entries`, {
      icon: '✓',
    });
  };

  const handleReject = (memberId: string, memberName: string) => {
    setApprovalStates(prev => ({ ...prev, [memberId]: 'rejected' }));
    toast.error(`Rejected ${memberName}'s time entries`, {
      icon: '✗',
    });
  };

  const getCategoryColor = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.color || '#4B5CFB';
  };

  if (selectedMember) {
    const member = mockTeamMembers.find(m => m.id === selectedMember);
    if (!member) return null;

    // Mock entries for the selected member
    const memberEntries = mockTimeEntries.slice(0, 3);

    return (
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-overlay border-b border-border">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 flex-1">
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3>{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-2xl mb-1">{member.hoursThisWeek}h</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="text-2xl mb-1">{memberEntries.length}</p>
                <p className="text-xs text-muted-foreground">Entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed logs */}
        <div className="p-4 space-y-3">
          {memberEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl p-4"
            >
              <h4 className="mb-2">{entry.task}</h4>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{entry.startTime} - {entry.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{entry.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs text-white"
                  style={{ backgroundColor: getCategoryColor(entry.category) }}
                >
                  {entry.category}
                </span>
                <span className="px-3 py-1 bg-muted rounded-full text-xs">
                  {entry.duration} min
                </span>
                {entry.billable && (
                  <span className="px-3 py-1 bg-success/20 text-success rounded-full text-xs">
                    Billable
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Approval actions */}
        <div className="fixed bottom-0 left-0 right-0 glass-overlay border-t border-border p-4">
          <div className="flex gap-3 max-w-2xl mx-auto">
            <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  handleReject(member.id, member.name);
                  setSelectedMember(null);
                }}
              >
                <X className="w-5 h-5 mr-2" />
                Reject
              </Button>
            </motion.div>
            <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
              <Button
                className="w-full bg-success hover:bg-success/90"
                onClick={() => {
                  handleApprove(member.id, member.name);
                  setSelectedMember(null);
                }}
              >
                <Check className="w-5 h-5 mr-2" />
                Approve
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-overlay border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2>Team Approvals</h2>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{mockTeamMembers.length}</p>
              <p className="text-xs text-muted-foreground">Team Size</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-2xl mb-1 text-success">{approvedPercentage}%</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div className="glass-card rounded-xl p-3 text-center">
              <p className="text-2xl mb-1 text-accent">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team members list */}
      <div className="p-4 space-y-3">
        {mockTeamMembers.map((member, index) => (
          <motion.button
            key={member.id}
            onClick={() => setSelectedMember(member.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="w-full glass-card rounded-xl p-4 text-left hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3>{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{member.hoursThisWeek}h this week</span>
              </div>

              <motion.div
                className={`px-3 py-1 rounded-full text-xs ${
                  approvalStates[member.id] === 'approved'
                    ? 'bg-success/20 text-success'
                    : approvalStates[member.id] === 'rejected'
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-accent/20 text-accent'
                }`}
              >
                {approvalStates[member.id] === 'approved' && '✓ Approved'}
                {approvalStates[member.id] === 'pending' && 'Pending'}
                {approvalStates[member.id] === 'rejected' && '✗ Rejected'}
              </motion.div>
            </div>

            {/* Quick actions for pending */}
            <AnimatePresence>
              {approvalStates[member.id] === 'pending' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 mt-3 pt-3 border-t border-border"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(member.id, member.name);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(member.id, member.name);
                    }}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Bottom nav */}
      <BottomNav currentScreen="home" />
    </div>
  );
};
