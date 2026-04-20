"use client";

import { TrendingUp, ShieldCheck, ChevronRight, Zap, AlertTriangle } from 'lucide-react';
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
      whileHover={{ scale: 1.02 }}
      onClick={() => onOpenInsights('milestones')}
      className={cn(
        "glass-card p-8 rounded-[2.5rem] cursor-pointer group",
        isHighRisk && "border-red-500/30 bg-red-500/[0.02]"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" /> Behavioral Integrity
          </h3>
          <span className={cn(
            "text-4xl font-black text-white",
            focusMode && "blur-lg"
          )}>
            {score}<span className="text-xs text-white/30 font-bold ml-1">%</span>
          </span>
        </div>
        <div className="flex flex-col items-end">
           <div className={cn(
             "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
             resilience === 'Fortress' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'
           )}>
             {resilience}
           </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="h-3 w-full bg-white/[0.05] rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5 }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full accent-glow"
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
           <span>Neural Paths Stable</span>
           <span>90 Day Target</span>
        </div>
      </div>

      {!focusMode && (
        <div className={cn(
          "p-5 rounded-[1.5rem] flex items-center gap-4 border",
          riskLevel === 'CRITICAL' ? "bg-red-500/10 border-red-500/20 text-red-400" :
          "bg-white/5 border-white/5 text-white/60"
        )}>
          {isHighRisk ? <AlertTriangle size={20} className="shrink-0" /> : <ShieldCheck size={20} className="shrink-0 text-primary" />}
          <p className="text-[11px] font-bold uppercase tracking-tight leading-snug">{message}</p>
        </div>
      )}
    </motion.div>
  );
}