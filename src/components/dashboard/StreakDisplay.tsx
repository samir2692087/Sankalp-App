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

export default function StreakDisplay({ current, best, focusMode, freezes, onUseFreeze }: StreakDisplayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="glass-card p-10 rounded-[3rem] flex flex-col items-center justify-center group">
        {/* Progress Ring Visual */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="128" cy="128" r="120" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="12" 
            />
            <motion.circle 
              cx="128" cy="128" r="120" 
              fill="transparent" 
              stroke="url(#gradientStreak)" 
              strokeWidth="12" 
              strokeDasharray="754"
              initial={{ strokeDashoffset: 754 }}
              animate={{ strokeDashoffset: 754 - (Math.min(current, 30) / 30 * 754) }}
              transition={{ duration: 2, ease: "easeOut" }}
              strokeLinecap="round"
              className="accent-glow"
            />
            <defs>
              <linearGradient id="gradientStreak" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex flex-col items-center relative z-10">
            <span className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] mb-1">Stability</span>
            <motion.h2 
              key={current}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "text-8xl font-black text-white tracking-tighter",
                focusMode && "blur-2xl"
              )}
            >
              {current}
            </motion.h2>
            <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Days</span>
          </div>
          
          <div className="absolute top-0 right-0 p-4">
             <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                <Flame size={20} className="animate-pulse" />
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 glass-card bg-white/5 border-none p-4 rounded-[1.5rem] flex items-center gap-3">
             <Trophy size={18} className="text-yellow-400" />
             <div className="flex flex-col">
                <span className="text-white/30 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Mastery Record</span>
                <span className="text-white font-bold text-sm">{best} Days</span>
             </div>
          </div>

          <button 
            onClick={onUseFreeze}
            disabled={freezes === 0}
            className={cn(
              "flex-1 p-4 rounded-[1.5rem] flex items-center gap-3 transition-all",
              freezes > 0 ? "glass-card bg-blue-500/10 hover:bg-blue-500/20 text-white" : "opacity-20 pointer-events-none"
            )}
          >
             <Snowflake size={18} className={cn("text-blue-400", freezes > 0 && "animate-spin-slow")} />
             <div className="flex flex-col text-left">
                <span className="text-white/30 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Neural Freezes</span>
                <span className="text-white font-bold text-sm">{freezes} Left</span>
             </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}