
"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  Download, 
  Trash2, 
  Palette, 
  Sun, 
  Moon, 
  Sparkles, 
  Terminal, 
  Shield, 
  Zap, 
  Bell, 
  ArrowLeft, 
  Check, 
  X as CloseIcon,
  Layout,
  Database,
  Eye,
  Activity
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppTheme, UserData } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import ReminderModal from '@/components/modals/ReminderModal';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  focusMode: boolean;
  theme: AppTheme;
  data: UserData;
  onThemeChange: (theme: AppTheme) => void;
  onReset: () => void;
  onToggleFocus: () => void;
  onShowExport: () => void;
  onUpdateReminder: (enabled: boolean, time: string) => void;
}

export default function Header({ 
  focusMode, 
  theme, 
  data, 
  onThemeChange, 
  onReset, 
  onToggleFocus, 
  onShowExport,
  onUpdateReminder
}: HeaderProps) {
  const isMobile = useIsMobile();
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Global Interaction Cleanup Trigger
  const runGlobalCleanup = useCallback(() => {
    setTimeout(() => {
      if (typeof document === 'undefined') return;
      const activeOverlays = document.querySelectorAll('[role="dialog"], [data-state="open"]');
      if (activeOverlays.length === 0) {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.body.removeAttribute('data-scroll-locked');
        document.documentElement.style.pointerEvents = 'auto';
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (!isThemeSheetOpen && !isSettingsOpen && !isReminderOpen) {
      runGlobalCleanup();
    }
  }, [isThemeSheetOpen, isSettingsOpen, isReminderOpen, runGlobalCleanup]);

  const themes: { id: AppTheme, name: string, icon: any, bg: string, accent: string }[] = [
    { id: 'light', name: 'Daylight', icon: Sun, bg: 'bg-white', accent: 'bg-primary' },
    { id: 'dark', name: 'Eclipse', icon: Moon, bg: 'bg-slate-900', accent: 'bg-primary' },
    { id: 'purple', name: 'Cosmic', icon: Sparkles, bg: 'bg-purple-950', accent: 'bg-purple-500' },
    { id: 'amoled', name: 'Void', icon: Terminal, bg: 'bg-black', accent: 'bg-white' },
  ];

  const ThemeCards = () => (
    <div className="grid grid-cols-2 gap-4">
      {themes.map((t) => (
        <button 
          key={t.id}
          type="button"
          onClick={() => {
            onThemeChange(t.id);
            if (isMobile) setIsThemeSheetOpen(false);
          }}
          className={cn(
            "theme-card p-4 rounded-3xl flex flex-col gap-3 text-left border-2 relative overflow-hidden transition-all duration-300",
            theme === t.id ? 'active border-primary bg-primary/20 scale-105 shadow-[0_0_20px_rgba(124,58,237,0.3)]' : 'border-transparent bg-white/5'
          )}
        >
          {theme === t.id && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
              <Check size={12} className="text-white" />
            </div>
          )}
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg", t.bg)}>
            <t.icon size={18} className={t.id === 'light' ? 'text-orange-400' : 'text-white'} />
          </div>
          <span className="text-white font-bold text-[10px] uppercase tracking-widest">{t.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className="w-full flex items-center justify-between p-6 sticky top-0 z-[50] shrink-0">
        <div className="absolute inset-0 bg-background/30 backdrop-blur-xl border-b border-white/5 pointer-events-none -z-10" />
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-transform group-hover:scale-110 active:scale-95">
            <Shield className="text-primary-foreground" size={18} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-bold text-xl leading-none">IronWill</h1>
            <span className="text-white/50 font-bold uppercase tracking-widest text-[8px]">Neural Mastery</span>
          </div>
        </div>

        <Dialog open={isSettingsOpen} onOpenChange={(open) => {
          setIsSettingsOpen(open);
          if (!open) runGlobalCleanup();
        }}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" className="rounded-xl p-2 h-10 w-10 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center">
              <Settings size={20} className="text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[420px] rounded-[2.5rem] bg-[rgba(20,20,25,0.95)] backdrop-blur-[10px] border border-white/10 p-0 overflow-hidden outline-none shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-in zoom-in-95 fade-in duration-200 pointer-events-auto">
            <div className="bg-white/5 p-8 text-center border-b border-white/5 relative shrink-0">
              <DialogTitle className="text-2xl font-bold text-white font-headline">Neural Protocols</DialogTitle>
              <DialogDescription className="text-white/40 font-black uppercase tracking-[0.2em] text-[9px] mt-1">Control Center Matrix</DialogDescription>
            </div>

            <div className="p-6 space-y-3">
              {/* Option: Visual Identity */}
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setIsThemeSheetOpen(true); setIsSettingsOpen(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
                  <Palette size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Visual Identity</p>
                  <p className="text-white/40 text-[10px] uppercase font-black">Calibrate neural themes</p>
                </div>
              </motion.button>

              {/* Option: Alerts */}
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setIsReminderOpen(true); setIsSettingsOpen(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all">
                  <Bell size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Neural Alerts</p>
                  <p className="text-white/40 text-[10px] uppercase font-black">Reminder synchronization</p>
                </div>
              </motion.button>

              {/* Option: Archive */}
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onShowExport(); setIsSettingsOpen(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-400 group-hover:shadow-[0_0_15px_rgba(148,163,184,0.3)] transition-all">
                  <Database size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Archive Matrix</p>
                  <p className="text-white/40 text-[10px] uppercase font-black">Backup & Restore logs</p>
                </div>
              </motion.button>

              {/* Option: Focus Flow */}
              <motion.button 
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onToggleFocus(); setIsSettingsOpen(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all">
                  <Zap size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-sm">Focus Flow</p>
                    <div className={cn("w-8 h-4 rounded-full p-1 transition-all", focusMode ? 'bg-primary' : 'bg-white/20')}>
                      <div className={cn("w-2 h-2 rounded-full bg-white transition-all", focusMode ? 'translate-x-4' : 'translate-x-0')} />
                    </div>
                  </div>
                  <p className="text-white/40 text-[10px] uppercase font-black">Minimalist interface active</p>
                </div>
              </motion.button>

              <div className="h-px bg-white/5 my-2" />

              {/* Option: Purge */}
              <motion.button 
                whileHover={{ backgroundColor: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.3)", x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { onReset(); setIsSettingsOpen(false); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all border border-transparent text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all">
                  <Trash2 size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-bold text-sm">Purge Mastery Data</p>
                  <p className="text-red-400/50 text-[10px] uppercase font-black">Irreversible data reset</p>
                </div>
              </motion.button>
            </div>
            <div className="h-6" />
          </DialogContent>
        </Dialog>
      </header>

      <Sheet open={isThemeSheetOpen} onOpenChange={(open) => {
        setIsThemeSheetOpen(open);
        if (!open) runGlobalCleanup();
      }}>
        <SheetContent side="bottom" className="rounded-t-[3.5rem] bg-[rgba(20,20,25,0.98)] backdrop-blur-xl border-white/10 p-8 pb-12 outline-none">
          <SheetHeader className="mb-8 relative">
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => setIsThemeSheetOpen(false)} 
              className="absolute left-0 top-0 p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft size={24} className="text-white" />
            </Button>
            <SheetTitle className="text-white font-bold text-2xl text-center font-headline">Neural Identity</SheetTitle>
            <SheetDescription className="text-white/40 font-black uppercase tracking-[0.2em] text-[9px] text-center mt-1">Calibrate your focus environment</SheetDescription>
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => setIsThemeSheetOpen(false)} 
              className="absolute right-0 top-0 p-0 h-auto hover:bg-transparent"
            >
              <CloseIcon size={24} className="text-white" />
            </Button>
          </SheetHeader>
          <ThemeCards />
        </SheetContent>
      </Sheet>

      {isReminderOpen && (
        <ReminderModal 
          isOpen={isReminderOpen} 
          onClose={() => {
            setIsReminderOpen(false);
            runGlobalCleanup();
          }} 
          enabled={data.notificationsEnabled} 
          time={data.reminderTime} 
          onUpdate={onUpdateReminder} 
        />
      )}
    </>
  );
}

