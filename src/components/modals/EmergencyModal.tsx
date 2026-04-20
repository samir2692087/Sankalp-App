"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Zap, Timer, Brain, Heart, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
  const [seconds, setSeconds] = useState(60);
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
      <DialogContent className="max-w-[450px] rounded-[3.5rem] border-none glass-card p-0 overflow-hidden outline-none">
        <div className="bg-red-500/10 p-10 text-center border-b border-white/5 relative">
          <Button variant="ghost" onClick={onClose} className="absolute left-6 top-10 p-0 h-auto hover:bg-transparent">
            <ArrowLeft size={24} />
          </Button>
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/40 animate-pulse">
            <ShieldAlert size={40} className="text-white" />
          </div>
          <DialogTitle className="text-3xl font-bold font-headline mb-2 text-red-600">Emergency Protocol</DialogTitle>
          <DialogDescription className="font-medium text-red-500/80 uppercase tracking-widest text-[10px]">Neural Pattern Interruption</DialogDescription>
        </div>

        <div className="p-8 space-y-8">
          <div className="neu-inset p-8 rounded-[2.5rem] flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-3 text-red-500 font-black text-4xl font-headline">
              <Timer size={32} /> {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-sm font-medium text-muted-foreground italic">"This urge will pass in less than 2 minutes. Stay with the discomfort."</p>
            {!isActive && (
              <Button onClick={() => setIsActive(true)} className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-12 px-8">
                Start Counter
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2">Rapid Actions</h4>
            {protocols.map((p) => (
              <div key={p.name} className="flex items-center gap-4 p-4 rounded-3xl neu-flat hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <p.icon size={24} />
                </div>
                <div>
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button variant="ghost" onClick={onClose} className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs border-2 border-dashed hover:bg-red-500/5">
            I've regained control
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
