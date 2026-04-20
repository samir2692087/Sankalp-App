
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
import BrowserModal from '@/components/browser/BrowserModal';
import FAB from '@/components/dashboard/FAB';
import { UserData, INITIAL_DATA, AppTheme, UrgeIntensity } from '@/lib/types';
import { getStoredData, saveData, clearData } from '@/lib/storage';
import { 
  calculateStreak, 
  calculateDisciplineScore, 
  getBehavioralInsights,
  getDailyChallenge
} from '@/lib/discipline-engine';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Dynamically import the 3D scene with SSR disabled
const Scene3D = dynamic(() => import('@/components/background/Scene3D'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-background" /> 
});

export default function IronWillDashboard() {
  const { toast } = useToast();
  const [data, setData] = useState<UserData>(INITIAL_DATA);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInsightsSheet, setShowInsightsSheet] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCalendarSheet, setShowCalendarSheet] = useState(false);
  const [showBrowserModal, setShowBrowserModal] = useState(false);
  const [insightsTab, setInsightsTab] = useState('milestones');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Reset interaction blocking logic for sheets/modals
    const forceReset = () => {
      if (typeof document === 'undefined') return;
      const activeOverlays = Array.from(document.querySelectorAll('[role="dialog"], [data-state="open"]'))
        .filter(el => !el.classList.contains('pointer-events-none'));
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
    const currentTheme = stored.theme || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
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
    const updatedData = { ...newData };
    updatedData.currentStreak = calculateStreak(updatedData.lastRelapseTimestamp);
    if (updatedData.currentStreak > (updatedData.bestStreak || 0)) {
      updatedData.bestStreak = updatedData.currentStreak;
    }
    updatedData.disciplineScore = calculateDisciplineScore(updatedData);
    
    setData(updatedData);
    saveData(updatedData);
    
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', updatedData.theme || 'dark');
    }
  };

  const handleOpenModal = useCallback((setter: (v: boolean) => void) => {
    window.history.pushState({ modalOpen: true }, "");
    setter(true);
  }, []);

  const handleCloseModal = useCallback((setter: (v: boolean) => void) => {
    if (window.history.state?.modalOpen) window.history.back();
    setter(false);
  }, []);

  const handleRelapseSubmit = (reason: string, time: string) => {
    const newRelapse = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      reason,
      timeOfDay: time
    };
    const newData = {
      ...data,
      lastRelapseTimestamp: Date.now(),
      relapses: [newRelapse, ...data.relapses],
      streakFreezes: Math.max(0, data.streakFreezes - 1)
    };
    updateState(newData);
    handleCloseModal(setShowRelapseModal);
    toast({ title: "Neural Protocol Reset", description: "Day One. Stay focused." });
  };

  const handleUrgeSubmit = (intensity: UrgeIntensity) => {
    const newUrge = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      intensity
    };
    const newData = {
      ...data,
      urges: [newUrge, ...data.urges]
    };
    updateState(newData);
    handleCloseModal(setShowUrgeModal);
    toast({ title: "Victory Confirmed", description: "You are mastering your mind." });
  };

  const insights = useMemo(() => getBehavioralInsights(data), [data]);
  const challenge = useMemo(() => getDailyChallenge(data.currentStreak), [data.currentStreak]);

  if (!mounted) return null;

  const isAnySheetOpen = showRelapseModal || showUrgeModal || showExportModal || showInsightsSheet || showEmergencyModal || showCalendarSheet || showBrowserModal;

  return (
    <div className="min-h-screen bg-transparent relative flex flex-col selection:bg-primary/30 overflow-x-hidden no-scrollbar">
      <Scene3D 
        streak={data.currentStreak} 
        theme={data.theme || 'dark'} 
        riskLevel={insights.riskLevel}
        isBlurred={isAnySheetOpen}
      />
      
      {/* Immersive Dimmer */}
      <div className={`fixed inset-0 transition-all duration-700 -z-[5] pointer-events-none ${isAnySheetOpen ? 'bg-black/70 backdrop-blur-md' : 'bg-black/40 backdrop-blur-[1px]'}`} />

      <Header 
        focusMode={data.focusMode} 
        theme={data.theme || 'dark'}
        data={data}
        onThemeChange={(t) => updateState({ ...data, theme: t })}
        onReset={() => { if(confirm("Wipe all neural mastery data?")) { clearData(); setData(INITIAL_DATA); } }}
        onToggleFocus={() => updateState({ ...data, focusMode: !data.focusMode })}
        onShowExport={() => handleOpenModal(setShowExportModal)}
        onUpdateReminder={(e, t) => updateState({ ...data, notificationsEnabled: e, reminderTime: t })}
      />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 max-w-lg mx-auto w-full px-6 flex flex-col gap-8 py-8 pb-40"
      >
        <StreakDisplay 
          current={data.currentStreak} 
          best={data.bestStreak} 
          focusMode={data.focusMode} 
          freezes={data.streakFreezes}
          onUseFreeze={() => {
            if (data.streakFreezes > 0) {
              updateState({ ...data, streakFreezes: data.streakFreezes - 1 });
              toast({ title: "Freeze Activated", description: "Integrity preserved." });
            }
          }}
        />

        <div className="grid grid-cols-1 gap-4 w-full">
           <Button 
            onClick={() => handleOpenModal(setShowBrowserModal)}
            className="h-16 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group flex items-center justify-between px-8"
           >
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
                 <Globe size={20} />
               </div>
               <div className="text-left">
                 <p className="text-white font-bold text-sm">Discipline Browser</p>
                 <p className="text-white/40 text-[9px] uppercase font-black tracking-widest">AI Protected Session</p>
               </div>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[9px] font-black uppercase text-green-500/70">Guardian Online</span>
             </div>
           </Button>
        </div>
        
        <ActionCards 
          onCheckIn={() => {
            const today = new Date().toISOString().split('T')[0];
            if (!data.checkIns.some(c => c.date === today)) {
              updateState({ ...data, checkIns: [{ date: today, timestamp: Date.now() }, ...data.checkIns] });
              toast({ title: "Protocol Marked Clean", description: "Consistency is power." });
            }
          }} 
          onUrge={() => handleOpenModal(setShowUrgeModal)} 
          onRelapse={() => handleOpenModal(setShowRelapseModal)} 
          checkedInToday={data.checkIns.some(c => c.date === new Date().toISOString().split('T')[0])}
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
            whileHover={{ scale: 1.02, y: -4 }}
            className="glass-card p-8 rounded-[3rem] bg-card/20 border-white/5"
          >
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 opacity-80">Daily Mission</h4>
            <p className="text-base font-bold leading-relaxed text-foreground/90">{challenge}</p>
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

      {showRelapseModal && <RelapseModal isOpen={showRelapseModal} onClose={() => handleCloseModal(setShowRelapseModal)} onSubmit={handleRelapseSubmit} />}
      {showUrgeModal && <UrgeModal isOpen={showUrgeModal} onClose={() => handleCloseModal(setShowUrgeModal)} onSubmit={handleUrgeSubmit} />}
      {showInsightsSheet && <InsightsSheet isOpen={showInsightsSheet} onClose={() => handleCloseModal(setShowInsightsSheet)} data={data} defaultTab={insightsTab} />}
      {showCalendarSheet && <CalendarSheet isOpen={showCalendarSheet} onClose={() => handleCloseModal(setShowCalendarSheet)} data={data} onToggleDate={() => {}} onSaveNote={() => {}} />}
      {showEmergencyModal && <EmergencyModal isOpen={showEmergencyModal} onClose={() => handleCloseModal(setShowEmergencyModal)} />}
      {showExportModal && <ExportModal isOpen={showExportModal} onClose={() => handleCloseModal(setShowExportModal)} data={data} onDataImport={() => {}} />}
      {showBrowserModal && <BrowserModal isOpen={showBrowserModal} onClose={() => handleCloseModal(setShowBrowserModal)} streak={data.currentStreak} />}
    </div>
  );
}
