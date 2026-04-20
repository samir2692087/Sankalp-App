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
      case 'Low': return <ShieldCheck size={48} className="animate-pulse" />;
      case 'Medium': return <Shield size={48} />;
      case 'High': return <ShieldAlert size={48} className="animate-bounce" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] rounded-[3rem] border border-white/10 bg-[rgba(15,15,20,0.95)] backdrop-blur-xl p-0 overflow-hidden outline-none flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.5)]">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-purple-900/60 via-blue-900/40 to-black/20 p-8 text-center border-b border-white/5 relative overflow-hidden shrink-0 shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 animate-pulse pointer-events-none" />
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-8 p-0 h-auto hover:bg-transparent z-10 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft size={28} />
          </Button>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-2xl relative z-10 border border-white/20"
          >
            <Zap size={32} className="text-white fill-white animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-spin-slow" size={20} />
          </motion.div>
          <DialogTitle className="text-2xl font-bold font-headline text-white mb-1 relative z-10">Neural Victory</DialogTitle>
          <DialogDescription className="text-white/60 font-black uppercase tracking-[0.3em] text-[8px] relative z-10">Conflict Logged & Overcome</DialogDescription>
        </div>

        {/* Body Section */}
        <div className="flex-1 overflow-y-auto bg-[#0b0b0f] p-10 space-y-12 no-scrollbar pb-32">
          <div className="flex flex-col items-center gap-8">
            <AnimatePresence mode="wait">
                <motion.div 
                  key={intensity}
                  initial={{ scale: 0.8, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: -10 }}
                  className={cn(
                      "p-8 rounded-full w-44 h-44 flex flex-col items-center justify-center gap-2 transition-all duration-500 bg-white/5 border-4",
                      getIntensityColor()
                  )}
                >
                  <div className="drop-shadow-[0_0_15px_currentColor]">
                      {getIntensityIcon()}
                  </div>
                  <span className="text-2xl font-bold font-headline mt-1 text-white">
                      {intensity}
                  </span>
                </motion.div>
            </AnimatePresence>
            
            <div className="w-full space-y-8">
              <div className="flex justify-between px-3 text-[10px] uppercase font-black tracking-[0.2em] text-white/80">
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
              <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/50">
                Log intensity to calibrate recovery patterns
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <DialogFooter className="p-8 pt-0 bg-[#0b0b0f] shrink-0 absolute bottom-0 left-0 w-full border-t border-white/5">
          <motion.button 
            whileHover={{ scale: 1.02, shadow: "0 0 30px rgba(124,58,237,0.4)" }}
            whileTap={{ scale: 0.96 }}
            type="button"
            className="w-full h-16 rounded-[1.5rem] font-black uppercase tracking-widest bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white text-sm shadow-2xl flex items-center justify-center gap-2"
            onClick={() => onSubmit(intensity)}
          >
            Confirm Neural Fortification
          </motion.button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
