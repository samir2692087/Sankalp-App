
"use client";

import { Flame, Trophy, Snowflake } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  current: number;
  best: number;
  focusMode: boolean;
  freezes: number;
  onUseFreeze: () => void;
}

const springConfig = { type: "spring", stiffness: 100, damping: 20 };

export default function StreakDisplay({ current, best, focusMode, freezes, onUseFreeze }: StreakDisplayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, z: -100 }}
      animate={{ opacity: 1, scale: 1, z: 0 }}
      whileHover={{ y: -10, rotateX: 2 }}
      transition={springConfig}
      className="w-full perspective-1000"
    >
      <div className="glass-card p-10 rounded-[3rem] flex flex-col items-center justify-center group relative overflow-hidden">
        {/* Physics-driven gradient flow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="120" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
            <motion.circle 
              cx="128" cy="128" r="120" 
              fill="transparent" 
              stroke="url(#gradientStreak)" 
              strokeWidth="12" 
              strokeDasharray="754"
              initial={{ strokeDashoffset: 754 }}
              animate={{ strokeDashoffset: 754 - (Math.min(current, 30) / 30 * 754) }}
              transition={{ type: "spring", stiffness: 40, damping: 15 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradientStreak" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex flex-col items-center relative z-10">
            <motion.span 
              animate={{ opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-white/40 font-black uppercase tracking-[0.4em] text-[10px] mb-1"
            >
              Mastery
            </motion.span>
            <motion.h2 
              key={current}
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={springConfig}
              className={cn(
                "text-8xl font-black text-white tracking-tighter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]",
                focusMode && "blur-2xl"
              )}
            >
              {current}
            </motion.h2>
            <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Days</span>
          </div>
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-0 p-4"
          >
             <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                <Flame size={20} />
             </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 w-full relative z-10">
          <motion.div 
            whileHover={{ scale: 1.02, x: -2 }}
            className="flex-1 glass-card bg-white/[0.02] border-none p-4 rounded-[1.5rem] flex items-center gap-3"
          >
             <Trophy size={18} className="text-yellow-400" />
             <div className="flex flex-col">
                <span className="text-white/20 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Peak Status</span>
                <span className="text-white font-bold text-sm">{best} Days</span>
             </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUseFreeze}
            disabled={freezes === 0}
            className={cn(
              "flex-1 p-4 rounded-[1.5rem] flex items-center gap-3 transition-all",
              freezes > 0 ? "glass-card bg-blue-500/10 hover:bg-blue-500/20 text-white" : "opacity-10 pointer-events-none"
            )}
          >
             <Snowflake size={18} className={cn("text-blue-400", freezes > 0 && "animate-spin-slow")} />
             <div className="flex flex-col text-left">
                <span className="text-white/20 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Cryo Locks</span>
                <span className="text-white font-bold text-sm">{freezes} Active</span>
             </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
