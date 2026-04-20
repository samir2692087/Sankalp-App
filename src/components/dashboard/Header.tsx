
"use client";

import { useState, useCallback } from 'react';
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

const physicsConfig = { type: "spring", stiffness: 120, damping: 14, mass: 1 };

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
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const themes: { id: AppTheme, name: string, icon: any, bg: string }[] = [
    { id: 'light', name: 'Daylight', icon: Sun, bg: 'bg-white' },
    { id: 'dark', name: 'Eclipse', icon: Moon, bg: 'bg-slate-900' },
    { id: 'purple', name: 'Cosmic', icon: Sparkles, bg: 'bg-purple-950' },
    { id: 'amoled', name: 'Void', icon: Terminal, bg: 'bg-black' },
  ];

  return (
    <>
      <header className="w-full flex items-center justify-between p-8 sticky top-0 z-[50] shrink-0">
        <div className="absolute inset-0 bg-[#0B0F14]/60 backdrop-blur-2xl border-b border-white/5 pointer-events-none -z-10" />
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={physicsConfig}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <div className="w-13 h-13 bg-primary rounded-2xl flex items-center justify-center primary-glow transition-all group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
            <Shield className="text-white" size={26} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-black text-2xl leading-none tracking-tighter">IronWill</h1>
            <span className="text-white/30 font-black uppercase tracking-[0.3em] text-[8px]">Neural Interface v2.5</span>
          </div>
        </motion.div>

        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9, rotate: -15 }} transition={physicsConfig}>
              <Button variant="ghost" className="rounded-2xl w-14 h-14 glass-card flex items-center justify-center p-0 border-white/10">
                <Settings size={24} className="text-white/80" />
              </Button>
            </motion.div>
          </DialogTrigger>
          <DialogContent className="max-w-[440px] glass-card border-white/10 p-0 outline-none overflow-hidden rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <div className="bg-white/[0.02] p-10 text-center border-b border-white/5">
              <DialogTitle className="text-2xl font-black text-white tracking-tight">System Core</DialogTitle>
              <DialogDescription className="text-white/30 font-black uppercase tracking-[0.25em] text-[9px] mt-1">Calibration Protocols</DialogDescription>
            </div>

            <div className="p-8 space-y-3">
              {[
                { label: 'Visual Persona', sub: 'Theme Calibration', icon: Palette, color: 'bg-purple-500/20 text-purple-400', action: () => { setIsThemeSheetOpen(true); setIsSettingsOpen(false); } },
                { label: 'Neural Alerts', sub: 'Reminder Sync', icon: Bell, color: 'bg-blue-500/20 text-blue-400', action: () => { setIsReminderOpen(true); setIsSettingsOpen(false); } },
                { label: 'Archive Matrix', sub: 'Data Management', icon: Database, color: 'bg-slate-500/20 text-slate-400', action: () => { onShowExport(); setIsSettingsOpen(false); } },
                { label: 'Focus Flow', sub: focusMode ? 'Active' : 'Standby', icon: Zap, color: 'bg-yellow-500/20 text-yellow-400', action: () => { onToggleFocus(); setIsSettingsOpen(false); }, isToggle: true },
              ].map((item, idx) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...physicsConfig, delay: idx * 0.05 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={item.action}
                    className="w-full h-18 rounded-[1.8rem] flex items-center gap-5 px-5 hover:bg-white/[0.04] transition-all group border border-transparent hover:border-white/5"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", item.color)}>
                      <item.icon size={22} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-white font-bold text-sm">{item.label}</p>
                      <p className="text-white/30 text-[9px] uppercase font-black tracking-widest">{item.sub}</p>
                    </div>
                    {item.isToggle && (
                      <div className={cn("w-10 h-5 rounded-full p-1 transition-all duration-500", focusMode ? 'bg-primary' : 'bg-white/10')}>
                        <motion.div 
                          animate={{ x: focusMode ? 20 : 0 }}
                          transition={physicsConfig}
                          className="w-3 h-3 rounded-full bg-white shadow-lg" 
                        />
                      </div>
                    )}
                  </Button>
                </motion.div>
              ))}
              
              <div className="h-px bg-white/5 my-4" />
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...physicsConfig, delay: 0.3 }}>
                <Button 
                  variant="ghost" 
                  onClick={() => { onReset(); setIsSettingsOpen(false); }}
                  className="w-full h-18 rounded-[1.8rem] flex items-center gap-5 px-5 hover:bg-red-500/10 text-red-500 group border border-transparent hover:border-red-500/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                    <Trash2 size={22} />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-bold text-sm">Purge Core</p>
                    <p className="text-red-500/30 text-[9px] uppercase font-black tracking-widest">Irreversible Reset</p>
                  </div>
                </Button>
              </motion.div>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <Sheet open={isThemeSheetOpen} onOpenChange={setIsThemeSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[4rem] bg-[#07070a]/95 backdrop-blur-3xl border-white/10 p-10 pb-16 outline-none">
          <SheetHeader className="mb-10">
            <SheetTitle className="text-white font-black text-3xl text-center tracking-tighter">Neural Skin</SheetTitle>
            <SheetDescription className="text-white/30 text-center uppercase tracking-[0.3em] text-[10px] font-black">Environmental Aesthetic calibration</SheetDescription>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-5 max-w-xl mx-auto">
            {themes.map((t) => (
              <motion.button 
                key={t.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={physicsConfig}
                onClick={() => onThemeChange(t.id)}
                className={cn(
                  "p-6 rounded-[2.2rem] flex flex-col gap-4 text-left border-2 transition-all group",
                  theme === t.id 
                    ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(168,85,247,0.3)]' 
                    : 'border-white/5 bg-white/[0.03] hover:border-white/20'
                )}
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12", t.bg)}>
                  <t.icon size={20} className={cn(t.id === 'light' ? 'text-blue-500' : 'text-white')} />
                </div>
                <span className="text-white font-black text-xs uppercase tracking-[0.2em]">{t.name}</span>
              </motion.button>
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
