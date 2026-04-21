
"use client";

import { Flame, Trophy, Snowflake } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import React, { useRef } from 'react';
import { useInteraction } from '@/context/InteractionContext';

interface StreakDisplayProps {
  current: number;
  best: number;
  focusMode: boolean;
  freezes: number;
  onUseFreeze: () => void;
}

const physicsConfig = { type: "spring", stiffness: 120, damping: 14, mass: 1 };

export default function StreakDisplay({ current, best, focusMode, freezes, onUseFreeze }: StreakDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { intensity, mode } = useInteraction();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 14 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 14 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: mode === 'risk' ? [0, -5, 0] : 0 
      }}
      transition={{
        ...physicsConfig,
        y: { repeat: Infinity, duration: 2 }
      }}
      style={{ rotateX, rotateY }}
      className="w-full perspective-1000 cursor-pointer"
    >
      <motion.div 
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.1}
        whileHover={{ scale: 1.02, boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
        className={cn(
          "glass-card p-10 rounded-[3rem] flex flex-col items-center justify-center group relative overflow-hidden transition-colors duration-1000",
          mode === 'risk' ? "border-red-500/30 bg-red-500/[0.02]" : "border-white/10"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none opacity-50" />
        
        <motion.div 
          style={{ 
            background: useTransform(
              [mouseX, mouseY], 
              ([x, y]: any) => `radial-gradient(circle at ${50 + x * 100}% ${50 + y * 100}%, rgba(255,255,255,${0.05 + intensity * 0.1}) 0%, transparent 60%)`
            )
          }}
          className="absolute inset-0 pointer-events-none"
        />

        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="120" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
            <motion.circle 
              cx="128" cy="128" r="120" 
              fill="transparent" 
              stroke={mode === 'risk' ? "#ef4444" : "url(#streakPhysicsGradient)"} 
              strokeWidth="12" 
              strokeDasharray="754"
              initial={{ strokeDashoffset: 754 }}
              animate={{ strokeDashoffset: 754 - (Math.min(current, 30) / 30 * 754) }}
              transition={{ ...physicsConfig, delay: 0.5 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="streakPhysicsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>

          <div className="flex flex-col items-center relative z-10">
            <motion.span 
              animate={{ opacity: mode === 'risk' ? [0.2, 0.8, 0.2] : [0.4, 0.7, 0.4] }}
              transition={{ duration: mode === 'risk' ? 0.5 : 3, repeat: Infinity }}
              className={cn(
                "font-black uppercase tracking-[0.4em] text-[10px] mb-1",
                mode === 'risk' ? "text-red-500" : "text-white/40"
              )}
            >
              {mode === 'risk' ? 'Stay aware' : 'Discipline streak'}
            </motion.span>
            <motion.h2 
              key={current}
              initial={{ scale: 0.5, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={physicsConfig}
              className={cn(
                "text-8xl font-black text-white tracking-tighter drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)]",
                (focusMode || mode === 'risk') && "blur-2xl transition-all duration-1000"
              )}
            >
              {current}
            </motion.h2>
            <span className="text-white/60 font-bold uppercase tracking-widest text-sm">Days</span>
          </div>
          
          <motion.div 
            animate={{ 
              scale: mode === 'risk' ? [1, 1.3, 1] : [1, 1.15, 1], 
              rotate: mode === 'risk' ? [0, 15, -15, 0] : [0, 8, -8, 0],
              filter: mode === 'risk' ? ["brightness(1)", "brightness(2)", "brightness(1)"] : ["brightness(1)", "brightness(1.5)", "brightness(1)"]
            }}
            transition={{ duration: mode === 'risk' ? 0.4 : 4, repeat: Infinity }}
            className="absolute top-0 right-0 p-4"
          >
             <div className={cn(
               "w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors shadow-2xl",
               mode === 'risk' ? "bg-red-500/20 border-red-500/50 text-red-500" : "bg-orange-500/10 border-orange-500/30 text-orange-500"
             )}>
                <Flame size={24} />
             </div>
          </motion.div>
        </div>

        <div className="flex items-center gap-4 w-full relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={physicsConfig}
            className="flex-1 glass-card bg-white/[0.03] border-white/5 p-4 rounded-[1.8rem] flex items-center gap-3"
          >
             <Trophy size={18} className="text-yellow-400" />
             <div className="flex flex-col">
                <span className="text-white/20 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Personal Best</span>
                <span className="text-white font-bold text-sm">{best} Days</span>
             </div>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95, z: -20 }}
            transition={physicsConfig}
            onClick={onUseFreeze}
            disabled={freezes === 0}
            className={cn(
              "flex-1 p-4 rounded-[1.8rem] border flex items-center gap-3 transition-all",
              freezes > 0 
                ? "bg-blue-500/10 border-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                : "opacity-20 border-white/5 pointer-events-none"
            )}
          >
             <Snowflake size={18} className={cn("text-blue-400", freezes > 0 && "animate-spin-slow")} />
             <div className="flex flex-col text-left">
                <span className="text-white/20 text-[8px] font-black uppercase tracking-widest leading-none mb-1">Pauses left</span>
                <span className="text-white font-bold text-sm">{freezes} Available</span>
             </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
