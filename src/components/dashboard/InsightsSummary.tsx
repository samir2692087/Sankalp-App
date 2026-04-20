
"use client";

import { TrendingUp, ShieldCheck, ChevronRight, Zap, AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';

interface InsightsSummaryProps {
  score: number;
  resilience: string;
  riskLevel: string;
  message: string;
  onOpenInsights: (tab: string) => void;
  focusMode: boolean;
}

export default function InsightsSummary({ 
  score, 
  resilience, 
  riskLevel, 
  message, 
  onOpenInsights, 
  focusMode 
}: InsightsSummaryProps) {
  const isHighRisk = riskLevel === 'CRITICAL' || riskLevel === 'ELEVATED';

  return (
    <div 
      className={cn(
        "neu-flat p-6 rounded-[2rem] flex flex-col gap-4 w-full animate-fade-in-up [animation-delay:200ms] cursor-pointer group transition-all",
        isHighRisk && riskLevel === 'CRITICAL' ? "border-2 border-red-500/20 bg-red-500/5" : "border border-transparent"
      )} 
      onClick={() => onOpenInsights('milestones')}
    >
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

      {!focusMode && (
        <div className={cn(
          "mt-2 p-3 rounded-2xl flex items-center gap-3 animate-in fade-in duration-500",
          riskLevel === 'CRITICAL' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" :
          riskLevel === 'ELEVATED' ? "bg-amber-100 text-amber-700 border border-amber-200" :
          "bg-green-50 text-green-700 border border-green-100"
        )}>
          {isHighRisk ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
          <p className="text-[10px] font-bold uppercase tracking-tight leading-tight">{message}</p>
        </div>
      )}
    </div>
  );
}
