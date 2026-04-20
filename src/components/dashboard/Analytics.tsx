
"use client";

import { TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface AnalyticsProps {
  score: number;
  trigger: string;
  window: string;
  challenge: string;
}

export default function Analytics({ score, trigger, window, challenge }: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-fade-in-up [animation-delay:200ms]">
      <div className="neu-flat p-8 rounded-[2.5rem] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl flex items-center gap-2">
            <TrendingUp className="text-primary" /> Discipline Score
          </h3>
          <span className="text-4xl font-headline font-bold text-primary">{score}</span>
        </div>
        <Progress value={score} className="h-4 bg-muted neu-inset overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-1000" 
            style={{ width: `${score}%` }}
          />
        </Progress>
        <p className="text-sm text-muted-foreground italic">
          Based on streak, resisted urges, and consistency.
        </p>
      </div>

      <div className="neu-flat p-8 rounded-[2.5rem] flex flex-col gap-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <Zap className="text-secondary" /> Behavioral Analysis
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-3 rounded-2xl neu-inset">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">High Risk Window</span>
            </div>
            <span className="text-sm font-bold text-primary uppercase">{window}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-2xl neu-inset">
            <div className="flex items-center gap-3">
              <Target size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium">Common Trigger</span>
            </div>
            <span className="text-sm font-bold text-primary uppercase">{trigger}</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 neu-flat p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-secondary/5 border-none">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary text-white">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg">Daily Challenge</h4>
            <p className="text-muted-foreground">{challenge}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
