"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export type StateOfMind = 'calm' | 'active' | 'focus' | 'risk';

interface InteractionState {
  intensity: number; // 0 to 1
  mode: StateOfMind;
  lastPulse: number;
  isUiLocked: boolean;
  triggerPulse: (strength?: number) => void;
  setMode: (mode: StateOfMind) => void;
  setIsUiLocked: (locked: boolean) => void;
  recordInteraction: (type: string) => void;
}

const InteractionContext = createContext<InteractionState | undefined>(undefined);

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [intensity, setIntensity] = useState(0);
  const [mode, setMode] = useState<StateOfMind>('calm');
  const [lastPulse, setLastPulse] = useState(0);
  const [isUiLocked, setIsUiLocked] = useState(false);
  const [interactionLog, setInteractionLog] = useState<{ type: string; timestamp: number }[]>([]);
  const decayRef = useRef<number | null>(null);

  const triggerPulse = useCallback((strength: number = 0.5) => {
    setIntensity(prev => Math.min(1, prev + strength));
    setLastPulse(Date.now());
  }, []);

  const recordInteraction = useCallback((type: string) => {
    const now = Date.now();
    setInteractionLog(prev => [...prev.slice(-20), { type, timestamp: now }]);
    triggerPulse(0.2);
  }, [triggerPulse]);

  useEffect(() => {
    const recentActions = interactionLog.filter(a => Date.now() - a.timestamp < 30000);
    const urgeCount = recentActions.filter(a => a.type === 'urge').length;
    const activityCount = recentActions.length;

    if (urgeCount >= 2) setMode('risk');
    else if (activityCount > 10) setMode('active');
    else if (mode === 'risk' && urgeCount === 0) setMode('focus');
    else if (activityCount < 3) setMode('calm');
  }, [interactionLog, mode]);

  useEffect(() => {
    const decay = () => {
      setIntensity(prev => Math.max(0, prev - 0.015));
      decayRef.current = requestAnimationFrame(decay);
    };
    decayRef.current = requestAnimationFrame(decay);
    return () => {
      if (decayRef.current) cancelAnimationFrame(decayRef.current);
    };
  }, []);

  return (
    <InteractionContext.Provider value={{ 
      intensity, 
      mode, 
      lastPulse, 
      isUiLocked, 
      triggerPulse, 
      setMode, 
      setIsUiLocked, 
      recordInteraction 
    }}>
      {children}
    </InteractionContext.Provider>
  );
}

export const useInteraction = () => {
  const context = useContext(InteractionContext);
  if (!context) throw new Error("useInteraction must be used within InteractionProvider");
  return context;
};
