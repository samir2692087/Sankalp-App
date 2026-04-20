
"use client";

import { useState, useCallback } from 'react';
import { Plus, Target, BarChart3, Trophy, Calendar, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './Magnetic';

interface FABProps {
  onOpenInsights: (tab: string) => void;
  onOpenEmergency: () => void;
}

const physicsConfig = { type: "spring", stiffness: 150, damping: 15, mass: 1 };

export default function FAB({ onOpenInsights, onOpenEmergency }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const cleanupInteractions = useCallback(() => {
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }, []);

  const navItems = [
    { label: 'Goals', icon: Target, tab: 'milestones', color: 'from-purple-600 to-indigo-600' },
    { label: 'Pulse', icon: BarChart3, tab: 'weekly', color: 'from-blue-500 to-cyan-500' },
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
            className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[60]"
            onClick={() => { setIsOpen(false); cleanupInteractions(); }}
          />
        )}
      </AnimatePresence>
      
      <div className="fixed bottom-10 right-10 z-[70] flex flex-col items-end gap-5">
        <AnimatePresence>
          {isOpen && (
            <motion.div className="flex flex-col gap-4 mb-4">
              {navItems.map((item, idx) => (
                <Magnetic key={item.label} strength={0.2}>
                  <motion.div 
                    initial={{ opacity: 0, x: 50, y: 20, scale: 0.5, rotate: -20 }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, x: 50, scale: 0.5, rotate: 20 }}
                    transition={{ ...physicsConfig, delay: idx * 0.05 }}
                    onClick={() => handleAction(item)}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <span className="glass-card px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </span>
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className={cn(
                        "w-15 h-15 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br shadow-[0_10px_20px_rgba(0,0,0,0.3)] border border-white/20",
                        item.color
                      )}
                    >
                      <item.icon size={22} />
                    </motion.div>
                  </motion.div>
                </Magnetic>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <Magnetic strength={0.4}>
          <motion.button 
            whileHover={{ scale: 1.05, rotate: isOpen ? 0 : 5 }}
            whileTap={{ scale: 0.9, rotate: -5 }}
            transition={physicsConfig}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-22 h-22 rounded-[2.4rem] flex items-center justify-center transition-all duration-500 relative border border-white/20 shadow-2xl",
              isOpen ? "bg-white/10 backdrop-blur-3xl rotate-90" : "neu-button-primary"
            )}
          >
            {isOpen ? <X size={36} className="text-white" /> : <Plus size={36} className="text-white" />}
            {!isOpen && (
               <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-[2.4rem] bg-purple-500/30 -z-10" 
               />
            )}
          </motion.button>
        </Magnetic>
      </div>
    </>
  );
}
