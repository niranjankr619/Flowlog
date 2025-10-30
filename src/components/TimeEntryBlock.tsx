import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { TimeEntry } from '../lib/mockData';

interface TimeEntryBlockProps {
  entry: TimeEntry;
  style: React.CSSProperties;
  index: number;
  onClick: () => void;
}

export const TimeEntryBlock = ({ entry, style, index, onClick }: TimeEntryBlockProps) => {
  return (
    <motion.div
      className="absolute left-0 right-0 px-2.5 py-2 rounded-xl text-white overflow-hidden cursor-pointer"
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 0.95, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ opacity: 1, scale: 1.02, zIndex: 10 }}
      onClick={onClick}
    >
      {/* Task name */}
      <div className="text-sm truncate" style={{ fontWeight: 600 }}>
        {entry.task}
      </div>
      
      {/* Duration info */}
      <div className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
        <Clock className="w-3 h-3" />
        {entry.duration} min
      </div>
    </motion.div>
  );
};
