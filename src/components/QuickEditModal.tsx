import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Undo2, Clock, Tag, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface TimeEntry {
  id: string;
  description: string;
  duration: number;
  date: string;
  workOrderType?: 'sequence' | 'direct' | 'general';
  billable?: boolean;
  rate?: number;
  currency?: string;
  startTime?: string;
  endTime?: string;
}

interface QuickEditModalProps {
  entry: TimeEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedEntry: TimeEntry) => void;
}

export const QuickEditModal = ({ entry, isOpen, onClose, onSave }: QuickEditModalProps) => {
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [activityType, setActivityType] = useState<'sequence' | 'direct' | 'general'>('general');
  const [useTimeRange, setUseTimeRange] = useState(false);

  // Initialize form with entry data
  useEffect(() => {
    if (entry) {
      setDescription(entry.description || '');
      const hrs = Math.floor(entry.duration / 60);
      const mins = entry.duration % 60;
      setHours(hrs.toString());
      setMinutes(mins.toString());
      setActivityType(entry.workOrderType || 'general');
      
      // Set time range if available
      if (entry.startTime && entry.endTime) {
        setStartTime(entry.startTime);
        setEndTime(entry.endTime);
        setUseTimeRange(true);
      } else {
        setStartTime('09:00');
        setEndTime('17:00');
        setUseTimeRange(false);
      }
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry) return;

    let totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
    
    // If using time range, calculate duration from start/end times
    if (useTimeRange && startTime && endTime) {
      const [startHr, startMin] = startTime.split(':').map(Number);
      const [endHr, endMin] = endTime.split(':').map(Number);
      const startMinutes = startHr * 60 + startMin;
      const endMinutes = endHr * 60 + endMin;
      totalMinutes = endMinutes - startMinutes;
      
      if (totalMinutes < 0) {
        toast.error('End time must be after start time');
        return;
      }
    }

    const updatedEntry: TimeEntry = {
      ...entry,
      description,
      duration: totalMinutes,
      workOrderType: activityType,
      startTime: useTimeRange ? startTime : undefined,
      endTime: useTimeRange ? endTime : undefined,
      editedAt: new Date().toISOString(),
    };

    onSave(updatedEntry);
    toast.success('Entry updated', {
      description: 'Your changes have been saved',
      duration: 2000,
    });
  };

  const handleUndo = () => {
    if (entry) {
      setDescription(entry.description || '');
      const hrs = Math.floor(entry.duration / 60);
      const mins = entry.duration % 60;
      setHours(hrs.toString());
      setMinutes(mins.toString());
      setActivityType(entry.workOrderType || 'general');
      toast.info('Changes reverted');
    }
  };

  if (!entry) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Modal Content */}
            <motion.div
              className="w-full max-w-md pointer-events-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div
                className="rounded-2xl border border-border/50 shadow-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(75, 92, 251, 0.18) 0%, rgba(0, 199, 183, 0.14) 100%)',
                  backdropFilter: 'blur(40px)',
                }}
              >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg" style={{ fontWeight: 700 }}>
                      Quick Edit
                    </h3>
                    <button
                      onClick={onClose}
                      className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                    Make quick adjustments to your time entry
                  </p>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-5">
                  {/* Description Field */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                      Description
                    </label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="What did you work on?"
                      className="bg-background/50 border-border/50 focus:border-primary/60 transition-colors"
                    />
                  </div>

                  {/* Duration Mode Toggle */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-background/45 border border-border/50">
                    <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                    <button
                      onClick={() => setUseTimeRange(!useTimeRange)}
                      className="flex-1 text-left text-sm text-muted-foreground"
                      style={{ fontWeight: 500 }}
                    >
                      {useTimeRange ? 'Time Range' : 'Duration'}
                    </button>
                    <div
                      className={`w-10 h-5 rounded-full transition-colors ${
                        useTimeRange ? 'bg-primary' : 'bg-muted'
                      } relative cursor-pointer`}
                      onClick={() => setUseTimeRange(!useTimeRange)}
                    >
                      <motion.div
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                        animate={{ left: useTimeRange ? '20px' : '2px' }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Duration Input - Conditional */}
                  {useTimeRange ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                          Start Time
                        </label>
                        <Input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-background/40 border-border/40 focus:border-primary/60 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                          End Time
                        </label>
                        <Input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="bg-background/40 border-border/40 focus:border-primary/60 transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                          Hours
                        </label>
                        <Input
                          type="number"
                          min="0"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="bg-background/40 border-border/40 focus:border-primary/60 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                          Minutes
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={minutes}
                          onChange={(e) => setMinutes(e.target.value)}
                          className="bg-background/40 border-border/40 focus:border-primary/60 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Activity Type Selector */}
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                      Activity Type
                    </label>
                    <div className="flex gap-2">
                      {(['sequence', 'direct', 'general'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setActivityType(type)}
                          className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${
                            activityType === type
                              ? type === 'sequence'
                                ? 'border-secondary bg-secondary/10'
                                : type === 'direct'
                                ? 'border-primary bg-primary/10'
                                : 'border-accent bg-accent/10'
                              : 'border-border/50 bg-background/40'
                          }`}
                        >
                          <Badge
                            className="text-xs px-2 py-0.5 w-full justify-center"
                            style={{
                              backgroundColor:
                                type === 'sequence'
                                  ? '#00C7B730'
                                  : type === 'direct'
                                  ? '#4B5CFB30'
                                  : '#F0BB0030',
                              color:
                                type === 'sequence'
                                  ? '#00E5D0'
                                  : type === 'direct'
                                  ? '#6B7CFF'
                                  : '#FFD666',
                              fontWeight: 600,
                              border:
                                type === 'sequence'
                                  ? '1px solid #00C7B780'
                                  : type === 'direct'
                                  ? '1px solid #4B5CFB80'
                                  : '1px solid #F0BB0080',
                            }}
                          >
                            {type === 'sequence' ? 'Sequence' : type === 'direct' ? 'Direct' : 'General'}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 pt-2 flex gap-3">
                  <Button
                    onClick={handleUndo}
                    variant="outline"
                    className="flex-1 bg-background/40 border-border/40 hover:bg-background/60"
                  >
                    <Undo2 className="w-4 h-4 mr-2" strokeWidth={2} />
                    Undo
                  </Button>
                  <motion.button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ fontWeight: 600 }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Check className="w-4 h-4" strokeWidth={2.5} />
                    </motion.div>
                    Save
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
