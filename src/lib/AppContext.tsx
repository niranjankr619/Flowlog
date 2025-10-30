import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockRecentOthersActivities } from './mockData';

interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedSeconds: number;
  taskName: string;
  workOrderId: string | null;
  activityType: 'work-order' | 'quick-activity' | null;
  activityId: string | null; // For quick activities like lunch, meeting, etc.
  activityReason: string; // For 'other' activity type
  category: string;
  billable: boolean;
  rate: number;
}

interface AppContextType {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  timerState: TimerState;
  setTimerState: React.Dispatch<React.SetStateAction<TimerState>>;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  selectedEntry: any | null;
  setSelectedEntry: (entry: any | null) => void;
  workOrderInitialTab: 'all' | 'direct' | 'sequence' | 'others';
  setWorkOrderInitialTab: (tab: 'all' | 'direct' | 'sequence' | 'others') => void;
  selectedOthersActivity: any | null;
  setSelectedOthersActivity: (activity: any | null) => void;
  isZenMode: boolean;
  setIsZenMode: (isZen: boolean) => void;
  recentEntries: any[];
  setRecentEntries: React.Dispatch<React.SetStateAction<any[]>>;
  isEditingEntry: boolean;
  setIsEditingEntry: (isEditing: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);
  const [workOrderInitialTab, setWorkOrderInitialTab] = useState<'all' | 'direct' | 'sequence' | 'others'>('direct');
  const [selectedOthersActivity, setSelectedOthersActivity] = useState<any | null>(null);
  const [isZenMode, setIsZenMode] = useState(false);
  const [recentEntries, setRecentEntries] = useState<any[]>(mockRecentOthersActivities);
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>({
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

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        timerState,
        setTimerState,
        theme,
        setTheme,
        showSplash,
        setShowSplash,
        selectedEntry,
        setSelectedEntry,
        workOrderInitialTab,
        setWorkOrderInitialTab,
        selectedOthersActivity,
        setSelectedOthersActivity,
        isZenMode,
        setIsZenMode,
        recentEntries,
        setRecentEntries,
        isEditingEntry,
        setIsEditingEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
