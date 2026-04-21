"use client";

import { useMemo } from 'react';
import PortalSheet from "@/components/ui/portal-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  XAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart,
  Line,
  YAxis
} from 'recharts';
import { Target, Trophy, TrendingUp } from 'lucide-react';
import { UserData } from "@/lib/types";
import { getWeeklyData, getAchievements } from "@/lib/discipline-engine";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface InsightsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  data: UserData;
  defaultTab?: string;
}

export default function InsightsSheet({ isOpen, onClose, data, defaultTab = 'milestones' }: InsightsSheetProps) {
  const { t } = useLanguage();
  const weeklyData = useMemo(() => getWeeklyData(data), [data]);
  const achievements = useMemo(() => getAchievements(data?.currentStreak || 0, data?.disciplineScore || 0), [data?.currentStreak, data?.disciplineScore]);

  const timelineData = useMemo(() => {
    if (!Array.isArray(weeklyData)) return [];
    return weeklyData.map(d => ({
      name: d.name || 'N/A',
      score: Math.max(0, 100 - ((d.relapses || 0) * 20) + ((d.checkins || 0) * 5))
    }));
  }, [weeklyData]);

  const winRate = useMemo(() => {
    const total = (data?.urges?.length || 0) + (data?.relapses?.length || 0);
    if (total === 0) return 100;
    return Math.round(((data?.urges?.length || 0) / total) * 100);
  }, [data]);

  return (
    <PortalSheet 
      isOpen={isOpen} 
      onClose={onClose}
      title={t('insights')}
      description={t('pattern_analysis')}
    >
      <Tabs defaultValue={defaultTab} className="w-full flex flex-col">
        <TabsList className="w-full bg-white/[0.03] p-1.5 rounded-2xl h-14 mb-8 shrink-0 border border-white/5">
          <TabsTrigger value="milestones" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest text-white/40 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"><Target size={14}/> {t('goals')}</TabsTrigger>
          <TabsTrigger value="weekly" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest text-white/40 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"><TrendingUp size={14}/> {t('timeline')}</TabsTrigger>
          <TabsTrigger value="achievements" className="flex-1 rounded-xl gap-2 font-bold text-[10px] uppercase tracking-widest text-white/40 data-[state=active]:bg-primary data-[state=active]:text-white transition-all"><Trophy size={14}/> {t('mastery')}</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="mt-0 outline-none space-y-4">
          {[7, 30, 90, 365].map((goal, idx) => {
            const progress = Math.min(((data?.currentStreak || 0) / goal) * 100, 100);
            return (
              <motion.div 
                key={goal} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/[0.03] border border-white/5 p-6 rounded-[2.2rem] flex flex-col gap-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">{goal} {t('day_resolve')}</span>
                  <span className={cn("text-[9px] font-black px-3 py-1 rounded-full uppercase", progress === 100 ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/40")}>
                    {progress === 100 ? t('ascended') : `${Math.round(progress)}% ${t('stable')}`}
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-primary shadow-[0_0_15px_rgba(168,85,247,0.5)] rounded-full" 
                  />
                </div>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="weekly" className="mt-0 outline-none space-y-6">
          <div className="bg-[#0b0b0f] border border-white/5 p-8 rounded-[2.5rem] h-64 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
            <h4 className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-6 relative z-10">{t('resilience_path')}</h4>
            <div className="h-40 w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#07070a', border: 'none', borderRadius: '1rem', color: '#fff', fontSize: '10px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: 'hsl(var(--primary))' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] text-center">
              <p className="text-[9px] font-black uppercase text-white/20 mb-1">{t('total_conflicts')}</p>
              <p className="text-2xl font-bold text-white">{(data?.urges?.length || 0) + (data?.relapses?.length || 0)}</p>
            </div>
            <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] text-center">
              <p className="text-[9px] font-black uppercase text-white/20 mb-1">{t('victory_rate')}</p>
              <p className="text-2xl font-bold text-white">{winRate}%</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-0 outline-none">
          <div className="grid grid-cols-2 gap-4">
            {(achievements || []).map((ach) => (
              <div 
                key={ach.id} 
                className={cn(
                  "rounded-[2.2rem] flex flex-col items-center justify-center text-center p-6 border transition-all",
                  ach.unlocked 
                    ? "bg-white/[0.03] border-primary/20 shadow-lg shadow-primary/5" 
                    : "bg-white/[0.01] border-white/5 opacity-30 grayscale"
                )}
              >
                <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-transform", ach.unlocked && "bg-primary/20 text-primary scale-110")}>
                  <Trophy size={32} />
                </div>
                <span className="text-[11px] font-bold text-white uppercase tracking-tight leading-tight">{ach.name}</span>
                <p className="text-[8px] font-bold uppercase text-white/20 mt-2">{ach.desc}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PortalSheet>
  );
}
