
"use client";

import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActionCardsProps {
  onCheckIn: () => void;
  onUrge: () => void;
  onRelapse: () => void;
  checkedInToday: boolean;
}

const springConfig = { type: "spring", stiffness: 300, damping: 15 };

export default function ActionCards({ onCheckIn, onUrge, onRelapse, checkedInToday }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <motion.button 
        whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
        whileTap={{ scale: 0.95, z: -10 }}
        transition={springConfig}
        onClick={onCheckIn}
        disabled={checkedInToday}
        className={cn(
          "glass-card p-6 rounded-[2rem] flex flex-col items-center gap-3 perspective-1000",
          checkedInToday ? 'opacity-20 pointer-events-none' : 'hover:border-green-500/30'
        )}
      >
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          <CheckCircle2 size={24} />
        </div>
        <span className="text-white font-bold text-[10px] uppercase tracking-widest">Mark Clean</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
        whileTap={{ scale: 0.95, z: -10 }}
        transition={springConfig}
        onClick={onUrge}
        className="glass-card p-6 rounded-[2rem] flex flex-col items-center gap-3 hover:border-blue-500/30 perspective-1000"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.1)]">
          <ShieldCheck size={24} />
        </div>
        <span className="text-white font-bold text-[10px] uppercase tracking-widest">Victory</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
        whileTap={{ scale: 0.95, z: -10 }}
        transition={springConfig}
        onClick={onRelapse}
        className="glass-card p-6 rounded-[2rem] flex flex-col items-center gap-3 hover:border-red-500/30 perspective-1000"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.1)]">
          <AlertTriangle size={24} />
        </div>
        <span className="text-white font-bold text-[10px] uppercase tracking-widest">Reset</span>
      </motion.button>
    </div>
  );
}
