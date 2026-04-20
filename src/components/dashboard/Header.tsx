"use client";

import { useState, useEffect, useCallback } from 'react';
import { Settings, Download, Trash2, Palette, Sun, Moon, Sparkles, Terminal, Shield, Zap, Bell, ArrowLeft, Check, X as CloseIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
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
            "theme-card p-4 rounded-3xl flex flex-col gap-3 text-left border-2 relative overflow-hidden",
            theme === t.id ? 'active border-primary bg-primary/5' : 'border-transparent bg-muted/30'
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
          <span className="font-bold text-xs uppercase tracking-widest">{t.name}</span>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className="w-full flex items-center justify-between p-6 sticky top-0 z-[50] backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 group cursor-pointer transition-transform hover:scale-110 active:scale-95">
            <Shield className="text-primary-foreground" size={18} />
          </div>
          <h1 className="text-xl font-bold font-headline leading-none text-foreground">IronWill</h1>
        </div>

        <DropdownMenu open={isSettingsOpen} onOpenChange={(open) => {
          setIsSettingsOpen(open);
          if (!open) runGlobalCleanup();
        }}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="rounded-xl p-2 h-10 w-10 neu-button border-none bg-card flex items-center justify-center outline-none">
              <Settings size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" className="glass-card rounded-[2rem] border-none shadow-2xl p-2 min-w-[240px] z-[9999]">
              <DropdownMenuLabel className="font-headline p-3 text-center text-[10px] uppercase tracking-widest opacity-50">Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="opacity-10" />
              
              <DropdownMenuItem onSelect={() => setIsThemeSheetOpen(true)} className="rounded-xl p-3 gap-3 cursor-pointer">
                <Palette size={18} /> <span className="font-bold text-sm">Themes</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setIsReminderOpen(true)} className="rounded-xl p-3 gap-3 cursor-pointer">
                <Bell size={18} /> <span className="font-bold text-sm">Reminders</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onShowExport} className="rounded-xl p-3 gap-3 cursor-pointer">
                <Download size={18} /> <span className="font-bold text-sm">Export Data</span>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onToggleFocus} className="rounded-xl p-3 justify-between cursor-pointer">
                <div className="flex items-center gap-3"><Zap size={18} /> <span className="font-bold text-sm">Focus Mode</span></div>
                <div className={cn("w-8 h-4 rounded-full p-1 transition-all", focusMode ? 'bg-primary' : 'bg-muted')}>
                  <div className={cn("w-2 h-2 rounded-full bg-white transition-all", focusMode ? 'translate-x-4' : 'translate-x-0')} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="opacity-10" />
              <DropdownMenuItem onSelect={onReset} className="rounded-xl p-3 gap-3 cursor-pointer text-red-500 hover:bg-red-500/10">
                <Trash2 size={18} /> <span className="font-bold text-xs uppercase tracking-widest">Wipe Data</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </header>

      <Sheet open={isThemeSheetOpen} onOpenChange={(open) => {
        setIsThemeSheetOpen(open);
        if (!open) runGlobalCleanup();
      }}>
        <SheetContent side="bottom" className="rounded-t-[3.5rem] glass-card border-none p-8 pb-12 outline-none">
          <SheetHeader className="mb-8 relative">
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => setIsThemeSheetOpen(false)} 
              className="absolute left-0 top-0 p-0 h-auto hover:bg-transparent"
            >
              <ArrowLeft size={24} />
            </Button>
            <SheetTitle className="text-2xl font-bold font-headline text-center">Visual Identity</SheetTitle>
            <SheetDescription className="text-center font-medium">Choose your focus environment.</SheetDescription>
            <Button 
              type="button"
              variant="ghost" 
              onClick={() => setIsThemeSheetOpen(false)} 
              className="absolute right-0 top-0 p-0 h-auto hover:bg-transparent"
            >
              <CloseIcon size={24} />
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