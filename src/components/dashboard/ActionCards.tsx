"use client";

import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

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
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onCheckIn}
        disabled={checkedInToday}
        className={`glass-card group p-5 rounded-[2.5rem] flex flex-col items-center text-center gap-2 transition-all ${checkedInToday ? 'opacity-40 grayscale pointer-events-none' : 'hover:bg-primary/5 border-white/5'}`}
      >
        <div className="p-3 rounded-2xl bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-all">
          <CheckCircle2 size={26} />
        </div>
        <span className="font-bold text-[10px] uppercase tracking-tighter text-foreground/80">Mark Clean</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onUrge}
        className="glass-card group p-5 rounded-[2.5rem] flex flex-col items-center text-center gap-2 hover:bg-primary/5 border-white/5"
      >
        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-all">
          <ShieldCheck size={26} />
        </div>
        <span className="font-bold text-[10px] uppercase tracking-tighter text-foreground/80">Resisted</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={onRelapse}
        className="glass-card group p-5 rounded-[2.5rem] flex flex-col items-center text-center gap-2 hover:bg-destructive/10 border-white/5"
      >
        <div className="p-3 rounded-2xl bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-all">
          <AlertTriangle size={26} />
        </div>
        <span className="font-bold text-[10px] uppercase tracking-tighter text-foreground/80">Relapsed</span>
      </motion.button>
    </div>
  );
}