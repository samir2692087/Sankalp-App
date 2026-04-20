"use client";

import { TrendingUp, Clock, Zap, Target, Star } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from 'react';

interface AnalyticsProps {
  score: number;
  trigger: string;
  window: string;
  challenge: string;
}

export default function Analytics({ score, trigger, window, challenge }: AnalyticsProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-fade-in-up [animation-delay:200ms]">
      <div className="neu-flat p-10 rounded-[3rem] flex flex-col gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl flex items-center gap-3 uppercase tracking-widest text-xs">
            <TrendingUp className="text-primary" size={20} /> Integrity Score
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-5xl font-headline font-bold text-primary streak-glow">
              {displayScore}
            </span>
            <span className="text-[10px] font-black uppercase text-muted-foreground">Level {Math.floor(score/10)}</span>
          </div>
        </div>
        <div className="space-y-3">
          <Progress value={displayScore} className="h-6 bg-muted neu-inset overflow-hidden rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out" 
              style={{ width: `${displayScore}%` }}
            />
          </Progress>
          <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground px-1">
            <span>Vulnerable</span>
            <span>Iron Will</span>
          </div>
        </div>
      </div>

      <div className="neu-flat p-10 rounded-[3rem] flex flex-col gap-6">
        <h3 className="font-bold text-xl flex items-center gap-3 uppercase tracking-widest text-xs">
          <Zap className="text-secondary" size={20} /> Behavioral Pulse
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="group flex items-center justify-between p-4 rounded-2xl neu-inset transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Clock size={18} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Risk Window</span>
            </div>
            <span className="text-sm font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{window}</span>
          </div>
          <div className="group flex items-center justify-between p-4 rounded-2xl neu-inset transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                <Target size={18} />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider">Top Trigger</span>
            </div>
            <span className="text-sm font-black text-secondary bg-secondary/5 px-3 py-1 rounded-full">{trigger}</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 neu-flat p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-none group cursor-pointer">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
            <Star size={32} />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-[0.2em] text-xs text-primary mb-1">Daily Protocol</h4>
            <p className="text-xl font-bold font-headline">{challenge}</p>
          </div>
          <div className="hidden sm:block">
            <Button className="rounded-xl font-bold neu-button border-none bg-primary text-white px-6">
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
