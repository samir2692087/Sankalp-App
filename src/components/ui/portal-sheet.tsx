"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PortalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function PortalSheet({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children,
  className 
}: PortalSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet Container */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "relative w-full max-w-2xl bg-[#0a0a0f] border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] flex flex-col max-h-[88vh] outline-none",
              className
            )}
          >
            {/* Drag Handle */}
            <div className="w-full pt-4 pb-2 flex justify-center shrink-0 cursor-pointer" onClick={onClose}>
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            {(title || description) && (
              <div className="px-8 pt-4 pb-2 shrink-0 flex items-center justify-between">
                <div>
                  {title && <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>}
                  {description && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">{description}</p>}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onClose} 
                  className="rounded-full bg-white/5 hover:bg-white/10 text-white/40"
                >
                  <X size={20} />
                </Button>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain">
              <div className="p-8 pt-4 pb-32">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
