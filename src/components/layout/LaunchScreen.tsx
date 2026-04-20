"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LOADING_MESSAGES = [
  "Initializing Neural Core...",
  "Stabilizing Focus Systems...",
  "Activating Discipline Engine...",
  "Preparing Mind Interface...",
  "Calibrating Behavioral Shield..."
];

export default function LaunchScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsFinishing(true), 500);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 600);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFinishing ? 0 : 1 }}
      className="fixed inset-0 z-[1000] bg-[#07070a] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Central Identity */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(168,85,247,0.2)", "0 0 40px rgba(168,85,247,0.4)", "0 0 20px rgba(168,85,247,0.2)"] 
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10"
          >
            <Shield size={48} className="text-white fill-white/10" />
          </motion.div>
          {/* Outer Ring Ambient */}
          <div className="absolute inset-[-10px] rounded-[2.5rem] border border-primary/20 animate-pulse" />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tighter text-white">IRONWILL</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
            Control Your Mind. Master Your Impulses.
          </p>
        </div>
      </motion.div>

      {/* Loading Matrix */}
      <div className="mt-20 flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90">
            <circle 
              cx="32" cy="32" r="28" 
              fill="transparent" 
              stroke="rgba(255,255,255,0.05)" 
              strokeWidth="4" 
            />
            <motion.circle 
              cx="32" cy="32" r="28" 
              fill="transparent" 
              stroke="url(#bootGradient)" 
              strokeWidth="4" 
              strokeDasharray="176"
              animate={{ strokeDashoffset: 176 - (progress / 100 * 176) }}
              transition={{ ease: "linear" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="bootGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-black text-white/40">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="h-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[9px] font-bold uppercase tracking-widest text-primary/80"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer HUD */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-12 flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5"
      >
        <div className="relative">
          <CheckCircle2 size={14} className="text-green-500" />
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
        </div>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Shield Protocol Active</span>
      </motion.div>
    </motion.div>
  );
}
