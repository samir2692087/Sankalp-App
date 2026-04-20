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
        "glass-card p-6 rounded-[2rem] flex flex-col gap-4 w-full animate-fade-in-up [animation-delay:200ms] cursor-pointer group transition-all",
        isHighRisk && riskLevel === 'CRITICAL' ? "border-red-500/40 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : ""
      )} 
      onClick={() => onOpenInsights('milestones')}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2 opacity-80">
            <TrendingUp size={12} className="text-primary" /> Neural Integrity
          </h3>
          <span className={cn(
            "text-2xl font-headline font-bold text-primary streak-glow transition-all duration-700",
            focusMode && "blur-md select-none"
          )}>
            {score} <span className="text-xs text-muted-foreground/60 font-body">Score</span>
          </span>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase text-muted-foreground opacity-80">Status</p>
          <span className="text-xs font-bold text-secondary flex items-center gap-1.5 justify-end">
            <Zap size={12} className="animate-pulse" /> {resilience}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Progress value={score} className="h-2 bg-muted/40 overflow-hidden rounded-full" />
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground/80">
          <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
            Tap for analytics <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className={cn(focusMode && "blur-sm")}>{score}% Recovery</span>
        </div>
      </div>

      {!focusMode && (
        <div className={cn(
          "mt-2 p-3 rounded-2xl flex items-center gap-3 animate-in fade-in duration-500",
          riskLevel === 'CRITICAL' ? "bg-red-500 text-white shadow-lg" :
          riskLevel === 'ELEVATED' ? "bg-amber-500/20 text-amber-300 border border-amber-500/20" :
          "bg-green-500/10 text-green-400 border border-green-500/10"
        )}>
          {isHighRisk ? <AlertTriangle size={16} /> : <ShieldCheck size={16} />}
          <p className="text-[10px] font-bold uppercase tracking-tight leading-tight">{message}</p>
        </div>
      )}
    </div>
  );
}