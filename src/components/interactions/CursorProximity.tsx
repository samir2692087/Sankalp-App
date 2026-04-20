"use client";

import React, { useRef, useEffect } from 'react';

/**
 * Utility component that tracks mouse position and exposes it via CSS variables
 * to child elements for highly efficient proximity-based styling.
 */
export default function CursorProximity({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      ref.current.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      ref.current.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
    </div>
  );
}
