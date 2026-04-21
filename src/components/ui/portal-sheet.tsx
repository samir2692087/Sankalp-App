
"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft } from 'lucide-react';
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

/**
 * A highly stable, portal-based bottom sheet.
 * Optimized for Mobile Keyboards:
 * - Uses dvh (dynamic viewport height)
 * - Includes scroll-padding-bottom for input focus
 * - Large bottom buffer for keyboard shifts
 */
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
    <div 
      className={cn(
        "fixed inset-0 z-[10000] flex items-end justify-center transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"
      )}
      style={{ height: '100dvh' }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Sheet Container */}
      <div 
        className={cn(
          "relative w-full max-w-2xl bg-[#0a0a0f] border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_100px_rgba(0,0,0,0.9)] flex flex-col outline-none transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform",
          "max-h-[92dvh]", 
          isOpen ? "translate-y-0" : "translate-y-full",
          className
        )}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Visual Drag Handle */}
        <div className="w-full pt-5 pb-2 flex justify-center shrink-0 select-none">
          <div className="w-14 h-1.5 bg-white/10 rounded-full" />
        </div>

        {/* Header Section with Dual Navigation */}
        <div className="px-6 pt-4 pb-4 shrink-0 flex items-center gap-4 border-b border-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="rounded-full bg-white/5 hover:bg-white/10 text-white/40 shrink-0"
          >
            <ArrowLeft size={18} />
          </Button>

          <div className="flex-1 min-w-0">
            {title && <h2 className="text-xl font-bold text-white tracking-tight truncate">{title}</h2>}
            {description && <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 truncate">{description}</p>}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="rounded-full bg-white/5 hover:bg-white/10 text-white/40 shrink-0"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Content Area - Keyboard Friendly */}
        <div 
          className="flex-1 overflow-y-auto no-scrollbar overscroll-contain touch-pan-y"
          style={{ scrollPaddingBottom: '320px' }}
          onScroll={(e) => e.stopPropagation()}
        >
          <div className="p-8 pt-6 pb-80">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
