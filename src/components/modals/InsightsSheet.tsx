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
      <SheetContent side="bottom" className="h-[90vh] rounded-t-[3rem] p-0 border-t border-slate-200 bg-white/95 backdrop-blur-md outline-none overflow-hidden flex flex-col">
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-4 shrink-0" />
        
        <SheetHeader className="px-8 pt-6 pb-4 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose} className="p-0 h-auto hover:bg-transparent text-slate-900">
              <ArrowLeft size={24} />
            </Button>
            <div>
              <SheetTitle className="text-2xl font-bold text-slate-900 tracking-tight">Intelligence Hub</SheetTitle>
              <SheetDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">Neural Pattern Analysis</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue={defaultTab} className="flex-1 flex flex-col px-6 pb-6 overflow-hidden">
          <TabsList className="w-full bg-slate-100 p-1.5 rounded-2xl h-14 mb-6 shrink-0 border border-slate-200">
            <TabsTrigger value="milestones" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all"><Target size={14}/> Goals</TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all"><TrendingUp size={14}/> Timeline</TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-md transition-all"><Trophy size={14}/> Mastery</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
            <TabsContent value="milestones" className="mt-0 outline-none space-y-3">
              <div className="grid grid-cols-1 gap-3">
                {[7, 30, 90, 365].map((goal) => {
                  const progress = Math.min((data.currentStreak / goal) * 100, 100);
                  return (
                    <motion.div 
                      key={goal} 
                      className="bg-white border border-slate-200 p-6 rounded-[2rem] flex flex-col gap-4 shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900">{goal} Day Protocol</span>
                        <span className={cn("text-[9px] font-black px-3 py-1 rounded-full uppercase", progress === 100 ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700")}>
                          {progress === 100 ? "Ascended" : `${Math.round(progress)}% Stability`}
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-slate-800 to-slate-900 rounded-full" 
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-0 outline-none space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] h-64 shadow-2xl">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6">Resilience Trajectory</h4>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={timelineData}>
                    <XAxis dataKey="name" hide />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '1rem', color: '#fff', fontSize: '10px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#fff" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#fff' }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] text-center shadow-sm">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Total Conflicts</p>
                  <p className="text-2xl font-bold text-slate-900">{data.urges.length + data.relapses.length}</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-[2rem] text-center shadow-sm">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Victory Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{Math.round((data.urges.length / (data.urges.length + data.relapses.length || 1)) * 100)}%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-0 outline-none">
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id} 
                    className={cn(
                      "rounded-[2rem] flex flex-col items-center justify-center text-center p-6 border transition-all",
                      ach.unlocked 
                        ? "bg-white border-slate-200 shadow-sm" 
                        : "bg-slate-50 border-slate-100 opacity-40 grayscale"
                    )}
                  >
                    <div className={cn("p-4 rounded-2xl bg-slate-50 mb-3", ach.unlocked && "bg-slate-100 text-slate-900")}>
                      <Trophy size={32} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight leading-tight">{ach.name}</span>
                    <p className="text-[8px] font-bold uppercase text-slate-400 mt-1">{ach.desc}</p>
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
