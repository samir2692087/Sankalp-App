"use client";

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/dashboard/Header';
import StreakDisplay from '@/components/dashboard/StreakDisplay';
import ActionCards from '@/components/dashboard/ActionCards';
import InsightsSummary from '@/components/dashboard/InsightsSummary';
import RelapseModal from '@/components/modals/RelapseModal';
import UrgeModal from '@/components/modals/UrgeModal';
import ExportModal from '@/components/modals/ExportModal';
import InsightsSheet from '@/components/modals/InsightsSheet';
import EmergencyModal from '@/components/modals/EmergencyModal';
import FAB from '@/components/dashboard/FAB';
import { UserData, INITIAL_DATA, UrgeIntensity, AppTheme } from '@/lib/types';
import { getStoredData, saveData, clearData } from '@/lib/storage';
import { 
  calculateStreak, 
  calculateDisciplineScore, 
  getBehavioralInsights 
} from '@/lib/discipline-engine';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function IronWillDashboard() {
  const { toast } = useToast();
  const [data, setData] = useState<UserData>(INITIAL_DATA);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInsightsSheet, setShowInsightsSheet] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [insightsTab, setInsightsTab] = useState('milestones');
  const [mounted, setMounted] = useState(false);

  // Interaction Cleanup Engine
  useEffect(() => {
    const isAnyModalOpen = showRelapseModal || showUrgeModal || showExportModal || showInsightsSheet || showEmergencyModal;
    
    if (!isAnyModalOpen) {
      const forceCleanup = () => {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
        document.body.removeAttribute('data-scroll-locked');
        document.documentElement.removeAttribute('data-scroll-locked');
      };

      forceCleanup();
      const interval = setInterval(forceCleanup, 100);
      const timer = setTimeout(() => clearInterval(interval), 1000);
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [showRelapseModal, showUrgeModal, showExportModal, showInsightsSheet, showEmergencyModal]);

  useEffect(() => {
    const handlePopState = () => {
      setShowRelapseModal(false);
      setShowUrgeModal(false);
      setShowExportModal(false);
      setShowInsightsSheet(false);
      setShowEmergencyModal(false);
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
    toast({ title: "+1 Day Added 🔥", description: "Keep the fire burning!" });
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
    if (confirm("Factory Reset: Wipe all progress?")) {
      clearData();
      setData(INITIAL_DATA);
      document.body.setAttribute('data-theme', 'light');
      toast({ title: "System Reset" });
    }
  };

  if (!mounted) return null;

  const insights = getBehavioralInsights(data);
  const checkedInToday = data.checkIns.some(c => c.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="h-screen bg-background relative overflow-hidden flex flex-col">
      <Header 
        focusMode={data.focusMode} 
        theme={data.theme || 'light'}
        data={data}
        onThemeChange={handleThemeChange}
        onReset={handleReset}
        onToggleFocus={() => updateState({ ...data, focusMode: !data.focusMode })}
        onShowExport={() => handleOpenModal(setShowExportModal)}
        onUpdateReminder={(enabled, time) => updateState({ ...data, notificationsEnabled: enabled, reminderTime: time })}
      />

      <main className="flex-1 max-w-lg mx-auto w-full px-6 flex flex-col gap-8 justify-center pb-24">
        <StreakDisplay current={data.currentStreak} best={data.bestStreak} focusMode={data.focusMode} />
        
        <ActionCards 
          onCheckIn={handleCheckIn} 
          onUrge={() => handleOpenModal(setShowUrgeModal)} 
          onRelapse={() => handleOpenModal(setShowRelapseModal)} 
          checkedInToday={checkedInToday}
        />

        <InsightsSummary 
          score={data.disciplineScore} 
          resilience={insights.resilienceLevel}
          onOpenInsights={(tab) => {
            setInsightsTab(tab);
            handleOpenModal(setShowInsightsSheet);
          }}
          focusMode={data.focusMode}
        />
      </main>

      <FAB 
        onOpenInsights={(tab) => {
          setInsightsTab(tab);
          handleOpenModal(setShowInsightsSheet);
        }}
        onOpenEmergency={() => handleOpenModal(setShowEmergencyModal)}
      />

      {showRelapseModal && (
        <RelapseModal isOpen={showRelapseModal} onClose={() => handleCloseModal(setShowRelapseModal)} onSubmit={handleRelapse} />
      )}
      {showUrgeModal && (
        <UrgeModal isOpen={showUrgeModal} onClose={() => handleCloseModal(setShowUrgeModal)} onSubmit={handleUrgeResisted} />
      )}
      {showExportModal && (
        <ExportModal isOpen={showExportModal} onClose={() => handleCloseModal(setShowExportModal)} data={data} onDataImport={() => setMounted(false)} />
      )}
      {showInsightsSheet && (
        <InsightsSheet 
          isOpen={showInsightsSheet} 
          onClose={() => handleCloseModal(setShowInsightsSheet)} 
          data={data} 
          defaultTab={insightsTab}
        />
      )}
      {showEmergencyModal && (
        <EmergencyModal isOpen={showEmergencyModal} onClose={() => handleCloseModal(setShowEmergencyModal)} />
      )}

      <Toaster />
    </div>
  );
}
