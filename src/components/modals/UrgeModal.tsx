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
import { ShieldAlert, ShieldCheck, Shield, ArrowLeft, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-blue-400';
      case 'High': return 'text-red-400';
    }
  };

  const getIntensityIcon = () => {
    switch(intensity) {
      case 'Low': return <ShieldCheck size={48} />;
      case 'Medium': return <Shield size={48} />;
      case 'High': return <ShieldAlert size={48} />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[450px] rounded-[3.5rem] border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)] p-0 overflow-hidden outline-none">
        <div className="bg-primary/10 p-10 text-center border-b border-white/5 relative">
          <Button 
            type="button"
            variant="ghost" 
            onClick={onClose} 
            className="absolute -left-2 sm:left-6 top-10 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Zap size={32} className="animate-pulse" />
          </div>
          <DialogTitle className="text-2xl font-bold font-headline">Battle Won</DialogTitle>
          <DialogDescription className="text-muted-foreground/60 font-medium uppercase tracking-[0.2em] text-[9px] mt-1">Neural Rewiring Confirmation</DialogDescription>
        </div>

        <div className="p-8 space-y-12">
          <div className="flex flex-col items-center gap-6">
            <motion.div 
              key={intensity}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`neu-inset p-10 rounded-full w-48 h-48 flex flex-col items-center justify-center gap-2 transition-all duration-500 bg-white/5 border border-white/10 ${getIntensityColor()}`}
            >
              <div className="drop-shadow-[0_0_15px_currentColor]">
                {getIntensityIcon()}
              </div>
              <span className="text-3xl font-bold font-headline mt-2">
                {intensity}
              </span>
            </motion.div>
            
            <div className="w-full space-y-6">
              <div className="flex justify-between px-2 text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">
                <span>Vulnerable</span>
                <span>Moderate</span>
                <span>Critical</span>
              </div>
              <Slider 
                value={val} 
                onValueChange={setVal} 
                max={100} 
                step={1} 
                className="py-4"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button"
              className="w-full h-16 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] active:scale-95 transition-all text-base shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
              onClick={() => onSubmit(intensity)}
            >
              Log Neural Victory
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
