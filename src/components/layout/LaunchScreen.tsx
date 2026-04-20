
"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, Cpu, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const BOOT_MESSAGES = [
  { text: "Initializing Neural Core...", phase: 0 },
  { text: "Scanning Environment Integrity...", phase: 20 },
  { text: "Stabilizing Focus Systems...", phase: 45 },
  { text: "Activating Discipline Engine...", phase: 70 },
  { text: "Neural Link Established.", phase: 90 },
  { text: "System Ready.", phase: 100 }
];

// Spring config for physics-driven feel
const springConfig = { type: "spring", stiffness: 100, damping: 20 };

export default function LaunchScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsFinishing(true), 500);
          setTimeout(onComplete, 1200);
          return 100;
        }
        const inc = prev < 30 ? 0.6 : prev < 80 ? 1.2 : 0.4;
        return prev + inc;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [onComplete]);

  const currentMessage = useMemo(() => {
    return [...BOOT_MESSAGES].reverse().find(m => progress >= m.phase)?.text || BOOT_MESSAGES[0].text;
  }, [progress]);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: isFinishing ? 0 : 1,
        scale: isFinishing ? 1.1 : 1,
      }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-[#05070a] flex flex-col items-center justify-center overflow-hidden font-body"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/5"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ 
            y: [-20, 20, -20],
            opacity: [0.1, 0.3, 0.1],
            scale: isFinishing ? 0 : 1
          }}
          transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
        />
      ))}

      <div className="relative flex flex-col items-center">
        <motion.div 
          className="relative w-72 h-72 flex items-center justify-center"
          animate={{ 
            rotate: isFinishing ? 180 : 0,
            scale: isFinishing ? 0.8 : 1
          }}
          transition={springConfig}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="144" cy="144" r="120" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="10 5" />
            <motion.circle 
              cx="144" cy="144" r="120" 
              fill="transparent" 
              stroke="url(#bootGradient)" 
              strokeWidth="4" 
              strokeDasharray="754"
              animate={{ strokeDashoffset: 754 - (progress / 100 * 754) }}
              transition={{ type: "spring", stiffness: 20, damping: 10 }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="bootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 0 30px rgba(168,85,247,0.1)",
                "0 0 60px rgba(168,85,247,0.3)",
                "0 0 30px rgba(168,85,247,0.1)"
              ]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-36 h-36 bg-white/[0.03] backdrop-blur-3xl rounded-full flex items-center justify-center relative border border-white/10"
          >
            <Shield size={56} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springConfig, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">IRONWILL</h1>
          <div className="h-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={springConfig}
                className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80"
              >
                {currentMessage}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-16">
        {[CheckCircle2, Activity, Cpu].map((Icon, idx) => (
          <motion.div 
            key={idx}
            animate={{ 
              opacity: progress > (30 + idx * 30) ? 1 : 0.2,
              scale: progress > (30 + idx * 30) ? 1.1 : 1
            }}
            transition={springConfig}
            className="flex flex-col items-center gap-2"
          >
            <Icon size={20} className={cn("transition-colors", progress > (30 + idx * 30) ? "text-primary" : "text-white/20")} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
