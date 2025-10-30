import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { useApp } from '../lib/AppContext';

interface IdleDetectionAlertProps {
  idleThresholdMinutes?: number;
}

export const IdleDetectionAlert = ({ idleThresholdMinutes = 5 }: IdleDetectionAlertProps) => {
  const { timerState, setTimerState } = useApp();
  const [showIdleAlert, setShowIdleAlert] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  useEffect(() => {
    // Reset activity time on any user interaction
    const resetActivityTime = () => {
      setLastActivityTime(Date.now());
      setShowIdleAlert(false);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, resetActivityTime);
    });

    // Check for idle every 30 seconds
    const idleCheckInterval = setInterval(() => {
      if (timerState.isRunning) {
        const idleTime = Date.now() - lastActivityTime;
        const idleMinutes = idleTime / (1000 * 60);

        if (idleMinutes >= idleThresholdMinutes) {
          setShowIdleAlert(true);
        }
      }
    }, 30000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetActivityTime);
      });
      clearInterval(idleCheckInterval);
    };
  }, [timerState.isRunning, lastActivityTime, idleThresholdMinutes]);

  const handleKeepRunning = () => {
    setShowIdleAlert(false);
    setLastActivityTime(Date.now());
  };

  const handleStopTimer = () => {
    setShowIdleAlert(false);
    setTimerState({
      ...timerState,
      isRunning: false,
      startTime: null,
    });
  };

  return (
    <AnimatePresence>
      {showIdleAlert && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Alert */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
          >
            <div className="glass-card rounded-2xl p-6 shadow-2xl border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-full bg-orange-500/20">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">Are you still working?</h3>
                  <p className="text-sm text-muted-foreground">
                    We noticed you've been idle for {idleThresholdMinutes}+ minutes. 
                    Would you like to keep the timer running?
                  </p>
                </div>
                <button
                  onClick={() => setShowIdleAlert(false)}
                  className="p-1 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleStopTimer}
                  className="w-full"
                >
                  Stop Timer
                </Button>
                <Button
                  onClick={handleKeepRunning}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Keep Running
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
