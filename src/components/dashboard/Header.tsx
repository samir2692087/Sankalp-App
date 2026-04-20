"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
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
  Database
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
import { motion } from 'framer-motion';

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

  const runGlobalCleanup = useCallback(() => {
    setTimeout(() => {
      if (typeof document === 'undefined') return;
      document.body.style.pointerEvents = 'auto';
      document.body.style.overflow = 'auto';
    }, 100);
  }, []);

  const themes: { id: AppTheme, name: string, icon: any, bg: string }[] = [
    { id: 'light', name: 'Daylight', icon: Sun, bg: 'bg-white' },
    { id: 'dark', name: 'Eclipse', icon: Moon, bg: 'bg-slate-900' },
    { id: 'purple', name: 'Cosmic', icon: Sparkles, bg: 'bg-purple-950' },
    { id: 'amoled', name: 'Void', icon: Terminal, bg: 'bg-black' },
  ];

  return (
    <>
      <header className="w-full flex items-center justify-between p-6 sticky top-0 z-[50] shrink-0">
        <div className="absolute inset-0 bg-[#0B0F14]/40 backdrop-blur-xl border-b border-white/5 pointer-events-none -z-10" />
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center primary-glow transition-transform group-hover:scale-105">
            <Shield className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-bold text-2xl leading-none tracking-tight">IronWill</h1>
            <span className="text-white/40 font-bold uppercase tracking-[0.2em] text-[8px]">Neural Interface</span>
          </div>
        </div>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="rounded-2xl w-12 h-12 glass-card flex items-center justify-center p-0">
              <Settings size={22} className="text-white/70" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[420px] glass-card border-white/10 p-0 outline-none">
            <div className="bg-white/5 p-8 text-center border-b border-white/5">
              <DialogTitle className="text-2xl font-bold text-white">System Protocols</DialogTitle>
              <DialogDescription className="text-white/40 font-black uppercase tracking-[0.2em] text-[9px] mt-1">Core Calibration</DialogDescription>
            </div>

            <div className="p-6 space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => { setIsThemeSheetOpen(true); setIsSettingsOpen(false); }}
                className="w-full h-16 rounded-2xl flex items-center gap-4 px-4 hover:bg-white/5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center"><Palette size={20} /></div>
                <div className="text-left flex-1"><p className="text-white font-bold text-sm">Visual Identity</p><p className="text-white/40 text-[10px] uppercase font-bold">Theme Calibration</p></div>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => { setIsReminderOpen(true); setIsSettingsOpen(false); }}
                className="w-full h-16 rounded-2xl flex items-center gap-4 px-4 hover:bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center"><Bell size={20} /></div>
                <div className="text-left flex-1"><p className="text-white font-bold text-sm">Neural Alerts</p><p className="text-white/40 text-[10px] uppercase font-bold">Reminder Sync</p></div>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => { onShowExport(); setIsSettingsOpen(false); }}
                className="w-full h-16 rounded-2xl flex items-center gap-4 px-4 hover:bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-500/20 text-slate-400 flex items-center justify-center"><Database size={20} /></div>
                <div className="text-left flex-1"><p className="text-white font-bold text-sm">Archive Matrix</p><p className="text-white/40 text-[10px] uppercase font-bold">Data Storage</p></div>
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => { onToggleFocus(); setIsSettingsOpen(false); }}
                className="w-full h-16 rounded-2xl flex items-center gap-4 px-4 hover:bg-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center"><Zap size={20} /></div>
                <div className="text-left flex-1 flex items-center justify-between"><p className="text-white font-bold text-sm">Focus Flow</p><div className={cn("w-8 h-4 rounded-full p-1", focusMode ? 'bg-primary' : 'bg-white/10')}><div className={cn("w-2 h-2 rounded-full bg-white", focusMode ? 'translate-x-4' : 'translate-x-0')} /></div></div>
              </Button>
              <div className="h-px bg-white/5 my-2" />
              <Button 
                variant="ghost" 
                onClick={() => { onReset(); setIsSettingsOpen(false); }}
                className="w-full h-16 rounded-2xl flex items-center gap-4 px-4 hover:bg-red-500/10 text-red-400"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center"><Trash2 size={20} /></div>
                <div className="text-left flex-1"><p className="font-bold text-sm">Purge Data</p><p className="text-red-500/40 text-[10px] uppercase font-bold">Irreversible Reset</p></div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Sheet open={isThemeSheetOpen} onOpenChange={setIsThemeSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[2.5rem] bg-[#0B0F14]/95 backdrop-blur-xl border-white/10 p-8 pb-12 outline-none">
          <SheetHeader className="mb-8">
            <SheetTitle className="text-white font-bold text-2xl text-center">Neural Identity</SheetTitle>
            <SheetDescription className="text-white/40 text-center uppercase tracking-widest text-[10px] font-bold">Select environment aesthetic</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((t) => (
              <button 
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={cn(
                  "p-4 rounded-[1.5rem] flex flex-col gap-3 text-left border-2 transition-all",
                  theme === t.id ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'border-transparent bg-white/5'
                )}
              >
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", t.bg)}>
                  <t.icon size={18} className="text-white" />
                </div>
                <span className="text-white font-bold text-xs uppercase tracking-widest">{t.name}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {isReminderOpen && (
        <ReminderModal 
          isOpen={isReminderOpen} 
          onClose={() => setIsReminderOpen(false)} 
          enabled={data.notificationsEnabled} 
          time={data.reminderTime} 
          onUpdate={onUpdateReminder} 
        />
      )}
    </>
  );
}