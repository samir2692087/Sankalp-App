
"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, CheckCircle2, Cpu, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const BOOT_MESSAGES = [
  { text: "Initializing Neural Core...", phase: 0 },
  { text: "Scanning Environment Integrity...", phase: 20 },
  { text: "Stabilizing Focus Systems...", phase: 45 },
  { text: "Activating Discipline Engine...", phase: 70 },
  { text: "Neural Link Established.", phase: 90 },
  { text: "System Ready.", phase: 100 }
];

export default function LaunchScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFinishing(true), 800);
          setTimeout(onComplete, 1600);
          return 100;
        }
        // Varied speed for more "realistic" system feel
        const inc = prev < 30 ? 0.8 : prev < 70 ? 1.5 : 0.6;
        return prev + inc;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  const currentMessage = useMemo(() => {
    return [...BOOT_MESSAGES].reverse().find(m => progress >= m.phase)?.text || BOOT_MESSAGES[0].text;
  }, [progress]);

  // Parallax particles
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 10 + 10
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFinishing ? 0 : 1 }}
      className="fixed inset-0 z-[1000] bg-[#05070a] flex flex-col items-center justify-center overflow-hidden font-body"
    >
      {/* 3D Atmosphere & Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.08),transparent_70%)]" />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10 pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Scanning Line Animation */}
      <motion.div 
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-10 pointer-events-none"
      />

      {/* Main Cinematic Core */}
      <div className="relative flex flex-col items-center">
        
        {/* 3D Neural Core Visual */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Outer HUD Rings */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="128" cy="128" r="110" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="1" 
              strokeDasharray="10 5"
            />
            <motion.circle 
              cx="128" cy="128" r="110" 
              fill="transparent" 
              stroke="url(#bootGradient)" 
              strokeWidth="3" 
              strokeDasharray="691"
              animate={{ strokeDashoffset: 691 - (progress / 100 * 691) }}
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
            <defs>
              <linearGradient id="bootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Secondary Spinning HUD */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-dashed border-white/5"
          />

          {/* Inner Energy Sphere (The Core) */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 40px rgba(168,85,247,0.2)",
                "0 0 70px rgba(168,85,247,0.4)",
                "0 0 40px rgba(168,85,247,0.2)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-32 h-32 bg-primary/20 backdrop-blur-3xl rounded-full flex items-center justify-center relative border border-white/10 overflow-hidden"
          >
            {/* Swirling Inner Energy */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.3),transparent)]"
            />
            <Shield size={48} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </motion.div>
        </div>

        {/* Branding Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: progress > 80 ? 1 : 0, y: progress > 80 ? 0 : 10 }}
          className="mt-8 text-center"
        >
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">IRONWILL</h1>
          <div className="h-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80"
              >
                {currentMessage}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Bottom Diagnostic HUD */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-12">
        <motion.div 
          animate={{ opacity: progress > 30 ? 1 : 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            progress > 30 ? "bg-green-500/10 text-green-500" : "bg-white/5 text-white/20"
          )}>
            <CheckCircle2 size={18} />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Shield Active</span>
        </motion.div>

        <motion.div 
          animate={{ opacity: progress > 60 ? 1 : 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            progress > 60 ? "bg-blue-500/10 text-blue-500" : "bg-white/5 text-white/20"
          )}>
            <Activity size={18} />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Neural Synced</span>
        </motion.div>

        <motion.div 
          animate={{ opacity: progress > 85 ? 1 : 0.2 }}
          className="flex flex-col items-center gap-2"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            progress > 85 ? "bg-primary/10 text-primary" : "bg-white/5 text-white/20"
          )}>
            <Cpu size={18} />
          </div>
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/20">Engine Online</span>
        </motion.div>
      </div>

      {/* Progress Numerical HUD */}
      <div className="absolute bottom-8 right-8 text-right">
        <span className="text-[9px] font-black uppercase text-white/10 tracking-[0.5em] block mb-1">Status Report</span>
        <span className="text-2xl font-black text-white/40 tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>
    </motion.div>
  );
}
