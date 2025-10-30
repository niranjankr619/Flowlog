// Utility functions for FLOWLOG

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const calculateXP = (minutes: number): number => {
  // 1 XP per minute
  return Math.floor(minutes);
};

export const getFlowScore = (
  totalHours: number,
  deepWorkHours: number,
  consistency: number
): number => {
  // Simple flow score calculation
  const hourScore = Math.min((totalHours / 40) * 40, 40);
  const deepWorkScore = Math.min((deepWorkHours / totalHours) * 30, 30);
  const consistencyScore = consistency * 30;
  
  return Math.round(hourScore + deepWorkScore + consistencyScore);
};

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};
