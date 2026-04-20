"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { UrgeIntensity } from '@/lib/types';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

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
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-blue-500';
      case 'High': return 'text-red-500';
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
      <DialogContent className="glass-card sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline text-center">Incredible Self-Control!</DialogTitle>
          <p className="text-center text-muted-foreground">Every victory counts. How strong was it?</p>
        </DialogHeader>
        <div className="py-12 flex flex-col items-center gap-8">
          <div className={`neu-inset p-8 rounded-full w-48 h-48 flex flex-col items-center justify-center gap-2 transition-colors duration-300 ${getIntensityColor()}`}>
            {getIntensityIcon()}
            <span className="text-3xl font-bold font-headline">
              {intensity}
            </span>
          </div>
          <div className="w-full space-y-4">
            <Slider 
              value={val} 
              onValueChange={setVal} 
              max={100} 
              step={1} 
              className="py-4"
            />
            <div className="flex justify-between px-1 text-[10px] uppercase font-black tracking-widest text-muted-foreground">
              <span>Low</span>
              <span>Med</span>
              <span>High</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            className="w-full h-14 rounded-xl font-bold bg-secondary hover:bg-secondary/90 transition-all text-lg shadow-lg neu-button border-none"
            onClick={() => onSubmit(intensity)}
          >
            I Won This Battle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}