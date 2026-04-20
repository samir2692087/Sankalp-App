
"use client";

import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface DraggableProps {
  children: React.ReactNode;
  className?: string;
  onDragEnd?: () => void;
}

const springConfig = { stiffness: 200, damping: 20, mass: 1 };

export default function Draggable({ children, className, onDragEnd }: DraggableProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-100, 100], [10, -10]);
  const rotateY = useTransform(springX, [-100, 100], [-10, 10]);

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.15}
      onDragEnd={onDragEnd}
      style={{ x: springX, y: springY, rotateX, rotateY, perspective: 1000 }}
      whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 100 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
