
"use client";

import { useState } from 'react';
import { Settings, Download, Trash2, Palette, Sun, Moon, Sparkles, Terminal, Shield, Zap, ChevronRight } from 'lucide-react';
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
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppTheme, UserData } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';

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

  const themes: { id: AppTheme, name: string, icon: any, bg: string, accent: string }[] = [
    { id: 'light', name: 'Light', icon: Sun, bg: 'bg-white', accent: 'bg-primary' },
    { id: 'dark', name: 'Dark', icon: Moon, bg: 'bg-slate-900', accent: 'bg-primary' },
    { id: 'purple', name: 'Purple', icon: Sparkles, bg: 'bg-purple-950', accent: 'bg-purple-500' },
    { id: 'amoled', name: 'AMOLED', icon: Terminal, bg: 'bg-black', accent: 'bg-white' },
  ];

  const ThemeCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
      {themes.map((t) => (
        <div 
          key={t.id}
          onClick={() => {
            onThemeChange(t.id);
            if (isMobile) setIsThemeSheetOpen(false);
          }}
          className={`theme-card group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${theme === t.id ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] scale-[1.02]' : 'border-transparent hover:bg-primary/5'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${t.bg} border border-white/10 flex items-center justify-center shadow-lg`}>
              <t.icon size={18} className={t.id === 'light' ? 'text-orange-400' : 'text-white'} />
            </div>
            <div className="flex-1">
              <span className="font-bold block text-sm">{t.name}</span>
              <div className="flex gap-1 mt-1">
                <div className={`w-3 h-3 rounded-full ${t.bg} border border-white/10`} />
                <div className={`w-3 h-3 rounded-full ${t.accent}`} />
              </div>
            </div>
            {theme === t.id && <Zap size={14} className="text-primary fill-primary" />}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <header className="w-full flex items-center justify-between p-4 sm:p-6 animate-fade-in-up sticky top-0 z-[50] backdrop-blur-md">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="rounded-2xl p-2 neu-button h-10 sm:h-12 flex items-center gap-2 px-4 sm:px-5 group outline-none">
                <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="hidden sm:inline font-bold uppercase text-xs tracking-widest">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent 
                align="end" 
                sideOffset={10}
                className="glass-card rounded-[2rem] border-none shadow-2xl p-3 min-w-[260px] z-[9999] animate-in fade-in zoom-in-95 duration-200"
              >
                <DropdownMenuLabel className="font-headline p-4 text-center opacity-70">Configuration</DropdownMenuLabel>
                <DropdownMenuSeparator className="opacity-10" />
                
                {isMobile ? (
                  <DropdownMenuItem 
                    onSelect={() => setIsThemeSheetOpen(true)}
                    className="rounded-xl p-4 cursor-pointer flex items-center justify-between hover:bg-primary/5 focus:bg-primary/5 outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <Palette size={20} />
                      <span className="font-bold">Visual Themes</span>
                    </div>
                    <ChevronRight size={16} className="opacity-50" />
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="rounded-xl p-4 cursor-pointer flex items-center gap-3 hover:bg-primary/5 transition-colors focus:bg-primary/5 outline-none">
                      <Palette size={20} />
                      <span className="font-bold">Visual Themes</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent 
                        sideOffset={15}
                        className="glass-card rounded-[2.5rem] border-none shadow-2xl p-4 min-w-[320px] z-[10000]"
                      >
                        <DropdownMenuLabel className="text-center text-xs font-black uppercase tracking-widest opacity-50 mb-2">Select Theme</DropdownMenuLabel>
                        <ThemeCards />
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )}

                <DropdownMenuItem onClick={onShowExport} className="rounded-xl p-4 cursor-pointer flex items-center gap-3 hover:bg-primary/5 focus:bg-primary/5 outline-none">
                  <Download size={20} className="text-secondary" />
                  <span className="font-bold">Export Center</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onToggleFocus} className="rounded-xl p-4 cursor-pointer flex items-center justify-between hover:bg-primary/5 focus:bg-primary/5 outline-none">
                  <div className="flex items-center gap-3">
                    <Sun size={20} className={focusMode ? 'text-primary' : ''} />
                    <span className="font-bold">Focus Mode</span>
                  </div>
                  <div className={`w-10 h-5 rounded-full p-1 transition-all ${focusMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-all ${focusMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="opacity-10" />
                
                <DropdownMenuItem onClick={onReset} className="rounded-xl p-4 cursor-pointer flex items-center gap-3 text-red-500 hover:bg-red-500/10 focus:bg-red-500/10 outline-none">
                  <Trash2 size={20} />
                  <span className="font-bold uppercase text-xs tracking-widest">Hard Reset</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Bottom Sheet for Themes */}
      <Sheet open={isThemeSheetOpen} onOpenChange={setIsThemeSheetOpen}>
        <SheetContent side="bottom" className="theme-sheet glass-card border-none rounded-t-[3rem] p-8 pb-12 z-[10000]">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-bold font-headline text-center">Visual Identity</SheetTitle>
            <SheetDescription className="text-center font-medium">Customize your environment for better discipline.</SheetDescription>
          </SheetHeader>
          <ThemeCards />
        </SheetContent>
      </Sheet>
    </>
  );
}
