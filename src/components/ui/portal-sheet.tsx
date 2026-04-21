
"use client";

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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

/**
 * A highly stable, portal-based bottom sheet.
 * Stabilization Logic:
 * - Always stays in DOM (controlled by opacity/visibility)
 * - Explicit open/close state logic
 * - Stops all inner event propagation
 * - Locked body scroll on mount
 * - No gesture conflicts (animations handled by CSS)
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

  // Ensure portal target exists
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll and log state for stabilization check
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log("MODAL_STABILITY_SCAN: OPEN", title || "Sheet");
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, title]);

  if (!mounted) return null;

  return createPortal(
    <div 
      className={cn(
        "fixed inset-0 z-[10000] flex items-end justify-center transition-all duration-300 ease-in-out",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"
      )}
      style={{ touchAction: 'auto' }}
    >
      {/* Backdrop - Explicit close receiver */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      />

      {/* Sheet Container - Strictly controlled position */}
      <div 
        className={cn(
          "relative w-full max-w-2xl bg-[#0a0a0f] border-t border-white/10 rounded-t-[3rem] shadow-[0_-20px_100px_rgba(0,0,0,0.9)] flex flex-col max-h-[85vh] outline-none transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform",
          isOpen ? "translate-y-0" : "translate-y-full",
          className
        )}
        onClick={(e) => {
          // Hard stop on propagation to prevent accidental closure
          e.stopPropagation();
        }}
      >
        {/* Visual Drag Handle (Static) */}
        <div className="w-full pt-5 pb-2 flex justify-center shrink-0 select-none">
          <div className="w-14 h-1.5 bg-white/10 rounded-full" />
        </div>

        {/* Header Section */}
        <div className="px-8 pt-4 pb-4 shrink-0 flex items-center justify-between border-b border-white/5">
          <div className="flex-1 min-w-0">
            {title && <h2 className="text-2xl font-bold text-white tracking-tight truncate">{title}</h2>}
            {description && <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mt-1 truncate">{description}</p>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="rounded-full bg-white/5 hover:bg-white/10 text-white/40 shrink-0 ml-4"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Content Area - Scrollable with isolation */}
        <div 
          className="flex-1 overflow-y-auto no-scrollbar overscroll-contain touch-pan-y"
          onScroll={(e) => e.stopPropagation()}
        >
          <div className="p-8 pt-6 pb-40">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
