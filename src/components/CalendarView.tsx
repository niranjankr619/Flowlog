import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sparkles, LayoutGrid, LayoutList, Clock } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockTimeEntries } from '../lib/mockData';
import { BottomNav } from './BottomNav';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const WEEKDAYS_FULL = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const CalendarView = () => {
  const { setCurrentScreen, setSelectedEntry } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 9, 17)); // Oct 17, 2025
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date(2025, 9, 12));
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'timeline'>('timeline');

  // Get week dates
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  // Get entries for selected date
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayEntries = mockTimeEntries.filter((e) => e.date === selectedDateStr);
  const dailyTotal = dayEntries.reduce((sum, e) => sum + e.duration, 0);

  // Get entries for the whole week
  const weekEntries = weekDates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const entries = mockTimeEntries.filter((e) => e.date === dateStr);
    const total = entries.reduce((sum, e) => sum + e.duration, 0);
    return { date, dateStr, entries, total };
  });
  const weekTotal = weekEntries.reduce((sum, day) => sum + day.total, 0);

  // Navigate week
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  // Format time
  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2025-10-17');
    const yesterday = new Date('2025-10-16');

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Handle entry click
  const handleEntryClick = (entry: typeof mockTimeEntries[0]) => {
    setSelectedEntry(entry);
    setCurrentScreen('entry-details');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      
      {/* Header with AI Coach Insight */}
      <div className="sticky top-0 z-20 glass-overlay border-b border-border/50">
        <div className="px-4 py-4 safe-top">
          
          {/* Title and View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Calendar
            </h2>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Clock className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'day'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'week'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-muted rounded-lg transition-all"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
              {MONTHS[currentWeekStart.getMonth()]} {currentWeekStart.getFullYear()}
            </p>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-muted rounded-lg transition-all"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-1">
            {weekDates.map((date, index) => {
              const isSelected = date.toISOString().split('T')[0] === selectedDateStr;
              const dateStr = date.toISOString().split('T')[0];
              const hasEntries = mockTimeEntries.some(e => e.date === dateStr);
              
              return (
                <motion.button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`py-2 px-1 rounded-lg transition-all text-center ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted/50'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <p className={`text-[9px] mb-0.5 text-center ${isSelected ? 'text-primary-foreground/80' : 'text-foreground/60'}`} style={{ fontWeight: 600 }}>
                    {WEEKDAYS[date.getDay()]}
                  </p>
                  <p className="text-sm text-center" style={{ fontWeight: isSelected ? 700 : 600 }}>
                    {date.getDate()}
                  </p>
                  {hasEntries && !isSelected && (
                    <div className="w-1 h-1 rounded-full bg-primary mx-auto mt-1" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 safe-bottom">
        <div className="px-4 pt-6">
          
          {viewMode === 'day' ? (
            <>
              {/* Daily Total */}
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-5xl mb-1" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {formatTime(dailyTotal)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
                </p>
              </motion.div>

              {/* Time Entries - Matching TimerDashboard style */}
              {dayEntries.length > 0 ? (
                <div className="space-y-3">
                  {dayEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      className="p-3 rounded-xl bg-card hover:bg-card/80 border-2 border-border/60 hover:border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleEntryClick(entry)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {entry.workOrderId && (
                              <>
                                <Badge
                                  className="text-xs px-1.5 py-0.5"
                                  style={{
                                    backgroundColor: entry.workOrderType === 'sequence' ? '#00C7B728' : '#4B5CFB28',
                                    color: entry.workOrderType === 'sequence' ? '#00A99D' : '#4B5CFB',
                                    fontWeight: 600,
                                    border: entry.workOrderType === 'sequence' ? '1px solid #00C7B740' : '1px solid #4B5CFB40',
                                  }}
                                >
                                  {entry.workOrderId}
                                </Badge>
                                <Badge
                                  className="text-xs px-1.5 py-0.5"
                                  style={{
                                    backgroundColor: entry.workOrderType === 'sequence' ? '#00C7B728' : '#F0BB0028',
                                    color: entry.workOrderType === 'sequence' ? '#00A99D' : '#D4A100',
                                    fontWeight: 600,
                                    border: entry.workOrderType === 'sequence' ? '1px solid #00C7B740' : '1px solid #F0BB0040',
                                  }}
                                >
                                  {entry.workOrderType === 'sequence' ? 'Sequence' : 'Direct'}
                                </Badge>
                                <Badge
                                  className="text-xs px-1.5 py-0.5"
                                  style={{
                                    backgroundColor: entry.billable ? '#4B5CFB28' : '#94A3B828',
                                    color: entry.billable ? '#4B5CFB' : '#64748B',
                                    fontWeight: 600,
                                    border: entry.billable ? '1px solid #4B5CFB40' : '1px solid #94A3B840',
                                  }}
                                >
                                  {entry.billable ? `₹${entry.rate}/hr` : 'Non-billable'}
                                </Badge>
                              </>
                            )}
                            {!entry.workOrderId && (
                              <Badge
                                className="text-xs px-1.5 py-0.5"
                                style={{
                                  backgroundColor: '#F0BB0028',
                                  color: '#D4A100',
                                  fontWeight: 600,
                                  border: '1px solid #F0BB0040',
                                }}
                              >
                                {entry.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-1.5" style={{ fontWeight: 600 }}>
                            {entry.task}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                              {entry.startTime} - {entry.endTime}
                            </p>
                            <span className="text-xs text-muted-foreground">•</span>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(entry.duration)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <CalendarIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">No entries</p>
                </motion.div>
              )}
            </>
          ) : viewMode === 'timeline' ? (
            <>
              {/* Timeline View */}
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-5xl mb-1" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {formatTime(dailyTotal)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'} today
                </p>
              </motion.div>

              {dayEntries.length > 0 ? (
                <div className="relative pl-16 pr-2">
                  {/* Timeline - Hours from 00:00 to 23:00 */}
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i;
                    const hourString = hour.toString().padStart(2, '0');
                    const hasEntriesAtHour = dayEntries.some(entry => {
                      const entryHour = parseInt(entry.startTime.split(':')[0]);
                      return entryHour === hour;
                    });

                    return (
                      <div key={hour} className="relative" style={{ height: '80px' }}>
                        {/* Hour Label */}
                        <div className="absolute left-0 -translate-x-14 top-0">
                          <p 
                            className="text-xs text-muted-foreground tabular-nums" 
                            style={{ fontWeight: hasEntriesAtHour ? 600 : 500 }}
                          >
                            {hourString}:00
                          </p>
                        </div>
                        
                        {/* Timeline Line */}
                        <div className="absolute left-0 top-0 w-2 h-full">
                          <div className="w-0.5 h-full bg-border/30 ml-1" />
                          <div className="absolute top-0 left-0 w-2 h-2 rounded-full bg-border/50" />
                        </div>

                        {/* Time Entries at this hour */}
                        {dayEntries
                          .filter(entry => {
                            const entryHour = parseInt(entry.startTime.split(':')[0]);
                            return entryHour === hour;
                          })
                          .map((entry, entryIndex) => {
                            const startHour = parseInt(entry.startTime.split(':')[0]);
                            const startMin = parseInt(entry.startTime.split(':')[1]);
                            const offsetTop = (startMin / 60) * 80; // Position within the hour
                            const heightPx = Math.min((entry.duration / 60) * 80, 200); // Card height based on duration

                            return (
                              <motion.div
                                key={entry.id}
                                className="absolute left-4 right-0 p-3 rounded-xl glass-card border cursor-pointer overflow-hidden"
                                style={{
                                  top: `${offsetTop}px`,
                                  minHeight: '72px',
                                  maxHeight: '200px',
                                  height: `${Math.max(heightPx, 72)}px`,
                                  background: entry.workOrderId 
                                    ? entry.workOrderType === 'sequence'
                                      ? 'linear-gradient(135deg, rgba(0, 199, 183, 0.18) 0%, rgba(0, 199, 183, 0.12) 100%)'
                                      : 'linear-gradient(135deg, rgba(75, 92, 251, 0.18) 0%, rgba(75, 92, 251, 0.12) 100%)'
                                    : 'linear-gradient(135deg, rgba(240, 187, 0, 0.18) 0%, rgba(240, 187, 0, 0.12) 100%)',
                                  borderColor: entry.workOrderId
                                    ? entry.workOrderType === 'sequence'
                                      ? 'rgba(0, 199, 183, 0.5)'
                                      : 'rgba(75, 92, 251, 0.5)'
                                    : 'rgba(240, 187, 0, 0.5)'
                                }}
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ delay: entryIndex * 0.05 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleEntryClick(entry)}
                              >
                                <div className="flex flex-col h-full">
                                  {/* Time Badge */}
                                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                    <div 
                                      className="px-2 py-0.5 rounded-md text-[11px] tabular-nums"
                                      style={{ 
                                        fontWeight: 700,
                                        background: 'rgba(0, 0, 0, 0.15)',
                                        backdropFilter: 'blur(8px)'
                                      }}
                                    >
                                      {entry.startTime} - {entry.endTime}
                                    </div>
                                    <Badge
                                      className="text-[11px] px-1.5 py-0"
                                      style={{
                                        backgroundColor: entry.workOrderId
                                          ? entry.billable ? '#4B5CFB20' : '#94A3B820'
                                          : '#F0BB0020',
                                        color: entry.workOrderId
                                          ? entry.billable ? '#4B5CFB' : '#94A3B8'
                                          : '#F0BB00',
                                        fontWeight: 600,
                                        border: 'none',
                                      }}
                                    >
                                      {formatTime(entry.duration)}
                                    </Badge>
                                  </div>

                                  {/* Task Name */}
                                  <p className="text-sm mb-1.5 line-clamp-1" style={{ fontWeight: 600 }}>
                                    {entry.task}
                                  </p>

                                  {/* Badges */}
                                  <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                                    {entry.workOrderId && (
                                      <>
                                        <Badge
                                          className="text-[11px] px-1.5 py-0"
                                          style={{
                                            backgroundColor: entry.workOrderType === 'sequence' ? '#00C7B720' : '#4B5CFB20',
                                            color: entry.workOrderType === 'sequence' ? '#00C7B7' : '#4B5CFB',
                                            fontWeight: 600,
                                            border: 'none',
                                          }}
                                        >
                                          {entry.workOrderId}
                                        </Badge>
                                        {entry.billable && (
                                          <Badge
                                            className="text-[11px] px-1.5 py-0"
                                            style={{
                                              backgroundColor: '#4B5CFB15',
                                              color: '#4B5CFB',
                                              fontWeight: 600,
                                              border: 'none',
                                            }}
                                          >
                                            ₹{entry.rate}/hr
                                          </Badge>
                                        )}
                                      </>
                                    )}
                                    {!entry.workOrderId && (
                                      <Badge
                                        className="text-[11px] px-1.5 py-0"
                                        style={{
                                          backgroundColor: '#F0BB0020',
                                          color: '#F0BB00',
                                          fontWeight: 600,
                                          border: 'none',
                                        }}
                                      >
                                        {entry.category}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Clock className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">No entries today</p>
                </motion.div>
              )}
            </>
          ) : (
            <>
              {/* Week Total */}
              <motion.div
                className="text-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-5xl mb-1" style={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {formatTime(weekTotal)}
                </p>
                <p className="text-xs text-muted-foreground">
                  This week
                </p>
              </motion.div>

              {/* Week View - Day by day */}
              <div className="space-y-4">
                {weekEntries.map((dayData, dayIndex) => (
                  <motion.div
                    key={dayData.dateStr}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.05 }}
                  >
                    {/* Day Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs" style={{ fontWeight: 700 }}>
                          {WEEKDAYS_FULL[dayData.date.getDay()]}
                        </p>
                        <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                          {MONTHS[dayData.date.getMonth()]} {dayData.date.getDate()}
                        </p>
                      </div>
                      <p className="text-xs" style={{ fontWeight: 600 }}>
                        {formatTime(dayData.total)}
                      </p>
                    </div>

                    {/* Day Entries */}
                    {dayData.entries.length > 0 ? (
                      <div className="space-y-3">
                        {dayData.entries.map((entry, entryIndex) => (
                          <motion.div
                            key={entry.id}
                            className="p-3 rounded-xl bg-card hover:bg-card/80 border-2 border-border/60 hover:border-border shadow-sm hover:shadow-md transition-all cursor-pointer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: entryIndex * 0.02 }}
                            onClick={() => handleEntryClick(entry)}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  {entry.workOrderId && (
                                    <>
                                      <Badge
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: entry.workOrderType === 'sequence' ? '#00C7B728' : '#4B5CFB28',
                                          color: entry.workOrderType === 'sequence' ? '#00A99D' : '#4B5CFB',
                                          fontWeight: 600,
                                          border: entry.workOrderType === 'sequence' ? '1px solid #00C7B740' : '1px solid #4B5CFB40',
                                        }}
                                      >
                                        {entry.workOrderId}
                                      </Badge>
                                      <Badge
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: entry.workOrderType === 'sequence' ? '#00C7B728' : '#F0BB0028',
                                          color: entry.workOrderType === 'sequence' ? '#00A99D' : '#D4A100',
                                          fontWeight: 600,
                                          border: entry.workOrderType === 'sequence' ? '1px solid #00C7B740' : '1px solid #F0BB0040',
                                        }}
                                      >
                                        {entry.workOrderType === 'sequence' ? 'Sequence' : 'Direct'}
                                      </Badge>
                                      <Badge
                                        className="text-xs px-1.5 py-0.5"
                                        style={{
                                          backgroundColor: entry.billable ? '#4B5CFB28' : '#94A3B828',
                                          color: entry.billable ? '#4B5CFB' : '#64748B',
                                          fontWeight: 600,
                                          border: entry.billable ? '1px solid #4B5CFB40' : '1px solid #94A3B840',
                                        }}
                                      >
                                        {entry.billable ? `₹${entry.rate}/hr` : 'Non-billable'}
                                      </Badge>
                                    </>
                                  )}
                                  {!entry.workOrderId && (
                                    <Badge
                                      className="text-xs px-1.5 py-0.5"
                                      style={{
                                        backgroundColor: '#F0BB0028',
                                        color: '#D4A100',
                                        fontWeight: 600,
                                        border: '1px solid #F0BB0040',
                                      }}
                                    >
                                      {entry.category}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm mb-1" style={{ fontWeight: 600 }}>
                                  {entry.task}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs text-muted-foreground">
                                    {entry.startTime} - {entry.endTime}
                                  </p>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(entry.duration)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-muted/20 border border-border/20 text-center">
                        <p className="text-xs text-muted-foreground">No entries</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="calendar" />
    </div>
  );
};
