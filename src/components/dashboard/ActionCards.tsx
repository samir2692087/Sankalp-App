
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

const physicsConfig = { type: "spring", stiffness: 120, damping: 14, mass: 1 };

export default function ActionCards({ onCheckIn, onUrge, onRelapse, checkedInToday }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <motion.button 
        whileHover={{ scale: 1.05, rotateY: 8, rotateX: -8, y: -5 }}
        whileTap={{ scale: 0.9, z: -30 }}
        transition={physicsConfig}
        onClick={onCheckIn}
        disabled={checkedInToday}
        className={cn(
          "glass-card p-6 rounded-[2.2rem] flex flex-col items-center gap-3 perspective-1000",
          checkedInToday 
            ? 'opacity-20 pointer-events-none grayscale' 
            : 'hover:border-green-500/40 hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)]'
        )}
      >
        <div className="w-14 h-14 rounded-2xl bg-green-500/10 text-green-400 flex items-center justify-center">
          <CheckCircle2 size={26} />
        </div>
        <span className="text-white/80 font-black text-[9px] uppercase tracking-widest">Protocol</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.05, rotateY: 8, rotateX: -8, y: -5 }}
        whileTap={{ scale: 0.9, z: -30 }}
        transition={physicsConfig}
        onClick={onUrge}
        className="glass-card p-6 rounded-[2.2rem] flex flex-col items-center gap-3 hover:border-blue-500/40 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] perspective-1000"
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
          <ShieldCheck size={26} />
        </div>
        <span className="text-white/80 font-black text-[9px] uppercase tracking-widest">Victory</span>
      </motion.button>

      <motion.button 
        whileHover={{ scale: 1.05, rotateY: 8, rotateX: -8, y: -5 }}
        whileTap={{ scale: 0.9, z: -30 }}
        transition={physicsConfig}
        onClick={onRelapse}
        className="glass-card p-6 rounded-[2.2rem] flex flex-col items-center gap-3 hover:border-red-500/40 hover:shadow-[0_10px_30px_rgba(239,68,68,0.1)] perspective-1000"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertTriangle size={26} />
        </div>
        <span className="text-white/80 font-black text-[9px] uppercase tracking-widest">Reset</span>
      </motion.button>
    </div>
  );
}
