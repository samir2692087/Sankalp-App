
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Header from '@/components/dashboard/Header';
import ClockBar from '@/components/dashboard/ClockBar';
import StreakDisplay from '@/components/dashboard/StreakDisplay';
import ActionCards from '@/components/dashboard/ActionCards';
import InsightsSummary from '@/components/dashboard/InsightsSummary';
import JourneyTimeline from '@/components/dashboard/JourneyTimeline';
import RelapseModal from '@/components/modals/RelapseModal';
import UrgeModal from '@/components/modals/UrgeModal';
import ExportModal from '@/components/modals/ExportModal';
import InsightsSheet from '@/components/modals/InsightsSheet';
import EmergencyModal from '@/components/modals/EmergencyModal';
import CalendarSheet from '@/components/modals/CalendarSheet';
import ClarityLibrary from '@/components/modals/ClarityLibrary';
import LaunchScreen from '@/components/layout/LaunchScreen';
import FAB from '@/components/dashboard/FAB';
import SankalpIcon from '@/components/icons/SankalpIcon';
import { UserData, INITIAL_DATA, UrgeIntensity } from '@/lib/types';
import { getStoredData, saveData, clearData } from '@/lib/storage';
import { 
  calculateStreak, 
  calculateDisciplineScore, 
  getBehavioralInsights,
  getDailyChallenge,
  calculateXP,
  calculateLevel
} from '@/lib/discipline-engine';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Magnetic from '@/components/interactions/Magnetic';
import Tilt from '@/components/interactions/Tilt';
import Parallax from '@/components/interactions/Parallax';
import Proximity from '@/components/interactions/Proximity';
import Draggable from '@/components/interactions/Draggable';
import { useInteraction } from '@/context/InteractionContext';
import { feedback } from '@/lib/feedback-engine';
import { cn } from '@/lib/utils';

