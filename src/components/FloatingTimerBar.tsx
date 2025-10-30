import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Play, Pause, Clock, X } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { toast } from 'sonner@2.0.3';

export const FloatingTimerBar = () => {
  const { currentScreen, setCurrentScreen, timerState, setTimerState } = useApp();
  const [displayTime, setDisplayTime] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Drag gesture state for collapsed button
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [0, 100], [1, 0]);
  const scale = useTransform(dragY, [0, 100], [1, 0.8]);

  // Show on all screens except login/splash/onboarding
  const shouldShow = currentScreen !== 'login' && 
                     currentScreen !== 'splash' &&
                     currentScreen !== 'onboarding' &&
                     !isDismissed;

  // Update display time every second when timer is running
  useEffect(() => {
    if (timerState.isRunning && timerState.startTime) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000) + timerState.elapsedSeconds;
        setDisplayTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setDisplayTime(timerState.elapsedSeconds);
    }
  }, [timerState.isRunning, timerState.startTime, timerState.elapsedSeconds]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    if (timerState.isRunning) {
      // Stop timer
      const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000) + timerState.elapsedSeconds;
      setTimerState({
        ...timerState,
        isRunning: false,
        startTime: null,
        elapsedSeconds: elapsed,
      });
      toast.success('Timer paused');
    } else {
      // Start timer - allow without task selection
      setTimerState({
        ...timerState,
        isRunning: true,
        startTime: Date.now(),
        taskName: timerState.taskName || 'Quick Timer',
      });
      toast.success('Timer started');
    }
  };

  const handleTimeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const handleCardClick = () => {
    // Navigate to timer dashboard when clicking the expanded card (not buttons)
    setCurrentScreen('timer');
  };

  const handleDragEnd = (_event: any, info: any) => {
    // If dragged down more than 80px, dismiss the button
    if (info.offset.y > 80) {
      setIsDismissed(true);
      toast.success('Timer minimized');
    } else {
      // Reset position if not dismissed
      dragY.set(0);
    }
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className={isExpanded ? "fixed left-0 right-0 z-40 px-4" : "fixed z-40"}
          style={{ 
            bottom: 'calc(96px + env(safe-area-inset-bottom))',
            right: isExpanded ? undefined : '16px',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 400,
            damping: 25
          }}
        >
          {isExpanded ? (
            // Expanded Card View
            <motion.div
              className="max-w-md mx-auto rounded-xl overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(30, 30, 35, 0.85)',
                backdropFilter: 'blur(16px)',
                border: timerState.isRunning 
                  ? '1px solid rgba(75, 92, 251, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: timerState.isRunning
                  ? '0 4px 20px rgba(75, 92, 251, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)'
                  : '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(255, 255, 255, 0.03)',
              }}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={handleCardClick}
            >
              <div className="flex items-center justify-between p-3.5">
                {/* Left side - Timer info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: timerState.isRunning
                        ? 'rgba(75, 92, 251, 0.12)'
                        : 'rgba(255, 255, 255, 0.06)',
                      border: timerState.isRunning
                        ? '1px solid rgba(75, 92, 251, 0.2)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Clock 
                      className="w-3.5 h-3.5" 
                      style={{ 
                        color: timerState.isRunning ? '#8B95FB' : '#A1A1AA'
                      }} 
                      strokeWidth={2} 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {timerState.isRunning || timerState.taskName ? (
                      <>
                        <p 
                          className="text-sm truncate" 
                          style={{ 
                            fontWeight: 500,
                            color: '#FAFAFA'
                          }}
                        >
                          {timerState.taskName || 'No task selected'}
                        </p>
                        <p 
                          className="text-xs" 
                          style={{ 
                            fontWeight: 400,
                            color: timerState.isRunning ? '#8B95FB' : '#A1A1AA'
                          }}
                        >
                          {timerState.isRunning ? 'Running' : 'Paused'} • {formatTime(displayTime)}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm" style={{ fontWeight: 500, color: '#FAFAFA' }}>
                          Quick Timer Access
                        </p>
                        <p className="text-xs" style={{ fontWeight: 400, color: '#A1A1AA' }}>
                          Tap to start tracking time
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Right side - Control buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <motion.button
                    onClick={handleToggleTimer}
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: timerState.isRunning 
                        ? 'rgba(240, 187, 0, 0.15)'
                        : 'rgba(75, 92, 251, 0.2)',
                      border: timerState.isRunning 
                        ? '1px solid rgba(240, 187, 0, 0.3)'
                        : '1px solid rgba(75, 92, 251, 0.35)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={timerState.isRunning ? 'Pause timer' : 'Start timer'}
                  >
                    <motion.div
                      initial={false}
                      animate={{ 
                        rotate: timerState.isRunning ? 0 : 360
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {timerState.isRunning ? (
                        <Pause className="w-3.5 h-3.5" style={{ color: '#F0BB00' }} fill="currentColor" strokeWidth={2} />
                      ) : (
                        <Play className="w-3.5 h-3.5" style={{ color: '#6B7AFB' }} fill="currentColor" strokeWidth={2} />
                      )}
                    </motion.div>
                  </motion.button>

                  <motion.button
                    onClick={handleCollapse}
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Collapse"
                  >
                    <X className="w-3.5 h-3.5" style={{ color: '#A1A1AA' }} strokeWidth={2} />
                  </motion.button>
                </div>
              </div>

              {/* Progress indicator when running */}
              {timerState.isRunning && (
                <motion.div
                  className="h-0.5"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(75, 92, 251, 0.5), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 0%'],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              )}
            </motion.div>
          ) : (
            // Collapsed Button View
            <motion.div
              className="cursor-pointer select-none"
              style={{
                background: 'rgba(30, 30, 35, 0.85)',
                backdropFilter: 'blur(16px)',
                border: timerState.isRunning 
                  ? '1px solid rgba(75, 92, 251, 0.25)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(255, 255, 255, 0.03)',
                borderRadius: '24px',
                y: dragY,
                opacity,
                scale,
              }}
              layout
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex items-center gap-2.5 px-4 py-3">
                <div className="relative">
                  <motion.button
                    onClick={handleToggleTimer}
                    className="relative flex items-center justify-center z-10"
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {isHovered ? (
                        <motion.div
                          key="control-icon"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          {timerState.isRunning ? (
                            <Pause 
                              className="w-4 h-4" 
                              style={{ color: '#F0BB00' }} 
                              fill="currentColor" 
                              strokeWidth={2} 
                            />
                          ) : (
                            <Play 
                              className="w-4 h-4" 
                              style={{ color: '#6B7AFB' }} 
                              fill="currentColor" 
                              strokeWidth={2} 
                            />
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="clock-icon"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Clock 
                            className="w-4 h-4" 
                            style={{ 
                              color: timerState.isRunning ? '#8B95FB' : '#A1A1AA'
                            }} 
                            strokeWidth={2} 
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                <button
                  onClick={handleTimeClick}
                  className="text-sm tabular-nums"
                  style={{ 
                    fontWeight: 600,
                    color: timerState.isRunning ? '#8B95FB' : '#FAFAFA'
                  }}
                >
                  {formatTime(displayTime)}
                </button>
              </div>

              {/* Progress indicator when running */}
              {timerState.isRunning && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden"
                  style={{
                    borderBottomLeftRadius: '24px',
                    borderBottomRightRadius: '24px',
                  }}
                >
                  <motion.div
                    className="h-full"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(75, 92, 251, 0.6), transparent)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 0%'],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
