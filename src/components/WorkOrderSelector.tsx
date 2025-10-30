/**
 * Work Order Selector Component
 * 
 * ERP Integration Module - Fetches work orders from company ERP system
 * 
 * Work Order Types:
 * - Direct: Standard work orders with direct time logging
 * - Sequence: Process-based work orders with multiple steps/phases
 * 
 * ERP Data Fields:
 * - Work Order Number: Unique identifier (e.g., WO-2025-001)
 * - Name: Work order title/description
 * - Client: Customer/client name
 * - Status: Current status (In Progress, Pending, Not Started, etc.)
 * - Priority: Critical, High, Medium, Low
 * - Start Date: Work order start date
 * - Due Date: Expected completion date
 * - Estimated Hours: Planned time allocation
 * - Actual Hours: Time logged so far
 * - Billable Rate: Hourly rate for billable work orders (₹/hour)
 * - Billing Policy: How the work order is billed (Per hour, Per milestone, etc.)
 * - Process Steps: For sequence-type work orders, shows multi-phase breakdown
 * 
 * In production, replace mockWorkOrders with actual ERP API calls:
 * - Use REST API or GraphQL endpoint
 * - Implement real-time syncing
 * - Add authentication headers
 * - Handle loading states and errors
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Clock, Calendar, IndianRupee, ChevronRight, List } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockWorkOrders, mockOtherActivities } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export const WorkOrderSelector = () => {
  const { setCurrentScreen, timerState, setTimerState, workOrderInitialTab, setWorkOrderInitialTab, setSelectedOthersActivity, isZenMode, isEditingEntry, setIsEditingEntry, selectedEntry, setSelectedEntry, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  // Default to 'direct' if initial tab was 'all' (since we removed that option)
  const initialType = workOrderInitialTab === 'all' ? 'direct' : workOrderInitialTab;
  const [selectedType, setSelectedType] = useState<'direct' | 'sequence' | 'others'>(initialType as 'direct' | 'sequence' | 'others');
  
  // Check if dark mode is active
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Combine work orders and other activities
  const allItems = selectedType === 'others' 
    ? mockOtherActivities 
    : mockWorkOrders;

  // Filter items
  const filteredOrders = allItems.filter((wo) => {
    const matchesSearch = wo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wo.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         wo.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'others' || wo.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleSelectWorkOrder = (workOrder: typeof mockWorkOrders[0]) => {
    // If we're editing an existing entry, update it and return to entry details
    if (isEditingEntry && selectedEntry) {
      const updatedEntry = {
        ...selectedEntry,
        activityId: workOrder.type === 'others' ? workOrder.id : workOrder.number,
        activityName: workOrder.type === 'others' ? workOrder.number : workOrder.number,
        workOrderType: workOrder.type === 'others' ? 'general' : workOrder.type,
        billable: workOrder.type === 'others' ? false : workOrder.billable,
        rate: workOrder.type === 'others' ? 0 : workOrder.rate,
      };
      setSelectedEntry(updatedEntry);
      setIsEditingEntry(false);
      setCurrentScreen('entry-details');
      toast.success(`Activity updated to: ${workOrder.number}`);
      return;
    }

    // If it's an "Others" activity, set it and navigate to home
    if (workOrder.type === 'others') {
      setSelectedOthersActivity(workOrder);
      setTimerState({
        ...timerState,
        workOrderId: workOrder.id,
        taskName: workOrder.name,
        billable: false,
        rate: 0,
      });
      setCurrentScreen('home');
      toast.success(`Selected: ${workOrder.number}`);
      return;
    }

    // For regular work orders, go directly to timer
    setTimerState({
      ...timerState,
      workOrderId: workOrder.number,
      taskName: workOrder.name,
      billable: workOrder.billable,
      rate: workOrder.rate,
    });
    setSelectedOthersActivity(null); // Clear any selected "Others" activity
    setCurrentScreen('home');
    toast.success(`Selected: ${workOrder.name}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return '#00C7B7';
      case 'Pending': return '#F0BB00';
      case 'Not Started': return '#94A3B8';
      case 'Critical': return '#FF4D4D';
      default: return '#4B5CFB';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#FF4D4D';
      case 'High': return '#FF6B6B';
      case 'Medium': return '#F0BB00';
      case 'Low': return '#94A3B8';
      default: return '#4B5CFB';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className="flex flex-col h-screen relative overflow-hidden"
      style={{
        background: isZenMode 
          ? isDark
            ? 'radial-gradient(ellipse at 50% 50%, hsl(240, 70%, 15%) 0%, hsl(200, 60%, 10%) 50%, hsl(180, 50%, 8%) 100%)'
            : 'radial-gradient(ellipse at 50% 50%, hsl(240, 30%, 95%) 0%, hsl(200, 25%, 97%) 50%, hsl(180, 20%, 98%) 100%)'
          : undefined
      }}
    >
      {/* Zen Mode Background Effect */}
      {isZenMode && (
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(75, 92, 251, 0.3), transparent 60%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}
      
      {/* Header */}
      <div className={`sticky top-0 z-20 ${isZenMode ? (isDark ? 'bg-transparent border-b border-white/10' : 'bg-transparent border-b border-black/10') : 'glass-overlay border-b border-border/50'}`}>
        <div className="px-4 py-4 safe-top">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => {
                if (isEditingEntry) {
                  setIsEditingEntry(false);
                  setCurrentScreen('entry-details');
                } else {
                  setCurrentScreen('home');
                }
              }}
              className={`p-2 rounded-lg transition-all ${
                isZenMode 
                  ? isDark 
                    ? 'bg-white/10 hover:bg-white/15 text-white' 
                    : 'bg-black/5 hover:bg-black/10 text-foreground'
                  : 'hover:bg-muted'
              }`}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <h2 
              className={isZenMode ? (isDark ? 'text-white' : 'text-foreground') : ''}
              style={{ fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              Change Activity
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search 
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                isZenMode 
                  ? isDark 
                    ? 'text-white/40' 
                    : 'text-foreground/40'
                  : 'text-muted-foreground'
              }`} 
              strokeWidth={2} 
            />
            <Input
              type="text"
              placeholder="Search work orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 ${
                isZenMode 
                  ? isDark
                    ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40'
                    : 'bg-black/5 border-black/10 text-foreground placeholder:text-foreground/40'
                  : 'bg-muted/30 border-0'
              }`}
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {(['direct', 'sequence', 'others'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                  selectedType === type
                    ? isZenMode 
                      ? isDark
                        ? 'bg-primary/30 text-white border-2 border-primary/50 shadow-sm'
                        : 'bg-primary/20 text-foreground border-2 border-primary/50 shadow-sm'
                      : 'bg-primary text-primary-foreground border-2 border-primary shadow-sm'
                    : isZenMode
                    ? isDark
                      ? 'bg-white/10 text-white/70 hover:bg-white/15 border-2 border-white/30 shadow-sm'
                      : 'bg-card text-foreground/70 hover:bg-card/80 border-2 border-border/40 shadow-sm'
                    : 'bg-card text-foreground/70 hover:bg-card/80 border-2 border-border/40 shadow-sm'
                }`}
                style={{ fontWeight: 600 }}
              >
                {type === 'direct' ? 'Direct' : type === 'sequence' ? 'Sequence' : 'General Activities'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Work Order List */}
      <div className="flex-1 overflow-y-auto pb-6 safe-bottom">
        <div className="px-4 pt-4">
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isZenMode 
                  ? isDark ? 'bg-white/10' : 'bg-black/5'
                  : 'bg-muted/40'
              }`}>
                <Search className={`w-6 h-6 ${
                  isZenMode 
                    ? isDark ? 'text-white/60' : 'text-foreground/60'
                    : 'text-muted-foreground'
                }`} />
              </div>
              <p className={`text-sm ${
                isZenMode 
                  ? isDark ? 'text-white/60' : 'text-foreground/60'
                  : 'text-muted-foreground'
              }`}>No work orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((workOrder, index) => (
                <motion.button
                  key={workOrder.id}
                  onClick={() => handleSelectWorkOrder(workOrder)}
                  className={`w-full p-4 rounded-xl transition-all text-left ${
                    isZenMode 
                      ? isDark
                        ? 'bg-white/[0.08] hover:bg-white/[0.12] border-2 border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl'
                        : 'bg-white/90 hover:bg-white border-2 border-black/15 hover:border-black/25 shadow-md hover:shadow-lg'
                      : 'bg-card hover:bg-card/80 border-2 border-border/60 hover:border-border shadow-md hover:shadow-lg'
                  }`}
                  style={{
                    backdropFilter: isZenMode ? 'blur(12px)' : 'none',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {workOrder.type === 'others' ? (
                    // Simple card for "Others" section
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`text-sm mb-1 ${
                          isZenMode 
                            ? isDark ? 'text-white' : 'text-foreground'
                            : ''
                        }`} style={{ fontWeight: 600 }}>
                          {workOrder.number}
                        </p>
                        <p className={`text-xs ${
                          isZenMode 
                            ? isDark ? 'text-white/60' : 'text-foreground/60'
                            : 'text-muted-foreground'
                        }`}>
                          {workOrder.description}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${
                        isZenMode 
                          ? isDark ? 'text-white/60' : 'text-foreground/60'
                          : 'text-muted-foreground'
                      }`} />
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-xs ${
                              isZenMode 
                                ? isDark ? 'text-white/60' : 'text-foreground/60'
                                : 'text-muted-foreground'
                            }`} style={{ fontWeight: 500 }}>
                              {workOrder.number}
                            </p>
                            <div
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: getPriorityColor(workOrder.priority) }}
                            />
                          </div>
                          <p className={`text-sm mb-1 ${
                            isZenMode 
                              ? isDark ? 'text-white' : 'text-foreground'
                              : ''
                          }`} style={{ fontWeight: 600 }}>
                            {workOrder.name}
                          </p>
                          <p className={`text-xs ${
                            isZenMode 
                              ? isDark ? 'text-white/60' : 'text-foreground/60'
                              : 'text-muted-foreground'
                          }`}>
                            {workOrder.client}
                          </p>
                        </div>
                        <ChevronRight className={`w-4 h-4 mt-1 ${
                          isZenMode 
                            ? isDark ? 'text-white/60' : 'text-foreground/60'
                            : 'text-muted-foreground'
                        }`} />
                      </div>

                      {/* Type Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          className="text-[12px] px-2 py-0.5"
                          style={{
                            backgroundColor: workOrder.type === 'sequence' ? '#4B5CFB20' : '#00C7B720',
                            color: workOrder.type === 'sequence' ? '#4B5CFB' : '#00C7B7',
                            fontWeight: 600,
                            border: 'none',
                          }}
                        >
                          {workOrder.type === 'sequence' ? (
                            <div className="flex items-center gap-1">
                              <List className="w-2.5 h-2.5" />
                              <span>Sequence</span>
                            </div>
                          ) : (
                            'Direct'
                          )}
                        </Badge>
                        <Badge
                          className="text-[12px] px-2 py-0.5"
                          style={{
                            backgroundColor: `${getStatusColor(workOrder.status)}20`,
                            color: getStatusColor(workOrder.status),
                            fontWeight: 600,
                            border: 'none',
                          }}
                        >
                          {workOrder.status}
                        </Badge>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                          <div>
                            <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>
                              Due Date
                            </p>
                            <p className="text-xs" style={{ fontWeight: 600 }}>
                              {formatDate(workOrder.dueDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                          <div>
                            <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>
                              Hours
                            </p>
                            <p className="text-xs" style={{ fontWeight: 600 }}>
                              {workOrder.actualHours} / {workOrder.estimatedHours}h
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Billable Info */}
                      {workOrder.billable && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                          <IndianRupee className="w-3 h-3 text-primary" strokeWidth={2} />
                          <p className="text-xs" style={{ fontWeight: 600 }}>
                            ₹{workOrder.rate}/hr
                          </p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">
                            {workOrder.billingPolicy}
                          </p>
                        </div>
                      )}

                      {/* Process Steps (for sequence type) */}
                      {workOrder.type === 'sequence' && workOrder.processSteps && (
                        <div className="mt-3 pt-3 border-t border-border/30">
                          <p className="text-[12px] text-muted-foreground mb-2" style={{ fontWeight: 600 }}>
                            PROCESS STEPS
                          </p>
                          <div className="space-y-1">
                            {workOrder.processSteps.slice(0, 3).map((step, idx) => (
                              <div key={step.id} className="flex items-center gap-2">
                                <div
                                  className={`w-1 h-1 rounded-full ${
                                    step.status === 'Completed'
                                      ? 'bg-secondary'
                                      : step.status === 'In Progress'
                                      ? 'bg-primary'
                                      : 'bg-muted-foreground'
                                  }`}
                                />
                                <p className="text-xs text-muted-foreground">
                                  {step.name}
                                </p>
                              </div>
                            ))}
                            {workOrder.processSteps.length > 3 && (
                              <p className="text-xs text-muted-foreground pl-3">
                                +{workOrder.processSteps.length - 3} more steps
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.button>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
