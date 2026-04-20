
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import StreakDisplay from '@/components/dashboard/StreakDisplay';
import ActionCards from '@/components/dashboard/ActionCards';
import Analytics from '@/components/dashboard/Analytics';
import RelapseModal from '@/components/modals/RelapseModal';
import UrgeModal from '@/components/modals/UrgeModal';
import ExportModal from '@/components/modals/ExportModal';
import FAB from '@/components/dashboard/FAB';
import { UserData, INITIAL_DATA, UrgeIntensity, AppTheme } from '@/lib/types';
import { getStoredData, saveData, clearData } from '@/lib/storage';
import { 
  calculateStreak, 
  calculateDisciplineScore, 
  getBehavioralInsights, 
  getDailyChallenge 
} from '@/lib/discipline-engine';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function IronWillDashboard() {
  const { toast } = useToast();
  const [data, setData] = useState<UserData>(INITIAL_DATA);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredData();
    // Apply theme on load
    document.body.setAttribute('data-theme', stored.theme || 'light');
    
    // Sync current streak on load
    stored.currentStreak = calculateStreak(stored.lastRelapseTimestamp);
    if (stored.currentStreak > (stored.bestStreak || 0)) {
      stored.bestStreak = stored.currentStreak;
    }
    stored.disciplineScore = calculateDisciplineScore(stored);
    setData(stored);
  }, []);

  const updateState = (newData: UserData) => {
    newData.currentStreak = calculateStreak(newData.lastRelapseTimestamp);
    if (newData.currentStreak > (newData.bestStreak || 0)) {
      newData.bestStreak = newData.currentStreak;
    }
    newData.disciplineScore = calculateDisciplineScore(newData);
    setData(newData);
    saveData(newData);
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    const newData = { ...data, theme: newTheme };
    document.body.setAttribute('data-theme', newTheme);
    updateState(newData);
    toast({ title: `Theme Updated`, description: `Switched to ${newTheme} mode.` });
  };

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (data.checkIns.some(c => c.date === today)) return;

    const newData = { ...data };
    newData.checkIns.push({ date: today, timestamp: Date.now() });
    updateState(newData);
    toast({ title: "+10 Discipline Points", description: "Consistency is key. Great job!" });
  };

  const handleUrgeResisted = (intensity: UrgeIntensity) => {
    const newData = { ...data };
    newData.urges.push({ id: Math.random().toString(36), timestamp: Date.now(), intensity });
    updateState(newData);
    setShowUrgeModal(false);
    toast({ title: "Victory Logged!", description: "Every urge resisted makes you stronger." });
  };

  const handleRelapse = (reason: string, time: string) => {
    const newData = { ...data };
    newData.relapses.push({ id: Math.random().toString(36), timestamp: Date.now(), reason, timeOfDay: time });
    newData.lastRelapseTimestamp = Date.now();
    newData.currentStreak = 0;
    updateState(newData);
    setShowRelapseModal(false);
    toast({ variant: "destructive", title: "Journey Reset", description: "Analyze the trigger, and start again stronger." });
  };

  const handleReset = () => {
    if (confirm("Factory Reset: Wipe all progress and settings?")) {
      clearData();
      setData(INITIAL_DATA);
      document.body.setAttribute('data-theme', 'light');
      toast({ title: "All Data Cleared", description: "You are starting from scratch." });
    }
  };

  if (!mounted) return null;

  const { mostCommonTrigger, highRiskWindow } = getBehavioralInsights(data);
  const challenge = getDailyChallenge();
  const checkedInToday = data.checkIns.some(c => c.date === new Date().toISOString().split('T')[0]);

  return (
    <main className="max-w-4xl mx-auto px-4 pb-32 pt-4 flex flex-col items-center gap-12 min-h-screen">
      <Header 
        focusMode={data.focusMode} 
        theme={data.theme || 'light'}
        onThemeChange={handleThemeChange}
        onExport={() => setShowExportModal(true)}
        onReset={handleReset}
        onToggleFocus={() => updateState({ ...data, focusMode: !data.focusMode })}
      />

      <div className="w-full space-y-12">
        <StreakDisplay current={data.currentStreak} best={data.bestStreak} />

        {!data.focusMode && (
          <>
            <ActionCards 
              onCheckIn={handleCheckIn} 
              onUrge={() => setShowUrgeModal(true)} 
              onRelapse={() => setShowRelapseModal(true)} 
              checkedInToday={checkedInToday}
            />
            <Analytics 
              score={data.disciplineScore} 
              trigger={mostCommonTrigger} 
              window={highRiskWindow}
              challenge={challenge}
            />
          </>
        )}
      </div>

      <RelapseModal 
        isOpen={showRelapseModal} 
        onClose={() => setShowRelapseModal(false)} 
        onSubmit={handleRelapse} 
      />

      <UrgeModal 
        isOpen={showUrgeModal} 
        onClose={() => setShowUrgeModal(false)} 
        onSubmit={handleUrgeResisted} 
      />

      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        data={data} 
      />

      <FAB 
        onCheckIn={handleCheckIn} 
        onUrge={() => setShowUrgeModal(true)} 
        onRelapse={() => setShowRelapseModal(true)} 
        disabledCheckIn={checkedInToday}
      />

      <Toaster />
    </main>
  );
}
