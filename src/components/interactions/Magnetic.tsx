
"use client";

import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useInteraction } from '@/context/InteractionContext';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  activeScale?: number;
}

const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };

export default function Magnetic({ children, strength = 0.4, className, activeScale = 1.05 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const { triggerPulse } = useInteraction();

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, springConfig);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = left + width / 2;
    const middleY = top + height / 2;
    const distanceX = clientX - middleX;
    const distanceY = clientY - middleY;
    
    x.set(distanceX * strength);
    y.set(distanceY * strength);
    scale.set(activeScale);
    
    // Trigger subtle proximity pulse
    triggerPulse(0.005);
  }, [strength, activeScale, x, y, scale, triggerPulse]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
    scale.set(1);
  }, [x, y, scale]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY, scale: springScale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
