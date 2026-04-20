"use client";

import { Flame, Trophy, Snowflake } from 'lucide-react';
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
    <div className="flex flex-col gap-4 w-full animate-fade-in-up">
      <div className="glass-card p-8 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:scale-[1.01]">
        <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Flame size={140} className="text-primary fill-primary" />
        </div>
        
        <span className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-2 opacity-80">Mastery Streak</span>
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className={cn(
            "font-headline text-7xl font-bold text-primary streak-glow transition-all duration-700",
            focusMode && "blur-2xl select-none"
          )}>
            {current}
          </h2>
          <span className="text-lg font-bold text-primary/60 uppercase tracking-widest">Days</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
            <Trophy size={12} className="text-yellow-500" />
            <span className="text-[10px] font-black uppercase text-foreground/80">Best: {best}</span>
          </div>

          {!focusMode && (
            <button 
              type="button"
              onClick={onUseFreeze}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95",
                freezes > 0 ? "bg-blue-500/20 text-blue-400 border border-blue-500/20" : "bg-muted text-muted-foreground opacity-50"
              )}
            >
              <Snowflake size={12} className={cn(freezes > 0 && "animate-pulse")} />
              <span className="text-[10px] font-black uppercase">{freezes} Freezes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}