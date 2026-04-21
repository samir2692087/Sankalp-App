
"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Plus, 
  Target, 
  BarChart3, 
  Calendar, 
  X
} from 'lucide-react';
import SankalpIcon from '@/components/icons/SankalpIcon';
import { cn } from '@/lib/utils';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useVelocity, 
  useTransform, 
  useSpring,
  useMotionValue
} from 'framer-motion';
import Magnetic from './Magnetic';
import { feedback } from '@/lib/feedback-engine';

interface FABProps {
  onOpenInsights: (tab: string) => void;
  onOpenEmergency: () => void;
}

const springConfig = { type: "spring", stiffness: 180, damping: 18, mass: 1 };

export default function FAB({ onOpenInsights, onOpenEmergency }: FABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  
  const lagY = useSpring(useTransform(scrollVelocity, [-2000, 2000], [-30, 30]), {
    stiffness: 100,
    damping: 30
  });

  const tiltZ = useSpring(useTransform(scrollVelocity, [-2000, 2000], [-10, 10]), {
    stiffness: 80,
    damping: 20
  });

  const navItems = [
    { label: 'Resolve', icon: Target, tab: 'milestones', color: 'bg-purple-600', shadow: 'shadow-purple-500/40' },
    { label: 'Pulse', icon: BarChart3, tab: 'weekly', color: 'bg-blue-500', shadow: 'shadow-blue-500/40' },
    { label: 'History', icon: Calendar, tab: 'history', color: 'bg-green-500', shadow: 'shadow-green-500/40' },
    { label: 'Control', icon: SankalpIcon, isEmergency: true, color: 'bg-red-500', shadow: 'shadow-red-500/40' },
  ];

  const handleAction = (item: any) => {
    feedback.tap();
    if (item.isEmergency) onOpenEmergency();
    else onOpenInsights(item.tab);
    setIsOpen(false);
  };

  const toggleMenu = () => {
    feedback.tap();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xl z-[60] pointer-events-auto"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        ref={containerRef}
        style={{ y: lagY, rotateZ: tiltZ }}
        className="fixed bottom-10 right-10 z-[70] flex flex-col items-end gap-5 pointer-events-none"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div className="flex flex-col gap-4 mb-4 pointer-events-auto">
              {navItems.map((item, idx) => (
                <Magnetic key={item.label} strength={0.4} activeScale={1.1}>
                  <motion.div 
                    initial={{ opacity: 0, x: 20, y: 10, scale: 0.4 }}
                    animate={{ 
                      opacity: 1, 
                      x: -idx * 5, 
                      y: 0, 
                      scale: 1 
                    }}
                    exit={{ opacity: 0, x: 20, scale: 0.4 }}
                    transition={{ ...springConfig, delay: idx * 0.04 }}
                    onClick={() => handleAction(item)}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <motion.span 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-card px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white/60 bg-white/[0.02] border-white/5 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                    
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                      whileTap={{ scale: 0.9, y: 5 }}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-white relative transition-shadow",
                        item.color,
                        item.shadow,
                        "shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4)] border border-white/20"
                      )}
                    >
                      <item.icon size={22} className="relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20 rounded-2xl pointer-events-none" />
                      <div className={cn(
                        "absolute -inset-2 rounded-[2rem] opacity-0 group-hover:opacity-40 transition-opacity blur-xl",
                        item.color
                      )} />
                    </motion.div>
                  </motion.div>
                </Magnetic>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="pointer-events-auto">
          <Magnetic strength={0.5} activeScale={1.05}>
            <motion.button 
              layout
              onClick={toggleMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9, rotate: -15 }}
              animate={{ 
                rotate: isOpen ? 90 : 0,
                y: isOpen ? 0 : [0, -4, 0],
              }}
              transition={{
                y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                ...springConfig
              }}
              className={cn(
                "w-20 h-20 rounded-[2.2rem] flex items-center justify-center relative border border-white/20 shadow-2xl transition-colors overflow-hidden group",
                isOpen ? "bg-white/10 backdrop-blur-3xl" : "neu-button-primary"
              )}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <X size={32} className="text-white/80" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plus"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <Plus size={36} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {!isOpen && (
                <motion.div 
                  animate={{ 
                    scale: [1, 1.4, 1], 
                    opacity: [0.2, 0, 0.2] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-[2.2rem] bg-white/20 -z-10" 
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            </motion.button>
          </Magnetic>
        </div>
      </motion.div>
    </>
  );
}
