
"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  YAxis
} from 'recharts';
import { Target, BarChart3, Trophy, ArrowLeft, TrendingUp } from 'lucide-react';
import { UserData } from "@/lib/types";
import { getWeeklyData, getAchievements } from "@/lib/discipline-engine";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface InsightsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
  defaultTab?: string;
}

export default function InsightsSheet({ isOpen, onClose, data, defaultTab = 'milestones' }: InsightsSheetProps) {
  const weeklyData = getWeeklyData(data);
  const achievements = getAchievements(data.currentStreak, data.disciplineScore);

  // Progress Timeline Data
  const timelineData = useMemo(() => {
    return weeklyData.map(d => ({
      name: d.name,
      score: Math.max(0, 100 - (d.relapses * 20) + (d.checkins * 5))
    }));
  }, [weeklyData]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[3rem] p-0 border-none glass-card outline-none overflow-hidden flex flex-col">
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-4 shrink-0" />
        
        <SheetHeader className="px-8 pt-6 pb-2 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose} className="p-0 h-auto hover:bg-transparent">
              <ArrowLeft size={24} />
            </Button>
            <SheetTitle className="text-2xl font-bold font-headline">Intelligence Report</SheetTitle>
          </div>
          <SheetDescription>Behavioral patterns and discipline trajectories.</SheetDescription>
        </SheetHeader>

        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col px-6 pb-4 overflow-hidden">
          <TabsList className="w-full bg-muted/30 p-1.5 rounded-2xl h-14 mb-6 shrink-0">
            <TabsTrigger value="milestones" className="flex-1 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest"><Target size={14}/> Goals</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest"><TrendingUp size={14}/> Timeline</TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1 rounded-xl gap-2 font-bold text-xs uppercase tracking-widest"><Trophy size={14}/> Mastery</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
            <TabsContent value="milestones" className="mt-0 outline-none space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {[7, 30, 90, 365].map((goal) => {
                  const progress = Math.min((data.currentStreak / goal) * 100, 100);
                  return (
                    <div key={goal} className="neu-flat p-6 rounded-3xl flex flex-col gap-4 transition-all hover:scale-[1.02]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold font-headline text-lg">{goal} Day Protocol</span>
                        <span className={cn("text-xs font-black px-3 py-1 rounded-full uppercase", progress === 100 ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary")}>
                          {progress === 100 ? "Completed" : `${Math.round(progress)}%`}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden neu-inset">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-0 outline-none space-y-6">
              <div className="neu-flat p-8 rounded-3xl h-64 bg-card">
                <h4 className="text-[10px] font-black uppercase text-muted-foreground mb-4">Neural Resilience Curve</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={timelineData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={4} 
                      dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="neu-inset p-5 rounded-[2rem] text-center bg-background/40">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Total Battles</p>
                  <p className="text-2xl font-bold font-headline">{data.urges.length + data.relapses.length}</p>
                </div>
                <div className="neu-inset p-5 rounded-[2rem] text-center bg-background/40">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Victory Rate</p>
                  <p className="text-2xl font-bold font-headline text-primary">{Math.round((data.urges.length / (data.urges.length + data.relapses.length || 1)) * 100)}%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0 outline-none">
              <div className="grid grid-cols-3 gap-4">
                {achievements.map((ach) => (
                  <div key={ach.id} className={cn(
                    "aspect-square rounded-[2.5rem] flex flex-col items-center justify-center text-center p-4 transition-all duration-500",
                    ach.unlocked ? "neu-flat bg-yellow-50 text-yellow-600 scale-100" : "bg-muted text-muted-foreground/30 grayscale scale-95 opacity-50"
                  )}>
                    <Trophy size={28} className={cn("mb-2", ach.unlocked && "animate-bounce")} />
                    <span className="text-[9px] font-black uppercase tracking-tighter leading-tight">{ach.name}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

import { useMemo } from 'react';
