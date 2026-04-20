
"use client";

import { Flame, Trophy, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
      <div className="neu-flat p-8 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:scale-[1.01]">
        <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Flame size={140} className="text-primary fill-primary" />
        </div>
        
        <span className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-2">Mastery Streak</span>
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className={cn(
            "font-headline text-7xl font-bold text-primary streak-glow transition-all duration-500",
            focusMode && "blur-2xl select-none"
          )}>
            {current}
          </h2>
          <span className="text-lg font-bold text-primary/40 uppercase tracking-widest">Days</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
            <Trophy size={12} className="text-yellow-600" />
            <span className="text-[10px] font-black uppercase text-primary/60">Best: {best}</span>
          </div>

          {!focusMode && (
            <button 
              onClick={onUseFreeze}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all active:scale-95",
                freezes > 0 ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground opacity-50"
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
