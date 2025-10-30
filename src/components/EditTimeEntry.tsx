import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Pause,
  Play,
  Square,
  Tag,
  FileText,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Button } from './ui/button';
import { mockWorkOrders } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { useApp } from '../lib/AppContext';

export const EditTimeEntry = () => {
  const { setCurrentScreen, selectedEntry, timerState } = useApp();
  const entry = selectedEntry;
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [description, setDescription] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from entry if exists
  useEffect(() => {
    if (entry) {
      setDescription(entry.task || '');
      // Calculate elapsed time from entry duration
      const duration = entry.duration || 0;
      setElapsedTime(duration * 60); // Convert minutes to seconds
      setIsRunning(false);
    }
  }, [entry]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const stopAndSave = () => {
    setIsRunning(false);
    if (elapsedTime > 0) {
      toast.success('Time entry saved!');
      setCurrentScreen('flow-calendar');
    } else {
      toast.error('No time to save');
    }
  };

  const selectedWorkOrder = entry?.workOrderId 
    ? mockWorkOrders.find((wo) => wo.id === entry.workOrderId)
    : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setCurrentScreen('flow-calendar')}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            {selectedWorkOrder && (
              <>
                <span className="text-sm" style={{ fontWeight: 600 }}>
                  {selectedWorkOrder.id}
                </span>
                {selectedWorkOrder.billable && selectedWorkOrder.rate > 0 && (
                  <Badge
                    className="text-xs px-2 py-0.5"
                    style={{
                      backgroundColor: '#4B5CFB20',
                      color: '#6B7CFF',
                      fontWeight: 600,
                      border: '1px solid #4B5CFB40',
                    }}
                  >
                    {selectedWorkOrder.currency}{selectedWorkOrder.rate}/hr
                  </Badge>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setCurrentScreen('flow-calendar')}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content - Zen Mode Timer UI */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Zen-Style Circular Timer Display */}
        <motion.div
          className="flex flex-col items-center w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Large Timer Ring with Breathing Animation */}
          <motion.div
            className="relative mb-12"
            style={{ width: 240, height: 240 }}
            animate={{
              scale: isRunning ? [1, 1.05, 1] : 1,
            }}
            transition={{
              duration: 2,
              repeat: isRunning ? Infinity : 0,
              ease: 'easeInOut',
            }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, rgba(75, 92, 251, 0.6), rgba(0, 199, 183, 0.6), rgba(75, 92, 251, 0.6))',
                filter: 'blur(20px)',
              }}
              animate={{
                rotate: isRunning ? 360 : 0,
                opacity: isRunning ? [0.4, 0.7, 0.4] : 0.3,
              }}
              transition={{
                rotate: { duration: 8, repeat: isRunning ? Infinity : 0, ease: 'linear' },
                opacity: { duration: 3, repeat: isRunning ? Infinity : 0, ease: 'easeInOut' },
              }}
            />

            {/* Main timer ring */}
            <div className="absolute inset-0 rounded-full bg-background/10 backdrop-blur-xl border-2 border-primary/30 flex items-center justify-center">
              <p
                className="text-5xl tabular-nums"
                style={{ fontWeight: 200, letterSpacing: '-0.05em', color: '#FAFAFA' }}
              >
                {formatTime(elapsedTime)}
              </p>
            </div>

            {/* Inner breathing pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(75, 92, 251, 0.2), transparent 70%)',
              }}
              animate={{
                scale: isRunning ? [0.8, 1.2, 0.8] : 0.8,
                opacity: isRunning ? [0.3, 0, 0.3] : 0.1,
              }}
              transition={{
                duration: 2,
                repeat: isRunning ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Running Status Indicator */}
          {isRunning && (
            <motion.div
              className="flex items-center gap-2 mb-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-secondary"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <p className="text-sm text-muted-foreground" style={{ fontWeight: 500 }}>
                Running
              </p>
            </motion.div>
          )}

          {/* Description Input */}
          <motion.div
            className="w-full mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <input
              type="text"
              placeholder="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/20 backdrop-blur-xl border border-border/40 text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 focus:bg-muted/30 transition-all text-sm"
              style={{ fontWeight: 500 }}
            />
          </motion.div>

          {/* Activity Selector Button */}
          <motion.button
            onClick={() => setCurrentScreen('work-order-selector')}
            className="w-full mb-8 px-4 py-3 rounded-xl bg-muted/20 backdrop-blur-xl border border-border/40 hover:border-border/60 hover:bg-muted/30 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tag 
                  className="w-4 h-4" 
                  strokeWidth={2}
                  style={{
                    color: selectedWorkOrder 
                      ? selectedWorkOrder.type === 'sequence' 
                        ? '#00E5D0'  // Green for sequence
                        : selectedWorkOrder.type === 'direct'
                        ? '#6B7CFF'  // Blue for direct
                        : '#FFD666'  // Yellow for general
                      : 'rgb(var(--muted-foreground))',
                  }}
                />
                <span className="text-sm" style={{ fontWeight: 500 }}>
                  {selectedWorkOrder?.title || 'Select Activity'}
                </span>
              </div>
              {selectedWorkOrder?.billable && selectedWorkOrder.rate > 0 && (
                <Badge
                  className="text-xs px-2 py-0.5"
                  style={{
                    backgroundColor: '#4B5CFB20',
                    color: '#6B7CFF',
                    fontWeight: 600,
                    border: '1px solid #4B5CFB40',
                  }}
                >
                  {selectedWorkOrder.currency}{selectedWorkOrder.rate}/hr
                </Badge>
              )}
            </div>
          </motion.button>

          {/* Primary CTA Buttons */}
          <motion.div
            className="flex items-center gap-3 w-full justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Activity Selector Icon Button */}
            <motion.button
              onClick={() => setCurrentScreen('work-order-selector')}
              className="w-12 h-12 rounded-xl bg-muted/20 backdrop-blur-xl border border-border/40 hover:bg-muted/30 hover:border-border/60 transition-all flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Select Activity"
            >
              <Tag className="w-5 h-5 text-primary" strokeWidth={2} />
            </motion.button>

            {/* Play/Pause Button */}
            <motion.button
              onClick={toggleTimer}
              className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center zen-shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRunning ? (
                <Pause className="w-8 h-8" strokeWidth={2} fill="currentColor" />
              ) : (
                <Play className="w-8 h-8 ml-1" strokeWidth={2} fill="currentColor" />
              )}
            </motion.button>

            {/* Stop & Save Button */}
            <AnimatePresence>
              {elapsedTime > 0 && (
                <motion.button
                  onClick={stopAndSave}
                  className="px-4 h-12 rounded-xl bg-secondary/20 hover:bg-secondary/30 backdrop-blur-xl border border-secondary/40 text-secondary flex items-center gap-2 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Square className="w-4 h-4" strokeWidth={2} fill="currentColor" />
                  <span className="text-sm" style={{ fontWeight: 600 }}>
                    Stop & Save
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
