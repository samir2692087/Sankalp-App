"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Zap, Timer, Brain, Heart, ArrowLeft, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [seconds, setSeconds] = useState(120);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const protocols = [
    { name: 'Cold Water', icon: Zap, desc: 'Splash face with freezing water.' },
    { name: 'Breath Work', icon: Brain, desc: '4-7-8 Deep Breathing.' },
    { name: 'Physical', icon: Heart, desc: 'Do 20 fast pushups.' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[450px] max-h-[90vh] rounded-[3.5rem] border border-red-500/20 glass-card p-0 overflow-hidden outline-none flex flex-col shadow-[0_0_80px_rgba(239,68,68,0.2)]">
        <div className="bg-red-500/10 p-10 text-center border-b border-red-500/10 relative shrink-0">
          <Button variant="ghost" onClick={onClose} className="absolute left-6 top-10 p-0 h-auto hover:bg-transparent">
            <ArrowLeft size={24} />
          </Button>
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-20 h-20 bg-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/40"
          >
            <ShieldAlert size={40} className="text-white" />
          </motion.div>
          <DialogTitle className="text-3xl font-bold font-headline mb-2 text-red-500">Emergency Calm</DialogTitle>
          <DialogDescription className="font-bold text-red-500/60 uppercase tracking-[0.2em] text-[9px]">Pause and reflect</DialogDescription>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto no-scrollbar pb-24">
          <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3 text-red-500 font-black text-5xl font-headline tabular-nums">
              <Timer size={32} /> {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-sm font-medium text-red-300 italic opacity-80">"Urges are temporary signals. You are the observer."</p>
            <AnimatePresence mode="wait">
              {!isActive ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button onClick={() => setIsActive(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl h-14 px-10 shadow-lg shadow-red-600/20">
                    Take a breath
                  </Button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 font-bold uppercase text-[10px]">
                  <Shield size={14} className="animate-pulse" /> Focus active
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Quick ways to reset</h4>
            {protocols.map((p) => (
              <motion.div 
                whileHover={{ scale: 1.02, x: 5 }}
                key={p.name} 
                className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-red-500/20 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                  <p.icon size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <Button variant="ghost" onClick={onClose} className="w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-dashed border-red-500/30 text-red-500/70 hover:bg-red-500/5">
            Done: Control regained
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
