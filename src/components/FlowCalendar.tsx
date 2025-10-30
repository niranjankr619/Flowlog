import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Zap,
  Plus,
  Brain,
  BarChart3,
  Filter,
  TrendingUp,
  AlertTriangle,
  Trophy,
  Coffee,
  Clock,
  Calendar as CalendarIcon,
  ArrowUp,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import {
  mockCalendarEntries,
  mockAIInsights,
  categories,
  mockWorkOrders,
} from '../lib/mockData';
import { toast } from 'sonner@2.0.3';
import { BottomNav } from './BottomNav';
import { useApp } from '../lib/AppContext';

type ViewMode = 'day' | 'week' | 'month';
type Mood = '😃' | '😐' | '😩' | null;

interface TimeBlock {
  id: string;
  task: string;
  startTime: string;
  endTime: string;
  category: string;
  planned: boolean;
  actual: boolean;
  workOrderId?: string | null;
}

export const FlowCalendar = () => {
  const { setCurrentScreen, setSelectedEntry } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 23)); // Oct 23, 2025
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [insightsPanelExpanded, setInsightsPanelExpanded] = useState(false);
  const [coachSheetOpen, setCoachSheetOpen] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  // Get today's flow score
  const todayString = currentDate.toISOString().split('T')[0];
  const todayEntries = mockCalendarEntries.filter((e) => e.date === todayString);

  // Format month & year
  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Navigate months
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Time slots for day view (15-min increments, 8 AM - 6 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Convert time to minutes
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Get position and height for timeline blocks
  const getBlockStyle = (startTime: string, endTime: string) => {
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    const baseMin = 8 * 60; // 8 AM
    const totalMin = 10 * 60; // 8 AM to 6 PM = 10 hours
    
    const top = ((startMin - baseMin) / totalMin) * 100;
    const height = ((endMin - startMin) / totalMin) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  // Get category color
  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.color || '#888';
  };

  // Handle mood selection
  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    toast.success(`Mood logged: ${mood}`);
  };

  // Generate week days for week view
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  // Generate month days for month view
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < (startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1); i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Get total hours for a date
  const getHoursForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const entries = mockCalendarEntries.filter((e) => e.date === dateString);
    const totalMinutes = entries.reduce((sum, e) => {
      const start = new Date(`2000-01-01 ${e.startTime}`);
      const end = new Date(`2000-01-01 ${e.endTime}`);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60);
    }, 0);
    return Math.round(totalMinutes / 60 * 10) / 10;
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      {/* Main container */}
      <div className="relative pb-20">
        {/* 1️⃣ HEADER ZONE */}
        <div className="sticky top-0 z-30 glass-overlay border-b border-border/50 px-4 pt-4 pb-3">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-muted rounded-xl transition-all zen-shadow"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </button>
            
            <motion.h2
              key={monthYear}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontWeight: 700, letterSpacing: '-0.02em' }}
            >
              {monthYear}
            </motion.h2>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-muted rounded-xl transition-all zen-shadow"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
              <button className="p-2 hover:bg-muted rounded-xl transition-all zen-shadow">
                <Settings className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Quick Tip */}
          <motion.div
            className="relative h-14 rounded-2xl overflow-hidden mb-3 p-4 flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(75, 92, 251, 0.08), rgba(0, 199, 183, 0.08))',
              border: '1px solid rgba(75, 92, 251, 0.1)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={2} />
            </motion.div>
            <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
              Tap any day to view details and plan your time
            </p>
          </motion.div>
        </div>

        {/* 2️⃣ MODE TOGGLE BAR */}
        <div className="sticky top-[140px] z-20 glass-overlay border-b border-border/30 px-4 py-3">
          <div className="relative flex items-center justify-center gap-1 p-1 rounded-2xl bg-muted/40">
            {/* Sliding underline */}
            <motion.div
              className="absolute h-10 rounded-xl bg-background zen-shadow"
              initial={false}
              animate={{
                x: viewMode === 'day' ? 0 : viewMode === 'week' ? '100%' : '200%',
                width: '33.333%',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ left: 0, top: 4 }}
            />
            
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="relative z-10 flex-1 py-2.5 rounded-xl transition-colors"
              >
                <span
                  className="text-sm capitalize"
                  style={{
                    fontWeight: viewMode === mode ? 700 : 600,
                    color: viewMode === mode ? 'var(--foreground)' : 'var(--muted-foreground)',
                  }}
                >
                  {mode}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <AnimatePresence mode="wait">
          {/* 3️⃣ DAY VIEW - TIMELINE GRID */}
          {viewMode === 'day' && (
            <motion.div
              key="day-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="px-4 pt-4 pb-32"
            >
              {/* Date display */}
              <div className="mb-4 text-center">
                <p className="text-sm text-muted-foreground" style={{ fontWeight: 600 }}>
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Timeline container */}
              <div className="relative min-h-[600px]">
                {/* Time labels */}
                <div className="absolute left-0 top-0 bottom-0 w-14 space-y-[calc(100%/11)]">
                  {Array.from({ length: 11 }, (_, i) => i + 8).map((hour) => (
                    <div key={hour} className="text-xs text-muted-foreground text-right pr-2" style={{ fontWeight: 600 }}>
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                  ))}
                </div>

                {/* Grid lines */}
                <div className="absolute left-16 right-0 top-0 bottom-0">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-t border-border/30"
                      style={{ top: `${(i / 10) * 100}%` }}
                    />
                  ))}
                </div>

                {/* Time blocks */}
                <div className="absolute left-16 right-0 top-0 bottom-0">
                  {todayEntries.map((entry) => {
                    const style = getBlockStyle(entry.startTime, entry.endTime);
                    const color = getCategoryColor(entry.category);
                    const workOrder = mockWorkOrders.find((wo) => wo.id === entry.workOrderId);

                    return (
                      <motion.div
                        key={entry.id}
                        className="absolute left-0 right-0 px-1"
                        style={style}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.div
                          className="h-full rounded-xl p-3 cursor-pointer zen-shadow relative overflow-hidden"
                          style={{
                            backgroundColor: entry.actual ? `${color}` : 'transparent',
                            border: entry.actual ? 'none' : `2px dashed ${color}`,
                            opacity: entry.actual ? 1 : 0.5,
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedEntry(entry);
                            setCurrentScreen('edit-time-entry');
                          }}
                          drag={entry.actual ? 'y' : false}
                          dragConstraints={{ top: 0, bottom: 0 }}
                          onDragStart={() => {
                            setDraggedBlock(entry.id);
                            // Haptic feedback simulation
                            toast.info('Dragging...', { duration: 500 });
                          }}
                          onDragEnd={() => {
                            setDraggedBlock(null);
                            toast.success('Time updated!');
                          }}
                        >
                          {/* Gradient overlay for actual entries */}
                          {entry.actual && (
                            <div
                              className="absolute inset-0 opacity-20"
                              style={{
                                background: `linear-gradient(135deg, transparent, white)`,
                              }}
                            />
                          )}

                          <div className="relative z-10">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p
                                className="text-xs text-white line-clamp-1"
                                style={{ fontWeight: 700 }}
                              >
                                {entry.task}
                              </p>

                            </div>
                            <p className="text-xs text-white/80" style={{ fontWeight: 600 }}>
                              {entry.startTime} - {entry.endTime}
                            </p>
                            {workOrder && (
                              <p className="text-xs text-white/70 mt-1 line-clamp-1" style={{ fontWeight: 500 }}>
                                {workOrder.id}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* 7️⃣ WEEK VIEW - HEATMAP */}
          {viewMode === 'week' && (
            <motion.div
              key="week-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="px-4 pt-4 pb-32"
            >
              <div className="grid grid-cols-7 gap-2">
                {getWeekDays().map((day, index) => {
                  const hours = getHoursForDate(day);
                  const isToday = day.toDateString() === currentDate.toDateString();

                  return (
                    <motion.div
                      key={index}
                      className="aspect-square rounded-2xl p-3 cursor-pointer zen-shadow relative overflow-hidden"
                      style={{
                        backgroundColor: hours > 0 ? 'rgba(75, 92, 251, 0.1)' : 'var(--muted)',
                        border: isToday ? '2px solid var(--primary)' : '1px solid var(--border)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode('day');
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 600 }}>
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </p>
                        <p className="text-sm mb-1" style={{ fontWeight: 700 }}>
                          {day.getDate()}
                        </p>
                        {hours > 0 && (
                          <div
                            className="text-xs"
                            style={{
                              fontWeight: 700,
                              color: 'var(--primary)',
                            }}
                          >
                            {hours}h
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Week summary */}
              <div className="mt-6 glass-card rounded-2xl p-4">
                <h4 className="mb-3" style={{ fontWeight: 700 }}>
                  Week Summary
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 500 }}>
                      Avg Flow
                    </p>
                    <p className="text-xl" style={{ fontWeight: 700, color: getFlowColor(88) }}>
                      ℱ 88
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 500 }}>
                      Hours
                    </p>
                    <p className="text-xl" style={{ fontWeight: 700 }}>
                      36.5h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 500 }}>
                      Peak Day
                    </p>
                    <p className="text-xl" style={{ fontWeight: 700 }}>
                      Wed
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MONTH VIEW - CALENDAR HEATMAP */}
          {viewMode === 'month' && (
            <motion.div
              key="month-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="px-4 pt-4 pb-32"
            >
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="text-center text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {getMonthDays().map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} className="aspect-square" />;
                  }

                  const hours = getHoursForDate(day);
                  const isToday = day.toDateString() === new Date(2025, 9, 23).toDateString();
                  const intensity = hours > 0 ? Math.min(hours / 8, 1) : 0;

                  return (
                    <motion.div
                      key={index}
                      className="aspect-square rounded-xl p-2 cursor-pointer zen-shadow relative overflow-hidden flex flex-col items-center justify-center"
                      style={{
                        backgroundColor: hours > 0 ? `rgba(75, 92, 251, ${0.2 + intensity * 0.6})` : 'var(--muted)',
                        border: isToday ? '2px solid var(--primary)' : '1px solid var(--border)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCurrentDate(day);
                        setViewMode('day');
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.01 }}
                    >
                      <p
                        className="text-xs"
                        style={{
                          fontWeight: 700,
                          color: hours > 0 ? 'white' : 'var(--muted-foreground)',
                        }}
                      >
                        {day.getDate()}
                      </p>
                      {hours > 0 && (
                        <p className="text-[8px] text-white/80 mt-0.5" style={{ fontWeight: 600 }}>
                          {hours}h
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 8️⃣ MOOD CHECK-IN STRIP */}
        {viewMode === 'day' && (
          <motion.div
            className="fixed bottom-[280px] left-0 right-0 z-10 px-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="glass-card rounded-2xl p-3 zen-shadow-xl border border-border/50">
              <p className="text-xs text-muted-foreground mb-2 text-center" style={{ fontWeight: 600 }}>
                How are you feeling?
              </p>
              <div className="flex items-center justify-center gap-3">
                {(['😃', '😐', '😩'] as Mood[]).map((mood) => (
                  <motion.button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all"
                    style={{
                      backgroundColor: selectedMood === mood ? 'var(--primary)' : 'var(--muted)',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={selectedMood === mood ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {mood}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 9️⃣ BOTTOM ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-40 glass-overlay border-t border-border/50 px-4 py-3 safe-bottom">
          <div className="flex items-center justify-around gap-2">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 zen-shadow-lg h-12"
              onClick={() => {
                setSelectedEntry(null);
                setCurrentScreen('edit-time-entry');
              }}
            >
              <Plus className="w-5 h-5 mr-2" strokeWidth={2.5} />
              <span style={{ fontWeight: 700 }}>Add Entry</span>
            </Button>
            
            <motion.button
              className="w-12 h-12 rounded-2xl bg-secondary/10 hover:bg-secondary/20 transition-all zen-shadow flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
              onClick={() => setCoachSheetOpen(true)}
            >
              <Brain className="w-5 h-5 text-secondary" strokeWidth={2.5} />
            </motion.button>
            
            <motion.button
              className="w-12 h-12 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 transition-all zen-shadow flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <BarChart3 className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
            </motion.button>
            
            <motion.button
              className="w-12 h-12 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 transition-all zen-shadow flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              <Filter className="w-5 h-5 text-purple-500" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* 5️⃣ AI COACH CARD - VISIBLE IN ALL MODES */}
      <motion.div
        className="fixed bottom-[100px] left-0 right-0 z-50 px-4"
        drag="y"
        dragConstraints={{ top: -400, bottom: 0 }}
        dragElastic={0.1}
        dragSnapToOrigin={false}
        onDragEnd={(e, info: PanInfo) => {
          if (info.offset.y < -100) {
            setCoachSheetOpen(true);
          }
        }}
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="glass-card rounded-2xl p-4 zen-shadow-2xl border border-border/50 backdrop-blur-xl">
          {/* Drag handle */}
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ fontWeight: 700 }}>
                  {viewMode === 'day' && "Today's Progress"}
                  {viewMode === 'week' && "This Week's Summary"}
                  {viewMode === 'month' && "Monthly Overview"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-2xl"
                    style={{
                      fontWeight: 800,
                      color: 'var(--primary)',
                      fontFamily: 'Urbanist',
                    }}
                  >
                    {viewMode === 'day' ? '5.5h' : viewMode === 'week' ? '36.5h' : '148h'}
                  </span>
                  <Badge
                    className="px-2 py-0.5"
                    style={{
                      backgroundColor: '#00D68F20',
                      color: '#00D68F',
                      fontWeight: 700,
                    }}
                  >
                    <ArrowUp className="w-3 h-3 mr-1" strokeWidth={2.5} />
                    {viewMode === 'day' ? 'On track' : viewMode === 'week' ? '+12% from avg' : '+8% from avg'}
                  </Badge>
                </div>
              </div>
              <motion.button
                onClick={() => setCoachSheetOpen(true)}
                className="p-3 rounded-2xl bg-primary/10 hover:bg-primary/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-5 h-5 text-primary" strokeWidth={2} />
              </motion.button>
            </div>

            <Separator />

            {/* Quick stats - Dynamic based on view mode */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" strokeWidth={2} />
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    {viewMode === 'day' ? 'Focus Time' : viewMode === 'week' ? 'Weekly Hours' : 'Total Hours'}
                  </p>
                </div>
                <p className="text-lg" style={{ fontWeight: 700 }}>
                  {viewMode === 'day' ? '5h 30m' : viewMode === 'week' ? '36.5h' : '148h'}
                </p>
              </div>
              <div className="glass-card rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Coffee className="w-4 h-4 text-secondary" strokeWidth={2} />
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    {viewMode === 'day' ? 'Breaks' : viewMode === 'week' ? 'Peak Day' : 'Best Day'}
                  </p>
                </div>
                <p className="text-lg" style={{ fontWeight: 700 }}>
                  {viewMode === 'day' ? '3 times' : viewMode === 'week' ? 'Wed' : 'Oct 15'}
                </p>
              </div>
            </div>

            {/* Micro tip - Dynamic based on view mode */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={2} />
              <p className="text-xs text-foreground" style={{ fontWeight: 500 }}>
                {viewMode === 'day' && "You're 30 mins away from your daily goal. One more focused session!"}
                {viewMode === 'week' && "You're on track to exceed your weekly target! Keep up the momentum."}
                {viewMode === 'month' && "Your best week was Oct 14-20 with 42.5 hours. Try to replicate that pattern!"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 6️⃣ COACH SHEET */}
      <Sheet open={coachSheetOpen} onOpenChange={setCoachSheetOpen}>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" strokeWidth={2.5} />
                </div>
                <div>
                  <SheetTitle style={{ fontWeight: 700 }}>Flow Coach</SheetTitle>
                  <SheetDescription style={{ fontWeight: 500 }}>
                    AI-powered insights for peak performance
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 px-6 py-6">
              <div className="space-y-6">
                {/* 7-day hours trend */}
                <div>
                  <h4 className="mb-3" style={{ fontWeight: 700 }}>
                    7-Day Hours Trend
                  </h4>
                  <div className="glass-card rounded-2xl p-4">
                    <div className="h-32 flex items-end justify-between gap-1">
                      {[6.5, 7.2, 8.1, 5.5, 7.8, 3.2, 5.5].map((hours, index) => {
                        const height = (hours / 10) * 100;
                        return (
                          <motion.div
                            key={index}
                            className="flex-1 rounded-t-lg"
                            style={{
                              height: `${height}%`,
                              backgroundColor: 'var(--primary)',
                            }}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: index * 0.1 }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <p key={index} className="flex-1 text-center text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                          {day}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div>
                  <h4 className="mb-3" style={{ fontWeight: 700 }}>
                    AI Insights
                  </h4>
                  <div className="space-y-3">
                    {mockAIInsights.map((insight) => {
                      const getIcon = () => {
                        switch (insight.icon) {
                          case 'zap':
                            return <Zap className="w-5 h-5" strokeWidth={2} />;
                          case 'alert-triangle':
                            return <AlertTriangle className="w-5 h-5" strokeWidth={2} />;
                          case 'trending-up':
                            return <TrendingUp className="w-5 h-5" strokeWidth={2} />;
                          case 'coffee':
                            return <Coffee className="w-5 h-5" strokeWidth={2} />;
                          default:
                            return <Sparkles className="w-5 h-5" strokeWidth={2} />;
                        }
                      };

                      const getColor = () => {
                        switch (insight.type) {
                          case 'productivity':
                            return '#00C7B7';
                          case 'warning':
                            return '#F0BB00';
                          case 'achievement':
                            return '#00D68F';
                          case 'tip':
                            return '#4B5CFB';
                          default:
                            return '#888';
                        }
                      };

                      return (
                        <motion.div
                          key={insight.id}
                          className="glass-card rounded-2xl p-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: `${getColor()}20`, color: getColor() }}
                            >
                              {getIcon()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm mb-1" style={{ fontWeight: 700 }}>
                                {insight.title}
                              </p>
                              <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                                {insight.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Generate Plan CTA */}
                <Button className="w-full h-14 bg-gradient-to-r from-secondary to-primary hover:opacity-90 zen-shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2" strokeWidth={2.5} />
                  <span style={{ fontWeight: 700 }}>Generate Tomorrow's Plan</span>
                </Button>
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>


    </div>
  );
};
