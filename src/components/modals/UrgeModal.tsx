
"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
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

const physicsConfig = { type: "spring", stiffness: 120, damping: 14, mass: 1 };

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
      case 'Low': return <ShieldCheck size={52} />;
      case 'Medium': return <Shield size={52} />;
      case 'High': return <ShieldAlert size={52} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] rounded-[3.5rem] border border-white/10 bg-[#07070a]/95 backdrop-blur-3xl p-0 overflow-hidden outline-none flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-black/40 p-10 text-center border-b border-white/5 relative overflow-hidden shrink-0">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="absolute left-6 top-8 p-0 h-auto hover:bg-transparent z-10 text-white/50 hover:text-white transition-all hover:scale-110 active:scale-90"
          >
            <ArrowLeft size={28} />
          </Button>
          
          <motion.div 
            initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={physicsConfig}
            className="w-18 h-18 bg-primary rounded-[1.8rem] flex items-center justify-center mx-auto mb-4 shadow-2xl relative z-10 border border-white/20"
          >
            <Zap size={36} className="text-white fill-white animate-pulse" />
          </motion.div>
          <DialogTitle className="text-2xl font-bold font-headline text-white mb-1 relative z-10">Victory</DialogTitle>
          <DialogDescription className="text-white/40 font-black uppercase tracking-[0.3em] text-[8px] relative z-10">Building strength</DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#0b0b0f] p-10 space-y-12 no-scrollbar pb-36">
          <div className="flex flex-col items-center gap-10">
            <AnimatePresence mode="wait">
                <motion.div 
                  key={intensity}
                  initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                  animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                  exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                  transition={physicsConfig}
                  className={cn(
                      "p-10 rounded-full w-48 h-48 flex flex-col items-center justify-center gap-2 transition-all duration-700 bg-white/[0.02] border-4",
                      getIntensityColor()
                  )}
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1], rotate: intensity === 'High' ? [-2, 2, -2] : 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="drop-shadow-[0_0_20px_currentColor]"
                  >
                      {getIntensityIcon()}
                  </motion.div>
                  <span className="text-2xl font-black font-headline mt-2 text-white">
                      {intensity}
                  </span>
                </motion.div>
            </AnimatePresence>
            
            <div className="w-full space-y-8 px-4">
              <div className="flex justify-between px-2 text-[9px] uppercase font-black tracking-[0.3em] text-white/40">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
              <Slider 
                value={val} 
                onValueChange={setVal} 
                max={100} 
                step={1} 
                className="py-6"
              />
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 italic">
                How strong was the urge?
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 pt-0 bg-[#0b0b0f] shrink-0 absolute bottom-0 left-0 w-full border-t border-white/5">
          <motion.button 
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 0 40px rgba(124,58,237,0.5)",
              brightness: 1.2
            }}
            whileTap={{ scale: 0.95, y: 5 }}
            transition={physicsConfig}
            type="button"
            className="w-full h-18 rounded-[2rem] font-black uppercase tracking-[0.25em] bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] hover:bg-right transition-all duration-700 text-white text-xs shadow-2xl flex items-center justify-center gap-3"
            onClick={() => onSubmit(intensity)}
          >
            <Sparkles size={18} /> Confirm victory
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
