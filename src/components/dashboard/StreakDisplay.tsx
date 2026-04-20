"use client";

import { Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  current: number;
  best: number;
  focusMode: boolean;
}

export default function StreakDisplay({ current, best, focusMode }: StreakDisplayProps) {
  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in-up">
      <div className="neu-flat p-8 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:scale-[1.01]">
        <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Flame size={140} className="text-primary fill-primary" />
        </div>
        
        <span className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-2">Current Mastery</span>
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className={cn(
            "font-headline text-7xl font-bold text-primary streak-glow transition-all duration-500",
            focusMode && "blur-2xl select-none"
          )}>
            {current}
          </h2>
          <span className="text-lg font-bold text-primary/40 uppercase tracking-widest">Days</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
          <Trophy size={12} className="text-yellow-600" />
          <span className="text-[10px] font-black uppercase text-primary/60">Best: {best} Days</span>
        </div>
      </div>
    </div>
  );
}
