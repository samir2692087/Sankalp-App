
"use client";

import { useState } from 'react';
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

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <Button 
            onClick={() => { onCheckIn(); setIsOpen(false); }}
            disabled={disabledCheckIn}
            className="rounded-full shadow-lg bg-green-500 hover:bg-green-600 flex items-center gap-2 h-12 px-4 text-white"
          >
            <CheckCircle2 size={20} /> <span className="font-bold">Check-In</span>
          </Button>
          <Button 
            onClick={() => { onUrge(); setIsOpen(false); }}
            className="rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 flex items-center gap-2 h-12 px-4 text-white"
          >
            <ShieldCheck size={20} /> <span className="font-bold">Urge</span>
          </Button>
          <Button 
            onClick={() => { onRelapse(); setIsOpen(false); }}
            className="rounded-full shadow-lg bg-red-500 hover:bg-red-600 flex items-center gap-2 h-12 px-4 text-white"
          >
            <AlertTriangle size={20} /> <span className="font-bold">Relapse</span>
          </Button>
        </div>
      )}
      
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-muted text-foreground rotate-90' : 'bg-primary text-white'}`}
      >
        {isOpen ? <X size={32} /> : <Plus size={32} />}
      </Button>
    </div>
  );
}
