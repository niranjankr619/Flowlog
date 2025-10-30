/**
 * FLOWLOG - ERP-integrated, gamified time-logging app for The Process ecosystem
 * 
 * Features:
 * - 🎨 Beautiful glassmorphic UI with Indigo→Aqua gradients
 * - ⏱️ Neumorphic timer with real-time tracking
 * - 🎮 Gamification: XP, levels, streaks, badges
 * - 📊 Analytics & insights with charts
 * - 📅 Timeline calendar view
 * - 🏢 Work order integration
 * - 🌓 Light/dark theme support
 * - ✨ Smooth animations with Motion (Framer Motion)
 * 
 * Architecture:
 * - React + TypeScript
 * - Tailwind CSS for styling
 * - Motion for animations
 * - Recharts for data visualization
 * - Context API for state management
 * - Mock data for frontend-only demo
 */

import { useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import { AppProvider, useApp } from './lib/AppContext';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { CreateAccount } from './components/CreateAccount';
import { ForgotPassword } from './components/ForgotPassword';
import { IconShowcase } from './components/IconShowcase';
import { TimerDashboard } from './components/TimerDashboard';
import { ActivitySelector } from './components/ActivitySelector';
import { CalendarView } from './components/CalendarView';
import { ReportsInsights } from './components/ReportsInsights';
import { Reports } from './components/Reports';
import { ProfileSettings } from './components/ProfileSettings';
import { MyProfile } from './components/MyProfile';
import { TimeEntriesHistory } from './components/TimeEntriesHistory';
import { TeamApprovals } from './components/TeamApprovals';
import { BillableReview } from './components/BillableReview';
import { FlowCalendar } from './components/FlowCalendar';
import { EditTimeEntry } from './components/EditTimeEntry';
import { WorkOrderSelector } from './components/WorkOrderSelector';
import { EntryDetails } from './components/EntryDetails';
import { EditProfile } from './components/EditProfile';
import { WorkDurationReminder } from './components/WorkDurationReminder';
import { FloatingTimerBar } from './components/FloatingTimerBar';
import { AllEntriesView } from './components/AllEntriesView';


const AppContent = () => {
  const { currentScreen, showSplash, theme } = useApp();

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!showSplash && (
        <AnimatePresence mode="wait">
          {currentScreen === 'login' && <LoginScreen key="login" />}
          {currentScreen === 'create-account' && <CreateAccount key="create-account" />}
          {currentScreen === 'forgot-password' && <ForgotPassword key="forgot-password" />}
          {currentScreen === 'icon-showcase' && <IconShowcase key="icon-showcase" />}
          {currentScreen === 'home' && <TimerDashboard key="home" />}
          {currentScreen === 'dashboard' && <TimerDashboard key="dashboard" />}
          {currentScreen === 'timer' && <TimerDashboard key="timer" />}
          {currentScreen === 'activity-selector' && <ActivitySelector key="activity-selector" />}
          {currentScreen === 'work-order-selector' && <WorkOrderSelector key="work-order-selector" />}
          {currentScreen === 'calendar' && <CalendarView key="calendar" />}
          {currentScreen === 'reports' && <Reports key="reports" />}
          {currentScreen === 'reports-old' && <ReportsInsights key="reports-old" />}
          {currentScreen === 'profile' && <MyProfile key="profile" />}
          {currentScreen === 'edit-profile' && <EditProfile key="edit-profile" />}
          {currentScreen === 'profile-settings' && <ProfileSettings key="profile-settings" />}
          {currentScreen === 'time-entries' && <TimeEntriesHistory key="time-entries" />}
          {currentScreen === 'team-approvals' && <TeamApprovals key="team-approvals" />}
          {currentScreen === 'billable-review' && <BillableReview key="billable-review" />}
          {currentScreen === 'flow-calendar' && <FlowCalendar key="flow-calendar" />}

          {currentScreen === 'edit-time-entry' && <EditTimeEntry key="edit-time-entry" />}
          {currentScreen === 'entry-details' && <EntryDetails key="entry-details" />}
          {currentScreen === 'all-entries' && <AllEntriesView key="all-entries" />}
          {currentScreen === 'workDurationReminder' && <WorkDurationReminder key="workDurationReminder" />}
        </AnimatePresence>
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: 'glass-overlay',
          },
          style: {
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          },
        }}
      />

      {/* Floating Timer Bar - appears on all screens except timer dashboard */}
      <FloatingTimerBar />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
