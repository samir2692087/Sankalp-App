"use client";

import { useState, useEffect, useCallback } from 'react';
import { Plus, Target, BarChart3, Trophy, Calendar, ShieldAlert, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
    document.body.removeAttribute('data-scroll-locked');
    document.documentElement.style.pointerEvents = 'auto';
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cleanupInteractions();
    }
  }, [isOpen, cleanupInteractions]);

  const navItems = [
    { label: 'Milestones', icon: Target, tab: 'milestones', color: 'from-purple-600 to-indigo-600', glow: 'shadow-purple-500/40' },
    { label: 'Weekly Report', icon: BarChart3, tab: 'weekly', color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/40' },
    { label: 'Achievements', icon: Trophy, tab: 'achievements', color: 'from-amber-400 to-yellow-600', glow: 'shadow-amber-500/40' },
    { label: 'Calendar', icon: Calendar, tab: 'history', color: 'from-green-500 to-emerald-600', glow: 'shadow-green-500/40' },
    { label: 'Emergency', icon: ShieldAlert, tab: 'emergency', color: 'from-red-600 to-rose-700', glow: 'shadow-red-500/40', isEmergency: true },
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
            className="fixed inset-0 bg-black/50 backdrop-blur-2xl z-[60] cursor-pointer"
            onClick={() => {
              setIsOpen(false);
              cleanupInteractions();
            }}
          >
             <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-secondary/15 pointer-events-none" />
             <div className="absolute bottom-40 right-40 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-10 right-10 z-[70] flex flex-col items-end gap-6">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  }
                }
              }}
              className="flex flex-col gap-4 mb-4 pointer-events-none"
            >
              {navItems.map((item) => (
                <motion.div 
                  key={item.label} 
                  variants={{
                    hidden: { opacity: 0, x: 20, scale: 0.8 },
                    visible: { opacity: 1, x: 0, scale: 1 }
                  }}
                  whileHover={{ scale: 1.08, x: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-5 group cursor-pointer pointer-events-auto" 
                  onClick={() => handleAction(item)}
                >
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/10 backdrop-blur-xl heading-strong px-5 py-2.5 rounded-[1.2rem] text-[10px] uppercase tracking-[0.2em] shadow-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {item.label}
                  </motion.span>
                  <motion.div 
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className={cn(
                      "w-14 h-14 rounded-[1.5rem] shadow-2xl text-white flex items-center justify-center transition-all border border-white/30 bg-gradient-to-br",
                      item.color,
                      item.glow
                    )}
                  >
                    <item.icon size={24} className="drop-shadow-lg" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.92 }}
          type="button"
          onClick={() => {
            if (isOpen) cleanupInteractions();
            setIsOpen(!isOpen);
          }}
          className={cn(
            "w-20 h-20 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all duration-500 flex items-center justify-center relative border border-white/20",
            isOpen ? "bg-white/10 text-white backdrop-blur-xl rotate-90" : "bg-primary text-white shadow-primary/40"
          )}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={32} />
              </motion.div>
            ) : (
              <motion.div key="plus" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Plus size={32} />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && (
             <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white rounded-[2.5rem]"
             />
          )}
        </motion.button>
      </div>
    </>
  );
}