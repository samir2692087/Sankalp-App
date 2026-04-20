
"use client";

import { Settings, Download, Trash2, Palette, Sun, Moon, Sparkles, Terminal } from 'lucide-react';
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
import { AppTheme } from '@/lib/types';

interface HeaderProps {
  focusMode: boolean;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  onExport: () => void;
  onReset: () => void;
  onToggleFocus: () => void;
}

export default function Header({ focusMode, theme, onThemeChange, onExport, onReset, onToggleFocus }: HeaderProps) {
  const getThemeIcon = () => {
    switch(theme) {
      case 'dark': return <Moon size={18} />;
      case 'purple': return <Sparkles size={18} className="text-purple-400" />;
      case 'amoled': return <Terminal size={18} />;
      default: return <Sun size={18} className="text-yellow-500" />;
    }
  };

  return (
    <header className="w-full flex items-center justify-between p-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-primary-foreground font-bold text-xl font-headline">IW</span>
        </div>
        <h1 className="text-2xl font-bold font-headline hidden sm:block">IronWill</h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl p-2 neu-button flex items-center gap-2">
              {getThemeIcon()}
              <span className="hidden sm:inline font-bold uppercase text-xs">{theme}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card rounded-2xl border-none shadow-xl p-2 min-w-[180px]">
            <DropdownMenuLabel className="font-headline">Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onThemeChange('light')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
              <Sun size={18} /> Light (Classic)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onThemeChange('dark')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
              <Moon size={18} /> Dark (Focus)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onThemeChange('purple')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
              <Sparkles size={18} /> Purple (Premium)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onThemeChange('amoled')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
              <Terminal size={18} /> AMOLED (Deep)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl p-2 neu-button">
              <Settings size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card rounded-2xl border-none shadow-xl p-2 min-w-[200px]">
            <DropdownMenuLabel className="font-headline">System</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onToggleFocus} className="rounded-lg p-3 cursor-pointer flex items-center justify-between">
              <span>Focus Mode</span>
              <div className={`w-8 h-4 rounded-full transition-colors ${focusMode ? 'bg-primary' : 'bg-muted'}`} />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
              <Download size={18} /> Multi-Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReset} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-500/10">
              <Trash2 size={18} /> Factory Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
