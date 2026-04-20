"use client";

import { TrendingUp, ShieldCheck, ChevronRight } from 'lucide-react';
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
    <div className="neu-flat p-8 rounded-[2.5rem] flex flex-col gap-6 w-full animate-fade-in-up [animation-delay:200ms]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" /> Integrity Score
          </h3>
          <span className={cn(
            "text-3xl font-headline font-bold text-primary transition-all duration-500",
            focusMode && "blur-md select-none"
          )}>
            {score}
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Resilience</p>
          <span className="text-sm font-bold text-secondary flex items-center gap-1.5 justify-end">
            <ShieldCheck size={14} /> {resilience}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Progress value={score} className="h-3 bg-muted neu-inset overflow-hidden rounded-full" />
        <Button 
          variant="ghost" 
          onClick={() => onOpenInsights('milestones')}
          className="w-full justify-between font-bold text-sm h-12 rounded-2xl neu-button border-none px-6 group"
        >
          View Full Performance
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
