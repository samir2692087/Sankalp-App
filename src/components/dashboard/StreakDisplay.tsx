
"use client";

import { Flame, Trophy } from 'lucide-react';

interface StreakDisplayProps {
  current: number;
  best: number;
}

export default function StreakDisplay({ current, best }: StreakDisplayProps) {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in-up">
      <div className="neu-flat p-10 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:scale-[1.02]">
        <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Flame size={200} className="text-primary fill-primary" />
        </div>
        
        <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-4">Mastery Streak</span>
        <div className="flex items-baseline gap-3">
          <h2 className="font-headline text-9xl font-bold text-primary streak-glow">{current}</h2>
          <span className="text-2xl font-bold text-primary/40 uppercase">Days</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="neu-flat p-6 rounded-[2rem] flex items-center gap-4 group transition-transform hover:translate-y-[-2px]">
          <div className="neu-inset p-4 rounded-2xl text-secondary">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Personal Best</p>
            <p className="text-2xl font-bold font-headline">{best || 0} Days</p>
          </div>
        </div>
        <div className="neu-flat p-6 rounded-[2rem] flex items-center gap-4 group transition-transform hover:translate-y-[-2px]">
          <div className="neu-inset p-4 rounded-2xl text-primary">
            <Flame size={28} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Current Status</p>
            <p className="text-2xl font-bold font-headline">{current > 0 ? 'Burning' : 'Ignite'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
