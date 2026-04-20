"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface ProximityProps {
  children: React.ReactNode;
  range?: number;
  className?: string;
}

export default function Proximity({ children, range = 300, className }: ProximityProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);
  const opacity = useMotionValue(0);
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      const proximity = Math.max(0, 1 - distance / range);
      opacity.set(proximity);
      setIsNear(distance < range);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [range, opacity]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-[-1]"
        style={{
          opacity: springOpacity,
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(168,85,247,0.15) 0%, transparent 70%)',
        }}
      />
      {children}
    </div>
  );
}