const Scene3D = dynamic(() => import('@/components/background/Scene3D'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-[#05070a]" /> 
});

const springConfig = { type: "spring", stiffness: 100, damping: 20 };

export default function SankalpOverview() {
  const { toast } = useToast();
  const { triggerPulse, setMode, mode, recordInteraction } = useInteraction();
  const [data, setData] = useState<UserData>(INITIAL_DATA);
  const [showRelapseModal, setShowRelapseModal] = useState(false);
  const [showUrgeModal, setShowUrgeModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInsightsSheet, setShowInsightsSheet] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showCalendarSheet, setShowCalendarSheet] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [insightsTab, setInsightsTab] = useState('milestones');
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredData();
    const syncData = () => {
      const newData = { ...stored };
      newData.currentStreak = calculateStreak(newData.lastRelapseTimestamp);
      if (newData.currentStreak > (newData.bestStreak || 0)) {
        newData.bestStreak = newData.currentStreak;
      }
      newData.disciplineScore = calculateDisciplineScore(newData);
      newData.xp = calculateXP(newData);
      newData.level = calculateLevel(newData.xp);
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
    updatedData.xp = calculateXP(updatedData);
    updatedData.level = calculateLevel(updatedData.xp);
    setData(updatedData);
    saveData(updatedData);
  };

  const handleOpenModal = useCallback((setter: (v: boolean) => void) => {
    triggerPulse(0.3);
    feedback.tap();
    window.history.pushState({ modalOpen: true }, "");
    setter(true);
  }, [triggerPulse]);

  const handleCloseModal = useCallback((setter: (v: boolean) => void) => {
    triggerPulse(0.2);
    feedback.tap();
    if (window.history.state?.modalOpen) window.history.back();
    setter(false);
  }, [triggerPulse]);

  const handleRelapseSubmit = (reason: string, time: string) => {
    feedback.warning();
    triggerPulse(0.8);
    recordInteraction('relapse');
    const newRelapse = { id: Date.now().toString(), timestamp: Date.now(), reason, timeOfDay: time };
    const newData = { 
      ...data, 
      lastRelapseTimestamp: Date.now(), 
      relapses: [newRelapse, ...(Array.isArray(data.relapses) ? data.relapses : [])], 
      streakFreezes: Math.max(0, (data.streakFreezes || 0) - 1) 
    };
    updateState(newData);
    handleCloseModal(setShowRelapseModal);
    toast({ title: "Stay aware", description: "Return to your resolve." });
  };

  const handleUrgeSubmit = (intensity: UrgeIntensity) => {
    feedback.success();
    triggerPulse(0.6);
    recordInteraction('urge');
    const newUrge = { id: Date.now().toString(), timestamp: Date.now(), intensity };
    const newData = { 
      ...data, 
      urges: [newUrge, ...(Array.isArray(data.urges) ? data.urges : [])] 
    };
    updateState(newData);
    handleCloseModal(setShowUrgeModal);
    toast({ title: "Strength held", description: "You are in control. Resolve earned." });
  };

  const insights = useMemo(() => getBehavioralInsights(data), [data]);
  const challenge = useMemo(() => getDailyChallenge(data.currentStreak), [data.currentStreak]);

  useEffect(() => {
    if (insights.riskLevel === 'CRITICAL') {
      setMode('risk');
    } else if (data.focusMode) {
      setMode('focus');
    } else {
      setMode('calm');
    }
  }, [insights.riskLevel, data.focusMode, setMode]);

  if (!mounted) return null;

  const isAnySheetOpen = showRelapseModal || showUrgeModal || showExportModal || showInsightsSheet || showEmergencyModal || showCalendarSheet || showLibrary;

  const xpProgress = (data.xp % 100);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LaunchScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <div className={cn(
        "min-h-screen relative flex flex-col selection:bg-primary/30 overflow-x-hidden no-scrollbar transition-all duration-1000",
        mode === 'risk' ? 'bg-red-950/20' : 'bg-transparent'
      )}>
        <Scene3D 
          isBlurred={isAnySheetOpen || isLoading}
        />
        
        <div className={cn(
          "fixed inset-0 transition-all duration-1000 -z-[5] pointer-events-none",
          isAnySheetOpen ? 'bg-black/60 backdrop-blur-md' : 'bg-black/20',
          mode === 'risk' && 'bg-red-950/30'
        )} />

        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1, z: 100 }}
            animate={{ opacity: 1, scale: 1, z: 0 }}
            transition={{ ...springConfig, duration: 1.2 }}
            className="flex flex-col flex-1"
          >
            <ClockBar />
            
            <Header 
              focusMode={data.focusMode} 
              theme={data.theme || 'dark'}
              data={data}
              onThemeChange={(t) => {
                feedback.tap();
                recordInteraction('theme');
                updateState({ ...data, theme: t });
              }}
              onReset={() => { 
                feedback.warning();
                if(confirm("Erase all progress and return to Day 0?")) { clearData(); setData(INITIAL_DATA); } 
              }}
              onToggleFocus={() => {
                feedback.tap();
                recordInteraction('focus_toggle');
                updateState({ ...data, focusMode: !data.focusMode });
              }}
              onShowExport={() => handleOpenModal(setShowExportModal)}
              onUpdateReminder={(e, t) => {
                feedback.tap();
                updateState({ ...data, notificationsEnabled: e, reminderTime: t });
              }}
            />

            <motion.main 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.2 }}
              className={cn(
                "flex-1 max-w-lg mx-auto w-full px-6 flex flex-col gap-8 py-8 pb-40 transition-all duration-700",
                mode === 'focus' ? 'gap-4' : 'gap-8'
              )}
            >
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex items-center justify-between px-2 mb-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Resolve Level</span>
                    <span className="text-sm font-black text-white">Level {data.level}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{data.xp} Resolve Points</span>
                  <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${xpProgress}%` }}
                      className="h-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                    />
                  </div>
                </div>
              </motion.div>

              <Draggable>
                <Parallax offset={15}>
                  <StreakDisplay 
                    current={data.currentStreak} 
                    best={data.bestStreak} 
                    focusMode={data.focusMode} 
                    freezes={data.streakFreezes}
                    onUseFreeze={() => {
                      if (data.streakFreezes > 0) {
                        feedback.success();
                        triggerPulse(0.5);
                        recordInteraction('freeze');
                        updateState({ ...data, streakFreezes: data.streakFreezes - 1 });
                        toast({ title: "Pause used", description: "Resolve held for 24 hours." });
                      }
                    }}
                  />
                </Parallax>
              </Draggable>

              {mode === 'risk' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 flex flex-col gap-4 shadow-[0_20px_40px_rgba(239,68,68,0.15)]"
                >
                  <div className="flex items-center gap-3 text-red-500">
                    <SankalpIcon size={24} className="animate-pulse" />
                    <h3 className="font-bold uppercase tracking-widest text-sm">Vulnerability High</h3>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    Stay aware: Risk detected. Pause, breathe, and return to your center.
                  </p>
                  <Button 
                    onClick={() => handleOpenModal(setShowEmergencyModal)}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-xl"
                  >
                    Control Mode
                  </Button>
                </motion.div>
              )}

              <JourneyTimeline currentStreak={data.currentStreak} />

              <div className="grid grid-cols-2 gap-4">
                <Proximity range={300}>
                  <Magnetic strength={0.3}>
                    <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                      <Button 
                        onClick={() => handleOpenModal(setShowEmergencyModal)}
                        className="h-24 w-full rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group flex flex-col items-center justify-center gap-2 p-0"
                      >
                        <SankalpIcon size={24} className="text-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
                        <span className="text-white/80 font-bold text-xs">Control Mode</span>
                      </Button>
                    </motion.div>
                  </Magnetic>
                </Proximity>

                <Proximity range={300}>
                  <Magnetic strength={0.3}>
                    <motion.div whileHover={{ scale: 1.02, y: -5 }}>
                      <Button 
                        onClick={() => handleOpenModal(setShowLibrary)}
                        className="h-24 w-full rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all group flex flex-col items-center justify-center gap-2 p-0"
                      >
                        <BookOpen size={24} className="text-amber-400 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]" />
                        <span className="text-white/80 font-bold text-xs">Clarity Hub</span>
                      </Button>
                    </motion.div>
                  </Magnetic>
                </Proximity>
              </div>
              
              <ActionCards 
                onCheckIn={() => {
                  const today = new Date().toISOString().split('T')[0];
                  if (!(Array.isArray(data.checkIns) && data.checkIns.some(c => c.date === today))) {
                    feedback.success();
                    triggerPulse(0.4);
                    recordInteraction('checkin');
                    updateState({ 
                      ...data, 
                      checkIns: [{ date: today, timestamp: Date.now() }, ...(Array.isArray(data.checkIns) ? data.checkIns : [])] 
                    });
                    toast({ title: "Checked in", description: "Commitment held. Strength earned." });
                  }
                }} 
                onUrge={() => handleOpenModal(setShowUrgeModal)} 
                onRelapse={() => handleOpenModal(setShowRelapseModal)} 
                checkedInToday={Array.isArray(data.checkIns) && data.checkIns.some(c => c.date === new Date().toISOString().split('T')[0])}
              />

              <Tilt strength={8}>
                <InsightsSummary 
                  score={data.disciplineScore} 
                  resilience={insights.resilienceLevel}
                  riskLevel={insights.riskLevel}
                  message={insights.protectionMessage}
                  onOpenInsights={(tab) => {
                    feedback.tap();
                    if (tab === 'history') handleOpenModal(setShowCalendarSheet);
                    else { setInsightsTab(tab); handleOpenModal(setShowInsightsSheet); }
                  }}
                  focusMode={data.focusMode}
                />
              </Tilt>

              {mode !== 'focus' && (
                <Parallax offset={10}>
                  <Draggable>
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -10, rotateX: 2 }}
                      transition={springConfig}
                      className="glass-card p-8 rounded-[3rem] bg-card/20 border-white/5 perspective-1000"
                    >
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3 opacity-60">Mastery Action</h4>
                      <p className="text-lg font-bold leading-relaxed text-foreground/90">{challenge}</p>
                    </motion.div>
                  </Draggable>
                </Parallax>
              )}
            </motion.main>

            <AnimatePresence>
              {!isAnySheetOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                  <FAB 
                    onOpenInsights={(tab) => {
                      feedback.tap();
                      if (tab === 'history') handleOpenModal(setShowCalendarSheet);
                      else { setInsightsTab(tab); handleOpenModal(setShowInsightsSheet); }
                    }}
                    onOpenEmergency={() => handleOpenModal(setShowEmergencyModal)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        <Toaster />

        {showRelapseModal && <RelapseModal isOpen={showRelapseModal} onClose={() => handleCloseModal(setShowRelapseModal)} onSubmit={handleRelapseSubmit} />}
        {showUrgeModal && <UrgeModal isOpen={showUrgeModal} onClose={() => handleCloseModal(setShowUrgeModal)} onSubmit={handleUrgeSubmit} />}
        {showInsightsSheet && <InsightsSheet isOpen={showInsightsSheet} onClose={() => handleCloseModal(setShowInsightsSheet)} data={data} defaultTab={insightsTab} />}
        {showCalendarSheet && <CalendarSheet isOpen={showCalendarSheet} onClose={() => handleCloseModal(setShowCalendarSheet)} data={data} onToggleDate={() => {}} onSaveNote={() => {}} />}
        {showEmergencyModal && <EmergencyModal isOpen={showEmergencyModal} onClose={() => handleCloseModal(setShowEmergencyModal)} />}
        {showExportModal && <ExportModal isOpen={showExportModal} onClose={() => handleCloseModal(setShowExportModal)} data={data} onDataImport={() => {}} />}
        {showLibrary && <ClarityLibrary isOpen={showLibrary} onClose={() => handleCloseModal(setShowLibrary)} />}
      </div>
    </>
  );
}
