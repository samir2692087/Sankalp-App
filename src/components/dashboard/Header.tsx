"use client";

import { Settings, Download, Trash2, Palette, Sun, Moon, Sparkles, Terminal, Shield, Zap } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import { AppTheme, UserData } from '@/lib/types';

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
  const themes: { id: AppTheme, name: string, icon: any, color: string }[] = [
    { id: 'light', name: 'Light', icon: Sun, color: 'bg-white' },
    { id: 'dark', name: 'Dark', icon: Moon, color: 'bg-slate-800' },
    { id: 'purple', name: 'Purple', icon: Sparkles, color: 'bg-purple-600' },
    { id: 'amoled', name: 'AMOLED', icon: Terminal, color: 'bg-black' },
  ];

  return (
    <header className="w-full flex items-center justify-between p-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group cursor-pointer transition-transform hover:scale-110 active:scale-95">
          <Shield className="text-primary-foreground" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-headline hidden sm:block leading-none">IronWill</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground hidden sm:block">Discipline Pro</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-2xl p-2 neu-button h-12 flex items-center gap-2 px-5 group">
              <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
              <span className="hidden sm:inline font-bold uppercase text-xs tracking-widest">Controls</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card rounded-[2rem] border-none shadow-2xl p-3 min-w-[280px]">
            <DropdownMenuLabel className="font-headline p-4 text-center">System Configuration</DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-10" />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-xl p-4 cursor-pointer flex items-center gap-3 hover:bg-white/5">
                <Palette size={20} />
                <span className="font-bold">Visual Themes</span>
                <div className="ml-auto flex -space-x-2">
                  <div className="w-4 h-4 rounded-full bg-white border" />
                  <div className="w-4 h-4 rounded-full bg-slate-900" />
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="glass-card rounded-[2rem] border-none shadow-2xl p-3 min-w-[220px]">
                  {themes.map((t) => (
                    <DropdownMenuItem 
                      key={t.id}
                      onClick={() => onThemeChange(t.id)} 
                      className={`rounded-xl p-4 cursor-pointer flex items-center gap-3 transition-all mb-1 ${theme === t.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-white/5'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.color} shadow-inner`}>
                        <t.icon size={16} className={t.id === 'light' ? 'text-orange-400' : 'text-white'} />
                      </div>
                      <span className="font-bold">{t.name}</span>
                      {theme === t.id && <Zap size={14} className="ml-auto text-primary fill-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={onShowExport} className="rounded-xl p-4 cursor-pointer flex items-center gap-3 hover:bg-white/5">
              <Download size={20} className="text-secondary" />
              <span className="font-bold">Export Reports</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onToggleFocus} className="rounded-xl p-4 cursor-pointer flex items-center justify-between hover:bg-white/5">
              <div className="flex items-center gap-3">
                <Sun size={20} className={focusMode ? 'text-primary' : ''} />
                <span className="font-bold">Focus Mode</span>
              </div>
              <div className={`w-10 h-5 rounded-full p-1 transition-all ${focusMode ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-all ${focusMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="opacity-10" />
            
            <DropdownMenuItem onClick={onReset} className="rounded-xl p-4 cursor-pointer flex items-center gap-3 text-red-500 hover:bg-red-500/10">
              <Trash2 size={20} />
              <span className="font-bold uppercase text-xs tracking-widest">Hard Reset</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}