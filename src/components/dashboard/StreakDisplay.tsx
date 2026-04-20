
"use client";

import { Flame, Trophy } from 'lucide-react';

interface StreakDisplayProps {
  current: number;
  best: number;
}

export default function StreakDisplay({ current, best }: StreakDisplayProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in-up">
      <div className="neu-flat p-8 rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Flame size={120} className="text-primary fill-primary" />
        </div>
        
        <span className="text-muted-foreground font-medium uppercase tracking-widest text-sm mb-2">Current Streak</span>
        <div className="flex items-baseline gap-2">
          <h2 className="font-headline text-8xl font-bold text-primary drop-shadow-sm">{current}</h2>
          <span className="text-2xl font-semibold text-primary/60">days</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="neu-flat p-6 rounded-[2rem] flex items-center gap-4">
          <div className="neu-inset p-3 rounded-2xl text-secondary">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Best Streak</p>
            <p className="text-xl font-bold font-headline">{best} Days</p>
          </div>
        </div>
        <div className="neu-flat p-6 rounded-[2rem] flex items-center gap-4">
          <div className="neu-inset p-3 rounded-2xl text-primary">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Status</p>
            <p className="text-xl font-bold font-headline">{current > 0 ? 'Active' : 'Ready'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
