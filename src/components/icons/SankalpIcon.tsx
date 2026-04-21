
"use client";

import React from 'react';

interface SankalpIconProps {
  className?: string;
  size?: number;
}

/**
 * Custom brand icon for Sankalp.
 * Represents focused intent (center) and balanced resolve (outer circle).
 */
export default function SankalpIcon({ className, size = 24 }: SankalpIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Outer circle of discipline */}
      <circle 
        cx="12" 
        cy="12" 
        r="9" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      {/* Center point of focused intent */}
      <circle 
        cx="12" 
        cy="12" 
        r="3" 
        fill="currentColor" 
      />
      {/* Balanced markings */}
      <path 
        d="M12 3V5M12 19V21M3 12H5M19 12H21" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );
}
