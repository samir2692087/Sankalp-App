"use client";

import { CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ActionCardsProps {
  onCheckIn: () => void;
  onUrge: () => void;
  onRelapse: () => void;
  checkedInToday: boolean;
}

export default function ActionCards({ onCheckIn, onUrge, onRelapse, checkedInToday }: ActionCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full animate-fade-in-up [animation-delay:100ms]">
      <button 
        type="button"
        onClick={onCheckIn}
        disabled={checkedInToday}
        className={`neu-button group p-4 rounded-[1.5rem] flex flex-col items-center text-center gap-1.5 transition-all ${checkedInToday ? 'opacity-60 grayscale' : 'hover:scale-105'}`}
      >
        <div className="p-2.5 rounded-xl bg-green-100 text-green-600 group-hover:scale-110 transition-transform">
          <CheckCircle2 size={24} />
        </div>
        <span className="font-bold text-[10px] uppercase tracking-tighter">Mark Clean</span>
      </button>

      <button 
        type="button"
        onClick={onUrge}
        className="neu-button group p-4 rounded-[1.5rem] flex flex-col items-center text-center gap-1.5 hover:scale-105 transition-all"
      >
        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
          <ShieldCheck size={24} />
        </div>
        <span className="font-bold text-[10px] uppercase tracking-tighter">Resisted</span>
      </button>

      <button 
        type="button"
        onClick={onRelapse}
        className="neu-button group p-4 rounded-[1.5rem] flex flex-col items-center text-center gap-1.5 hover:scale-105 transition-all"
      >
        <div className="p-2.5 rounded-xl bg-red-100 text-red-600 group-hover:scale-110 transition-transform">
          <AlertTriangle size={24} />
        </div>
        <span className="font-bold text-[10px] uppercase tracking-tighter">Relapsed</span>
      </button>
    </div>
  );
}