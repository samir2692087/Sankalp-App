"use client";

import React from 'react';

interface SankalpIconProps {
  className?: string;
  size?: number;
}

/**
 * Custom brand icon for Sankalp.
 * Based on the visual identity of a central glowing energy core and concentric rings of resolve.
 * This icon replaces defensive imagery with symbols of focused intent and internal balance.
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
      <defs>
        <radialGradient id="sankalpInnerGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
        </radialGradient>
        <filter id="sankalpCoreBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Concentric rings representing layers of discipline and resolve */}
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="0.3" strokeOpacity="0.2" />
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="0.45" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.6" />
      
      {/* The glowing core of focus and Sankalp */}
      <circle 
        cx="12" 
        cy="12" 
        r="3.5" 
        fill="url(#sankalpInnerGlow)" 
        filter="url(#sankalpCoreBlur)"
        className="animate-pulse"
        style={{ animationDuration: '4s' }}
      />
    </svg>
  );
}
