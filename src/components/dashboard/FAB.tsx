"use client";

import { useState, useEffect } from 'react';
import { Plus, ShieldCheck, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FABProps {
  onCheckIn: () => void;
  onUrge: () => void;
  onRelapse: () => void;
  disabledCheckIn: boolean;
}

export default function FAB({ onCheckIn, onUrge, onRelapse, disabledCheckIn }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    };
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setTimeout(() => {
      document.body.style.pointerEvents = 'auto';
    }, 50);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/40 backdrop-blur-md z-[60] animate-in fade-in duration-300"
          style={{ pointerEvents: 'auto', display: 'block' }}
          onClick={closeMenu}
        />
      )}
      
      <div className="fixed bottom-10 right-10 z-[70] flex flex-col items-end gap-5">
        {isOpen && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-bottom-6 fade-in duration-300">
            <div className="flex items-center gap-4">
              <span className="bg-card text-foreground px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl neu-flat">Mark Clean</span>
              <Button 
                onClick={() => { onCheckIn(); closeMenu(); }}
                disabled={disabledCheckIn}
                className={`w-14 h-14 rounded-2xl shadow-2xl bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all ${disabledCheckIn ? 'opacity-40 grayscale' : 'hover:scale-110 active:scale-95'}`}
              >
                <CheckCircle2 size={24} />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="bg-card text-foreground px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl neu-flat">Won Battle</span>
              <Button 
                onClick={() => { onUrge(); closeMenu(); }}
                className="w-14 h-14 rounded-2xl shadow-2xl bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center hover:scale-110 active:scale-95"
              >
                <ShieldCheck size={24} />
              </Button>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="bg-card text-foreground px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl neu-flat">I Failed</span>
              <Button 
                onClick={() => { onRelapse(); closeMenu(); }}
                className="w-14 h-14 rounded-2xl shadow-2xl bg-red-500 hover:bg-red-600 text-white flex items-center justify-center hover:scale-110 active:scale-95"
              >
                <AlertTriangle size={24} />
              </Button>
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-20 h-20 rounded-[2rem] shadow-2xl transition-all duration-500 ${isOpen ? 'bg-muted text-foreground rotate-90 scale-90' : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/40'}`}
        >
          {isOpen ? <X size={36} /> : <Plus size={36} />}
        </Button>
      </div>
    </>
  );
}