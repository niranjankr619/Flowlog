import { motion } from 'motion/react';
import {
  ArrowLeft,
  Trophy,
  Zap,
  TrendingUp,
  Award,
  Star,
  Target,
  Flame,
  Crown,
  Medal,
  Gift,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockUser } from '../lib/mockData';
import { BottomNav } from './BottomNav';
import { Progress } from './ui/progress';

interface GamificationDetailsProps {
  view: 'xp' | 'flowpoints';
  onBack: () => void;
}

export const GamificationDetails = ({ view, onBack }: GamificationDetailsProps) => {

  const achievements = [
    {
      id: 1,
      name: 'Early Bird',
      description: 'Log time before 9 AM for 5 consecutive days',
      icon: Crown,
      earned: true,
      earnedDate: '2024-01-15',
      xp: 100,
    },
    {
      id: 2,
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: Flame,
      earned: true,
      earnedDate: '2024-02-01',
      xp: 250,
    },
    {
      id: 3,
      name: 'Speed Demon',
      description: 'Complete 10 tasks in one day',
      icon: Zap,
      earned: true,
      earnedDate: '2024-01-20',
      xp: 150,
    },
    {
      id: 4,
      name: 'Master Organizer',
      description: 'Categorize 100 time entries',
      icon: Target,
      earned: false,
      progress: 67,
      xp: 200,
    },
    {
      id: 5,
      name: 'Century Club',
      description: 'Log 100 hours in a month',
      icon: Medal,
      earned: false,
      progress: 82,
      xp: 300,
    },
    {
      id: 6,
      name: 'Perfect Week',
      description: 'Log time every day for a week',
      icon: Star,
      earned: false,
      progress: 43,
      xp: 150,
    },
  ];

  const recentXpGains = [
    { date: '2024-01-17', activity: 'Completed task', xp: 25 },
    { date: '2024-01-17', activity: 'Daily login bonus', xp: 10 },
    { date: '2024-01-16', activity: 'Logged 8 hours', xp: 50 },
    { date: '2024-01-16', activity: 'Earned "Speed Demon" badge', xp: 150 },
    { date: '2024-01-15', activity: 'Completed work order', xp: 40 },
  ];

  const flowPointsHistory = [
    { date: '2024-01-17', activity: 'Billable hours logged', points: 120 },
    { date: '2024-01-16', activity: 'High-value task completed', points: 200 },
    { date: '2024-01-16', activity: 'Client approval received', points: 150 },
    { date: '2024-01-15', activity: 'Quality bonus', points: 100 },
    { date: '2024-01-15', activity: 'Efficiency bonus', points: 80 },
  ];

  const nextLevelXp = 2500;
  const currentXp = mockUser.xp;
  const progressToNext = (currentXp / nextLevelXp) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header with gradient */}
      <div className="sticky top-0 z-10">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="relative glass-overlay">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-foreground">
                {view === 'xp' ? 'XP & Achievements' : 'Flow Points'}
              </h2>
            </div>

            {/* Stats Card */}
            <motion.div
              className="glass-card rounded-2xl p-6 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {view === 'xp' ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Current Level</p>
                      <div className="flex items-center gap-2">
                        <Crown className="w-6 h-6 text-accent" />
                        <span className="text-3xl">Level {mockUser.level}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Total XP</p>
                      <p className="text-3xl text-primary">{currentXp.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress to Level {mockUser.level + 1}</span>
                      <span>{currentXp} / {nextLevelXp} XP</span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 gradient-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToNext}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Zap className="w-8 h-8 text-secondary" />
                      <span className="text-5xl bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                        {mockUser.flowPoints}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Total Flow Points</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                      <p className="text-2xl mb-1">820</p>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10">
                      <p className="text-2xl mb-1">3,240</p>
                      <p className="text-xs text-muted-foreground">This Month</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {view === 'xp' ? (
          <>
            {/* Achievements Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-accent" />
                <h3>Achievements</h3>
              </div>

              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    className={`glass-card rounded-xl p-4 ${
                      achievement.earned
                        ? 'border-accent/50 bg-gradient-to-br from-accent/5 to-transparent'
                        : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          achievement.earned
                            ? 'bg-gradient-to-br from-accent to-accent/80'
                            : 'bg-muted'
                        }`}
                      >
                        <achievement.icon
                          className={`w-6 h-6 ${
                            achievement.earned ? 'text-white' : 'text-muted-foreground'
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={achievement.earned ? 'text-accent' : ''}>
                            {achievement.name}
                          </h4>
                          <span className="text-sm text-primary">+{achievement.xp} XP</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>

                        {achievement.earned ? (
                          <p className="text-xs text-muted-foreground">
                            Earned on {achievement.earnedDate}
                          </p>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent XP Gains */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3>Recent Activity</h3>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                {recentXpGains.map((gain, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm mb-1">{gain.activity}</p>
                        <p className="text-xs text-muted-foreground">{gain.date}</p>
                      </div>
                      <span className="text-primary px-3 py-1 rounded-full bg-primary/10">
                        +{gain.xp} XP
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Flow Points Rewards */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-secondary" />
                <h3>Redeem Rewards</h3>
              </div>

              <div className="grid gap-3">
                {[
                  {
                    name: 'Extra PTO Day',
                    points: 5000,
                    available: false,
                    gradient: 'from-primary to-secondary',
                  },
                  {
                    name: 'Coffee Gift Card',
                    points: 2500,
                    available: true,
                    gradient: 'from-secondary to-accent',
                  },
                  {
                    name: 'Team Lunch',
                    points: 1500,
                    available: true,
                    gradient: 'from-accent to-primary',
                  },
                ].map((reward, index) => (
                  <motion.div
                    key={index}
                    className={`glass-card rounded-xl p-4 ${
                      reward.available ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-50'
                    } transition-all`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="mb-1">{reward.name}</h4>
                        <p className={`text-sm bg-gradient-to-r ${reward.gradient} bg-clip-text text-transparent`}>
                          {reward.points.toLocaleString()} points
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-br ${reward.gradient} ${
                          !reward.available ? 'grayscale' : ''
                        }`}
                      >
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Flow Points History */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-secondary" />
                <h3>Points History</h3>
              </div>

              <div className="glass-card rounded-xl overflow-hidden">
                {flowPointsHistory.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm mb-1">{item.activity}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <span className="text-secondary px-3 py-1 rounded-full bg-secondary/10">
                        +{item.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom nav */}
      <BottomNav currentScreen="profile" />
    </div>
  );
};
