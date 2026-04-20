"use client";

import { useMemo } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  YAxis
} from 'recharts';
import { Target, Trophy, ArrowLeft, TrendingUp } from 'lucide-react';
import { UserData } from "@/lib/types";
import { getWeeklyData, getAchievements } from "@/lib/discipline-engine";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface InsightsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
  defaultTab?: string;
}

export default function InsightsSheet({ isOpen, onClose, data, defaultTab = 'milestones' }: InsightsSheetProps) {
  const weeklyData = getWeeklyData(data);
  const achievements = getAchievements(data.currentStreak, data.disciplineScore);

  const timelineData = useMemo(() => {
    return weeklyData.map(d => ({
      name: d.name,
      score: Math.max(0, 100 - (d.relapses * 20) + (d.checkins * 5))
    }));
  }, [weeklyData]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[4rem] p-0 border-none glass-card shadow-[0_-20px_100px_rgba(124,58,237,0.2)] outline-none overflow-hidden flex flex-col">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 shrink-0" />
        
        <SheetHeader className="px-10 pt-8 pb-4 shrink-0">
          <div className="flex items-center gap-5">
            <Button variant="ghost" onClick={onClose} className="p-0 h-auto hover:bg-transparent">
              <ArrowLeft size={28} />
            </Button>
            <div>
              <SheetTitle className="text-3xl font-bold font-headline leading-none">Intelligence Hub</SheetTitle>
              <SheetDescription className="text-muted-foreground/60 uppercase tracking-widest text-[9px] mt-1.5 font-bold">Neural Pattern Analysis</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col px-8 pb-6 overflow-hidden">
          <TabsList className="w-full bg-white/5 p-1.5 rounded-[2rem] h-16 mb-8 shrink-0 border border-white/5">
            <TabsTrigger value="milestones" className="flex-1 rounded-[1.5rem] gap-2 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20"><Target size={14}/> Goals</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1 rounded-[1.5rem] gap-2 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20"><TrendingUp size={14}/> Timeline</TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1 rounded-[1.5rem] gap-2 font-bold text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg shadow-primary/20"><Trophy size={14}/> Mastery</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
            <TabsContent value="milestones" className="mt-0 outline-none space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {[7, 30, 90, 365].map((goal) => {
                  const progress = Math.min((data.currentStreak / goal) * 100, 100);
                  return (
                    <motion.div 
                      key={goal} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col gap-5 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold font-headline text-xl">{goal} Day Protocol</span>
                        <span className={cn("text-[10px] font-black px-4 py-1.5 rounded-full uppercase", progress === 100 ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary")}>
                          {progress === 100 ? "Ascended" : `${Math.round(progress)}% Stability`}
                        </span>
                      </div>
                      <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 p-1">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_15px_rgba(124,58,237,0.4)]" 
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-0 outline-none space-y-8">
              <div className="bg-black/20 border border-white/5 p-10 rounded-[3rem] h-80 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50" />
                <h4 className="text-[10px] font-black uppercase text-muted-foreground/60 mb-6 tracking-widest">Resilience Trajectory</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={timelineData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1 }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold' }} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={5} 
                      dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 0 }} 
                      activeDot={{ r: 10, fill: 'white', stroke: 'hsl(var(--primary))', strokeWidth: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] text-center">
                  <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-2">Total Conflicts</p>
                  <p className="text-3xl font-bold font-headline">{data.urges.length + data.relapses.length}</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] text-center">
                  <p className="text-[10px] font-black uppercase text-muted-foreground/60 mb-2">Victory Rate</p>
                  <p className="text-3xl font-bold font-headline text-primary">{Math.round((data.urges.length / (data.urges.length + data.relapses.length || 1)) * 100)}%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0 outline-none">
              <div className="grid grid-cols-2 gap-5">
                {achievements.map((ach) => (
                  <motion.div 
                    key={ach.id} 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "rounded-[3rem] flex flex-col items-center justify-center text-center p-8 transition-all duration-700 border",
                      ach.unlocked 
                        ? "bg-primary/10 border-primary text-primary shadow-[0_0_30px_rgba(124,58,237,0.1)]" 
                        : "bg-white/5 border-white/5 text-muted-foreground/30 opacity-40 grayscale"
                    )}
                  >
                    <div className={cn("p-5 rounded-3xl bg-white/5 mb-4 shadow-inner", ach.unlocked && "animate-pulse")}>
                      <Trophy size={40} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight leading-tight">{ach.name}</span>
                    <p className="text-[8px] mt-2 opacity-60 font-bold uppercase tracking-widest">{ach.desc}</p>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
