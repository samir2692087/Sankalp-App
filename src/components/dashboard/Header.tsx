
"use client";

import { Settings, LogOut, Download, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  focusMode: boolean;
  onToggleFocus: () => void;
  onExport: () => void;
  onReset: () => void;
}

export default function Header({ focusMode, onToggleFocus, onExport, onReset }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between p-6 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
          <span className="text-white font-bold text-xl font-headline">IW</span>
        </div>
        <h1 className="text-2xl font-bold font-headline hidden sm:block">IronWill</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onToggleFocus}
          className="rounded-xl flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          {focusMode ? <ToggleRight className="text-primary" /> : <ToggleLeft />}
          <span className="hidden sm:inline font-semibold">Focus Mode</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-xl p-2 neu-button">
              <Settings size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card rounded-2xl border-none shadow-xl p-2 min-w-[200px]">
            <DropdownMenuLabel className="font-headline">Management</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExport} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 hover:bg-primary/10">
              <Download size={18} /> Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onReset} className="rounded-lg p-3 cursor-pointer flex items-center gap-2 text-red-500 hover:bg-red-50">
              <Trash2 size={18} /> Reset All Progress
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
