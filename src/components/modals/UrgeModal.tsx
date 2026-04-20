"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { UrgeIntensity } from '@/lib/types';
import { ShieldAlert, ShieldCheck, Shield, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UrgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intensity: UrgeIntensity) => void;
}

export default function UrgeModal({ isOpen, onClose, onSubmit }: UrgeModalProps) {
  const [val, setVal] = useState([50]);

  const getIntensity = (v: number): UrgeIntensity => {
    if (v < 34) return 'Low';
    if (v < 67) return 'Medium';
    return 'High';
  };

  const intensity = getIntensity(val[0]);

  const getIntensityColor = () => {
    switch(intensity) {
      case 'Low': return 'text-green-400 border-green-400/30 shadow-green-400/20';
      case 'Medium': return 'text-blue-400 border-blue-400/30 shadow-blue-400/20';
      case 'High': return 'text-red-400 border-red-400/30 shadow-red-400/20';
    }
  };

  const getIntensityIcon = () => {
    switch(intensity) {
      case 'Low': return <ShieldCheck size={56} className="animate-pulse" />;
      case 'Medium': return <Shield size={56} />;
      case 'High': return <ShieldAlert size={56} className="animate-bounce" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[480px] rounded-[3.5rem] border border-white/10 shadow-[0_0_80px_rgba(37,99,235,0.25)] p-0 overflow-hidden outline-none">
        <div className="bg-primary/20 p-12 text-center border-b border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse" />
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-10 p-0 h-auto hover:bg-transparent z-10"
          >
            <ArrowLeft size={28} className="text-white" />
          </Button>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10"
          >
            <Zap size={40} className="text-white fill-white animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-spin-slow" size={24} />
          </motion.div>
          <DialogTitle className="text-3xl font-bold font-headline text-white mb-2 relative z-10">Neural Victory</DialogTitle>
          <DialogDescription className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] relative z-10">Conflict Logged & Overcome</DialogDescription>
        </div>

        <div className="p-10 space-y-12">
          <div className="flex flex-col items-center gap-8">
            <AnimatePresence mode="wait">
                <motion.div 
                key={intensity}
                initial={{ scale: 0.8, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -10 }}
                className={cn(
                    "p-12 rounded-full w-56 h-56 flex flex-col items-center justify-center gap-3 transition-all duration-500 bg-white/5 border-4",
                    getIntensityColor()
                )}
                >
                <div className="drop-shadow-[0_0_20px_currentColor]">
                    {getIntensityIcon()}
                </div>
                <span className="text-4xl font-bold font-headline mt-2 text-white">
                    {intensity}
                </span>
                </motion.div>
            </AnimatePresence>
            
            <div className="w-full space-y-8">
              <div className="flex justify-between px-3 text-[11px] uppercase font-black tracking-[0.2em] text-white/50">
                <span>Trifle</span>
                <span>Conflict</span>
                <span>Critical</span>
              </div>
              <Slider 
                value={val} 
                onValueChange={setVal} 
                max={100} 
                step={1} 
                className="py-6"
              />
            </div>
          </div>

          <DialogFooter>
            <motion.button 
              whileHover={{ scale: 1.05, shadow: "0 0 30px rgba(37,99,235,0.5)" }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="w-full h-18 rounded-[2rem] font-black uppercase tracking-widest bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient hover:bg-right transition-all text-white text-base shadow-2xl py-6"
              onClick={() => onSubmit(intensity)}
            >
              Confirm Neural Fortification
            </motion.button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
