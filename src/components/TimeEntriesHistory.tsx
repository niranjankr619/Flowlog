import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Briefcase,
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Edit2,
  IndianRupee,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { mockTimeEntries, mockWorkOrders, categories } from '../lib/mockData';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { BottomNav } from './BottomNav';

export const TimeEntriesHistory = () => {
  const { setCurrentScreen, setSelectedEntry } = useApp();
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string | null>(null);

  const filteredEntries = mockTimeEntries.filter((entry) => {
    if (filterCategory && entry.category !== filterCategory) return false;
    if (filterDate && entry.date !== filterDate) return false;
    return true;
  });

  const totalHours = filteredEntries.reduce((sum, e) => sum + e.duration, 0) / 60;
  const billableHours =
    filteredEntries.filter((e) => e.billable).reduce((sum, e) => sum + e.duration, 0) / 60;

  const getCategoryColor = (categoryName: string) => {
    return categories.find((c) => c.name === categoryName)?.color || '#4B5CFB';
  };

  const getWorkOrderTitle = (workOrderId: string | null) => {
    if (!workOrderId) return 'Personal Task';
    return mockWorkOrders.find((wo) => wo.id === workOrderId)?.title || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-overlay border-b border-border">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentScreen('home')}
                className="p-2 hover:bg-muted rounded-xl transition-all zen-shadow"
              >
                <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              </button>
              <h2 style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Time Entries</h2>
            </div>

            {/* Filter button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setFilterCategory(null)}>
                  All Categories
                </DropdownMenuItem>
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={() => setFilterCategory(cat.name)}>
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-4 text-center zen-shadow-md">
              <p className="text-3xl mb-1.5" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {filteredEntries.length}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 600, letterSpacing: '0.02em' }}>
                Entries
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center zen-shadow-md">
              <p className="text-3xl mb-1.5" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {totalHours.toFixed(1)}h
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 600, letterSpacing: '0.02em' }}>
                Total
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 text-center zen-shadow-md">
              <p className="text-3xl mb-1.5 text-success" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                {billableHours.toFixed(1)}h
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontWeight: 600, letterSpacing: '0.02em' }}>
                Billable
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Entries list */}
      <div className="px-6 py-5 space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground" style={{ fontWeight: 500 }}>No time entries found</p>
          </div>
        ) : (
          filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="glass-card rounded-2xl p-5 cursor-pointer hover:bg-muted/40 transition-all group relative zen-shadow-md hover:zen-shadow-lg"
              onClick={() => {
                setSelectedEntry(entry);
                setCurrentScreen('edit-time-entry');
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 style={{ fontWeight: 600 }}>{entry.task}</h3>
                    <Edit2 className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" strokeWidth={2} />
                    <span style={{ fontWeight: 500 }}>{getWorkOrderTitle(entry.workOrderId)}</span>
                  </div>
                </div>
                {entry.billable ? (
                  <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2.5} />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground opacity-50" strokeWidth={2} />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                    <span style={{ fontWeight: 500 }}>
                      {entry.startTime} - {entry.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                    <span style={{ fontWeight: 500 }}>{entry.date}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="px-3 py-1.5 rounded-full text-xs"
                      style={{ 
                        backgroundColor: `${getCategoryColor(entry.category)}20`,
                        color: getCategoryColor(entry.category),
                        fontWeight: 700
                      }}
                    >
                      {entry.category}
                    </span>
                    {entry.billable && (
                      <span className="px-2.5 py-1.5 rounded-full text-xs bg-green-500/10 text-green-600 flex items-center gap-1" style={{ fontWeight: 700 }}>
                        <IndianRupee className="w-3 h-3" />
                        Billable
                      </span>
                    )}
                    {entry.billable && entry.rate && entry.rate > 0 && (
                      <span className="px-2.5 py-1.5 rounded-full text-xs bg-primary/10 text-primary flex items-center gap-1" style={{ fontWeight: 700 }}>
                        ₹{entry.rate}/hr
                      </span>
                    )}
                    <span className="px-3 py-1.5 bg-muted/60 rounded-full text-xs" style={{ fontWeight: 700 }}>
                      {entry.duration} min
                    </span>
                  </div>
                  {entry.billable && entry.amount > 0 && (
                    <span className="text-sm text-primary" style={{ fontWeight: 700 }}>
                      ₹ {entry.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom nav */}
      <BottomNav currentScreen="home" />
    </div>
  );
};
