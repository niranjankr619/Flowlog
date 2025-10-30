import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, Vibrate, MessageSquare, Sparkles, Check } from 'lucide-react';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../lib/AppContext';
import { BottomNav } from './BottomNav';

export const WorkDurationReminder = () => {
  const { setCurrentScreen } = useApp();
  const [continuousFocusMin, setContinuousFocusMin] = useState(90);
  const [dailyWorkHours, setDailyWorkHours] = useState(8);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [smartResetEnabled, setSmartResetEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate save with animation
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Reminders updated', {
        description: `Focus: ${continuousFocusMin} min • Daily: ${dailyWorkHours} h`
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setCurrentScreen('profile')}
              className="p-2 -ml-2 rounded-xl hover:bg-muted/50 transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
            </motion.button>
            <div>
              <h1 className="text-lg" style={{ fontWeight: 700 }}>
                Work Duration Reminder
              </h1>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                Set limits to stay balanced while working
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Continuous Focus Limit */}
        <motion.div
          className="p-5 rounded-2xl bg-muted/30 backdrop-blur-xl space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Continuous Focus Limit
                </p>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontWeight: 500, opacity: 0.8 }}>
                  Remind me after continuous work
                </p>
              </div>
              <motion.div
                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary"
                key={continuousFocusMin}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <p className="text-sm" style={{ fontWeight: 700 }}>
                  {continuousFocusMin} min
                </p>
              </motion.div>
            </div>
          </div>

          <div className="space-y-3">
            <Slider
              value={[continuousFocusMin]}
              onValueChange={(value) => setContinuousFocusMin(value[0])}
              min={30}
              max={180}
              step={15}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
              <span>30 min</span>
              <span>180 min</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.7 }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>A gentle nudge to take a break</span>
          </div>
        </motion.div>

        {/* Daily Work Limit */}
        <motion.div
          className="p-5 rounded-2xl bg-muted/30 backdrop-blur-xl space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Daily Work Limit
                </p>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontWeight: 500, opacity: 0.8 }}>
                  Notify when daily total exceeds
                </p>
              </div>
              <motion.div
                className="px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary"
                key={dailyWorkHours}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                <p className="text-sm" style={{ fontWeight: 700 }}>
                  {dailyWorkHours} h
                </p>
              </motion.div>
            </div>
          </div>

          <div className="space-y-3">
            <Slider
              value={[dailyWorkHours]}
              onValueChange={(value) => setDailyWorkHours(value[0])}
              min={4}
              max={12}
              step={0.5}
              className="w-full"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
              <span>4 h</span>
              <span>12 h</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.7 }}>
            <span className="text-base">🌙</span>
            <span>Protect your work-life balance</span>
          </div>
        </motion.div>

        {/* Reminder Style */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm text-muted-foreground px-1" style={{ fontWeight: 600 }}>
            Reminder Style
          </h2>

          {/* Sound */}
          <motion.div
            className="p-4 rounded-xl bg-muted/30 backdrop-blur-xl"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                <div>
                  <p className="text-sm" style={{ fontWeight: 600 }}>
                    Sound
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                    Play reminder tone
                  </p>
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={(checked) => {
                  setSoundEnabled(checked);
                  toast.success(checked ? 'Sound enabled' : 'Sound disabled');
                }}
              />
            </div>
          </motion.div>

          {/* Vibration */}
          <motion.div
            className="p-4 rounded-xl bg-muted/30 backdrop-blur-xl"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Vibrate className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                <div>
                  <p className="text-sm" style={{ fontWeight: 600 }}>
                    Vibration
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                    Haptic feedback
                  </p>
                </div>
              </div>
              <Switch
                checked={vibrationEnabled}
                onCheckedChange={(checked) => {
                  setVibrationEnabled(checked);
                  toast.success(checked ? 'Vibration enabled' : 'Vibration disabled');
                }}
              />
            </div>
          </motion.div>

          {/* Popup */}
          <motion.div
            className="p-4 rounded-xl bg-muted/30 backdrop-blur-xl"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                <div>
                  <p className="text-sm" style={{ fontWeight: 600 }}>
                    Popup
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                    Show notification message
                  </p>
                </div>
              </div>
              <Switch
                checked={popupEnabled}
                onCheckedChange={(checked) => {
                  setPopupEnabled(checked);
                  toast.success(checked ? 'Popup enabled' : 'Popup disabled');
                }}
              />
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-2">
              <span className="text-base">💭</span>
              <div className="flex-1">
                <p className="text-xs" style={{ fontWeight: 600 }}>
                  Example Preview
                </p>
                <p className="text-xs text-muted-foreground mt-1" style={{ fontWeight: 500, opacity: 0.9 }}>
                  "You've been in flow for {continuousFocusMin} min — time to stretch."
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Smart Reset */}
        <motion.div
          className="p-4 rounded-xl bg-muted/30 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">🔄</span>
              <div>
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Smart Reset
                </p>
                <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                  Reset timer after logged break
                </p>
              </div>
            </div>
            <Switch
              checked={smartResetEnabled}
              onCheckedChange={(checked) => {
                setSmartResetEnabled(checked);
                toast.success(checked ? 'Smart reset enabled' : 'Smart reset disabled');
              }}
            />
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          onClick={handleSave}
          className="w-full p-4 rounded-2xl bg-primary text-primary-foreground relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSaving}
        >
          {isSaving && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          )}
          <div className="relative flex items-center justify-center gap-2">
            <Check className="w-4 h-4" strokeWidth={2.5} />
            <p className="text-sm" style={{ fontWeight: 700 }}>
              {isSaving ? 'Saving...' : 'Save Settings'}
            </p>
          </div>
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="profile" />
    </div>
  );
};
