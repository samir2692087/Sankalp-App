"use client";

import { Activity } from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface InsightsSummaryProps {
  score: number;
  resilience: string;
  riskLevel: string;
  message: string;
  onOpenInsights: (tab: string) => void;
  focusMode: boolean;
}

const physicsConfig = { type: "spring", stiffness: 120, damping: 14, mass: 1 };

export default function InsightsSummary({ 
  score, 
  resilience, 
  riskLevel, 
  message, 
  onOpenInsights, 
  focusMode 
}: InsightsSummaryProps) {
  const { t } = useLanguage();
  const isHighRisk = riskLevel === 'CRITICAL' || riskLevel === 'ELEVATED';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        rotateX: [0, 1, 0],
        rotateY: [0, -1, 0]
      }}
      transition={{
        ...physicsConfig,
        rotateX: { duration: 5, repeat: Infinity, ease: "linear" },
        rotateY: { duration: 7, repeat: Infinity, ease: "linear" }
      }}
      whileHover={{ scale: 1.02, y: -8, rotateX: 2 }}
      onClick={() => onOpenInsights('milestones')}
      className={cn(
        "glass-card p-8 rounded-[2.8rem] cursor-pointer group transition-colors",
        isHighRisk ? "border-red-500/40 bg-red-500/[0.03]" : "hover:border-primary/40"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <Activity size={14} className="text-primary" /> {t('resolve_insight')}
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
             "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
             resilience === 'Fortress' 
                ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                : 'bg-primary/10 text-primary border-primary/20'
           )}>
             {resilience}
           </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="h-4 w-full bg-white/[0.05] rounded-full overflow-hidden p-1 border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ ...physicsConfig, delay: 0.8 }}
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] rounded-full primary-glow"
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
           <span>{t('focus_level')}</span>
           <span>{t('risk')}: {riskLevel}</span>
        </div>
      </div>

      {!focusMode && (
        <motion.div 
          animate={isHighRisk ? { x: [-2, 2, -2] } : {}}
          transition={{ repeat: Infinity, duration: 0.15 }}
          className={cn(
            "p-5 rounded-[1.8rem] flex items-center gap-4 border",
            riskLevel === 'CRITICAL' ? "bg-red-500/10 border-red-500/30 text-red-400" :
            riskLevel === 'ELEVATED' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
            "bg-white/5 border-white/5 text-white/60"
          )}
        >
          {riskLevel === 'CRITICAL' ? <SankalpIcon size={20} className="shrink-0 animate-pulse text-red-500" /> : 
           riskLevel === 'ELEVATED' ? <SankalpIcon size={20} className="shrink-0 text-amber-500" /> : 
           <SankalpIcon size={20} className="shrink-0 text-primary" />}
          <p className="text-[11px] font-bold uppercase tracking-tight leading-snug">{message}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
