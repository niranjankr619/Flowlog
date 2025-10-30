import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Bell, LogOut, ChevronRight, Crown, Zap, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Sparkles, Briefcase, Sun, Moon, Monitor, Volume2, Clock } from 'lucide-react';
import { Switch } from './ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../lib/AppContext';
import { BottomNav } from './BottomNav';
import { mockUser } from '../lib/mockData';

export const MyProfile = () => {
  const { setCurrentScreen, theme, setTheme } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  const [workDurationReminderEnabled, setWorkDurationReminderEnabled] = useState(true);

  const handleLogout = () => {
    toast.info('Logging out...');
    setTimeout(() => {
      setCurrentScreen('splash');
      toast.success('Logged out');
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      
      {/* Header */}
      <div className="sticky top-0 z-20 glass-overlay border-b border-border/30">
        <div className="px-4 py-4 safe-top">
          <h2 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
            Profile
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 safe-bottom">
        <div className="px-4 pt-6 max-w-md mx-auto">
          
          {/* Profile Card with Rotating Frame */}
          <motion.div
            className="relative mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Card Background */}
            <div className="relative rounded-3xl p-5 overflow-hidden glass-card">
              {/* Settings Icon - Top Right */}
              <motion.button
                onClick={() => setCurrentScreen('edit-profile')}
                className="absolute top-4 right-4 p-2 rounded-lg bg-muted/30 backdrop-blur-sm hover:bg-muted/50 transition-all z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Edit Profile"
              >
                <Settings className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
              </motion.button>

              {/* Profile Section with Rotating Frame */}
              <div className="flex items-start gap-4 mb-5">
                {/* Avatar with Rotating Frame */}
                <div className="relative">
                  {/* Rotating border frame */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #4B5CFB, #00C7B7, #4B5CFB)',
                      padding: '2px',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <div className="w-full h-full rounded-2xl bg-background" />
                  </motion.div>
                  
                  {/* Avatar Image */}
                  <div className="relative w-16 h-16 rounded-2xl">
                    <Avatar className="w-full h-full rounded-2xl overflow-hidden">
                      <AvatarImage src={mockUser.avatar} />
                      <AvatarFallback style={{ fontWeight: 700 }}>
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online status indicator */}
                    <div className="absolute -bottom-1 -right-1">
                      <motion.div
                        className="w-4 h-4 rounded-full border-2 border-background shadow-lg"
                        style={{ backgroundColor: '#00C7B7' }}
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="flex-1">
                  <h3 className="mb-1" style={{ fontWeight: 700 }}>
                    {mockUser.name}
                  </h3>
                  
                  {/* Badges Row */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="px-2 py-1 rounded-md flex items-center gap-1"
                      style={{
                        backgroundColor: 'rgba(75, 92, 251, 0.15)',
                      }}
                    >
                      <Briefcase className="w-3 h-3 text-primary" strokeWidth={2} />
                      <span className="text-xs text-primary" style={{ fontWeight: 600 }}>
                        {mockUser.role}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                    Engineering Division
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div
                className="rounded-2xl p-4 mb-4 space-y-2.5"
                style={{
                  backgroundColor: 'rgba(75, 92, 251, 0.08)',
                  border: '1px solid rgba(75, 92, 251, 0.15)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10">
                    <Mail className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-foreground" style={{ fontWeight: 600 }}>
                    {mockUser.email}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-secondary/10">
                    <Phone className="w-3.5 h-3.5 text-secondary" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-foreground" style={{ fontWeight: 600 }}>
                    +91 98765 43210
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-primary/10">
                    <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                  </div>
                  <span className="text-xs text-foreground" style={{ fontWeight: 600 }}>
                    Bangalore, India
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            className="space-y-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs text-muted-foreground mb-3 px-1" style={{ fontWeight: 600 }}>
              Settings
            </p>

            {/* Theme Selector */}
            <div className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <Sun className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                <div>
                  <p className="text-sm" style={{ fontWeight: 600 }}>
                    Theme
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                    Choose your color theme
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  onClick={() => {
                    setTheme('light');
                    toast.success('Light theme enabled');
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 ${
                    theme === 'light'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                  style={{ fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sun className="w-3.5 h-3.5" strokeWidth={2} />
                  Light
                </motion.button>
                <motion.button
                  onClick={() => {
                    setTheme('dark');
                    toast.success('Dark theme enabled');
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 ${
                    theme === 'dark'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                  style={{ fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Moon className="w-3.5 h-3.5" strokeWidth={2} />
                  Dark
                </motion.button>
                <motion.button
                  onClick={() => {
                    setTheme('system');
                    toast.success('System theme enabled');
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 ${
                    theme === 'system'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                  style={{ fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Monitor className="w-3.5 h-3.5" strokeWidth={2} />
                  Auto
                </motion.button>
              </div>
            </div>

            {/* Notifications */}
            <motion.div
              className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                  <div>
                    <p className="text-sm" style={{ fontWeight: 600 }}>
                      Notifications
                    </p>
                    <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                      Stay updated with alerts
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => {
                    setNotificationsEnabled(checked);
                    toast.success(checked ? 'Notifications enabled' : 'Notifications disabled');
                  }}
                />
              </div>
            </motion.div>

            {/* Sound Effects */}
            <motion.div
              className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                  <div>
                    <p className="text-sm" style={{ fontWeight: 600 }}>
                      Sound Effects
                    </p>
                    <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                      Enable interaction sounds
                    </p>
                  </div>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={(checked) => {
                    setSoundEnabled(checked);
                    toast.success(checked ? 'Sound effects enabled' : 'Sound effects disabled');
                  }}
                />
              </div>
            </motion.div>

            {/* Time Format */}
            <div className="p-4 rounded-xl bg-card border-2 border-border/40 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                <div>
                  <p className="text-sm" style={{ fontWeight: 600 }}>
                    Time Format
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                    Choose 12-hour or 24-hour
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  onClick={() => {
                    setTimeFormat('12h');
                    toast.success('12-hour format enabled');
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 ${
                    timeFormat === '12h'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                  style={{ fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }}
                >
                  12-hour
                </motion.button>
                <motion.button
                  onClick={() => {
                    setTimeFormat('24h');
                    toast.success('24-hour format enabled');
                  }}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 ${
                    timeFormat === '24h'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                  style={{ fontWeight: 600 }}
                  whileTap={{ scale: 0.97 }}
                >
                  24-hour
                </motion.button>
              </div>
            </div>

            {/* Work Duration Reminder */}
            <motion.div
              className="w-full p-4 rounded-xl bg-card hover:bg-card/80 border-2 border-border/40 hover:border-border shadow-sm transition-all cursor-pointer"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setCurrentScreen('workDurationReminder')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1" onClick={() => setCurrentScreen('workDurationReminder')}>
                  <Clock className="w-4 h-4 text-foreground/60" strokeWidth={2} />
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm" style={{ fontWeight: 600 }}>
                        Work Duration Reminder
                      </p>
                      <ChevronRight className="w-3.5 h-3.5 text-foreground/40" strokeWidth={2} />
                    </div>
                    <p className="text-xs text-muted-foreground" style={{ fontWeight: 500, opacity: 0.8 }}>
                      Set focus & daily limits
                    </p>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={workDurationReminderEnabled}
                    onCheckedChange={(checked) => {
                      setWorkDurationReminderEnabled(checked);
                      toast.success(checked ? 'Work duration reminders enabled' : 'Work duration reminders disabled');
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={handleLogout}
              className="w-full p-4 rounded-xl bg-destructive/10 hover:bg-destructive/20 border-2 border-destructive/30 hover:border-destructive/50 shadow-sm transition-all flex items-center justify-center gap-2 text-destructive"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
              <p className="text-sm" style={{ fontWeight: 600 }}>
                Log Out
              </p>
            </motion.button>
          </motion.div>

        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="profile" />
    </div>
  );
};
