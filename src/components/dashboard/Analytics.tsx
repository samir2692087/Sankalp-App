
"use client";

import { TrendingUp, Clock, Zap, Target, Star, Trophy, BarChart3, ShieldCheck } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { UserData } from '@/lib/types';
import { getWeeklyData, getAchievements, getBehavioralInsights } from '@/lib/discipline-engine';
import { cn } from '@/lib/utils';

interface AnalyticsProps {
  score: number;
  trigger: string;
  window: string;
  challenge: string;
  data: UserData;
  focusMode: boolean;
}

export default function Analytics({ score, trigger, window, challenge, data, focusMode }: AnalyticsProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const weeklyReport = useMemo(() => getWeeklyData(data), [data]);
  const achievements = useMemo(() => getAchievements(data?.currentStreak || 0, score), [data?.currentStreak, score]);
  const insights = useMemo(() => getBehavioralInsights(data), [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full animate-fade-in-up [animation-delay:200ms]">
      {/* Integrity Score */}
      <div className="neu-flat p-8 sm:p-10 rounded-[3rem] flex flex-col gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl flex items-center gap-3 uppercase tracking-widest text-xs">
            <TrendingUp className="text-primary" size={20} /> Integrity Score
          </h3>
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-5xl font-headline font-bold text-primary streak-glow transition-all duration-500",
              focusMode && "blur-md select-none"
            )}>
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

      {/* Weekly Pulse Chart */}
      <div className="neu-flat p-8 sm:p-10 rounded-[3rem] flex flex-col gap-6">
        <h3 className="font-bold text-xl flex items-center gap-3 uppercase tracking-widest text-xs">
          <BarChart3 className="text-secondary" size={20} /> Weekly Pulse
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyReport}>
              <XAxis dataKey="name" hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  borderRadius: '1.5rem', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="urges" radius={[4, 4, 0, 0]}>
                {weeklyReport.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--primary))" fillOpacity={0.6} />
                ))}
              </Bar>
              <Bar dataKey="relapses" radius={[4, 4, 0, 0]}>
                {weeklyReport.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="hsl(var(--destructive))" fillOpacity={0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 justify-center">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary/60" /> Battle Won
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-destructive/60" /> Setback
          </div>
        </div>
      </div>

      {/* Behavioral Insights */}
      <div className="neu-flat p-8 sm:p-10 rounded-[3rem] flex flex-col gap-6">
        <h3 className="font-bold text-xl flex items-center gap-3 uppercase tracking-widest text-xs">
          <Zap className="text-primary" size={20} /> Insights
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="group flex items-center justify-between p-4 rounded-2xl neu-inset">
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider">Risk Window</span>
            </div>
            <span className="text-sm font-black text-primary bg-primary/5 px-3 py-1 rounded-full">{window}</span>
          </div>
          <div className="group flex items-center justify-between p-4 rounded-2xl neu-inset">
            <div className="flex items-center gap-3">
              <Target size={18} className="text-secondary" />
              <span className="text-sm font-bold uppercase tracking-wider">Top Trigger</span>
            </div>
            <span className="text-sm font-black text-secondary bg-secondary/5 px-3 py-1 rounded-full">{trigger}</span>
          </div>
          <div className="group flex items-center justify-between p-4 rounded-2xl neu-inset">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-green-500" />
              <span className="text-sm font-bold uppercase tracking-wider">Victory Rate</span>
            </div>
            <span className="text-sm font-black text-green-500 bg-green-500/5 px-3 py-1 rounded-full">{insights.winRate}%</span>
          </div>
        </div>
      </div>

      {/* Achievement Wall */}
      <div className="neu-flat p-8 sm:p-10 rounded-[3rem] flex flex-col gap-6">
        <h3 className="font-bold text-xl flex items-center gap-3 uppercase tracking-widest text-xs">
          <Trophy className="text-yellow-500" size={20} /> Achievements
        </h3>
        <div className="flex flex-wrap gap-3">
          {(achievements || []).map((ach) => (
            <div 
              key={ach.id} 
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                ach.unlocked ? "bg-yellow-100 text-yellow-600 shadow-lg shadow-yellow-200" : "bg-muted text-muted-foreground/30 grayscale"
              )}
              title={ach.desc}
            >
              <Trophy size={20} />
            </div>
          ))}
        </div>
        <p className="text-[10px] font-bold uppercase text-muted-foreground">
          {(achievements || []).filter(a => a.unlocked).length} / {(achievements || []).length} Unlocked
        </p>
      </div>

      {/* Daily Challenge */}
      <div className="md:col-span-2 neu-flat p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-none group cursor-pointer overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
          <Star size={120} />
        </div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
            <Star size={32} />
          </div>
          <div className="flex-1">
            <h4 className="font-black uppercase tracking-[0.2em] text-xs text-primary mb-1">Daily Protocol</h4>
            <p className="text-xl font-bold font-headline">{challenge}</p>
          </div>
          <div className="hidden sm:block">
            <Button className="rounded-xl font-bold neu-button border-none bg-primary text-white px-6">
              Complete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
