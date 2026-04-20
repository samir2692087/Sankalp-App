"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Target, BarChart3, Trophy, Calendar, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FABProps {
  onOpenInsights: (tab: string) => void;
  onOpenEmergency: () => void;
}

export default function FAB({ onOpenInsights, onOpenEmergency }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cleanupInteractions = useCallback(() => {
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }, []);

  const navItems = [
    { label: 'Milestones', icon: Target, tab: 'milestones', color: 'from-purple-600 to-indigo-600' },
    { label: 'Report', icon: BarChart3, tab: 'weekly', color: 'from-blue-500 to-cyan-500' },
    { label: 'Trophies', icon: Trophy, tab: 'achievements', color: 'from-amber-400 to-yellow-600' },
    { label: 'History', icon: Calendar, tab: 'history', color: 'from-green-500 to-emerald-600' },
    { label: 'SOS', icon: ShieldAlert, tab: 'emergency', color: 'from-red-600 to-rose-700', isEmergency: true },
  ];

  const handleAction = (item: any) => {
    if (item.isEmergency) onOpenEmergency();
    else onOpenInsights(item.tab);
    setIsOpen(false);
    cleanupInteractions();
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            onClick={() => { setIsOpen(false); cleanupInteractions(); }}
          />
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-10 right-10 z-[70] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div className="flex flex-col gap-3 mb-4">
              {navItems.map((item, idx) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleAction(item)}
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <span className="glass-card px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-xl border border-white/20",
                    item.color
                  )}>
                    <item.icon size={22} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-300 relative border border-white/20",
            isOpen ? "bg-white/10 backdrop-blur-xl rotate-90" : "neu-button-primary"
          )}
        >
          {isOpen ? <X size={32} className="text-white" /> : <Plus size={32} className="text-white" />}
          {!isOpen && (
             <div className="absolute inset-0 rounded-[2rem] animate-ping bg-purple-500/20 -z-10" />
          )}
        </motion.button>
      </div>
    </>
  );
}