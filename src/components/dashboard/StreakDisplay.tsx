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
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="flex flex-col gap-4 w-full"
    >
      <motion.div 
        whileHover={{ scale: 1.03, y: -5 }}
        className="glass-card p-12 rounded-[4.5rem] flex flex-col items-center justify-center relative overflow-hidden group transition-all"
      >
        <div className="absolute -top-10 -right-10 p-12 opacity-5 group-hover:opacity-20 transition-all duration-1000 group-hover:rotate-12">
          <Flame size={220} className="text-primary fill-primary animate-pulse" />
        </div>
        
        <span className="text-white font-black uppercase tracking-[0.4em] text-[11px] mb-6 opacity-90 text-shadow-strong">Neural Mastery Level</span>
        <div className="flex items-baseline gap-4 mb-6">
          <motion.h2 
            key={current}
            initial={{ scale: 0.8, filter: "blur(10px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            className={cn(
              "font-headline text-9xl font-bold text-white streak-glow transition-all duration-1000",
              focusMode && "blur-3xl select-none"
            )}>
            {current}
          </motion.h2>
          <span className="text-2xl font-black text-white/50 uppercase tracking-widest text-shadow-strong">Days</span>
        </div>
        
        <div className="flex items-center gap-8">
          <motion.div 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-2xl border border-white/10 shadow-xl"
          >
            <Trophy size={16} className="text-yellow-400 drop-shadow-glow" />
            <span className="text-[11px] font-black uppercase text-white">Record: {best}</span>
          </motion.div>

          {!focusMode && (
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onUseFreeze}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 rounded-2xl transition-all border shadow-xl",
                freezes > 0 ? "bg-blue-500/20 text-white border-blue-400/30" : "bg-muted/10 text-muted-foreground border-transparent opacity-40 pointer-events-none"
              )}
            >
              <Snowflake size={16} className={cn(freezes > 0 && "animate-spin-slow")} />
              <span className="text-[11px] font-black uppercase tracking-tight">{freezes} Protocol Freezes</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}