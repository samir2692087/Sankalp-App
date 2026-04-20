"use client";

import { useState, useEffect, useCallback } from 'react';
import { Settings, Download, Trash2, Palette, Sun, Moon, Sparkles, Terminal, Shield, Zap, ChevronRight, Check, ArrowLeft, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppTheme, UserData } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface HeaderProps {
  focusMode: boolean;
  theme: AppTheme;
  data: UserData;
  onThemeChange: (theme: AppTheme) => void;
  onReset: () => void;
  onToggleFocus: () => void;
  onShowExport: () => void;
}

export default function Header({ focusMode, theme, data, onThemeChange, onReset, onToggleFocus, onShowExport }: HeaderProps) {
  const isMobile = useIsMobile();
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);

  // Robust interaction cleanup for the theme sheet
  useEffect(() => {
    if (!isThemeSheetOpen) {
      const cleanup = () => {
        document.body.style.pointerEvents = 'auto';
        document.body.style.overflow = 'auto';
        document.documentElement.style.pointerEvents = 'auto';
        document.documentElement.style.overflow = 'auto';
      };
      
      cleanup();
      const timer = setTimeout(cleanup, 300);
      return () => clearTimeout(timer);
    }
  }, [isThemeSheetOpen]);

  useEffect(() => {
    const handlePopState = () => {
      setIsThemeSheetOpen(false);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openThemeSheet = () => {
    window.history.pushState({ themeSheetOpen: true }, "");
    setIsThemeSheetOpen(true);
  };

  const closeThemeSheet = () => {
    if (window.history.state?.themeSheetOpen) {
      window.history.back();
    }
    setIsThemeSheetOpen(false);
  };

  const themes: { id: AppTheme, name: string, icon: any, bg: string, accent: string }[] = [
    { id: 'light', name: 'Daylight', icon: Sun, bg: 'bg-white', accent: 'bg-primary' },
    { id: 'dark', name: 'Eclipse', icon: Moon, bg: 'bg-slate-900', accent: 'bg-primary' },
    { id: 'purple', name: 'Cosmic', icon: Sparkles, bg: 'bg-purple-950', accent: 'bg-purple-500' },
    { id: 'amoled', name: 'Void', icon: Terminal, bg: 'bg-black', accent: 'bg-white' },
  ];

  const ThemeCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
      {themes.map((t) => (
        <button 
          key={t.id}
          onClick={() => {
            onThemeChange(t.id);
            if (isMobile) {
              setTimeout(closeThemeSheet, 150);
            }
          }}
          className={cn(
            "theme-card group relative p-5 rounded-[2rem] flex flex-col gap-3 text-left outline-none",
            theme === t.id ? 'active bg-primary/5' : 'bg-muted/30 hover:bg-primary/5'
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 transition-transform group-hover:scale-110",
              t.bg
            )}>
              <t.icon size={22} className={t.id === 'light' ? 'text-orange-400' : 'text-white'} />
            </div>
            {theme === t.id && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-300">
                <Check size={14} className="text-primary-foreground" />
              </div>
            )}
          </div>
          
          <div>
            <span className="font-bold block text-base tracking-tight">{t.name}</span>
            <div className="flex gap-1.5 mt-2">
              <div className={cn("w-4 h-4 rounded-full border border-white/10 shadow-sm", t.bg)} />
              <div className={cn("w-4 h-4 rounded-full shadow-sm", t.accent)} />
            </div>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className="w-full flex items-center justify-between p-4 sm:p-6 sticky top-0 z-[50] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group cursor-pointer transition-transform hover:scale-110 active:scale-95">
            <Shield className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-headline leading-none">IronWill</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground leading-none mt-1">Discipline Pro</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu modal={true}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-2xl p-2 neu-button h-10 sm:h-12 flex items-center gap-2 px-4 sm:px-5 group outline-none border-none">
                <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="hidden sm:inline font-bold uppercase text-xs tracking-widest">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent 
                align="end" 
                sideOffset={10}
                className="glass-card rounded-[2.5rem] border-none shadow-2xl p-3 min-w-[280px] z-[9999] animate-in fade-in zoom-in-95 duration-200"
              >
                <DropdownMenuLabel className="font-headline p-4 text-center opacity-70">Configuration</DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-10" />
                
                <DropdownMenuItem 
                  onSelect={openThemeSheet}
                  className="rounded-2xl p-4 cursor-pointer flex items-center justify-between hover:bg-primary/5 focus:bg-primary/5 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <Palette size={20} />
                    <span className="font-bold">Visual Themes</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onShowExport} className="rounded-2xl p-4 cursor-pointer flex items-center gap-3 hover:bg-primary/5 focus:bg-primary/5 outline-none">
                  <Download size={20} className="text-secondary" />
                  <span className="font-bold">Export Center</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onToggleFocus} className="rounded-2xl p-4 cursor-pointer flex items-center justify-between hover:bg-primary/5 focus:bg-primary/5 outline-none">
                  <div className="flex items-center gap-3">
                    <Zap size={20} className={focusMode ? 'text-primary' : ''} />
                    <span className="font-bold">Focus Mode</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full p-1 transition-all ${focusMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-all ${focusMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="opacity-10" />
                
                <DropdownMenuItem onClick={onReset} className="rounded-2xl p-4 cursor-pointer flex items-center gap-3 text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 outline-none">
                  <Trash2 size={20} />
                  <span className="font-bold uppercase text-xs tracking-widest">Hard Reset</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </header>

      <Sheet open={isThemeSheetOpen} onOpenChange={setIsThemeSheetOpen}>
        <SheetContent 
          side={isMobile ? "bottom" : "right"} 
          className={cn(
            "theme-sheet glass-card border-none z-[10000] p-8 pb-12",
            isMobile ? "rounded-t-[3.5rem]" : "rounded-l-[3.5rem] max-w-md"
          )}
        >
          <div className="theme-sheet-handle" />
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={closeThemeSheet} className="p-0 h-auto hover:bg-transparent">
              <ArrowLeft size={24} />
            </Button>
            <SheetTitle className="text-2xl font-bold font-headline text-center flex-1">Visual Identity</SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" className="opacity-70 hover:opacity-100 p-0 h-auto">
                <X className="h-6 w-6" />
              </Button>
            </SheetClose>
          </div>
          <SheetDescription className="text-center font-medium mb-6">Customize your environment for better discipline.</SheetDescription>
          <ThemeCards />
        </SheetContent>
      </Sheet>
    </>
  );
}
