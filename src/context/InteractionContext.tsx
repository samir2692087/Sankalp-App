
"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

type SystemMode = 'calm' | 'active' | 'focus' | 'risk';

interface InteractionState {
  intensity: number; // 0 to 1
  mode: SystemMode;
  lastPulse: number;
  triggerPulse: (strength?: number) => void;
  setMode: (mode: SystemMode) => void;
}

const InteractionContext = createContext<InteractionState | undefined>(undefined);

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [intensity, setIntensity] = useState(0);
  const [mode, setMode] = useState<SystemMode>('calm');
  const [lastPulse, setLastPulse] = useState(0);
  const decayRef = useRef<number | null>(null);

  const triggerPulse = useCallback((strength: number = 0.5) => {
    setIntensity(prev => Math.min(1, prev + strength));
    setLastPulse(Date.now());
  }, []);

  // Natural decay of intensity over time
  useEffect(() => {
    const decay = () => {
      setIntensity(prev => Math.max(0, prev - 0.02));
      decayRef.current = requestAnimationFrame(decay);
    };
    decayRef.current = requestAnimationFrame(decay);
    return () => {
      if (decayRef.current) cancelAnimationFrame(decayRef.current);
    };
  }, []);

  return (
    <InteractionContext.Provider value={{ intensity, mode, lastPulse, triggerPulse, setMode }}>
      {children}
    </InteractionContext.Provider>
  );
}

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) throw new Error("useInteraction must be used within InteractionProvider");
  return context;
};
