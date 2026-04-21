
"use client";

import { motion } from 'framer-motion';
import { JOURNEY_PHASES, getJourneyPhase } from '@/lib/journey-data';
import { cn } from '@/lib/utils';
import { Brain, Activity, Sparkles } from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import React, { useRef, useEffect } from 'react';

interface JourneyTimelineProps {
  currentStreak: number;
}

export default function JourneyTimeline({ currentStreak }: JourneyTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentPhase = getJourneyPhase(currentStreak);
  const progressPercent = Math.min((currentStreak / 365) * 100, 100);

  // Auto-scroll to current phase
  useEffect(() => {
    if (scrollRef.current) {
      const activeCard = scrollRef.current.querySelector('[data-active="true"]');
      if (activeCard) {
        activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, []);

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
          <Sparkles size={14} className="text-primary" /> Resolve Path
        </h3>
        <span className="text-[10px] font-bold text-white/20">
          Day {currentStreak} of 365
        </span>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 -translate-y-1/2" />
        
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-6 px-2 snap-x snap-mandatory"
        >
          {JOURNEY_PHASES.map((phase, idx) => {
            const isActive = currentPhase.id === phase.id;
            const isCompleted = currentStreak >= phase.range[1];

            return (
              <motion.div
                key={phase.id}
                data-active={isActive}
                whileHover={{ y: -5 }}
                className={cn(
                  "flex-shrink-0 w-72 snap-center rounded-[2.5rem] p-6 border transition-all duration-500",
                  isActive ? "bg-primary/10 border-primary/40 shadow-[0_20px_40px_rgba(124,58,237,0.15)]" : 
                  isCompleted ? "bg-green-500/5 border-green-500/20 opacity-60" :
                  "bg-white/[0.02] border-white/5 opacity-40"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                    isActive ? "bg-primary text-white" : "bg-white/5 text-white/40"
                  )}>
                    Stage {idx + 1}
                  </div>
                  <div className="text-[9px] font-bold text-white/20">
                    {phase.range[0]}-{phase.range[1]} Days
                  </div>
                </div>

                <h4 className={cn(
                  "text-xl font-bold mb-3 tracking-tight",
                  isActive ? "text-white" : "text-white/60"
                )}>
                  {phase.name}
                </h4>

                <p className="text-[10px] font-medium text-white/40 leading-relaxed mb-6 italic">
                  "{phase.message}"
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Brain size={14} className="text-primary mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-black uppercase text-white/20 tracking-tighter">Mind</span>
                      <p className="text-[10px] font-medium text-white/60">{phase.mentalState}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Activity size={14} className="text-secondary mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-black uppercase text-white/20 tracking-tighter">Body</span>
                      <p className="text-[10px] font-medium text-white/60">{phase.physicalState}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <SankalpIcon size={14} className="text-green-500 mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] font-black uppercase text-white/20 tracking-tighter">Focus</span>
                      <p className="text-[10px] font-medium text-white/60">{phase.guidance}</p>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between"
                  >
                    <span className="text-[9px] font-black uppercase text-primary tracking-widest animate-pulse">Current Stage</span>
                    <SankalpIcon size={14} className="text-primary" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="px-2">
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"
          />
        </div>
      </div>
    </div>
  );
}
