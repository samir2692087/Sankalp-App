"use client";

import { Settings, Download, Trash2, Palette, Sun, Moon, Sparkles, Terminal, FileJson, FileSpreadsheet, FileText, FileBox } from 'lucide-react';
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
import { exportToCSV, exportToText, exportToPDF } from '@/lib/export-utils';

interface HeaderProps {
  focusMode: boolean;
  theme: AppTheme;
  data: UserData;
  onThemeChange: (theme: AppTheme) => void;
  onReset: () => void;
  onToggleFocus: () => void;
}

export default function Header({ focusMode, theme, data, onThemeChange, onReset, onToggleFocus }: HeaderProps) {
  const getThemeIcon = () => {
    switch(theme) {
      case 'dark': return <Moon size={18} />;
      case 'purple': return <Sparkles size={18} className="text-purple-400" />;
      case 'amoled': return <Terminal size={18} />;
      default: return <Sun size={18} className="text-yellow-500" />;
    }
  };

  const handleJSONExport = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ironwill-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
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
            <Button variant="ghost" className="rounded-xl p-2 neu-button h-12 flex items-center gap-2 px-4">
              <Settings size={20} />
              <span className="hidden sm:inline font-bold uppercase text-xs">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card rounded-2xl border-none shadow-xl p-2 min-w-[240px]">
            <DropdownMenuLabel className="font-headline p-3">System Control</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                <Palette size={18} />
                <span>Change Theme</span>
                <div className="ml-auto flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white border" />
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                </div>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="glass-card rounded-2xl border-none shadow-xl p-2 min-w-[180px]">
                  <DropdownMenuItem onClick={() => onThemeChange('light')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <Sun size={18} className="text-yellow-500" /> 🌞 Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onThemeChange('dark')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <Moon size={18} /> 🌙 Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onThemeChange('purple')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-400" /> 💜 Purple
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onThemeChange('amoled')} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <Terminal size={18} /> ⚫ AMOLED
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                <Download size={18} />
                <span>Export Reports</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="glass-card rounded-2xl border-none shadow-xl p-2 min-w-[180px]">
                  <DropdownMenuItem onClick={handleJSONExport} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <FileJson size={18} className="text-blue-500" /> JSON Backup
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToCSV(data)} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <FileSpreadsheet size={18} className="text-green-500" /> CSV Table
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToText(data)} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <FileText size={18} className="text-primary" /> TXT Summary
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToPDF(data)} className="rounded-lg p-3 cursor-pointer flex items-center gap-2">
                    <FileBox size={18} className="text-red-500" /> PDF Report
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem onClick={onToggleFocus} className="rounded-lg p-3 cursor-pointer flex items-center justify-between">
              <span className="flex items-center gap-2"><Sun size={18} /> Focus Mode</span>
              <div className={`w-8 h-4 rounded-full transition-colors ${focusMode ? 'bg-primary' : 'bg-muted'}`} />
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onReset} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-500/10">
              <Trash2 size={18} /> Factory Reset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}