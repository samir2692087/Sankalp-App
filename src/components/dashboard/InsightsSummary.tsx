"use client";

import { TrendingUp, ShieldCheck, ChevronRight, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface InsightsSummaryProps {
  score: number;
  resilience: string;
  onOpenInsights: (tab: string) => void;
  focusMode: boolean;
}

export default function InsightsSummary({ score, resilience, onOpenInsights, focusMode }: InsightsSummaryProps) {
  return (
    <div className="neu-flat p-6 rounded-[2rem] flex flex-col gap-4 w-full animate-fade-in-up [animation-delay:200ms] cursor-pointer group" onClick={() => onOpenInsights('milestones')}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <TrendingUp size={12} className="text-primary" /> Performance
          </h3>
          <span className={cn(
            "text-2xl font-headline font-bold text-primary transition-all duration-500",
            focusMode && "blur-md select-none"
          )}>
            {score} <span className="text-xs text-muted-foreground opacity-50">Score</span>
          </span>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase text-muted-foreground">Status</p>
          <span className="text-xs font-bold text-secondary flex items-center gap-1.5 justify-end">
            <Zap size={12} className="animate-pulse" /> {resilience}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Progress value={score} className="h-2 bg-muted neu-inset overflow-hidden rounded-full" />
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
            Tap for detailed report <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className={cn(focusMode && "blur-sm")}>{score}% Integrity</span>
        </div>
      </div>
    </div>
  );
}
