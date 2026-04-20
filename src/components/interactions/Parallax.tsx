"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };

export default function Parallax({ children, offset = 20, className }: ParallaxProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const translateX = useTransform(springX, [-100, 100], [-offset, offset]);
  const translateY = useTransform(springY, [-100, 100], [-offset, offset]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const mouseX = (e.clientX / innerWidth) * 200 - 100;
      const mouseY = (e.clientY / innerHeight) * 200 - 100;
      x.set(mouseX);
      y.set(mouseY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      style={{ x: translateX, y: translateY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
