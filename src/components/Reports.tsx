import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText,
  List,
  Activity,
  Download,
  Save,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockReportsData } from '../lib/mockData';
import { BottomNav } from './BottomNav';
import { Badge } from './ui/badge';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { toast } from 'sonner@2.0.3';

type PeriodType = 'today' | 'week' | 'month';

// Animated Counter Component
const AnimatedCounter = ({ 
  value, 
  duration = 1000, 
  prefix = '', 
  suffix = '',
  decimals = 0 
}: { 
  value: number; 
  duration?: number; 
  prefix?: string; 
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const totalSteps = 30;
    const stepValue = (end - start) / totalSteps;
    const stepDuration = duration / totalSteps;

    let current = start;
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, duration]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return <span>{prefix}{formattedCount}{suffix}</span>;
};

// Format hours to HH:MM
const formatHours = (hours: number) => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

export const Reports = () => {
  const { setCurrentScreen } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('week');
  const [animatePie, setAnimatePie] = useState(false);
  const [animateBars, setAnimateBars] = useState(false);
  const [animateLine, setAnimateLine] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const data = mockReportsData;

  useEffect(() => {
    // Stagger animations
    setTimeout(() => setAnimatePie(true), 100);
    setTimeout(() => setAnimateBars(true), 200);
    setTimeout(() => setAnimateLine(true), 300);
  }, [selectedPeriod]);

  // Pie Chart Data
  const pieData = [
    { 
      name: 'Work Orders', 
      value: data.workOrdersDirect.totalHours, 
      color: '#4B5CFB',
      amount: data.workOrdersDirect.totalAmount
    },
    { 
      name: 'Process Sequence', 
      value: data.workOrdersSequence.totalHours, 
      color: '#00C7B7',
      amount: data.workOrdersSequence.totalAmount
    },
    { 
      name: 'General Activities', 
      value: data.generalActivities.totalHours, 
      color: '#F0BB00',
      amount: 0
    },
  ];

  // Bar Chart Data - Billable Value
  const barData = [
    { 
      name: 'Work Orders',
      value: data.workOrdersDirect.totalAmount / 1000,
      hours: data.workOrdersDirect.billableHours,
      rate: data.workOrdersDirect.avgRate,
      color: '#4B5CFB'
    },
    { 
      name: 'Sequence',
      value: data.workOrdersSequence.totalAmount / 1000,
      hours: data.workOrdersSequence.billableHours,
      rate: data.workOrdersSequence.avgRate,
      color: '#00C7B7'
    },
    { 
      name: 'General',
      value: 0,
      hours: 0,
      rate: 0,
      color: '#F0BB00'
    },
  ];

  // Trend Line Data (Weekly)
  const trendData = [
    { day: 'Mon', hours: 7.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 6.8 },
    { day: 'Thu', hours: 9.1 },
    { day: 'Fri', hours: 8.5 },
    { day: 'Sat', hours: 4.2 },
    { day: 'Sun', hours: 3.5 },
  ];

  // Stacked Bar Percentages
  const totalWorkHours = data.workOrdersDirect.totalHours + data.workOrdersSequence.totalHours;
  const woPercent = (data.workOrdersDirect.totalHours / totalWorkHours) * 100;
  const seqPercent = (data.workOrdersSequence.totalHours / totalWorkHours) * 100;

  const handleExportPDF = () => {
    toast.success('Report exported · Saved to Files');
  };

  const handleExportCSV = () => {
    toast.success('CSV exported · Saved to Files');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="px-4 py-3 rounded-xl backdrop-blur-xl bg-background/95 border border-border shadow-xl">
          <p className="text-xs mb-1" style={{ fontWeight: 700 }}>
            {data.name}
          </p>
          {data.hours > 0 && (
            <p className="text-xs text-muted-foreground mb-1">
              {formatHours(data.hours)} × ₹{data.rate}/hr
            </p>
          )}
          <p className="text-sm text-primary" style={{ fontWeight: 700 }}>
            ₹{(data.value * 1000).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="px-4 py-3 rounded-xl backdrop-blur-xl bg-background/95 border border-border shadow-xl">
          <p className="text-xs mb-1" style={{ fontWeight: 700, color: data.payload.color }}>
            {data.name}
          </p>
          <p className="text-sm mb-1" style={{ fontWeight: 700 }}>
            {formatHours(data.value)}
          </p>
          {data.payload.amount > 0 && (
            <p className="text-xs text-primary" style={{ fontWeight: 600 }}>
              ₹{data.payload.amount.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate total entries
  const totalEntries = data.workOrdersDirect.entries.length + 
                       data.workOrdersSequence.entries.length + 
                       data.generalActivities.entries.length;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 glass-overlay border-b border-border/50">
        <div className="px-6 py-4 safe-top">
          <div className="flex items-center justify-between">
            <h1 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Reports
            </h1>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border-2 border-border/40 hover:border-border shadow-sm hover:bg-card/80 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Export PDF"
              >
                <Download className="w-3.5 h-3.5 text-foreground/60" strokeWidth={2} />
                <span className="text-xs" style={{ fontWeight: 600 }}>PDF</span>
              </motion.button>
              <motion.button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border-2 border-border/40 hover:border-border shadow-sm hover:bg-card/80 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Save CSV"
              >
                <Save className="w-3.5 h-3.5 text-foreground/60" strokeWidth={2} />
                <span className="text-xs" style={{ fontWeight: 600 }}>CSV</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 safe-bottom">
        <div className="px-6 pt-6 space-y-4">
          
          {/* Period Selector */}
          <motion.div
            className="flex gap-1 p-1 rounded-lg bg-card border-2 border-border/40 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {(['today', 'week', 'month'] as const).map((period) => (
              <motion.button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs text-center transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground/60 hover:text-foreground hover:bg-muted/50'
                }`}
                style={{ fontWeight: 600 }}
                whileTap={{ scale: 0.98 }}
              >
                {period === 'today' ? 'Today' : period === 'week' ? 'Week' : 'Month'}
              </motion.button>
            ))}
          </motion.div>

          {/* Total Summary Card */}
          <motion.div
            className="p-4 rounded-2xl glass-card border border-primary/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            style={{
              background: 'linear-gradient(135deg, rgba(75, 92, 251, 0.18) 0%, rgba(0, 199, 183, 0.14) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 600 }}>
                TOTAL LOGGED TIME
              </p>
              <p className="text-3xl mb-0.5" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
                <AnimatedCounter value={Math.floor(data.totals.totalLoggedHours)} />h{' '}
                <AnimatedCounter value={Math.round((data.totals.totalLoggedHours % 1) * 60)} />m
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>
                {totalEntries} entries recorded
              </p>
            </div>
          </motion.div>

          {/* Pie Chart - Time Distribution */}
          <motion.div
            className="p-4 rounded-2xl glass-card border border-secondary/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 199, 183, 0.16) 0%, rgba(75, 92, 251, 0.14) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 600 }}>
              TIME SPLIT BY MODULE
            </p>
            
            <div className="relative" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1000}
                    animationEasing="ease-out"
                    onClick={(data) => setSelectedSegment(data.name)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="transparent"
                        style={{
                          filter: selectedSegment === entry.name ? 'brightness(1.2)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.25s'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<CustomPieTooltip />} 
                    cursor={{ fill: 'transparent' }}
                    wrapperStyle={{
                      outline: 'none',
                      zIndex: 1000
                    }}
                    contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                      backdropFilter: 'blur(20px)'
                    }}
                    offset={20}
                    allowEscapeViewBox={{ x: false, y: false }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Label */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-xl tabular-nums" style={{ fontWeight: 700 }}>
                    <AnimatedCounter value={data.totals.totalLoggedHours} decimals={1} />h
                  </p>
                  <p className="text-[9px] text-muted-foreground" style={{ fontWeight: 500 }}>
                    Total
                  </p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 mt-3">
              {pieData.map((entry) => (
                <motion.div
                  key={entry.name}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/30 transition-all cursor-pointer"
                  onClick={() => setSelectedSegment(entry.name)}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs" style={{ fontWeight: 500 }}>
                      {entry.name}
                    </span>
                  </div>
                  <span className="text-xs tabular-nums" style={{ fontWeight: 600 }}>
                    {formatHours(entry.value)}
                  </span>
                </motion.div>
              ))}
            </div>
            </div>
          </motion.div>

          {/* Bar Chart - Billable Value per Module */}
          <motion.div
            className="p-4 rounded-2xl glass-card border border-primary/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            style={{
              background: 'linear-gradient(135deg, rgba(75, 92, 251, 0.16) 0%, rgba(240, 187, 0, 0.13) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 600 }}>
              BILLABLE VALUE BY MODULE
            </p>
            <p className="text-[12px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>
              Calculated billable value by logged hours
            </p>
            
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={barData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value}k`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.1 }} />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-out"
                >
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`bar-${index}`}
                      fill={`url(#gradient-${index})`}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="gradient-0" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4B5CFB" stopOpacity={1} />
                    <stop offset="100%" stopColor="#00C7B7" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="gradient-1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C7B7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4B5CFB" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="gradient-2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F0BB00" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#F0BB00" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Stacked Bar - Work Order vs Sequence Hours */}
          <motion.div
            className="p-4 rounded-2xl glass-card border border-secondary/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 199, 183, 0.15) 0%, rgba(75, 92, 251, 0.15) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/5 to-primary/5 pointer-events-none" />
            <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-3" style={{ fontWeight: 600 }}>
              PROJECT EFFORT BALANCE
            </p>
            
            <div className="h-3 rounded-full bg-muted/30 overflow-hidden flex">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${woPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
              <motion.div
                className="h-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${seqPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div>
                  <p className="text-xs" style={{ fontWeight: 600 }}>
                    Work Orders
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {formatHours(data.workOrdersDirect.totalHours)} · {woPercent.toFixed(0)}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <div className="text-right">
                  <p className="text-xs" style={{ fontWeight: 600 }}>
                    Sequence
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {formatHours(data.workOrdersSequence.totalHours)} · {seqPercent.toFixed(0)}%
                  </p>
                </div>
              </div>
            </div>
            </div>
          </motion.div>

          {/* Mini List Cards */}
          <motion.div
            className="space-y-2.5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.25 }}
          >
            {/* Work Orders Card */}
            <div className="p-3 rounded-xl glass-card border border-primary/40 relative overflow-hidden" style={{
              background: 'linear-gradient(120deg, rgba(75, 92, 251, 0.18) 0%, rgba(75, 92, 251, 0.12) 100%)',
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/15 backdrop-blur-sm flex items-center justify-center border border-primary/20">
                    <FileText className="w-4 h-4 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 700 }}>
                      Work Orders
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatHours(data.workOrdersDirect.totalHours)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base text-primary tabular-nums" style={{ fontWeight: 700 }}>
                    ₹<AnimatedCounter value={data.workOrdersDirect.totalAmount / 1000} decimals={1} />k
                  </p>
                </div>
              </div>
            </div>

            {/* Sequence Card */}
            <div className="p-3 rounded-xl glass-card border border-secondary/40 relative overflow-hidden" style={{
              background: 'linear-gradient(120deg, rgba(0, 199, 183, 0.18) 0%, rgba(0, 199, 183, 0.12) 100%)',
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-secondary/15 backdrop-blur-sm flex items-center justify-center border border-secondary/20">
                    <List className="w-4 h-4 text-secondary" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 700 }}>
                      Sequence Orders
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatHours(data.workOrdersSequence.totalHours)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base text-secondary tabular-nums" style={{ fontWeight: 700 }}>
                    ₹<AnimatedCounter value={data.workOrdersSequence.totalAmount / 1000} decimals={1} />k
                  </p>
                </div>
              </div>
            </div>

            {/* General Activities Card */}
            <div className="p-3 rounded-xl glass-card border border-accent/20 relative overflow-hidden" style={{
              background: 'linear-gradient(120deg, rgba(240, 187, 0, 0.06) 0%, rgba(240, 187, 0, 0.01) 100%)',
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/8 to-transparent pointer-events-none" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/15 backdrop-blur-sm flex items-center justify-center border border-accent/20">
                    <Activity className="w-4 h-4 text-accent" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 700 }}>
                      General Activities
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatHours(data.generalActivities.totalHours)}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[12px]">
                  Non-billable
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* Trend Line - Week View */}
          <motion.div
            className="p-4 rounded-2xl glass-card border border-secondary/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.3 }}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 199, 183, 0.16) 0%, rgba(75, 92, 251, 0.13) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-secondary" strokeWidth={2} />
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                YOUR WEEKLY TIME TREND
              </p>
            </div>
            
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="px-3 py-2 rounded-lg glass-card border border-border/50">
                          <p className="text-xs" style={{ fontWeight: 600 }}>
                            {payload[0].payload.day}
                          </p>
                          <p className="text-sm text-secondary" style={{ fontWeight: 700 }}>
                            {payload[0].value}h
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ stroke: 'var(--secondary)', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#00C7B7"
                  strokeWidth={3}
                  dot={{ fill: '#00C7B7', r: 4 }}
                  activeDot={{ r: 6, fill: '#00C7B7', stroke: '#fff', strokeWidth: 2 }}
                  animationDuration={1000}
                  animationBegin={0}
                  animationEasing="ease-out"
                />
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4B5CFB" />
                    <stop offset="100%" stopColor="#00C7B7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>

      <BottomNav currentScreen="reports" />
    </div>
  );
};
