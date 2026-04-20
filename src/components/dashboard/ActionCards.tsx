
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full animate-fade-in-up [animation-delay:100ms]">
      <button 
        onClick={onCheckIn}
        disabled={checkedInToday}
        className={`neu-button group p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 transition-all ${checkedInToday ? 'opacity-60 grayscale' : 'hover:scale-105'}`}
      >
        <div className="p-4 rounded-full bg-green-100 text-green-600 mb-2 group-hover:scale-110 transition-transform">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="font-bold text-lg">Mark Clean</h3>
        <p className="text-sm text-muted-foreground">Logged: {checkedInToday ? 'Done' : 'Pending'}</p>
      </button>

      <button 
        onClick={onUrge}
        className="neu-button group p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:scale-105 transition-all"
      >
        <div className="p-4 rounded-full bg-blue-100 text-blue-600 mb-2 group-hover:scale-110 transition-transform">
          <ShieldCheck size={32} />
        </div>
        <h3 className="font-bold text-lg">Resisted Urge</h3>
        <p className="text-sm text-muted-foreground">Stay Strong 💪</p>
      </button>

      <button 
        onClick={onRelapse}
        className="neu-button group p-6 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:scale-105 transition-all"
      >
        <div className="p-4 rounded-full bg-red-100 text-red-600 mb-2 group-hover:scale-110 transition-transform">
          <AlertTriangle size={32} />
        </div>
        <h3 className="font-bold text-lg">I Relapsed</h3>
        <p className="text-sm text-muted-foreground">Restart & Grow</p>
      </button>
    </div>
  );
}
