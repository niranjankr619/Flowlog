import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Calendar, Trash2, Clock, RotateCcw, X, Edit3, Filter, ChevronDown } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { toast } from 'sonner@2.0.3';
import { mockRecentOthersActivities } from '../lib/mockData';
import { BottomNav } from './BottomNav';
import { QuickEditModal } from './QuickEditModal';

export const AllEntriesView = () => {
  const { setCurrentScreen, recentEntries, setRecentEntries, setSelectedEntry, theme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'week' | 'month'>('all');
  const [workOrderTypeFilter, setWorkOrderTypeFilter] = useState<string[]>([]);
  const [billableFilter, setBillableFilter] = useState<'all' | 'billable' | 'non-billable'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [swipedEntryId, setSwipedEntryId] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<typeof mockRecentOthersActivities[0] | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [justEditedId, setJustEditedId] = useState<string | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Combine all entries
  const allEntries = [...recentEntries, ...mockRecentOthersActivities];

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2025-10-25');
    const yesterday = new Date('2025-10-24');

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  // Apply filters
  const filteredEntries = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    const today = new Date('2025-10-25');
    const yesterday = new Date('2025-10-24');
    const weekStart = new Date('2025-10-20');
    const monthStart = new Date('2025-10-01');

    // Date filter
    let dateMatch = true;
    switch (dateFilter) {
      case 'today':
        dateMatch = entryDate.toDateString() === today.toDateString();
        break;
      case 'yesterday':
        dateMatch = entryDate.toDateString() === yesterday.toDateString();
        break;
      case 'week':
        dateMatch = entryDate >= weekStart && entryDate <= today;
        break;
      case 'month':
        dateMatch = entryDate >= monthStart && entryDate <= today;
        break;
    }

    // Work Order Type filter
    const workOrderTypeMatch = workOrderTypeFilter.length === 0 || 
      workOrderTypeFilter.includes(entry.workOrderType || 'general');

    // Billable filter
    const billableMatch = billableFilter === 'all' || 
      (billableFilter === 'billable' && entry.billable) ||
      (billableFilter === 'non-billable' && !entry.billable);

    // Search filter
    const searchMatch = searchQuery.trim() === '' || 
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.activityName && entry.activityName.toLowerCase().includes(searchQuery.toLowerCase()));

    return dateMatch && workOrderTypeMatch && billableMatch && searchMatch;
  });

  // Count active filters
  const activeFilterCount = 
    (dateFilter !== 'all' ? 1 : 0) +
    workOrderTypeFilter.length +
    (billableFilter !== 'all' ? 1 : 0);

  // Clear all filters
  const clearAllFilters = () => {
    setDateFilter('all');
    setWorkOrderTypeFilter([]);
    setBillableFilter('all');
    toast.success('All filters cleared');
  };

  // Toggle filter option
  const toggleFilter = (filterArray: string[], setFilter: (val: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(v => v !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  };

  // Group entries by date
  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const dateKey = formatDate(entry.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {} as Record<string, typeof allEntries>);

  // Calculate stats
  const totalEntries = filteredEntries.length;
  const totalMinutes = filteredEntries.reduce((sum, e) => sum + (e.durationMinutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalMins = totalMinutes % 60;

  // Handle delete
  const handleDelete = (entryId: string) => {
    setRecentEntries(recentEntries.filter(e => e.id !== entryId));
    setSwipedEntryId(null);
    toast.success('Entry deleted');
  };

  // Handle entry click
  const handleEntryClick = (entry: typeof allEntries[0]) => {
    if (swipedEntryId === entry.id) return; // Don't open if in delete mode
    setSelectedEntry(entry);
    setCurrentScreen('entry-details');
  };

  // Handle long press to edit
  const handleLongPressStart = (entry: typeof allEntries[0]) => {
    longPressTimerRef.current = setTimeout(() => {
      setEditingEntry(entry);
      setIsQuickEditOpen(true);
      setSwipedEntryId(null);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // Handle quick edit save
  const handleQuickEditSave = (updatedEntry: any) => {
    setRecentEntries(
      recentEntries.map((e) =>
        e.id === updatedEntry.id ? { ...e, ...updatedEntry } : e
      )
    );
    setIsQuickEditOpen(false);
    setEditingEntry(null);
    setJustEditedId(updatedEntry.id);
    setTimeout(() => setJustEditedId(null), 1000);
  };

  // Handle reload entry (reuse the entry data for a new timer session)
  const handleReloadEntry = (entry: typeof allEntries[0]) => {
    // This would reload the entry into the timer
    toast.success(`Loaded: ${entry.activityName || entry.client}`);
    setCurrentScreen('timer');
  };

  // Check if light theme
  const isLightTheme = theme === 'light' || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Get entry style matching TimerDashboard exactly
  const getEntryStyle = (entry: typeof allEntries[0]) => {
    if (entry.workOrderType === 'sequence') {
      return {
        background: 'linear-gradient(120deg, rgba(0, 199, 183, 0.12) 0%, rgba(0, 199, 183, 0.04) 100%)',
        border: 'border-secondary/30',
        overlayClass: 'from-secondary/15',
      };
    } else if (entry.workOrderType === 'direct') {
      return {
        background: 'linear-gradient(120deg, rgba(75, 92, 251, 0.12) 0%, rgba(75, 92, 251, 0.04) 100%)',
        border: 'border-primary/30',
        overlayClass: 'from-primary/15',
      };
    } else {
      return {
        background: 'linear-gradient(120deg, rgba(240, 187, 0, 0.12) 0%, rgba(240, 187, 0, 0.04) 100%)',
        border: 'border-accent/30',
        overlayClass: 'from-accent/15',
      };
    }
  };

  // Get badge style with better contrast for light theme
  const getBadgeStyle = (entry: typeof allEntries[0]) => {
    if (isLightTheme) {
      // Light theme - better contrast
      if (entry.workOrderType === 'sequence') {
        return {
          backgroundColor: '#00C7B760',
          color: '#006B5F',
          border: '1px solid #00C7B7',
        };
      } else if (entry.workOrderType === 'direct') {
        return {
          backgroundColor: '#4B5CFB60',
          color: '#2A3BB7',
          border: '1px solid #4B5CFB',
        };
      } else {
        return {
          backgroundColor: '#F0BB0060',
          color: '#8B6500',
          border: '1px solid #F0BB00',
        };
      }
    } else {
      // Dark theme - existing styling
      return {
        backgroundColor: entry.workOrderType === 'sequence' 
          ? '#00C7B730' 
          : entry.workOrderType === 'direct' 
            ? '#4B5CFB30' 
            : '#F0BB0030',
        color: entry.workOrderType === 'sequence' 
          ? '#00E5D0' 
          : entry.workOrderType === 'direct' 
            ? '#6B7CFF' 
            : '#FFD666',
        border: entry.workOrderType === 'sequence' 
          ? '1px solid #00C7B780' 
          : entry.workOrderType === 'direct' 
            ? '1px solid #4B5CFB80' 
            : '1px solid #F0BB0080',
      };
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <motion.div 
        className="sticky top-0 z-20 glass-overlay border-b border-border/50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-6 pt-12 pb-4 safe-top">
          <div className="flex items-center gap-3 mb-4">
            <motion.button
              onClick={() => setCurrentScreen('timer')}
              className="p-2 hover:bg-muted rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </motion.button>
            <h1 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              All Entries
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              className="flex-1 px-4 py-3 rounded-xl glass-card border border-border/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-xs text-muted-foreground mb-1">Total Entries</p>
              <p className="text-lg" style={{ fontWeight: 700 }}>
                {totalEntries}
              </p>
            </motion.div>
            <motion.div 
              className="flex-1 px-4 py-3 rounded-xl glass-card border border-border/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
            >
              <p className="text-xs text-muted-foreground mb-1">Total Time</p>
              <p className="text-lg" style={{ fontWeight: 700 }}>
                {totalHours}h {totalMins}m
              </p>
            </motion.div>
          </div>

          {/* Search Bar & Filter Button */}
          <motion.div 
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by description, activity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/30 border-border/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-md transition-all"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            
            {/* Filter Toggle Button */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="relative px-4 py-2.5 rounded-xl glass-card border border-border/50 hover:bg-muted/50 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4" strokeWidth={2} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center" style={{ fontWeight: 700 }}>
                  {activeFilterCount}
                </span>
              )}
            </motion.button>
          </motion.div>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.div
                className="flex items-center gap-2 mb-4 overflow-x-auto hide-scrollbar pb-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {dateFilter !== 'all' && (
                  <Badge 
                    className="text-xs px-3 py-1 cursor-pointer hover:bg-destructive/20 transition-all"
                    onClick={() => setDateFilter('all')}
                  >
                    {dateFilter === 'today' ? 'Today' : dateFilter === 'yesterday' ? 'Yesterday' : dateFilter === 'week' ? 'This Week' : 'This Month'}
                    <X className="w-3 h-3 ml-1 inline" />
                  </Badge>
                )}
                {workOrderTypeFilter.map(type => (
                  <Badge 
                    key={type}
                    className="text-xs px-3 py-1 cursor-pointer hover:bg-destructive/20 transition-all capitalize"
                    onClick={() => toggleFilter(workOrderTypeFilter, setWorkOrderTypeFilter, type)}
                  >
                    {type}
                    <X className="w-3 h-3 ml-1 inline" />
                  </Badge>
                ))}
                {billableFilter !== 'all' && (
                  <Badge 
                    className="text-xs px-3 py-1 cursor-pointer hover:bg-destructive/20 transition-all"
                    onClick={() => setBillableFilter('all')}
                  >
                    {billableFilter === 'billable' ? 'Billable' : 'Non-billable'}
                    <X className="w-3 h-3 ml-1 inline" />
                  </Badge>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-muted-foreground hover:text-destructive transition-all underline ml-1"
                  style={{ fontWeight: 500 }}
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto pb-24">
        {filteredEntries.length === 0 ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? 'No matching entries found' : 'No entries yet'}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="mt-4"
              >
                Clear search
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="px-6 pt-4 space-y-6">
            {Object.entries(groupedEntries).map(([dateLabel, entries], groupIndex) => (
              <motion.div 
                key={dateLabel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    {dateLabel.toUpperCase()}
                  </h3>
                  <div className="flex-1 h-px bg-border/30" />
                  <span className="text-xs text-muted-foreground">
                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                {/* Entries for this date */}
                <div className="space-y-2.5">
                  {entries.map((entry, index) => {
                    const style = getEntryStyle(entry);
                    const badgeStyle = getBadgeStyle(entry);
                    const isSwiped = swipedEntryId === entry.id;

                    return (
                      <motion.div
                        key={`${entry.id}-${entry.date}-${index}`}
                        className="relative h-[104px] overflow-hidden"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {/* Edit & Delete Button Background */}
                        <AnimatePresence>
                          {isSwiped && (
                            <motion.div
                              className="absolute inset-0 rounded-xl flex items-center justify-end px-4 gap-3"
                              style={{
                                background: 'linear-gradient(90deg, rgba(75, 92, 251, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <motion.button
                                onClick={() => {
                                  setEditingEntry(entry);
                                  setIsQuickEditOpen(true);
                                  setSwipedEntryId(null);
                                }}
                                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Edit3 className="w-4 h-4 text-white" strokeWidth={2} />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDelete(entry.id)}
                                className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-4 h-4 text-white" strokeWidth={2} />
                              </motion.button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Entry Card - Swipeable */}
                        <motion.div
                          drag="x"
                          dragConstraints={{ left: -140, right: 0 }}
                          dragElastic={0.2}
                          onDragEnd={(e, info) => {
                            if (info.offset.x < -60) {
                              setSwipedEntryId(entry.id);
                            } else {
                              setSwipedEntryId(null);
                            }
                          }}
                          onPointerDown={() => handleLongPressStart(entry)}
                          onPointerUp={handleLongPressEnd}
                          onPointerLeave={handleLongPressEnd}
                          animate={{
                            x: isSwiped ? -120 : 0,
                            boxShadow: justEditedId === entry.id 
                              ? '0 0 30px rgba(75, 92, 251, 0.4)' 
                              : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          }}
                          className={`absolute inset-0 rounded-xl glass-card border-2 ${
                            justEditedId === entry.id ? 'border-primary/60' : style.border
                          } cursor-pointer overflow-hidden`}
                          style={{
                            background: style.background,
                            backdropFilter: 'blur(20px)',
                          }}
                          onClick={() => handleEntryClick(entry)}
                          whileHover={{ scale: isSwiped ? 1 : 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {/* Left-to-right gradient overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-r ${style.overlayClass} to-transparent pointer-events-none rounded-xl`} />
                          
                          {/* Content wrapper with padding to respect rounded corners */}
                          <div className="relative z-10 h-full flex items-center pl-5 pr-4">
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className="text-xs px-2 py-0.5 shrink-0"
                                  style={{
                                    backgroundColor: badgeStyle.backgroundColor,
                                    color: badgeStyle.color,
                                    fontWeight: 600,
                                    border: badgeStyle.border,
                                  }}
                                >
                                  {entry.workOrderType === 'sequence' 
                                    ? 'Sequence' 
                                    : entry.workOrderType === 'direct' 
                                      ? 'Direct' 
                                      : 'General'}
                                </Badge>
                                {(entry as any).editedAt && (
                                  <span className="text-[10px] text-muted-foreground/60 shrink-0" style={{ fontWeight: 500 }}>
                                    🕓 Edited {new Date((entry as any).editedAt).toLocaleTimeString('en-US', { 
                                      hour: '2-digit', 
                                      minute: '2-digit',
                                      hour12: false 
                                    })}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm mb-2 truncate" style={{ fontWeight: 600 }}>
                                {entry.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <Calendar className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(entry.date)}
                                  </p>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">•</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <Clock className="w-3 h-3 text-muted-foreground" strokeWidth={2} />
                                  <p className="text-xs text-muted-foreground">
                                    {entry.startTime && entry.endTime 
                                      ? `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}`
                                      : formatDuration(entry.durationMinutes || 0)
                                    }
                                  </p>
                                </div>
                                {entry.billable && (
                                  <>
                                    <span className="text-xs text-muted-foreground shrink-0">•</span>
                                    <p className="text-xs text-muted-foreground shrink-0">
                                      Billable
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Quick Edit Modal */}
      <QuickEditModal
        entry={editingEntry}
        isOpen={isQuickEditOpen}
        onClose={() => {
          setIsQuickEditOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleQuickEditSave}
      />

      {/* Filter Sheet Overlay */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="bottom" className="h-[85vh] !bg-transparent border-t border-border/50 p-0">
          <div className="h-full glass-overlay rounded-t-[32px] border border-border/50 flex flex-col">
            <SheetHeader className="px-6 pt-8 pb-4">
              <SheetTitle style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                Filters
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Apply filters to refine your time entries
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-32">
              {/* Date Range Filter */}
              <div>
                <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 600 }}>DATE RANGE</p>
                <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All Time', value: 'all' as const },
                  { label: 'Today', value: 'today' as const },
                  { label: 'Yesterday', value: 'yesterday' as const },
                  { label: 'This Week', value: 'week' as const },
                  { label: 'This Month', value: 'month' as const },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={dateFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter(filter.value)}
                    className="text-xs"
                    style={{ fontWeight: 600 }}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

              {/* Work Order Type Filter */}
              <div>
                <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 600 }}>WORK ORDER TYPE</p>
                <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Direct', value: 'direct' },
                  { label: 'Sequence', value: 'sequence' },
                  { label: 'General', value: 'general' },
                ].map((type) => (
                  <Button
                    key={type.value}
                    variant={workOrderTypeFilter.includes(type.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleFilter(workOrderTypeFilter, setWorkOrderTypeFilter, type.value)}
                    className="text-xs"
                    style={{ fontWeight: 600 }}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

              {/* Billable Filter */}
              <div>
                <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 600 }}>BILLING STATUS</p>
                <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All', value: 'all' as const },
                  { label: 'Billable', value: 'billable' as const },
                  { label: 'Non-billable', value: 'non-billable' as const },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={billableFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBillableFilter(filter.value)}
                    className="text-xs"
                    style={{ fontWeight: 600 }}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-6 pt-4 glass-overlay border-t border-border/50 space-y-3 rounded-t-[24px]">
              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="w-full text-xs"
                  style={{ fontWeight: 600 }}
                >
                  Clear All Filters
                </Button>
              )}
              <Button
                onClick={() => setShowFilters(false)}
                className="w-full"
                style={{ fontWeight: 600 }}
              >
                Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
