
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
import CalendarSheet from '@/components/modals/CalendarSheet';
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
  const [showCalendarSheet, setShowCalendarSheet] = useState(false);
  const [insightsTab, setInsightsTab] = useState('milestones');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const forceReset = () => {
      const activeOverlays = document.querySelectorAll('[role="dialog"], [data-state="open"], .fixed.inset-0');
      if (activeOverlays.length === 0) {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.body.removeAttribute('data-scroll-locked');
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'style' || mutation.attributeName === 'data-scroll-locked')) {
          forceReset();
        }
      });
    });

    observer.observe(document.body, { attributes: true });
    const interval = setInterval(forceReset, 250);
    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setShowRelapseModal(false);
      setShowUrgeModal(false);
      setShowExportModal(false);
      setShowInsightsSheet(false);
      setShowEmergencyModal(false);
      setShowCalendarSheet(false);
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

  const handleToggleCheckIn = (dateStr: string) => {
    const newData = { ...data };
    const index = newData.checkIns.findIndex(c => c.date === dateStr);
    
    if (index > -1) {
      newData.checkIns.splice(index, 1);
      toast({ title: "Status Removed", description: `Removed clean status for ${dateStr}` });
    } else {
      newData.checkIns.push({ date: dateStr, timestamp: new Date(dateStr).getTime() });
      toast({ title: "Status Added", description: `Marked ${dateStr} as clean.` });
    }
    updateState(newData);
  };

  const handleSaveNote = (dateStr: string, content: string) => {
    const newData = { ...data };
    const index = newData.notes.findIndex(n => n.date === dateStr);
    
    if (index > -1) {
      if (content.trim() === "") newData.notes.splice(index, 1);
      else newData.notes[index].content = content;
    } else if (content.trim() !== "") {
      newData.notes.push({ date: dateStr, content });
    }
    updateState(newData);
    toast({ title: "Note Saved", description: "Your daily reflection is secure." });
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
  const isAnySheetOpen = showRelapseModal || showUrgeModal || showExportModal || showInsightsSheet || showEmergencyModal || showCalendarSheet;

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

      <main className="flex-1 max-w-lg mx-auto w-full px-6 flex flex-col gap-6 justify-center pb-20 overflow-hidden">
        <StreakDisplay current={data.currentStreak} best={data.bestStreak} focusMode={data.focusMode} />
        
        <ActionCards 
          onCheckIn={handleCheckIn} 
          onUrge={() => handleOpenModal(setShowUrgeModal)} 
          onRelapse={() => handleOpenModal(setShowRelapseModal)} 
          checkedInToday={data.checkIns.some(c => c.date === new Date().toISOString().split('T')[0])}
        />

        <InsightsSummary 
          score={data.disciplineScore} 
          resilience={insights.resilienceLevel}
          onOpenInsights={(tab) => {
            if (tab === 'history') handleOpenModal(setShowCalendarSheet);
            else {
              setInsightsTab(tab);
              handleOpenModal(setShowInsightsSheet);
            }
          }}
          focusMode={data.focusMode}
        />
      </main>

      {!isAnySheetOpen && (
        <FAB 
          onOpenInsights={(tab) => {
            if (tab === 'history') handleOpenModal(setShowCalendarSheet);
            else {
              setInsightsTab(tab);
              handleOpenModal(setShowInsightsSheet);
            }
          }}
          onOpenEmergency={() => handleOpenModal(setShowEmergencyModal)}
        />
      )}

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
      {showCalendarSheet && (
        <CalendarSheet 
          isOpen={showCalendarSheet} 
          onClose={() => handleCloseModal(setShowCalendarSheet)} 
          data={data}
          onToggleDate={handleToggleCheckIn}
          onSaveNote={handleSaveNote}
        />
      )}

      <Toaster />
    </div>
  );
}
