"use client";

import { TrendingUp, ShieldCheck, ChevronRight, Zap, AlertTriangle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "glass-card p-8 rounded-[2.5rem] flex flex-col gap-6 w-full cursor-pointer group transition-all",
        isHighRisk && riskLevel === 'CRITICAL' ? "border-red-500/60 bg-red-950/20 shadow-[0_0_50px_rgba(239,68,68,0.2)]" : ""
      )} 
      onClick={() => onOpenInsights('milestones')}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" /> Behavioral Integrity
          </h3>
          <span className={cn(
            "text-3xl font-headline font-bold text-white streak-glow transition-all duration-700",
            focusMode && "blur-md select-none"
          )}>
            {score} <span className="text-sm text-white/40 font-body font-black uppercase">Neuro-Grade</span>
          </span>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-white/50 mb-1">Stability</p>
          <span className={cn(
            "text-sm font-black uppercase tracking-widest flex items-center gap-2 justify-end",
            resilience === 'Fortress' ? 'text-green-400' : resilience === 'Steel' ? 'text-blue-400' : 'text-red-400'
          )}>
            <Zap size={14} className={cn(resilience === 'Fortress' && "animate-pulse")} /> {resilience}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary via-secondary to-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]"
            />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/60">
          <span className="flex items-center gap-2 group-hover:text-primary transition-colors">
            Analyze Patterns <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className={cn(focusMode && "blur-sm")}>{score}% Neural Recovery</span>
        </div>
      </div>

      {!focusMode && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "mt-2 p-4 rounded-[1.5rem] flex items-center gap-4 border shadow-2xl",
            riskLevel === 'CRITICAL' ? "bg-red-600/30 border-red-500/50 text-white" :
            riskLevel === 'ELEVATED' ? "bg-amber-500/20 text-amber-300 border-amber-500/30" :
            "bg-green-500/20 text-green-300 border-green-500/30"
          )}>
          {isHighRisk ? <AlertTriangle size={20} className="animate-bounce" /> : <ShieldCheck size={20} className="animate-pulse" />}
          <p className="text-[11px] font-black uppercase tracking-tight leading-snug flex-1">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}