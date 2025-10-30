import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  IndianRupee, 
  Target, 
  Calendar, 
  Download, 
  TrendingUp,
  Coffee,
  Users,
  Code,
  FileText,
  Activity
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockTimeEntries } from '../lib/mockData';
import { BottomNav } from './BottomNav';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend 
} from 'recharts';
import { toast } from 'sonner@2.0.3';

type PeriodType = 'today' | 'week' | 'month';

export const ReportsInsights = () => {
  const { setCurrentScreen } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');

  // Calculate metrics based on period
  const metrics = useMemo(() => {
    let entries = [...mockTimeEntries];
    const today = '2025-10-27'; // Monday
    
    if (selectedPeriod === 'today') {
      entries = entries.filter((e) => e.date === today);
    } else if (selectedPeriod === 'week') {
      // This week: Oct 13-17 based on mock data
      entries = entries.filter((e) =>
        ['2025-10-13', '2025-10-14', '2025-10-15', '2025-10-16', '2025-10-17'].includes(e.date)
      );
    }
    // Month includes all entries

    const totalMinutes = entries.reduce((sum, e) => sum + e.duration, 0);
    const billableAmount = entries
      .filter((e) => e.billable)
      .reduce((sum, e) => sum + (e.amount || 0), 0);

    // Category breakdown
    const categoryBreakdown: { [key: string]: number } = {};
    entries.forEach((e) => {
      const cat = e.category || 'Other';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + e.duration;
    });

    // Daily breakdown for bar chart
    const dailyBreakdown: { [key: string]: { [category: string]: number } } = {};
    entries.forEach((e) => {
      if (!dailyBreakdown[e.date]) {
        dailyBreakdown[e.date] = {};
      }
      const cat = e.category || 'Other';
      dailyBreakdown[e.date][cat] = (dailyBreakdown[e.date][cat] || 0) + e.duration;
    });

    return {
      totalMinutes,
      totalHours: Math.floor(totalMinutes / 60),
      remainingMinutes: Math.round(totalMinutes % 60),
      billableAmount,
      categoryBreakdown,
      dailyBreakdown,
    };
  }, [selectedPeriod]);

  // Pie chart data with colors
  const pieChartData = useMemo(() => {
    const categoryColors: { [key: string]: string } = {
      'Work': '#4B5CFB',
      'Meeting': '#00C7B7',
      'Lunch': '#F0BB00',
      'Break': '#FF8A00',
      'Other': '#8B5CF6',
    };

    return Object.entries(metrics.categoryBreakdown).map(([name, minutes]) => ({
      name,
      value: minutes,
      hours: (minutes / 60).toFixed(1),
      color: categoryColors[name] || '#8B5CF6',
      percentage: ((minutes / metrics.totalMinutes) * 100).toFixed(1),
    }));
  }, [metrics]);

  // Bar chart data - daily breakdown
  const barChartData = useMemo(() => {
    const days = selectedPeriod === 'today' 
      ? ['2025-10-27']
      : selectedPeriod === 'week'
      ? ['2025-10-13', '2025-10-14', '2025-10-15', '2025-10-16', '2025-10-17']
      : Object.keys(metrics.dailyBreakdown);

    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((date) => {
      const dayData = metrics.dailyBreakdown[date] || {};
      const dateObj = new Date(date);
      const dayName = dayNames[dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1];
      
      return {
        day: dayName,
        Work: (dayData.Work || 0) / 60,
        Meeting: (dayData.Meeting || 0) / 60,
        Lunch: (dayData.Lunch || 0) / 60,
        Other: ((dayData.Break || 0) + (dayData.Other || 0)) / 60,
      };
    });
  }, [metrics, selectedPeriod]);

  // Category icons
  const categoryIcons: { [key: string]: any } = {
    'Work': Code,
    'Meeting': Users,
    'Lunch': Coffee,
    'Break': Activity,
    'Other': FileText,
  };

  const handleExport = () => {
    toast.success('Report exported successfully!');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      
      {/* Header */}
      <div className="sticky top-0 z-20 glass-overlay border-b border-border/30">
        <div className="px-4 py-4 safe-top">
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Analytics
            </h2>
          </div>

          {/* Period Selector Pills */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-muted/40">
            <button
              onClick={() => setSelectedPeriod('today')}
              className="flex-1 px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                fontWeight: 600,
                backgroundColor: selectedPeriod === 'today' ? 'var(--background)' : 'transparent',
                color: selectedPeriod === 'today' ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedPeriod('week')}
              className="flex-1 px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                fontWeight: 600,
                backgroundColor: selectedPeriod === 'week' ? 'var(--background)' : 'transparent',
                color: selectedPeriod === 'week' ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              This Week
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className="flex-1 px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                fontWeight: 600,
                backgroundColor: selectedPeriod === 'month' ? 'var(--background)' : 'transparent',
                color: selectedPeriod === 'month' ? 'var(--foreground)' : 'var(--muted-foreground)',
              }}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 safe-bottom">
        <div className="px-4 pt-6 space-y-4">
          
          {/* Hero Total Card */}
          <motion.div
            className="relative overflow-hidden rounded-2xl p-6"
            style={{
              background: 'rgba(15, 25, 35, 0.6)',
              border: '1px solid rgba(240, 187, 0, 0.2)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated pulsing gradient background */}
            <motion.div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(240, 187, 0, 0.6), transparent)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(240, 187, 0, 0.2)' }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Clock className="w-6 h-6" style={{ color: '#F0BB00' }} strokeWidth={2.5} />
                </motion.div>
                <div>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    TOTAL TIME LOGGED
                  </p>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                    {selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : 'This Month'}
                  </p>
                </div>
              </div>

              {/* Large time display */}
              <div className="flex items-baseline gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <span 
                    className="text-6xl"
                    style={{ 
                      fontWeight: 800, 
                      color: '#F0BB00',
                      lineHeight: 1,
                    }}
                  >
                    {metrics.totalHours}
                  </span>
                  <span 
                    className="text-2xl ml-1"
                    style={{ 
                      fontWeight: 700, 
                      color: '#F0BB00',
                      opacity: 0.7,
                    }}
                  >
                    h
                  </span>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <span 
                    className="text-4xl"
                    style={{ 
                      fontWeight: 800, 
                      color: '#F0BB00',
                      opacity: 0.8,
                      lineHeight: 1,
                    }}
                  >
                    {metrics.remainingMinutes}
                  </span>
                  <span 
                    className="text-xl ml-1"
                    style={{ 
                      fontWeight: 700, 
                      color: '#F0BB00',
                      opacity: 0.6,
                    }}
                  >
                    m
                  </span>
                </motion.div>
              </div>

              {/* Billable amount */}
              <div 
                className="mt-4 pt-4 border-t flex items-center justify-between"
                style={{ borderColor: 'rgba(240, 187, 0, 0.2)' }}
              >
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" style={{ color: '#F0BB00' }} strokeWidth={2} />
                  <span className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    Billable Amount
                  </span>
                </div>
                <span className="text-xl" style={{ fontWeight: 700, color: '#F0BB00' }}>
                  ₹{metrics.billableAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Pie Chart Card */}
          <motion.div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(15, 25, 35, 0.6)',
              border: '1px solid rgba(75, 92, 251, 0.15)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Time Distribution
                </p>
                <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                  By category
                </p>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div 
                            className="rounded-lg p-3"
                            style={{
                              background: 'rgba(15, 25, 35, 0.95)',
                              border: `1px solid ${data.color}`,
                            }}
                          >
                            <p className="text-xs" style={{ fontWeight: 600 }}>
                              {data.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {data.hours} hours ({data.percentage}%)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2">
              {pieChartData.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{
                    backgroundColor: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate" style={{ fontWeight: 600 }}>
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                      {item.hours}h
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart Card */}
          <motion.div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(15, 25, 35, 0.6)',
              border: '1px solid rgba(0, 199, 183, 0.15)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm" style={{ fontWeight: 600 }}>
                  Daily Breakdown
                </p>
                <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                  Hours by category
                </p>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="0" 
                    stroke="rgba(255, 255, 255, 0.05)" 
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11, fontWeight: 600 }}
                    label={{ value: 'hours', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10, fontWeight: 600 } }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div 
                            className="rounded-lg p-3"
                            style={{
                              background: 'rgba(15, 25, 35, 0.95)',
                              border: '1px solid rgba(0, 199, 183, 0.3)',
                            }}
                          >
                            <p className="text-xs mb-2" style={{ fontWeight: 600 }}>
                              {label}
                            </p>
                            {payload.map((entry: any, index: number) => (
                              entry.value > 0 && (
                                <p key={index} className="text-xs text-muted-foreground">
                                  {entry.name}: {entry.value.toFixed(1)}h
                                </p>
                              )
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="Work" fill="#4B5CFB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Meeting" fill="#00C7B7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Summary Grid - Category Cards */}
          <div className="grid grid-cols-2 gap-3">
            {pieChartData.map((category, index) => {
              const Icon = categoryIcons[category.name] || FileText;
              return (
                <motion.div
                  key={index}
                  className="rounded-2xl p-4"
                  style={{
                    background: 'rgba(15, 25, 35, 0.4)',
                    border: `1px solid ${category.color}30`,
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: category.color }} strokeWidth={2} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 500 }}>
                    {category.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span 
                      className="text-2xl"
                      style={{ 
                        fontWeight: 700, 
                        color: category.color,
                      }}
                    >
                      {category.hours}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ 
                        fontWeight: 600, 
                        color: category.color,
                        opacity: 0.7,
                      }}
                    >
                      hours
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1" style={{ fontWeight: 500 }}>
                    {category.percentage}% of total
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Export Button */}
          <motion.button
            onClick={handleExport}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, rgba(75, 92, 251, 0.15), rgba(0, 199, 183, 0.15))',
              border: '1px solid rgba(75, 92, 251, 0.3)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Download className="w-5 h-5 text-primary" strokeWidth={2} />
            <span className="text-sm text-primary" style={{ fontWeight: 600 }}>
              Export Report
            </span>
          </motion.button>

        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentScreen="reports" />
    </div>
  );
};
