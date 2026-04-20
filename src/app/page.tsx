"use client";

import { useState, useEffect, useCallback } from 'react';
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

  // ULTIMATE INTERACTION CLEANUP ENGINE
  // This ensures that even if Radix/ShadCN components fail to clean up their 
  // focus traps or pointer-event locks, the page remains interactive.
  useEffect(() => {
    const isAnyModalOpen = showRelapseModal || showUrgeModal || showExportModal;
    
    if (!isAnyModalOpen) {
      const forceCleanup = () => {
        // Reset styles on body and html to restore clickability
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.body.style.userSelect = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
        
        // Aggressively remove Radix-specific lock attributes
        document.body.removeAttribute('data-scroll-locked');
        document.documentElement.removeAttribute('data-scroll-locked');
        
        // Remove any lingering portal containers if they're empty
        const portals = document.querySelectorAll('[data-radix-portal]');
        portals.forEach(portal => {
          if (portal.children.length === 0) portal.remove();
        });
      };

      // Execute immediately and then poll briefly to ensure late-cleanup components are caught
      forceCleanup();
      const interval = setInterval(forceCleanup, 100);
      const timer = setTimeout(() => clearInterval(interval), 1000);
      
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [showRelapseModal, showUrgeModal, showExportModal]);

  useEffect(() => {
    const handlePopState = () => {
      setShowRelapseModal(false);
      setShowUrgeModal(false);
      setShowExportModal(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenModal = useCallback((setter: (v: boolean) => void) => {
    window.history.pushState({ modalOpen: true }, "");
    setter(true);
  }, []);

  const handleCloseModal = useCallback((setter: (v: boolean) => void) => {
    if (window.history.state?.modalOpen) {
      window.history.back();
    }
    setter(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredData();
    document.body.setAttribute('data-theme', stored.theme || 'light');
    
    const syncData = () => {
      const newData = { ...stored };
      newData.currentStreak = calculateStreak(newData.lastRelapseTimestamp);
      if (newData.currentStreak > (newData.bestStreak || 0)) {
        newData.bestStreak = newData.currentStreak;
      }
      newData.disciplineScore = calculateDisciplineScore(newData);
      setData(newData);
    };
    
    syncData();
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
    toast({ title: `Theme Activated`, description: `Switched to ${newTheme} mode.` });
  };

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (data.checkIns.some(c => c.date === today)) {
      toast({ variant: "destructive", title: "Already Logged", description: "Your discipline is noted for today!" });
      return;
    }

    const newData = { ...data };
    newData.checkIns.push({ date: today, timestamp: Date.now() });
    updateState(newData);

    const messages = [
      { min: 0, msg: "Strong start 💪 +10 Points" },
      { min: 7, msg: "Momentum building 🚀 +20 Points" },
      { min: 30, msg: "Discipline unlocked 🧠 Master status!" }
    ];
    
    const feedback = [...messages].reverse().find(m => data.currentStreak >= m.min);
    toast({ title: "+1 Day Added 🔥", description: feedback?.msg || "+10 Points Added" });
  };

  const handleUrgeResisted = (intensity: UrgeIntensity) => {
    const newData = { ...data };
    newData.urges.push({ id: Math.random().toString(36), timestamp: Date.now(), intensity });
    updateState(newData);
    handleCloseModal(setShowUrgeModal);
    toast({ title: "Urge Controlled 💪", description: `Victory against a ${intensity} urge.` });
  };

  const handleRelapse = (reason: string, time: string) => {
    const newData = { ...data };
    newData.relapses.push({ id: Math.random().toString(36), timestamp: Date.now(), reason, timeOfDay: time });
    newData.lastRelapseTimestamp = Date.now();
    newData.currentStreak = 0;
    updateState(newData);
    handleCloseModal(setShowRelapseModal);
    toast({ variant: "destructive", title: "Relapse Logged", description: "Resilience is built through restart." });
  };

  const handleReset = () => {
    if (confirm("Factory Reset: Wipe all progress and settings?")) {
      clearData();
      setData(INITIAL_DATA);
      document.body.setAttribute('data-theme', 'light');
      toast({ title: "System Reset", description: "All data cleared. Starting fresh." });
    }
  };

  if (!mounted) return null;

  const { mostCommonTrigger, highRiskWindow } = getBehavioralInsights(data);
  const challenge = getDailyChallenge();
  const checkedInToday = data.checkIns.some(c => c.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="min-h-screen bg-background relative transition-colors duration-500 overflow-x-hidden">
      <Header 
        focusMode={data.focusMode} 
        theme={data.theme || 'light'}
        data={data}
        onThemeChange={handleThemeChange}
        onReset={handleReset}
        onToggleFocus={() => updateState({ ...data, focusMode: !data.focusMode })}
        onShowExport={() => handleOpenModal(setShowExportModal)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-4 flex flex-col items-center gap-12">
        <div className="w-full space-y-12 transition-all duration-700">
          <StreakDisplay current={data.currentStreak} best={data.bestStreak} />

          {!data.focusMode && (
            <>
              <ActionCards 
                onCheckIn={handleCheckIn} 
                onUrge={() => handleOpenModal(setShowUrgeModal)} 
                onRelapse={() => handleOpenModal(setShowRelapseModal)} 
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

        {showRelapseModal && (
          <RelapseModal 
            isOpen={showRelapseModal} 
            onClose={() => handleCloseModal(setShowRelapseModal)} 
            onSubmit={handleRelapse} 
          />
        )}

        {showUrgeModal && (
          <UrgeModal 
            isOpen={showUrgeModal} 
            onClose={() => handleCloseModal(setShowUrgeModal)} 
            onSubmit={handleUrgeResisted} 
          />
        )}

        {showExportModal && (
          <ExportModal 
            isOpen={showExportModal}
            onClose={() => handleCloseModal(setShowExportModal)}
            data={data}
          />
        )}

        <FAB 
          onCheckIn={handleCheckIn} 
          onUrge={() => handleOpenModal(setShowUrgeModal)} 
          onRelapse={() => handleOpenModal(setShowRelapseModal)} 
          disabledCheckIn={checkedInToday}
        />

        <Toaster />
      </main>
    </div>
  );
}
