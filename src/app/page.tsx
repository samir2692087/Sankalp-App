
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/dashboard/Header';
import StreakDisplay from '@/components/dashboard/StreakDisplay';
import ActionCards from '@/components/dashboard/ActionCards';
import Analytics from '@/components/dashboard/Analytics';
import RelapseModal from '@/components/modals/RelapseModal';
import UrgeModal from '@/components/modals/UrgeModal';
import { UserData, INITIAL_DATA, UrgeIntensity } from '@/lib/types';
import { getStoredData, saveData, clearData } from '@/lib/storage';
import { 
  calculateStreak, 
  calculateDisciplineScore, 
  getBehavioralInsights, 
  getDailyChallenge 
} from '@/lib/discipline-engine';
import { useToast } from '@/hooks/use-toast';

export default function IronWillDashboard() {
  const { toast } = useToast();
  const [data, setData] = useState<UserData>(INITIAL_DATA);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredData();
    // Sync current streak on load
    stored.currentStreak = calculateStreak(stored.lastRelapseTimestamp);
    if (stored.currentStreak > stored.bestStreak) {
      stored.bestStreak = stored.currentStreak;
    }
    stored.disciplineScore = calculateDisciplineScore(stored);
    setData(stored);
  }, []);

  const updateState = (newData: UserData) => {
    newData.currentStreak = calculateStreak(newData.lastRelapseTimestamp);
    if (newData.currentStreak > newData.bestStreak) {
      newData.bestStreak = newData.currentStreak;
    }
    newData.disciplineScore = calculateDisciplineScore(newData);
    setData(newData);
    saveData(newData);
  };

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (data.checkIns.some(c => c.date === today)) return;

    const newData = { ...data };
    newData.checkIns.push({ date: today, timestamp: Date.now() });
    updateState(newData);
    toast({ title: "Check-in successful!", description: "Another day of strength added." });
  };

  const handleUrgeResisted = (intensity: UrgeIntensity) => {
    const newData = { ...data };
    newData.urges.push({ id: Math.random().toString(36), timestamp: Date.now(), intensity });
    updateState(newData);
    setShowUrgeModal(false);
    toast({ title: "Battle Won!", description: `Intensity: ${intensity}. You are stronger than your urges.` });
  };

  const handleRelapse = (reason: string, time: string) => {
    const newData = { ...data };
    newData.relapses.push({ id: Math.random().toString(36), timestamp: Date.now(), reason, timeOfDay: time });
    newData.lastRelapseTimestamp = Date.now();
    newData.currentStreak = 0;
    updateState(newData);
    setShowRelapseModal(false);
    toast({ variant: "destructive", title: "Journey Reset", description: "Learn from this and start again. You've got this." });
  };

  const toggleFocusMode = () => {
    const newData = { ...data, focusMode: !data.focusMode };
    updateState(newData);
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ironwill-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset ALL data? This cannot be undone.")) {
      clearData();
      setData(INITIAL_DATA);
      toast({ title: "Data Cleared", description: "Everything has been reset to zero." });
    }
  };

  if (!mounted) return null;

  const { mostCommonTrigger, highRiskWindow } = getBehavioralInsights(data);
  const challenge = getDailyChallenge();
  const checkedInToday = data.checkIns.some(c => c.date === new Date().toISOString().split('T')[0]);

  return (
    <main className="max-w-4xl mx-auto px-4 pb-20 pt-4 flex flex-col items-center gap-12">
      <Header 
        focusMode={data.focusMode} 
        onToggleFocus={toggleFocusMode} 
        onExport={handleExport}
        onReset={handleReset}
      />

      <div className="w-full space-y-12">
        <StreakDisplay current={data.currentStreak} best={data.bestStreak} />

        <ActionCards 
          onCheckIn={handleCheckIn} 
          onUrge={() => setShowUrgeModal(true)} 
          onRelapse={() => setShowRelapseModal(true)} 
          checkedInToday={checkedInToday}
        />

        {!data.focusMode && (
          <Analytics 
            score={data.disciplineScore} 
            trigger={mostCommonTrigger} 
            window={highRiskWindow}
            challenge={challenge}
          />
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
    </main>
  );
}
