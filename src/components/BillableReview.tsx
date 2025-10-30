import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  DollarSign,
  Clock,
  Briefcase,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockTimeEntries, mockWorkOrders, categories } from '../lib/mockData';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { BottomNav } from './BottomNav';
import { toast } from 'sonner@2.0.3';

export const BillableReview = () => {
  const { setCurrentScreen } = useApp();
  const [filterStatus, setFilterStatus] = useState<'all' | 'billable' | 'non-billable'>('all');
  const [filterWorkOrder, setFilterWorkOrder] = useState<string | null>(null);
  
  // Track billable status locally (in real app, this would sync with backend)
  const [billableStatus, setBillableStatus] = useState<Record<string, boolean>>(
    mockTimeEntries.reduce((acc, entry) => ({
      ...acc,
      [entry.id]: entry.billable,
    }), {})
  );

  const toggleBillable = (entryId: string) => {
    setBillableStatus(prev => ({
      ...prev,
      [entryId]: !prev[entryId],
    }));
    toast.success(billableStatus[entryId] ? 'Marked as non-billable' : 'Marked as billable');
  };

  const markAllBillable = (billable: boolean) => {
    const newStatus = { ...billableStatus };
    filteredEntries.forEach(entry => {
      newStatus[entry.id] = billable;
    });
    setBillableStatus(newStatus);
    toast.success(`${filteredEntries.length} entries marked as ${billable ? 'billable' : 'non-billable'}`);
  };

  const filteredEntries = mockTimeEntries.filter((entry) => {
    if (filterStatus === 'billable' && !billableStatus[entry.id]) return false;
    if (filterStatus === 'non-billable' && billableStatus[entry.id]) return false;
    if (filterWorkOrder && entry.workOrderId !== filterWorkOrder) return false;
    return true;
  });

  const totalHours = filteredEntries.reduce((sum, e) => sum + e.duration, 0) / 60;
  const billableHours = filteredEntries.filter(e => billableStatus[e.id]).reduce((sum, e) => sum + e.duration, 0) / 60;
  const billablePercentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0;

  const getWorkOrderTitle = (workOrderId: string | null) => {
    if (!workOrderId) return 'Personal Task';
    return mockWorkOrders.find((wo) => wo.id === workOrderId)?.title || 'Unknown';
  };

  const getCategoryColor = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.color || '#4B5CFB';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-card border-b border-border">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2 hover:bg-muted rounded-xl transition-all zen-shadow"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h2 className="mb-1">Billable Review</h2>
              <p className="text-sm text-muted-foreground opacity-80">
                Manage billing status for your time entries
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 h-11">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterStatus === 'all' ? 'All Entries' : filterStatus === 'billable' ? 'Billable' : 'Non-billable'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Entries
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('billable')}>
                  Billable Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('non-billable')}>
                  Non-billable Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 h-11">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {filterWorkOrder ? mockWorkOrders.find(wo => wo.id === filterWorkOrder)?.title : 'All Projects'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterWorkOrder(null)}>
                  All Projects
                </DropdownMenuItem>
                {mockWorkOrders.map(wo => (
                  <DropdownMenuItem key={wo.id} onClick={() => setFilterWorkOrder(wo.id)}>
                    {wo.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-5 bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-border/50">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl mb-1.5" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {totalHours.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, letterSpacing: '0.02em' }}>
                Total Hours
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1.5 text-success" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {billableHours.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, letterSpacing: '0.02em' }}>
                Billable
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl mb-1.5 text-primary" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {billablePercentage.toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, letterSpacing: '0.02em' }}>
                Rate
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 flex gap-3 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-11"
            onClick={() => markAllBillable(true)}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            All Billable
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-11"
            onClick={() => markAllBillable(false)}
          >
            <XCircle className="w-4 h-4 mr-2" />
            All Non-billable
          </Button>
        </div>
      </div>

      {/* Entries List */}
      <div className="px-6 py-5 space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground" style={{ fontWeight: 500 }}>No entries found</p>
            <p className="text-sm text-muted-foreground mt-1 opacity-70">Try adjusting your filters</p>
          </div>
        ) : (
          filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass-card rounded-2xl p-5 zen-shadow-md hover:zen-shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Billable Toggle Button */}
                <div className="flex-shrink-0">
                  <motion.button
                    onClick={() => toggleBillable(entry.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      billableStatus[entry.id]
                        ? 'bg-gradient-to-br from-success to-secondary text-white shadow-lg shadow-success/25'
                        : 'bg-muted/80 text-muted-foreground hover:bg-muted'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {billableStatus[entry.id] ? (
                      <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="w-6 h-6" strokeWidth={2} />
                    )}
                  </motion.button>
                </div>

                {/* Entry Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="mb-2" style={{ fontWeight: 600 }}>{entry.task}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Briefcase className="w-4 h-4" strokeWidth={2} />
                    <span className="truncate" style={{ fontWeight: 500 }}>
                      {getWorkOrderTitle(entry.workOrderId)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                      <span style={{ fontWeight: 500 }}>{entry.startTime} - {entry.endTime}</span>
                    </div>
                    
                    <span
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ 
                        backgroundColor: `${getCategoryColor(entry.category)}15`,
                        color: getCategoryColor(entry.category),
                        fontWeight: 600
                      }}
                    >
                      {entry.category}
                    </span>

                    <span className="text-xs px-2.5 py-1 bg-muted/60 rounded-full" style={{ fontWeight: 600 }}>
                      {Math.floor(entry.duration / 60)}h {entry.duration % 60}m
                    </span>
                  </div>
                </div>

                {/* Switch Toggle */}
                <div className="flex-shrink-0 pt-2">
                  <Switch
                    checked={billableStatus[entry.id]}
                    onCheckedChange={() => toggleBillable(entry.id)}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BottomNav currentScreen="home" />
    </div>
  );
};
