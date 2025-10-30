import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Square, Tag, Briefcase, Clock, Calendar, RotateCcw, Filter, MessageSquare, Sparkles, List, Trash2, Edit3 } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { categories, mockWorkOrders, mockOtherActivities, mockRecentOthersActivities } from '../lib/mockData';
import { toast } from 'sonner@2.0.3';
import { BottomNav } from './BottomNav';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { QuickEditModal } from './QuickEditModal';
import { soundManager } from '../lib/sounds';

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const formatTimerDisplay = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const TimerDashboard = () => {
  const { 
    timerState, 
    setTimerState, 
    setCurrentScreen, 
    setWorkOrderInitialTab, 
    selectedOthersActivity, 
    setSelectedOthersActivity, 
    setSelectedEntry,
    isZenMode,
    setIsZenMode,
    recentEntries,
    setRecentEntries,
    theme,
  } = useApp();
  const [displayTime, setDisplayTime] = useState(0);
  const [description, setDescription] = useState('');
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'yesterday' | 'this-week'>('all');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [swipedEntryId, setSwipedEntryId] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<typeof mockRecentOthersActivities[0] | null>(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [justEditedId, setJustEditedId] = useState<string | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if dark mode is active
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Zen Mode UI states
  const [showGestureHint, setShowGestureHint] = useState(false);
  const [showFlowReward, setShowFlowReward] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [zenMusicPlaying, setZenMusicPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number; touches: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const lastMilestoneRef = useRef<number>(0);
  const zenMusicRef = useRef<{ stop: () => void } | null>(null);

  // Update display time and check for milestones
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerState.isRunning && timerState.startTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000);
        const newTime = timerState.elapsedSeconds + elapsed;
        setDisplayTime(newTime);
        
        // Check for hourly milestones (3600 seconds = 1 hour)
        const currentHour = Math.floor(newTime / 3600);
        const lastHour = Math.floor(lastMilestoneRef.current / 3600);
        
        if (currentHour > lastHour && currentHour > 0) {
          soundManager.milestone();
          toast.success(`${currentHour} hour${currentHour > 1 ? 's' : ''} milestone! 🎉`, { duration: 3000 });
        }
        
        lastMilestoneRef.current = newTime;
      }, 1000);
    } else {
      setDisplayTime(timerState.elapsedSeconds);
    }
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.startTime, timerState.elapsedSeconds]);

  // Toggle timer start/pause
  const toggleTimer = () => {
    if (timerState.isRunning) {
      // Pause
      soundManager.timerPause();
      const elapsed = Math.floor((Date.now() - timerState.startTime!) / 1000);
      setTimerState({
        ...timerState,
        isRunning: false,
        startTime: null,
        elapsedSeconds: timerState.elapsedSeconds + elapsed,
      });
      toast.success('Paused');
    } else {
      // Start/Resume - save description if provided
      if (timerState.elapsedSeconds === 0) {
        soundManager.timerStart();
      } else {
        soundManager.timerResume();
      }
      
      if (timerState.elapsedSeconds === 0 && description.trim()) {
        setTimerState({
          ...timerState,
          isRunning: true,
          startTime: Date.now(),
          activityReason: description,
          taskName: description.slice(0, 50), // Use description as task name
        });
      } else {
        setTimerState({
          ...timerState,
          isRunning: true,
          startTime: Date.now(),
        });
      }
      toast.success(timerState.elapsedSeconds > 0 ? 'Resumed' : 'Started');
    }
  };

  // Stop and save timer
  const stopTimer = () => {
    if (displayTime === 0) {
      toast.error('No time to save');
      return;
    }

    const duration = Math.floor(displayTime / 60);
    const xp = duration;
    
    // Calculate start and end times
    const now = new Date();
    const startDate = new Date(now.getTime() - (displayTime * 1000));
    const startTime = `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`;
    const endTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Create new entry
    const newEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      description: description || 'No description',
      duration: `${Math.floor(duration / 60)}h ${duration % 60}m`,
      durationMinutes: duration,
      startTime: startTime,
      endTime: endTime,
      client: selectedOthersActivity?.client || timerState.taskName || 'Work',
      category: timerState.category,
      billable: timerState.billable,
      workOrderId: timerState.workOrderId,
      activityType: timerState.activityType,
      activityId: timerState.activityId,
      workOrderType: timerState.workOrderType || (selectedOthersActivity ? 'others' : 'direct'),
      xp: xp,
    };

    // Add to recent entries at the beginning
    setRecentEntries([newEntry, ...recentEntries]);
    
    // Play sound and show success animation
    soundManager.timerStop();
    
    // Show success animation in Zen Mode
    if (isZenMode) {
      setShowSaveSuccess(true);
      setTimeout(() => {
        soundManager.success();
        setShowSaveSuccess(false);
      }, 500);
    }
    
    toast.success(`Saved ${Math.floor(duration / 60)}h ${duration % 60}m • +${xp} points`);

    setTimerState({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      taskName: '',
      workOrderId: null,
      activityType: null,
      activityId: null,
      activityReason: '',
      category: 'work',
      billable: false,
      rate: 0,
    });
    setDisplayTime(0);
    setDescription('');
    setSelectedOthersActivity(null);
  };

  // Navigate to work order selector with Direct tab
  const openOthersSelector = () => {
    soundManager.uiClick();
    setWorkOrderInitialTab('direct');
    setCurrentScreen('work-order-selector');
  };

  // Handle reload entry
  const handleReloadEntry = (entry: typeof mockRecentOthersActivities[0]) => {
    soundManager.selection();
    setDescription(entry.description);
    
    // Find the activity
    const activity = mockOtherActivities.find(a => a.id === entry.activityId);
    if (activity) {
      setSelectedOthersActivity(activity);
    }
    
    setTimerState({
      ...timerState,
      taskName: entry.activityName,
      workOrderId: entry.activityId,
      activityType: 'quick-activity',
      activityId: entry.activityId,
      activityReason: entry.description,
      billable: false,
      rate: 0,
    });
    toast.success(`Loaded: ${entry.activityName}`);
  };

  // Handle entry click to view details
  const handleEntryClick = (entry: typeof mockRecentOthersActivities[0]) => {
    if (swipedEntryId === entry.id) return; // Don't open if in delete mode
    setSelectedEntry(entry);
    setCurrentScreen('entry-details');
  };

  // Handle delete entry
  const handleDeleteEntry = (entryId: string) => {
    setRecentEntries(recentEntries.filter(e => e.id !== entryId));
    setSwipedEntryId(null);
    toast.success('Entry deleted');
  };

  // Handle long press to edit
  const handleLongPressStart = (entry: typeof mockRecentOthersActivities[0]) => {
    longPressTimerRef.current = setTimeout(() => {
      setEditingEntry(entry);
      setIsQuickEditOpen(true);
      setSwipedEntryId(null);
      // Haptic feedback simulation
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
    
    // Show glow effect
    setJustEditedId(updatedEntry.id);
    setTimeout(() => setJustEditedId(null), 1000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date('2025-10-25');
    const yesterday = new Date('2025-10-24');

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
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

  // Zen Mode Functions
  const enterZenMode = () => {
    if (!timerState.isRunning && displayTime === 0) {
      toast.error('Start the timer to enter Zen Mode');
      return;
    }
    soundManager.enterZenMode();
    setIsZenMode(true);
    toast.success('Zen Mode activated', { duration: 1500 });
  };

  const exitZenMode = (showReward = false) => {
    soundManager.exitZenMode();
    setIsZenMode(false);
    // Stop zen music when exiting
    if (zenMusicRef.current) {
      zenMusicRef.current.stop();
      zenMusicRef.current = null;
      setZenMusicPlaying(false);
    }
    if (showReward) {
      setShowFlowReward(true);
      toast.success('Focus +4 Flow Score', { duration: 2000 });
      setTimeout(() => setShowFlowReward(false), 3000);
    }
  };

  // Zen Music - Melodious meditative soundscape with continuous looping
  const playZenMusic = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    let isPlaying = true;
    let currentPads: { oscillator: OscillatorNode; gainNode: GainNode }[] = [];
    let loopTimeout: NodeJS.Timeout | null = null;
    
    // Create reverb for spacious depth
    const createReverb = () => {
      const convolver = audioContext.createConvolver();
      const rate = audioContext.sampleRate;
      const length = rate * 3.5; // Long reverb tail for meditation
      const impulse = audioContext.createBuffer(2, length, rate);
      const impulseL = impulse.getChannelData(0);
      const impulseR = impulse.getChannelData(1);
      
      for (let i = 0; i < length; i++) {
        const n = length - i;
        impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 3);
        impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 3);
      }
      
      convolver.buffer = impulse;
      return convolver;
    };
    
    const reverb = createReverb();
    const reverbGain = audioContext.createGain();
    reverbGain.gain.value = 0.5; // Rich reverb for meditation
    reverb.connect(reverbGain);
    reverbGain.connect(audioContext.destination);
    
    const masterGain = audioContext.createGain();
    masterGain.gain.value = 0.2; // Increased volume
    masterGain.connect(audioContext.destination);
    
    // Pentatonic scale for zen feeling (C pentatonic: C, D, E, G, A)
    const pentatonicScale = [
      130.81, 146.83, 164.81, 196.00, 220.00, // Lower octave
      261.63, 293.66, 329.63, 392.00, 440.00, // Middle octave
      523.25, 587.33, 659.25, 783.99, 880.00  // Higher octave
    ];
    
    // Create sustained pad layer for ambience (continuous drones)
    const createContinuousPad = (frequency: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Add subtle filtering for warmth
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 0.5;
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGain);
      gainNode.connect(reverb);
      
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.04, now + 2);
      
      oscillator.start(now);
      
      return { oscillator, gainNode };
    };
    
    // Create continuous pad layer (ambient drones)
    currentPads = [
      createContinuousPad(pentatonicScale[5]), // C
      createContinuousPad(pentatonicScale[7]), // E
      createContinuousPad(pentatonicScale[8]), // G
    ];
    
    // Function to play one melodic loop
    const playMelodyLoop = () => {
      if (!isPlaying) return;
      
      const now = audioContext.currentTime;
      const loopDuration = 30; // 30 second loop
      
      // Create a flowing melodic pattern
      const playMelodicNote = (frequency: number, startTime: number, duration: number, volume: number = 0.1) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        // Gentle sine wave
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Soft low-pass for warmth
        filter.type = 'lowpass';
        filter.frequency.value = 1800;
        filter.Q.value = 0.8;
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(masterGain);
        gainNode.connect(reverb);
        
        // Smooth ADSR envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + duration * 0.3);
        gainNode.gain.linearRampToValueAtTime(volume * 0.7, startTime + duration * 0.7);
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      // Melodic pattern - flowing and contemplative
      const melodyPattern = [
        { note: 10, time: 0.5, duration: 4 },     // C (high)
        { note: 9, time: 4, duration: 3 },        // A
        { note: 8, time: 6.5, duration: 3.5 },    // G
        { note: 9, time: 9.5, duration: 3 },      // A
        { note: 7, time: 12, duration: 4 },       // E
        { note: 6, time: 15.5, duration: 3 },     // D
        { note: 5, time: 18, duration: 5 },       // C (middle)
        { note: 8, time: 22.5, duration: 3.5 },   // G
        { note: 10, time: 25.5, duration: 4.5 },  // C (high)
      ];
      
      melodyPattern.forEach(({ note, time, duration }) => {
        playMelodicNote(pentatonicScale[note], now + time, duration, 0.08);
      });
      
      // Gentle harmonic layer
      const harmonies = [
        { note: 7, time: 8, duration: 5 },
        { note: 9, time: 16, duration: 6 },
        { note: 6, time: 24, duration: 5 },
      ];
      
      harmonies.forEach(({ note, time, duration }) => {
        playMelodicNote(pentatonicScale[note], now + time, duration, 0.05);
      });
      
      // Schedule next loop
      loopTimeout = setTimeout(() => {
        playMelodyLoop();
      }, loopDuration * 1000);
    };
    
    // Start the first loop
    playMelodyLoop();
    
    // Return cleanup function
    return {
      stop: () => {
        isPlaying = false;
        
        // Clear loop timeout
        if (loopTimeout) {
          clearTimeout(loopTimeout);
          loopTimeout = null;
        }
        
        // Stop and disconnect pads
        currentPads.forEach(({ oscillator, gainNode }) => {
          try {
            const now = audioContext.currentTime;
            gainNode.gain.linearRampToValueAtTime(0.001, now + 0.5);
            setTimeout(() => {
              oscillator.stop();
              gainNode.disconnect();
            }, 600);
          } catch (e) {
            // Already stopped
          }
        });
        
        // Disconnect audio nodes after fade out
        setTimeout(() => {
          try {
            masterGain.disconnect();
            reverbGain.disconnect();
            reverb.disconnect();
          } catch (e) {
            // Already disconnected
          }
        }, 700);
      }
    };
  };

  const toggleZenMusic = () => {
    if (zenMusicPlaying) {
      // Stop music
      if (zenMusicRef.current) {
        zenMusicRef.current.stop();
        zenMusicRef.current = null;
      }
      setZenMusicPlaying(false);
      toast.success('Zen music paused', { duration: 1000 });
    } else {
      // Start music
      zenMusicRef.current = playZenMusic();
      setZenMusicPlaying(true);
      toast.success('Zen music playing', { duration: 1000 });
    }
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      touches: e.touches.length,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touchEnd = e.changedTouches[0];
    const deltaY = touchEnd.clientY - touchStartRef.current.y;
    const deltaX = Math.abs(touchEnd.clientX - touchStartRef.current.x);
    const duration = Date.now() - touchStartRef.current.time;

    // Two-finger swipe detection
    if (touchStartRef.current.touches === 2) {
      // Swipe down to enter Zen Mode
      if (deltaY > 80 && deltaX < 50 && duration < 500 && !isZenMode) {
        enterZenMode();
      }
      // Swipe up to exit Zen Mode
      else if (deltaY < -80 && deltaX < 50 && duration < 500 && isZenMode) {
        exitZenMode();
      }
    }

    touchStartRef.current = null;
  };

  // Timer click handler - handles both single tap (start/pause) and double tap (Zen Mode)
  const handleTimerDoubleTap = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected - toggle Zen Mode
      if (isZenMode) {
        exitZenMode();
      } else {
        enterZenMode();
      }
    } else {
      // Single tap - toggle timer (start/pause)
      setTimeout(() => {
        const timeSinceThisTap = Date.now() - lastTapRef.current;
        if (timeSinceThisTap >= 300) {
          // This was indeed a single tap, not a double tap
          toggleTimer();
        }
      }, 300);
    }
    
    lastTapRef.current = now;
  };

  // Check for first-time gesture hint
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('zenModeHintSeen');
    if (!hasSeenHint && timerState.isRunning) {
      setShowGestureHint(true);
      setTimeout(() => {
        setShowGestureHint(false);
        localStorage.setItem('zenModeHintSeen', 'true');
      }, 3000);
    }
  }, [timerState.isRunning]);

  // Sync sound manager with state
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const currentCategory = categories.find(c => c.id === timerState.category) || categories[0];
  const currentWorkOrder = mockWorkOrders.find(wo => wo.number === timerState.workOrderId);
  const currentOtherActivity = mockOtherActivities.find(oa => oa.id === timerState.workOrderId);

  // Apply date filter to all recent entries
  const today = new Date('2025-10-25');
  const yesterday = new Date('2025-10-24');
  const weekStart = new Date('2025-10-20');

  // Combine new entries with mock entries
  const allEntries = [...recentEntries, ...mockRecentOthersActivities];

  const filteredEntries = allEntries.filter((entry) => {
    const entryDate = new Date(entry.date);
    
    switch (filterDate) {
      case 'today':
        return entryDate.toDateString() === today.toDateString();
      case 'yesterday':
        return entryDate.toDateString() === yesterday.toDateString();
      case 'this-week':
        return entryDate >= weekStart && entryDate <= today;
      default:
        return true;
    }
  });

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-screen bg-background relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      
      {/* Zen Mode Full Screen Overlay */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div
            className="absolute inset-0 z-50 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              // Only toggle music if clicking the background, not buttons
              if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.zen-background-area')) {
                toggleZenMusic();
              }
            }}
            style={{
              background: isDark
                ? `radial-gradient(ellipse at 50% 50%, 
                    hsl(${240 + (displayTime % 360) * 0.1}, 70%, 15%) 0%, 
                    hsl(${200 + (displayTime % 360) * 0.1}, 60%, 10%) 50%, 
                    hsl(180, 50%, 8%) 100%)`
                : `radial-gradient(ellipse at 50% 50%, 
                    hsl(${240 + (displayTime % 360) * 0.1}, 30%, 95%) 0%, 
                    hsl(${200 + (displayTime % 360) * 0.1}, 25%, 97%) 50%, 
                    hsl(180, 20%, 98%) 100%)`,
            }}
          >
            {/* Music Toggle Button - Top Center */}
            <motion.div
              className="absolute top-16 left-1/2 -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleZenMusic();
                }}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl border transition-all duration-200 ${
                  zenMusicPlaying
                    ? 'bg-primary/10 border-primary/30 hover:bg-primary/20'
                    : 'bg-background/10 border-white/10 hover:bg-background/20'
                }`}
              >
                {/* Animated music icon */}
                <motion.div
                  animate={{
                    scale: zenMusicPlaying ? [1, 1.15, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: zenMusicPlaying ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  {zenMusicPlaying ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={isDark ? 'text-white/60' : 'text-foreground/60'}
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </motion.div>
                
                {/* Label text */}
                <span
                  className={`text-xs transition-colors duration-200 ${
                    zenMusicPlaying
                      ? 'text-primary'
                      : isDark
                      ? 'text-white/60 group-hover:text-white/80'
                      : 'text-foreground/60 group-hover:text-foreground/80'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {zenMusicPlaying ? 'Music On' : 'Music Off'}
                </span>
                
                {/* Audio wave indicator when playing */}
                {zenMusicPlaying && (
                  <div className="flex items-center gap-0.5 ml-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-0.5 bg-primary rounded-full"
                        animate={{
                          height: [4, 10, 4],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            </motion.div>

            {/* Breathing wave background */}
            <motion.div
              className="absolute inset-0 opacity-30 zen-background-area pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(75, 92, 251, 0.3), transparent 60%)',
              }}
              animate={{
                scale: timerState.isRunning ? [1, 1.2, 1] : 1,
                opacity: timerState.isRunning ? [0.2, 0.4, 0.2] : 0.2,
              }}
              transition={{
                duration: 4,
                repeat: timerState.isRunning ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />

            {/* Save Success Celebration */}
            <AnimatePresence>
              {showSaveSuccess && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Success burst particles */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * Math.PI * 2;
                    const distance = 100;
                    return (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full bg-secondary"
                        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                        animate={{
                          x: Math.cos(angle) * distance,
                          y: Math.sin(angle) * distance,
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1,
                          ease: 'easeOut',
                        }}
                      />
                    );
                  })}
                  
                  {/* Success checkmark */}
                  <motion.div
                    className="text-6xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                    transition={{ duration: 0.5, type: 'spring', damping: 10 }}
                  >
                    <div className="w-20 h-20 rounded-full bg-secondary/20 backdrop-blur-xl border-2 border-secondary flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-secondary"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                        />
                      </svg>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Zen Mode Centered Container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              {/* Zen Mode Content */}
              <div className="relative text-center">
              {/* Large Timer Ring with Breathing Animation */}
              <motion.div
                className="relative mx-auto mb-8"
                style={{ width: 240, height: 240 }}
                animate={{
                  scale: timerState.isRunning ? [1, 1.05, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: timerState.isRunning ? Infinity : 0,
                  ease: 'easeInOut',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTimerDoubleTap();
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
                    rotate: timerState.isRunning ? 360 : 0,
                    opacity: timerState.isRunning ? [0.4, 0.7, 0.4] : 0.3,
                  }}
                  transition={{
                    rotate: { duration: 8, repeat: timerState.isRunning ? Infinity : 0, ease: 'linear' },
                    opacity: { duration: 3, repeat: timerState.isRunning ? Infinity : 0, ease: 'easeInOut' },
                  }}
                />

                {/* Main timer ring */}
                <div className="absolute inset-0 rounded-full bg-background/10 backdrop-blur-xl border-2 border-primary/30 flex items-center justify-center">
                  <p
                    className={`text-5xl tabular-nums ${isDark ? 'text-white' : 'text-foreground'}`}
                    style={{ fontWeight: 200, letterSpacing: '-0.05em' }}
                  >
                    {formatTimerDisplay(displayTime)}
                  </p>
                </div>

                {/* Inner breathing pulse */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(75, 92, 251, 0.2), transparent 70%)',
                  }}
                  animate={{
                    scale: timerState.isRunning ? [0.8, 1.2, 0.8] : 0.8,
                    opacity: timerState.isRunning ? [0.3, 0, 0.3] : 0.1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: timerState.isRunning ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              {/* Task name or status caption */}
              <div className="text-center space-y-1">
                {timerState.taskName && displayTime > 0 && (
                  <motion.p
                    className={`text-sm mb-1 ${isDark ? 'text-white/60' : 'text-foreground/60'}`}
                    style={{ fontWeight: 500 }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {timerState.taskName}
                  </motion.p>
                )}
                

              </div>

              {/* Zen Mode Controls */}
              <motion.div
                className="w-full max-w-md space-y-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={(e) => e.stopPropagation()}
              >
              {/* Activity Badge (if selected) */}
              {(currentWorkOrder || currentOtherActivity) && (
                <motion.div
                  className="flex flex-wrap gap-2 justify-center mb-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {currentWorkOrder && (
                    <>
                      <Badge
                        className="text-xs px-2 py-1 backdrop-blur-xl"
                        style={{
                          backgroundColor: isDark ? 'rgba(75, 92, 251, 0.2)' : '#4B5CFB28',
                          color: isDark ? '#fff' : '#4B5CFB',
                          fontWeight: 600,
                          border: isDark ? '1px solid rgba(75, 92, 251, 0.3)' : '1px solid #4B5CFB40',
                        }}
                      >
                        {currentWorkOrder.number}
                      </Badge>
                      {currentWorkOrder.billable && currentWorkOrder.rate > 0 && (
                        <Badge
                          className="text-xs px-2 py-1 backdrop-blur-xl"
                          style={{
                            backgroundColor: isDark ? 'rgba(75, 92, 251, 0.2)' : '#4B5CFB28',
                            color: isDark ? '#fff' : '#4B5CFB',
                            fontWeight: 600,
                            border: isDark ? '1px solid rgba(75, 92, 251, 0.3)' : '1px solid #4B5CFB40',
                          }}
                        >
                          {currentWorkOrder.currency}{currentWorkOrder.rate}/hr
                        </Badge>
                      )}
                    </>
                  )}
                  {currentOtherActivity && currentOtherActivity.client && (
                    <Badge
                      className="text-xs px-2 py-1 backdrop-blur-xl"
                      style={{
                        backgroundColor: isDark ? 'rgba(240, 187, 0, 0.2)' : '#F0BB0028',
                        color: isDark ? '#fff' : '#D4A100',
                        fontWeight: 600,
                        border: isDark ? '1px solid rgba(240, 187, 0, 0.3)' : '1px solid #F0BB0040',
                      }}
                    >
                      {currentOtherActivity.client}
                    </Badge>
                  )}
                </motion.div>
              )}

              {/* Compact Description Input */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  placeholder="What are you working on?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  disabled={!isZenMode && displayTime > 0 && timerState.isRunning}
                  className={`w-full px-4 py-3 rounded-xl backdrop-blur-xl border outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/15'
                      : 'bg-black/5 border-black/10 text-foreground placeholder:text-muted-foreground focus:border-black/20 focus:bg-black/10'
                  }`}
                  style={{ fontWeight: 500 }}
                />
              </motion.div>

              {/* Control Buttons */}
              <div className="flex items-center gap-3 justify-center">
                {/* Activity Selector Button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    openOthersSelector();
                  }}
                  className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all"
                  style={{
                    boxShadow: !isDark ? '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)' : 'none',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Select Activity"
                >
                  <Tag className={`w-5 h-5 ${isDark ? 'text-white' : 'text-foreground'}`} strokeWidth={2} />
                </motion.button>

                {/* Pause/Resume Button - Only show when timer has time */}
                {displayTime > 0 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTimer();
                    }}
                    className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all"
                    style={{
                      boxShadow: !isDark ? '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)' : 'none',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={timerState.isRunning ? 'Pause' : 'Resume'}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    {timerState.isRunning ? (
                      <Pause className={`w-5 h-5 ${isDark ? 'text-white' : 'text-foreground'}`} strokeWidth={2} fill="currentColor" />
                    ) : (
                      <Play className={`w-5 h-5 ml-0.5 ${isDark ? 'text-white' : 'text-foreground'}`} strokeWidth={2} fill="currentColor" />
                    )}
                  </motion.button>
                )}

                {/* Stop Timer Button - Only show when timer has time */}
                {displayTime > 0 && (
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      stopTimer();
                      // Stay in Zen Mode after stopping
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all"
                    style={{
                      boxShadow: !isDark ? '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)' : 'none',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Square className={`w-4 h-4 ${isDark ? 'text-white' : 'text-foreground'}`} strokeWidth={2} fill="currentColor" />
                      <span className={`text-sm ${isDark ? 'text-white' : 'text-foreground'}`} style={{ fontWeight: 600 }}>
                        Stop & Save
                      </span>
                    </div>
                  </motion.button>
                )}

                {/* Start New Timer Button - Show when timer is at 0 */}
                {displayTime === 0 && (
                  <motion.div className="flex-1 relative">
                    {/* Pulsing glow behind button */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/30 blur-xl"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [0.95, 1.05, 0.95],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTimer();
                      }}
                      className="relative w-full px-6 py-3 rounded-xl bg-primary/20 backdrop-blur-xl border border-primary/40 hover:bg-primary/30 hover:border-primary/50 transition-all"
                      style={{
                        boxShadow: !isDark ? '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)' : 'none',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Play className={`w-4 h-4 ml-0.5 ${isDark ? 'text-white' : 'text-foreground'}`} strokeWidth={2} fill="currentColor" />
                        <span className={`text-sm ${isDark ? 'text-white' : 'text-foreground'}`} style={{ fontWeight: 600 }}>
                          Start Timer
                        </span>
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Subtle hint */}
              <motion.p
                className={`text-xs text-center mt-2 ${isDark ? 'text-white/20' : 'text-foreground/50'}`}
                style={{ fontWeight: 300 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {displayTime === 0 
                  ? 'Start a new task or swipe up to exit' 
                  : 'Double-tap timer or swipe up to exit'}
              </motion.p>
              </motion.div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gesture Hint Overlay */}
      <AnimatePresence>
        {showGestureHint && !isZenMode && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="px-6 py-4 rounded-2xl bg-primary/90 backdrop-blur-xl border border-primary/30 shadow-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-white' : 'text-foreground'}`} strokeWidth={2} />
                <p className={`text-sm ${isDark ? 'text-white' : 'text-foreground'}`} style={{ fontWeight: 600 }}>
                  Swipe down with two fingers to enter Zen Mode
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flow Score Reward Badge */}
      <AnimatePresence>
        {showFlowReward && (
          <motion.div
            className="absolute top-24 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="px-6 py-4 rounded-2xl bg-gradient-to-br from-secondary to-primary text-primary-foreground shadow-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" strokeWidth={2} />
                <p className="text-sm" style={{ fontWeight: 700 }}>
                  Focus +4 Flow Score
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Organic Flowing Particles Background - Only visible when timer is running */}
      <AnimatePresence>
        {timerState.isRunning && !isZenMode && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              zIndex: 0,
            }}
          >
            {/* Ambient base glow */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at 50% 120%, rgba(75, 92, 251, 0.03), transparent 60%)',
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Floating particles - liquid sand effect */}
            {[...Array(25)].map((_, i) => {
              const colors = [
                'rgba(75, 92, 251, 0.15)',   // Primary indigo
                'rgba(0, 199, 183, 0.12)',   // Secondary teal
                'rgba(240, 187, 0, 0.08)',   // Accent gold
              ];
              const color = colors[i % 3];
              const size = 3 + Math.random() * 8;
              const startX = Math.random() * 100;
              const delay = Math.random() * 8;
              const duration = 15 + Math.random() * 10;
              const floatX = (Math.random() - 0.5) * 30;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    left: `${startX}%`,
                    background: color,
                    filter: 'blur(2px)',
                    boxShadow: `0 0 ${size * 2}px ${color}`,
                  }}
                  initial={{
                    top: '110%',
                    opacity: 0,
                  }}
                  animate={{
                    top: '-10%',
                    x: [0, floatX, -floatX, floatX, 0],
                    opacity: [0, 1, 1, 1, 0],
                    scale: [1, 1.2, 0.8, 1.1, 1],
                  }}
                  transition={{
                    duration: duration,
                    delay: delay,
                    repeat: Infinity,
                    ease: 'linear',
                    x: {
                      duration: duration * 0.8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                />
              );
            })}

            {/* Organic flowing wisps - flame-like effect */}
            {[...Array(8)].map((_, i) => {
              const startY = 100 + Math.random() * 20;
              const startX = Math.random() * 100;
              const delay = Math.random() * 5;
              const duration = 12 + Math.random() * 8;
              const colors = [
                'linear-gradient(180deg, rgba(75, 92, 251, 0.08) 0%, transparent 100%)',
                'linear-gradient(180deg, rgba(0, 199, 183, 0.06) 0%, transparent 100%)',
                'linear-gradient(180deg, rgba(240, 187, 0, 0.04) 0%, transparent 100%)',
              ];
              const color = colors[i % 3];
              
              return (
                <motion.div
                  key={`wisp-${i}`}
                  className="absolute"
                  style={{
                    width: 80 + Math.random() * 100,
                    height: 120 + Math.random() * 150,
                    left: `${startX}%`,
                    background: color,
                    filter: 'blur(30px)',
                    borderRadius: '50% 50% 40% 60%',
                  }}
                  initial={{
                    top: `${startY}%`,
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    top: `-20%`,
                    x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * -50, (Math.random() - 0.5) * 50],
                    opacity: [0, 0.8, 0.6, 0],
                    rotate: [0, 180, 360],
                    scale: [0.8, 1.1, 0.9, 0.7],
                    borderRadius: [
                      '50% 50% 40% 60%',
                      '40% 60% 50% 50%',
                      '60% 40% 60% 40%',
                      '50% 50% 40% 60%',
                    ],
                  }}
                  transition={{
                    duration: duration,
                    delay: delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              );
            })}

            {/* Shimmer stars - occasional sparkles */}
            {[...Array(12)].map((_, i) => {
              const x = Math.random() * 100;
              const y = Math.random() * 100;
              const delay = Math.random() * 10;
              
              return (
                <motion.div
                  key={`star-${i}`}
                  className="absolute"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: 2,
                    height: 2,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0, 1.5, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: delay,
                    repeat: Infinity,
                    repeatDelay: 7,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.6)',
                      boxShadow: '0 0 8px rgba(255, 255, 255, 0.8), 0 0 12px rgba(75, 92, 251, 0.4)',
                      borderRadius: '50%',
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header - Fixed at Top */}
      <motion.div 
        className="sticky top-0 z-20 glass-overlay border-b border-border/30"
        animate={{
          opacity: isZenMode ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 py-4 safe-top">
          <div className="flex items-center justify-between">
            <h1 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Timer
            </h1>
            <motion.button
              onClick={() => setCurrentScreen('all-entries')}
              className="p-2 hover:bg-muted rounded-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <List className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area - Fades out in Zen Mode */}
      <motion.div 
        className="flex-1 overflow-y-auto pb-20 relative" 
        style={{ zIndex: 1 }}
        animate={{
          opacity: isZenMode ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-6 pt-6 pb-6 space-y-5">

          {/* Zen-Style Circular Timer Display */}
          <motion.div
            className="flex flex-col items-center py-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {/* Large Timer Ring with Breathing Animation */}
            <motion.div
              className="relative mb-8"
              style={{ width: 220, height: 220 }}
              animate={{
                scale: timerState.isRunning ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: timerState.isRunning ? Infinity : 0,
                ease: 'easeInOut',
              }}
              onClick={handleTimerDoubleTap}
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(75, 92, 251, 0.6), rgba(0, 199, 183, 0.6), rgba(75, 92, 251, 0.6))',
                  filter: 'blur(20px)',
                }}
                animate={{
                  rotate: timerState.isRunning ? 360 : 0,
                  opacity: timerState.isRunning ? [0.4, 0.7, 0.4] : 0.3,
                }}
                transition={{
                  rotate: { duration: 8, repeat: timerState.isRunning ? Infinity : 0, ease: 'linear' },
                  opacity: { duration: 3, repeat: timerState.isRunning ? Infinity : 0, ease: 'easeInOut' },
                }}
              />

              {/* Main timer ring */}
              <div className="absolute inset-0 rounded-full backdrop-blur-xl border-2 flex items-center justify-center bg-card/80 border-primary/40 shadow-xl" style={{
                boxShadow: '0 8px 32px rgba(75, 92, 251, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
              }}>
                <p
                  className="text-5xl tabular-nums text-foreground"
                  style={{ fontWeight: 200, letterSpacing: '-0.05em' }}
                >
                  {formatTimerDisplay(displayTime)}
                </p>
              </div>

              {/* Inner breathing pulse */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(75, 92, 251, 0.2), transparent 70%)',
                }}
                animate={{
                  scale: timerState.isRunning ? [0.8, 1.2, 0.8] : 0.8,
                  opacity: timerState.isRunning ? [0.3, 0, 0.3] : 0.1,
                }}
                transition={{
                  duration: 2,
                  repeat: timerState.isRunning ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* Compact Description Input with Animations */}
            <motion.div
              className="w-full max-w-md mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="What are you working on?"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setIsTyping(true);
                    
                    // Clear existing timeout
                    if (typingTimeout) {
                      clearTimeout(typingTimeout);
                    }
                    
                    // Set new timeout to stop typing animation
                    const timeout = setTimeout(() => {
                      setIsTyping(false);
                    }, 800);
                    setTypingTimeout(timeout);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-card border-2 border-border/40 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 focus:bg-card/80 focus:shadow-sm transition-all text-sm shadow-sm"
                  style={{ fontWeight: 500 }}
                />
                
                {/* Animated underline with gradient */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary/40 via-secondary/60 to-primary/40"
                    animate={{
                      x: isTyping ? ['-100%', '100%'] : 0,
                      opacity: description || isTyping ? [0.6, 1, 0.6] : 0,
                    }}
                    transition={{
                      x: {
                        duration: 1,
                        repeat: isTyping ? Infinity : 0,
                        ease: "linear"
                      },
                      opacity: {
                        duration: 1.5,
                        repeat: description ? Infinity : 0,
                      }
                    }}
                  />
                </motion.div>
                
                {/* Typing particles effect */}
                <AnimatePresence>
                  {isTyping && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-primary/60"
                          initial={{ 
                            x: 0, 
                            y: 0, 
                            opacity: 0,
                            scale: 0 
                          }}
                          animate={{ 
                            x: Math.random() * 40 - 20,
                            y: -20 - Math.random() * 20,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.1,
                            ease: "easeOut"
                          }}
                          style={{
                            left: `${20 + i * 30}%`,
                            top: '50%'
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Activity Selector Button */}
            <motion.button
              onClick={openOthersSelector}
              className="w-full max-w-md mb-6 px-4 py-3 rounded-xl bg-card border-2 border-border/40 hover:border-border hover:bg-card/80 shadow-sm transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Tag 
                    className="w-4 h-4 shrink-0" 
                    strokeWidth={2}
                    style={{
                      color: currentWorkOrder 
                        ? currentWorkOrder.type === 'sequence' 
                          ? '#00E5D0'  // Green for sequence
                          : currentWorkOrder.type === 'direct'
                          ? '#6B7CFF'  // Blue for direct
                          : '#FFD666'  // Yellow for general
                        : currentOtherActivity
                        ? '#FFD666'    // Yellow for other activities
                        : 'rgb(var(--foreground) / 0.6)',
                    }}
                  />
                  <span className="text-sm truncate" style={{ fontWeight: 500 }}>
                    {currentWorkOrder?.name || currentOtherActivity?.description || 'Select Activity'}
                  </span>
                </div>
                {(currentWorkOrder || currentOtherActivity) && (
                  <div className="flex items-center gap-2 shrink-0">
                    {currentWorkOrder?.billable && currentWorkOrder.rate > 0 && (
                      <Badge
                        className="text-xs px-2 py-0.5"
                        style={{
                          backgroundColor: '#4B5CFB20',
                          color: '#6B7CFF',
                          fontWeight: 600,
                          border: '1px solid #4B5CFB40',
                        }}
                      >
                        {currentWorkOrder.currency}{currentWorkOrder.rate}/hr
                      </Badge>
                    )}
                    {currentOtherActivity && currentOtherActivity.client && (
                      <Badge
                        className="text-xs px-2 py-0.5"
                        style={{
                          backgroundColor: '#F0BB0020',
                          color: '#FFD666',
                          fontWeight: 600,
                          border: '1px solid #F0BB0040',
                        }}
                      >
                        {currentOtherActivity.client}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </motion.button>

            {/* Primary CTA Buttons - Centered Layout */}
            <motion.div
              className="flex items-center justify-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Play/Pause Button - Always Centered */}
              <motion.button
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full text-white flex items-center justify-center zen-shadow-lg relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #00C7B7 0%, #4B5CFB 100%)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {timerState.isRunning ? (
                  <Pause className="w-5 h-5" strokeWidth={2} fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" strokeWidth={2} fill="currentColor" />
                )}
              </motion.button>

              {/* Stop Button - Same size, centered with play/pause */}
              <AnimatePresence>
                {displayTime > 0 && (
                  <motion.button
                    onClick={stopTimer}
                    className="w-16 h-16 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all zen-shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 77, 77, 0.15)',
                      borderColor: 'rgba(255, 77, 77, 0.3)',
                      color: '#FF4D4D',
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 77, 77, 0.25)',
                      borderColor: 'rgba(255, 77, 77, 0.4)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Square className="w-5 h-5" strokeWidth={2} fill="currentColor" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Recent Entries Section - Always visible */}
          <motion.div
            className="space-y-3 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                RECENT ENTRIES
              </label>
            </div>

            {filteredEntries.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">No recent entries</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredEntries.slice(0, 5).map((entry, index) => {
                  // Check if light theme
                  const isLightTheme = theme === 'light' || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);

                  // Determine background gradient and colors based on entry type
                  const getEntryStyle = () => {
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
                  const getBadgeStyle = () => {
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

                  const style = getEntryStyle();
                  const badgeStyle = getBadgeStyle();
                  const isSwiped = swipedEntryId === entry.id;

                  return (
                    <motion.div
                      key={entry.id}
                      className="relative h-[104px] overflow-hidden"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
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
                              onClick={() => handleDeleteEntry(entry.id)}
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
                                    : formatDuration(entry.duration)
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
                
                {/* View All button */}
                {filteredEntries.length > 5 && (
                  <motion.button
                    onClick={() => {
                      // Navigate to Time Entries History
                      setCurrentScreen('time-entries');
                    }}
                    className="w-full mt-3 p-3 rounded-xl glass-card border border-border/40 hover:border-primary/40 transition-all text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <p className="text-xs text-primary" style={{ fontWeight: 600 }}>
                      View All ({filteredEntries.length} entries)
                    </p>
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>

        </div>
      </motion.div>

      {/* Bottom Navigation - Fades out in Zen Mode */}
      <motion.div
        animate={{
          opacity: isZenMode ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: isZenMode ? 'none' : 'auto' }}
      >
        <BottomNav currentScreen="home" />
      </motion.div>

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
    </div>
  );
};
