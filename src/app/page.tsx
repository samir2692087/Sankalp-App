
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
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
import { UserData, INITIAL_DATA, AppTheme } from '@/lib/types';
import { getStoredData, saveData, clearData } from '@/lib/storage';
import { 
  calculateStreak, 
  calculateDisciplineScore, 
  getBehavioralInsights,
  getDailyChallenge
} from '@/lib/discipline-engine';
import { Toaster } from '@/components/ui/toaster';

// Dynamically import the 3D scene with SSR disabled
const Scene3D = dynamic(() => import('@/components/background/Scene3D'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-[#050505]" /> 
});

export default function IronWillDashboard() {
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
    // Reset interaction blocking
    const forceReset = () => {
      const activeOverlays = document.querySelectorAll('[role="dialog"], [data-state="open"], .fixed.inset-0');
      if (activeOverlays.length === 0) {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.body.removeAttribute('data-scroll-locked');
        document.documentElement.style.pointerEvents = 'auto';
      }
    };
    const interval = setInterval(forceReset, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredData();
    document.body.setAttribute('data-theme', stored.theme || 'dark');
    
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

  const handleOpenModal = useCallback((setter: (v: boolean) => void) => {
    window.history.pushState({ modalOpen: true }, "");
    setter(true);
  }, []);

  const handleCloseModal = useCallback((setter: (v: boolean) => void) => {
    if (window.history.state?.modalOpen) window.history.back();
    setter(false);
  }, []);

  const insights = useMemo(() => getBehavioralInsights(data), [data]);
  const challenge = useMemo(() => getDailyChallenge(data.currentStreak), [data.currentStreak]);

  if (!mounted) return null;

  const isAnySheetOpen = showRelapseModal || showUrgeModal || showExportModal || showInsightsSheet || showEmergencyModal || showCalendarSheet;

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col selection:bg-primary/30">
      <Scene3D streak={data.currentStreak} theme={data.theme || 'dark'} />
      
      <Header 
        focusMode={data.focusMode} 
        theme={data.theme || 'dark'}
        data={data}
        onThemeChange={(t) => updateState({ ...data, theme: t })}
        onReset={() => { if(confirm("Wipe all data?")) { clearData(); setData(INITIAL_DATA); } }}
        onToggleFocus={() => updateState({ ...data, focusMode: !data.focusMode })}
        onShowExport={() => handleOpenModal(setShowExportModal)}
        onUpdateReminder={(e, t) => updateState({ ...data, notificationsEnabled: e, reminderTime: t })}
      />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 max-w-lg mx-auto w-full px-6 flex flex-col gap-6 py-8 pb-32"
      >
        <StreakDisplay 
          current={data.currentStreak} 
          best={data.bestStreak} 
          focusMode={data.focusMode} 
          freezes={data.streakFreezes}
          onUseFreeze={() => {}}
        />
        
        <ActionCards 
          onCheckIn={() => {}} 
          onUrge={() => handleOpenModal(setShowUrgeModal)} 
          onRelapse={() => handleOpenModal(setShowRelapseModal)} 
          checkedInToday={false}
        />

        <InsightsSummary 
          score={data.disciplineScore} 
          resilience={insights.resilienceLevel}
          riskLevel={insights.riskLevel}
          message={insights.protectionMessage}
          onOpenInsights={(tab) => {
            if (tab === 'history') handleOpenModal(setShowCalendarSheet);
            else { setInsightsTab(tab); handleOpenModal(setShowInsightsSheet); }
          }}
          focusMode={data.focusMode}
        />

        {!data.focusMode && (
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10"
          >
            <h4 className="text-[9px] font-black uppercase tracking-widest text-primary mb-2 opacity-70">Adaptive Challenge</h4>
            <p className="text-sm font-bold leading-snug text-white/90">{challenge}</p>
          </motion.div>
        )}
      </motion.main>

      <AnimatePresence>
        {!isAnySheetOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FAB 
              onOpenInsights={(tab) => {
                if (tab === 'history') handleOpenModal(setShowCalendarSheet);
                else { setInsightsTab(tab); handleOpenModal(setShowInsightsSheet); }
              }}
              onOpenEmergency={() => handleOpenModal(setShowEmergencyModal)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster />

      {showRelapseModal && <RelapseModal isOpen={showRelapseModal} onClose={() => handleCloseModal(setShowRelapseModal)} onSubmit={() => {}} />}
      {showUrgeModal && <UrgeModal isOpen={showUrgeModal} onClose={() => handleCloseModal(setShowUrgeModal)} onSubmit={() => {}} />}
      {showInsightsSheet && <InsightsSheet isOpen={showInsightsSheet} onClose={() => handleCloseModal(setShowInsightsSheet)} data={data} defaultTab={insightsTab} />}
      {showCalendarSheet && <CalendarSheet isOpen={showCalendarSheet} onClose={() => handleCloseModal(setShowCalendarSheet)} data={data} onToggleDate={() => {}} onSaveNote={() => {}} />}
      {showEmergencyModal && <EmergencyModal isOpen={showEmergencyModal} onClose={() => handleCloseModal(setShowEmergencyModal)} />}
      {showExportModal && <ExportModal isOpen={showExportModal} onClose={() => handleCloseModal(setShowExportModal)} data={data} onDataImport={() => {}} />}
    </div>
  );
}
