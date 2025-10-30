import { motion } from 'motion/react';
import { Clock, TrendingUp, Target, Trophy } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  delay?: number;
}

const StatItem = ({ icon, label, value, color, delay = 0 }: StatItemProps) => (
  <motion.div
    className="glass-card rounded-xl p-4"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
  >
    <div className="flex items-start justify-between mb-2">
      <div
        className="p-2 rounded-lg"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
    </div>
    <p className="text-2xl mb-1">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </motion.div>
);

interface QuickStatsWidgetProps {
  todayHours?: number;
  weekHours?: number;
  completedTasks?: number;
  streak?: number;
}

export const QuickStatsWidget = ({
  todayHours = 7.5,
  weekHours = 37.5,
  completedTasks = 24,
  streak = 12,
}: QuickStatsWidgetProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatItem
        icon={<Clock className="w-5 h-5" style={{ color: '#4B5CFB' }} />}
        label="Today"
        value={`${todayHours}h`}
        color="#4B5CFB"
        delay={0}
      />
      <StatItem
        icon={<TrendingUp className="w-5 h-5" style={{ color: '#00C7B7' }} />}
        label="This Week"
        value={`${weekHours}h`}
        color="#00C7B7"
        delay={0.1}
      />
      <StatItem
        icon={<Trophy className="w-5 h-5" style={{ color: '#F0BB00' }} />}
        label="Completed"
        value={completedTasks}
        color="#F0BB00"
        delay={0.2}
      />
      <StatItem
        icon={<Target className="w-5 h-5" style={{ color: '#FF4D4D' }} />}
        label="Day Streak"
        value={streak}
        color="#FF4D4D"
        delay={0.3}
      />
    </div>
  );
};
