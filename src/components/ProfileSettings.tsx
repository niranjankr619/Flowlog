import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Moon, Sun, Monitor, Bell, Zap, ChevronRight } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

type ThemeOption = 'light' | 'dark' | 'system';

export const ProfileSettings = () => {
  const { setCurrentScreen, theme, setTheme } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const themeOptions: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> },
  ];

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    toast.success(`Theme: ${newTheme}`);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      
      {/* Header */}
      <div className="sticky top-0 z-20 glass-overlay border-b border-border/30">
        <div className="px-4 py-4 safe-top">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentScreen('profile')}
              className="p-2 hover:bg-muted rounded-lg transition-all"
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </button>
            <h2 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Settings
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6 safe-bottom">
        <div className="px-4 pt-6 max-w-md mx-auto space-y-8">
          
          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs text-muted-foreground mb-3 px-1" style={{ fontWeight: 600 }}>
              APPEARANCE
            </p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`py-3 px-3 rounded-xl transition-all border-2 ${
                    theme === option.value
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card hover:bg-card/80 text-foreground border-border/40 hover:border-border shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {option.icon}
                    <span className="text-xs" style={{ fontWeight: theme === option.value ? 700 : 600 }}>
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-muted-foreground mb-3 px-1" style={{ fontWeight: 600 }}>
              PREFERENCES
            </p>
            <div className="space-y-2">
              
              <div className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>
                        Notifications
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Push alerts
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={(checked) => {
                      setNotifications(checked);
                      toast.success(checked ? 'Enabled' : 'Disabled');
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>
                        Sound Effects
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Audio feedback
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={soundEffects}
                    onCheckedChange={(checked) => {
                      setSoundEffects(checked);
                      toast.success(checked ? 'Enabled' : 'Disabled');
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <span className="text-sm">📳</span>
                    </div>
                    <div>
                      <p className="text-sm" style={{ fontWeight: 600 }}>
                        Haptic Feedback
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Vibration
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={haptics}
                    onCheckedChange={(checked) => {
                      setHaptics(checked);
                      toast.success(checked ? 'Enabled' : 'Disabled');
                    }}
                  />
                </div>
              </div>

            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-muted-foreground mb-3 px-1" style={{ fontWeight: 600 }}>
              ABOUT
            </p>
            <div className="space-y-2">
              
              <button
                onClick={() => toast.info('Privacy Policy')}
                className="w-full p-4 rounded-xl bg-card hover:bg-card/80 border-2 border-border/40 hover:border-border transition-all flex items-center justify-between shadow-sm"
              >
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Privacy Policy
                </p>
                <ChevronRight className="w-4 h-4 text-foreground/40" />
              </button>

              <button
                onClick={() => toast.info('Terms of Service')}
                className="w-full p-4 rounded-xl bg-card hover:bg-card/80 border-2 border-border/40 hover:border-border transition-all flex items-center justify-between shadow-sm"
              >
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Terms of Service
                </p>
                <ChevronRight className="w-4 h-4 text-foreground/40" />
              </button>

              <div className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm">
                <p className="text-sm text-muted-foreground" style={{ fontWeight: 500 }}>
                  Version 1.0.0
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
