"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useInteraction } from '@/context/InteractionContext';

export default function ClockBar() {
  const { t } = useLanguage();
  const { isUiLocked } = useInteraction();
  const [time, setTime] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      setTime(now.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
      }));
      
      setDate(now.toLocaleDateString('en-GB').replace(/\//g, '-'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "w-full bg-black/40 backdrop-blur-xl border-b border-white/5 py-2 px-8 flex items-center justify-between z-[60] sticky top-0 transition-opacity duration-300",
      isUiLocked ? "pointer-events-none opacity-40" : "pointer-events-auto opacity-100"
    )}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
          <Calendar size={12} className="text-primary/60" />
          <span className="tabular-nums">{date || '--/--/----'}</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/30">
          <Clock size={12} className="text-primary/60" />
          <span className="tabular-nums">{time || '--:--:--'}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/20">{t('active_resolve')}</span>
        </div>
      </div>
    </div>
  );
}
