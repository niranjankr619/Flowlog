import { motion } from 'motion/react';
import { Play, Calendar, BarChart3, User } from 'lucide-react';
import { useApp } from '../lib/AppContext';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavButton = ({ icon, label, active = false, onClick }: NavButtonProps) => (
  <motion.button
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 min-w-[64px] relative ${
      active ? 'text-primary' : 'text-muted-foreground'
    }`}
    whileTap={{ scale: 0.92 }}
  >
    {active && (
      <motion.div
        layoutId="bottomNavActiveIndicator"
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gradient-to-r from-secondary to-primary"
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />
    )}
    <motion.div
      className={`${active ? 'p-2.5 rounded-2xl bg-primary/10' : 'p-2.5'}`}
      animate={active ? { scale: 1.05 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {icon}
    </motion.div>
    <span className="text-xs" style={{ fontWeight: active ? 600 : 500 }}>{label}</span>
  </motion.button>
);

export const BottomNav = ({ currentScreen }: { currentScreen: string }) => {
  const { setCurrentScreen } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-overlay border-t border-border/50 z-50 zen-shadow-lg">
      <div className="flex items-center justify-around py-3 px-6 max-w-2xl mx-auto">
        <NavButton
          icon={<Play className="w-5 h-5" strokeWidth={2.5} />}
          label="Timer"
          active={currentScreen === 'home' || currentScreen === 'dashboard'}
          onClick={() => setCurrentScreen('home')}
        />
        <NavButton
          icon={<Calendar className="w-5 h-5" strokeWidth={2.5} />}
          label="Calendar"
          active={currentScreen === 'calendar'}
          onClick={() => setCurrentScreen('calendar')}
        />
        <NavButton
          icon={<BarChart3 className="w-5 h-5" strokeWidth={2.5} />}
          label="Reports"
          active={currentScreen === 'reports'}
          onClick={() => setCurrentScreen('reports')}
        />
        <NavButton
          icon={<User className="w-5 h-5" strokeWidth={2.5} />}
          label="Profile"
          active={currentScreen === 'profile'}
          onClick={() => setCurrentScreen('profile')}
        />
      </div>
    </div>
  );
};
