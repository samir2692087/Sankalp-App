"use client";

import { CheckCircle2, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ActionCardsProps {
  onCheckIn: () => void;
  onUrge: () => void;
  onRelapse: () => void;
  checkedInToday: boolean;
}

export default function ActionCards({ onCheckIn, onUrge, onRelapse, checkedInToday }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <motion.button 
        whileHover={{ scale: 1.08, y: -8, backgroundColor: "rgba(34, 197, 94, 0.1)" }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onCheckIn}
        disabled={checkedInToday}
        className={cn(
          "glass-card group p-6 rounded-[2.5rem] flex flex-col items-center text-center gap-3 transition-all",
          checkedInToday ? 'opacity-30 grayscale pointer-events-none' : 'border-white/20 shadow-lg'
        )}
      >
        <div className="p-4 rounded-[1.5rem] bg-green-500/20 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all shadow-xl group-hover:shadow-green-500/40">
          <CheckCircle2 size={28} />
        </div>
        <span className="font-black text-[11px] uppercase tracking-tighter text-white group-hover:text-green-400">Mark Clean</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.08, y: -8, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onUrge}
        className="glass-card group p-6 rounded-[2.5rem] flex flex-col items-center text-center gap-3 border-white/20 shadow-xl hover:shadow-blue-500/20"
      >
        <div className="p-4 rounded-[1.5rem] bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-xl group-hover:shadow-blue-500/40">
          <ShieldCheck size={28} />
        </div>
        <span className="font-black text-[11px] uppercase tracking-tighter text-white group-hover:text-blue-400">Conflict Won</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.08, y: -8, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
        whileTap={{ scale: 0.92 }}
        type="button"
        onClick={onRelapse}
        className="glass-card group p-6 rounded-[2.5rem] flex flex-col items-center text-center gap-3 border-white/20 shadow-xl hover:shadow-red-500/20"
      >
        <div className="p-4 rounded-[1.5rem] bg-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-xl group-hover:shadow-red-500/40">
          <AlertTriangle size={28} />
        </div>
        <span className="font-black text-[11px] uppercase tracking-tighter text-white group-hover:text-red-400">Relapsed</span>
      </motion.button>
    </div>
  );
}