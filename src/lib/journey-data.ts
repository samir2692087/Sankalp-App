
export interface JourneyPhase {
  id: string;
  name: string;
  range: [number, number]; // [minDays, maxDays]
  mentalState: string;
  physicalState: string;
  challenges: string;
  guidance: string;
  message: string;
}

export const JOURNEY_PHASES: JourneyPhase[] = [
  {
    id: 'reset',
    name: 'Reset',
    range: [0, 7],
    mentalState: 'High anxiety, strong impulses.',
    physicalState: 'Restless, low energy.',
    challenges: 'Breaking the loop.',
    guidance: 'Stay away from triggers. Use cold water or deep breathing.',
    message: 'Weather the storm. This is the hardest part.'
  },
  {
    id: 'stabilization',
    name: 'Stabilization',
    range: [7, 30],
    mentalState: 'Clarity returns, mood swings possible.',
    physicalState: 'Improved sleep, energy stabilizes.',
    challenges: 'Boredom and flatline.',
    guidance: 'Routine is your primary foundation. Stay steady.',
    message: 'Foundations are being laid. Keep building.'
  },
  {
    id: 'growth',
    name: 'Growth',
    range: [30, 60],
    mentalState: 'Confidence spikes, focus improves.',
    physicalState: 'Increased vitality and recovery.',
    challenges: 'Overconfidence traps.',
    guidance: 'Channel your new energy into a difficult hobby or training.',
    message: 'Your potential is waking up. Direct it.'
  },
  {
    id: 'control',
    name: 'Control',
    range: [60, 90],
    mentalState: 'Calm presence, mastery over impulses.',
    physicalState: 'Sustained energy levels.',
    challenges: 'Stagnation risks.',
    guidance: 'Discipline is not a restriction; it is freedom.',
    message: 'Control is becoming your default state.'
  },
  {
    id: 'discipline',
    name: 'Discipline',
    range: [90, 120],
    mentalState: 'Long-term thinking, high resilience.',
    physicalState: 'Total optimization.',
    challenges: 'Ego traps.',
    guidance: 'Re-evaluate your life goals. You are capable of much more.',
    message: 'Resolve is no longer an effort; it is a choice.'
  },
  {
    id: 'expansion',
    name: 'Expansion',
    range: [120, 180],
    mentalState: 'Natural creative flow, leadership emerges.',
    physicalState: 'Peak wellness.',
    challenges: 'Complexity management.',
    guidance: 'Apply your resolve to finance, relationships, career.',
    message: 'The horizon is widening. Lead with clarity.'
  },
  {
    id: 'identity-shift',
    name: 'Identity Shift',
    range: [180, 270],
    mentalState: 'New identify formed.',
    physicalState: 'Total synchronization.',
    challenges: 'Pride or losing beginner mind.',
    guidance: 'Remain humble. Mastery is a lifelong pursuit.',
    message: 'You are not trying to be disciplined. You ARE disciplined.'
  },
  {
    id: 'mastery',
    name: 'Mastery',
    range: [270, 365],
    mentalState: 'Absolute clarity and inner peace.',
    physicalState: 'Embodiment of health.',
    challenges: 'Maintaining standards.',
    guidance: 'Help others start. Your path now serves as a light.',
    message: 'A year of choice. A lifetime of freedom.'
  }
];

export function getJourneyPhase(days: number): JourneyPhase {
  return JOURNEY_PHASES.find(p => days >= p.range[0] && days < p.range[1]) || JOURNEY_PHASES[JOURNEY_PHASES.length - 1];
}
