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
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 w-full"
    >
      <motion.div 
        whileHover={{ scale: 1.02, rotate: 0.5 }}
        className="glass-card p-10 rounded-[4rem] flex flex-col items-center justify-center relative overflow-hidden group transition-all"
      >
        <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:opacity-15 transition-opacity duration-700">
          <Flame size={180} className="text-primary fill-primary" />
        </div>
        
        <span className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] mb-4 opacity-70">Neural Mastery Streak</span>
        <div className="flex items-baseline gap-3 mb-4">
          <h2 className={cn(
            "font-headline text-8xl font-bold text-primary streak-glow transition-all duration-1000",
            focusMode && "blur-3xl select-none"
          )}>
            {current}
          </h2>
          <span className="text-xl font-bold text-primary/40 uppercase tracking-widest">Days</span>
        </div>
        
        <div className="flex items-center gap-6">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-white/5"
          >
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-[10px] font-black uppercase text-foreground/70">Best: {best}</span>
          </motion.div>

          {!focusMode && (
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onUseFreeze}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border",
                freezes > 0 ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-muted/10 text-muted-foreground border-transparent opacity-40"
              )}
            >
              <Snowflake size={14} className={cn(freezes > 0 && "animate-pulse")} />
              <span className="text-[10px] font-black uppercase tracking-tight">{freezes} Protocol Freezes</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}