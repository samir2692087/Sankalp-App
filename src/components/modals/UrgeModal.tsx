
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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { UrgeIntensity } from '@/lib/types';

interface UrgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (intensity: UrgeIntensity) => void;
}

export default function UrgeModal({ isOpen, onClose, onSubmit }: UrgeModalProps) {
  const [val, setVal] = useState([50]);

  const getIntensity = (v: number): UrgeIntensity => {
    if (v < 33) return 'Low';
    if (v < 66) return 'Medium';
    return 'High';
  };

  const intensity = getIntensity(val[0]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-headline text-center">Incredible Self-Control!</DialogTitle>
          <p className="text-center text-muted-foreground">Every victory counts. How strong was it?</p>
        </DialogHeader>
        <div className="py-12 flex flex-col items-center gap-8">
          <div className="neu-inset p-8 rounded-full w-48 h-48 flex items-center justify-center">
            <span className={`text-4xl font-bold transition-colors ${
              intensity === 'Low' ? 'text-green-500' : 
              intensity === 'Medium' ? 'text-blue-500' : 'text-red-500'
            }`}>
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
          </div>
        </div>
        <DialogFooter>
          <Button 
            className="w-full h-12 rounded-xl font-bold bg-secondary hover:bg-secondary/90 transition-all text-lg shadow-lg"
            onClick={() => onSubmit(intensity)}
          >
            I Won This Battle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
