import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Search,
  Briefcase,
  Layers,
  Plus,
  ChevronRight,
  Utensils,
  Users,
  MessageCircle,
  DoorOpen,
  Edit,
  IndianRupee,
  Info,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { mockWorkOrders, quickActivities } from '../lib/mockData';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';

const iconMap = {
  utensils: Utensils,
  users: Users,
  'message-circle': MessageCircle,
  'door-open': DoorOpen,
  edit: Edit,
};

export const ActivitySelector = () => {
  const { setCurrentScreen, timerState, setTimerState } = useApp();
  const [activeTab, setActiveTab] = useState<'quick' | 'direct' | 'sequence'>('quick');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showOtherDialog, setShowOtherDialog] = useState(false);
  const [otherReason, setOtherReason] = useState('');
  const [newWorkOrder, setNewWorkOrder] = useState({
    title: '',
    client: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    status: 'Pending' as 'In Progress' | 'Pending' | 'Completed',
    type: 'direct' as 'direct' | 'sequence',
  });

  const filteredOrders = mockWorkOrders.filter(
    (wo) =>
      wo.type === activeTab &&
      (wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wo.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectQuickActivity = (activityId: string) => {
    if (activityId === 'other') {
      setShowOtherDialog(true);
      return;
    }

    const activity = quickActivities.find((a) => a.id === activityId);
    setTimerState({
      ...timerState,
      activityType: 'quick-activity',
      activityId,
      workOrderId: null,
      taskName: activity?.name || '',
    });
    toast.success(`Selected: ${activity?.name}`);
    setCurrentScreen('home');
  };

  const handleSelectOther = () => {
    if (!otherReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setTimerState({
      ...timerState,
      activityType: 'quick-activity',
      activityId: 'other',
      workOrderId: null,
      activityReason: otherReason,
      taskName: otherReason,
    });
    toast.success('Activity selected');
    setShowOtherDialog(false);
    setOtherReason('');
    setCurrentScreen('home');
  };

  const handleSelectWorkOrder = (id: string) => {
    const workOrder = mockWorkOrders.find((wo) => wo.id === id);
    setTimerState({
      ...timerState,
      activityType: 'work-order',
      workOrderId: id,
      activityId: null,
      taskName: workOrder?.title || '',
      billable: workOrder?.billable || false,
      rate: workOrder?.rate || 0,
    });
    toast.success(`Selected: ${workOrder?.title}`);
    setCurrentScreen('home');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/10 text-red-600 border-red-200';
      case 'Medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'Low':
        return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Pending':
        return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'Completed':
        return 'bg-green-500/10 text-green-600 border-green-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddWorkOrder = () => {
    if (!newWorkOrder.title || !newWorkOrder.client) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newId = `WO-${String(mockWorkOrders.length + 1).padStart(3, '0')}`;
    
    const workOrder = {
      id: newId,
      title: newWorkOrder.title,
      client: newWorkOrder.client,
      status: newWorkOrder.status,
      priority: newWorkOrder.priority,
      lastActivity: 'Just now',
      type: newWorkOrder.type,
    };

    mockWorkOrders.push(workOrder);
    
    toast.success(`Work order ${newId} created successfully!`);
    
    setNewWorkOrder({
      title: '',
      client: '',
      priority: 'Medium',
      status: 'Pending',
      type: 'direct',
    });
    setShowAddDialog(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-card border-b border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setCurrentScreen('home')}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2>Link Activity</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 mb-4 p-1 bg-muted/30 rounded-2xl">
            <motion.button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                activeTab === 'quick'
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              style={{ fontWeight: activeTab === 'quick' ? 600 : 500 }}
              whileTap={{ scale: 0.97 }}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span className="text-xs">Quick</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                activeTab === 'direct'
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              style={{ fontWeight: activeTab === 'direct' ? 600 : 500 }}
              whileTap={{ scale: 0.97 }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="text-xs">Direct</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('sequence')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all ${
                activeTab === 'sequence'
                  ? 'bg-gradient-to-r from-secondary to-primary text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
              style={{ fontWeight: activeTab === 'sequence' ? 600 : 500 }}
              whileTap={{ scale: 0.97 }}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-xs">Sequence</span>
            </motion.button>
          </div>

          {/* Search - only for work orders */}
          {activeTab !== 'quick' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search work orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input-background rounded-2xl"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Quick Activities */}
        {activeTab === 'quick' && (
          <div className="space-y-3">
            {quickActivities.map((activity, index) => {
              const IconComponent = iconMap[activity.icon as keyof typeof iconMap];
              return (
                <motion.button
                  key={activity.id}
                  onClick={() => handleSelectQuickActivity(activity.id)}
                  className="w-full text-left glass-card rounded-2xl p-5 hover:shadow-lg transition-all border border-border hover:border-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${activity.color}15`,
                      }}
                    >
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: activity.color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1" style={{ fontWeight: 600 }}>
                        {activity.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Work Orders */}
        {activeTab !== 'quick' && (
          <>
            {filteredOrders.map((order, index) => (
              <motion.button
                key={order.id}
                onClick={() => handleSelectWorkOrder(order.id)}
                className="w-full text-left glass-card rounded-2xl p-4 hover:shadow-lg transition-all border border-border hover:border-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-muted-foreground">{order.id}</span>
                      {timerState.workOrderId === order.id && (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      )}
                    </div>
                    <h4 className="mb-1 truncate" style={{ fontWeight: 600 }}>
                      {order.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">{order.client}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getPriorityColor(order.priority)}>
                        {order.priority}
                      </Badge>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      {order.billable && (
                        <Badge className="bg-green-500/10 text-green-600 border-green-200">
                          <IndianRupee className="w-3 h-3 mr-0.5" />
                          Billable
                        </Badge>
                      )}
                    </div>
                    
                    {/* Billing Details */}
                    {order.billable && (
                      <div className="mt-2 p-2 rounded-xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Rate / hr:</span>
                          <span style={{ fontWeight: 600 }} className="text-primary">
                            ₹ {order.rate.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-start gap-1 mt-1 text-xs text-muted-foreground/70">
                          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                          <span>{order.billingPolicy}</span>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      Last activity: {order.lastActivity}
                    </p>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </motion.button>
            ))}

            {filteredOrders.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No work orders found</p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Floating add button - only for work orders */}
      {activeTab !== 'quick' && (
        <motion.button
          onClick={() => setShowAddDialog(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-secondary to-primary text-white shadow-lg flex items-center justify-center z-20"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: [
              '0 8px 24px rgba(75, 92, 251, 0.3)',
              '0 8px 32px rgba(75, 92, 251, 0.5), 0 0 0 8px rgba(75, 92, 251, 0.1)',
              '0 8px 24px rgba(75, 92, 251, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* Other Activity Dialog */}
      <Dialog open={showOtherDialog} onOpenChange={setShowOtherDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Other Activity</DialogTitle>
            <DialogDescription>
              Please specify the reason for this activity
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Activity Reason *</Label>
              <Textarea
                id="reason"
                placeholder="e.g., Doctor appointment, Training session, etc."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows={3}
                className="rounded-2xl"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowOtherDialog(false);
                setOtherReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSelectOther}
              className="bg-gradient-to-r from-secondary to-primary text-white"
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Work Order Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Work Order</DialogTitle>
            <DialogDescription>
              Add a new work order to your list. Fill in the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Website Redesign"
                value={newWorkOrder.title}
                onChange={(e) =>
                  setNewWorkOrder({ ...newWorkOrder, title: e.target.value })
                }
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                placeholder="e.g., Acme Corporation"
                value={newWorkOrder.client}
                onChange={(e) =>
                  setNewWorkOrder({ ...newWorkOrder, client: e.target.value })
                }
                className="rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={newWorkOrder.type}
                onValueChange={(value: 'direct' | 'sequence') =>
                  setNewWorkOrder({ ...newWorkOrder, type: value })
                }
              >
                <SelectTrigger id="type" className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Direct</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sequence">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      <span>Process Sequence</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newWorkOrder.priority}
                  onValueChange={(value: 'High' | 'Medium' | 'Low') =>
                    setNewWorkOrder({ ...newWorkOrder, priority: value })
                  }
                >
                  <SelectTrigger id="priority" className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newWorkOrder.status}
                  onValueChange={(value: 'In Progress' | 'Pending' | 'Completed') =>
                    setNewWorkOrder({ ...newWorkOrder, status: value })
                  }
                >
                  <SelectTrigger id="status" className="rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddWorkOrder}
              className="bg-gradient-to-r from-secondary to-primary text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Work Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
