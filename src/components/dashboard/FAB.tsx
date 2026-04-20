
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Target, BarChart3, Trophy, Calendar, ShieldAlert, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface FABProps {
  onOpenInsights: (tab: string) => void;
  onOpenEmergency: () => void;
}

export default function FAB({ onOpenInsights, onOpenEmergency }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cleanupInteractions = useCallback(() => {
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
    document.body.removeAttribute('data-scroll-locked');
    document.documentElement.style.pointerEvents = 'auto';
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cleanupInteractions();
    }
  }, [isOpen, cleanupInteractions]);

  const navItems = [
    { label: 'Milestones', icon: Target, tab: 'milestones', color: 'bg-primary' },
    { label: 'Weekly Report', icon: BarChart3, tab: 'weekly', color: 'bg-secondary' },
    { label: 'Achievements', icon: Trophy, tab: 'achievements', color: 'bg-yellow-500' },
    { label: 'Calendar', icon: Calendar, tab: 'history', color: 'bg-green-500' },
    { label: 'Emergency', icon: ShieldAlert, tab: 'emergency', color: 'bg-red-500', isEmergency: true },
  ];

  const handleAction = (item: any) => {
    if (item.isEmergency) onOpenEmergency();
    else onOpenInsights(item.tab);
    setIsOpen(false);
    cleanupInteractions();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/60 backdrop-blur-xl z-[60] animate-in fade-in duration-300"
          onClick={() => {
            setIsOpen(false);
            cleanupInteractions();
          }}
        />
      )}
      
      <div className="fixed bottom-8 right-8 z-[70] flex flex-col items-end gap-4">
        {isOpen && (
          <div className="flex flex-col gap-3 mb-2 animate-in slide-in-from-bottom-6 fade-in duration-300">
            {navItems.map((item) => (
              <div key={item.label} className="flex items-center gap-4 group cursor-pointer" onClick={() => handleAction(item)}>
                <span className="bg-card text-foreground px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl neu-flat transition-transform group-hover:scale-105">
                  {item.label}
                </span>
                <Button 
                  className={cn(
                    "w-12 h-12 rounded-2xl shadow-2xl text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95",
                    item.color
                  )}
                >
                  <item.icon size={20} />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <Button 
          onClick={() => {
            if (isOpen) cleanupInteractions();
            setIsOpen(!isOpen);
          }}
          className={cn(
            "w-16 h-16 rounded-[2rem] shadow-2xl transition-all duration-500",
            isOpen ? "bg-muted text-foreground rotate-90 scale-90" : "bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/40"
          )}
        >
          {isOpen ? <X size={28} /> : <Plus size={28} />}
        </Button>
      </div>
    </>
  );
}
