
"use client";

import { Flame, Trophy, Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  current: number;
  best: number;
  focusMode: boolean;
}

export default function StreakDisplay({ current, best, focusMode }: StreakDisplayProps) {
  // Goal tiers: 7, 30, 90, 365
  const goals = [7, 30, 90, 365];
  const nextGoal = goals.find(g => g > current) || 365;
  const prevGoal = goals[goals.indexOf(nextGoal) - 1] || 0;
  const goalProgress = ((current - prevGoal) / (nextGoal - prevGoal)) * 100;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in-up">
      <div className="neu-flat p-8 sm:p-12 rounded-[3.5rem] flex flex-col items-center justify-center relative overflow-hidden group transition-all hover:scale-[1.01]">
        <div className="absolute -top-4 -right-4 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Flame size={220} className="text-primary fill-primary" />
        </div>
        
        <span className="text-muted-foreground font-bold uppercase tracking-widest text-xs mb-4">Mastery Streak</span>
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className={cn(
            "font-headline text-9xl font-bold text-primary streak-glow transition-all duration-500",
            focusMode && "blur-2xl select-none"
          )}>
            {current}
          </h2>
          <span className="text-2xl font-bold text-primary/40 uppercase">Days</span>
        </div>

        {/* Goal Progress Bar */}
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground px-1">
            <div className="flex items-center gap-1">
              <Target size={12} /> Milestone {nextGoal}
            </div>
            <span>{Math.round(goalProgress)}%</span>
          </div>
          <Progress value={goalProgress} className="h-3 bg-muted neu-inset rounded-full overflow-hidden">
             <div 
              className="h-full bg-primary transition-all duration-1000 ease-out" 
              style={{ width: `${goalProgress}%` }}
            />
          </Progress>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="neu-flat p-6 rounded-[2.5rem] flex items-center gap-4 group transition-transform hover:translate-y-[-2px]">
          <div className="neu-inset p-4 rounded-2xl text-secondary">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Personal Best</p>
            <p className={cn(
              "text-2xl font-bold font-headline transition-all duration-500",
              focusMode && "blur-md"
            )}>
              {best || 0} Days
            </p>
          </div>
        </div>
        <div className="neu-flat p-6 rounded-[2.5rem] flex items-center gap-4 group transition-transform hover:translate-y-[-2px]">
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
