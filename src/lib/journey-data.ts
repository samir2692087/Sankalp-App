
/**
 * @fileOverview Data definition for the 365-day mastery journey.
 */

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
    mentalState: 'Foggy, high anxiety, strong impulses.',
    physicalState: 'Restless sleep, low energy, irritability.',
    challenges: 'Breaking the immediate habit loop.',
    guidance: 'Stay away from known triggers. Use cold water or deep breathing during spikes.',
    message: 'Weather the storm. This is the hardest part.'
  },
  {
    id: 'stabilization',
    name: 'Stabilization',
    range: [7, 30],
    mentalState: 'Clarity returns, but mood swings are common.',
    physicalState: 'Improved sleep, skin clarity, resting heart rate stabilizes.',
    challenges: 'Boredom and the "flatline" (emotional numbness).',
    guidance: 'Establish a rock-solid morning routine. Routine is your primary shield.',
    message: 'Foundations are being laid. Keep building.'
  },
  {
    id: 'growth',
    name: 'Growth',
    range: [30, 60],
    mentalState: 'Confidence spikes, cognitive focus and memory improve.',
    physicalState: 'Increased vitality, better recovery after exercise.',
    challenges: 'Overconfidence leading to "test" urges.',
    guidance: 'Channel your new energy into a difficult hobby or intense physical training.',
    message: 'Your potential is waking up. Direct it.'
  },
  {
    id: 'control',
    name: 'Control',
    range: [60, 90],
    mentalState: 'Calm presence, mastery over immediate impulses.',
    physicalState: 'Sustained energy levels throughout the day.',
    challenges: 'Stagnation or feeling like the "work" is done.',
    guidance: 'Deepen your "Why." Discipline is not a restriction; it is freedom.',
    message: 'Control is becoming your default state.'
  },
  {
    id: 'discipline',
    name: 'Discipline',
    range: [90, 120],
    mentalState: 'Long-term thinking, high emotional resilience.',
    physicalState: 'Metabolic and hormonal optimization.',
    challenges: 'The 100-day ego trap.',
    guidance: 'Re-evaluate your life goals. You are now capable of much more.',
    message: 'Discipline is no longer an effort; it is a choice.'
  },
  {
    id: 'expansion',
    name: 'Expansion',
    range: [120, 180],
    mentalState: 'Natural creative flow, leadership qualities emerge.',
    physicalState: 'Peak wellness and physical integration.',
    challenges: 'Life complexity as you take on more responsibility.',
    guidance: 'Apply your mastery to other areas: finance, relationships, career.',
    message: 'The horizon is widening. Lead with clarity.'
  },
  {
    id: 'identity-shift',
    name: 'Identity Shift',
    range: [180, 270],
    mentalState: 'You no longer identify with your old self.',
    physicalState: 'Total physical and mental synchronization.',
    challenges: 'Subtle pride or losing the "beginner\'s mind."',
    guidance: 'Remain humble. Mastery is a lifelong pursuit, not a destination.',
    message: 'You are not "trying" to be disciplined. You ARE disciplined.'
  },
  {
    id: 'mastery',
    name: 'Mastery',
    range: [270, 365],
    mentalState: 'Absolute clarity, inner peace, and purpose.',
    physicalState: 'Embodiment of long-term health and focus.',
    challenges: 'Maintaining the standard you have set.',
    guidance: 'Help others start their journey. Your path now serves as a light.',
    message: 'A year of choice. A lifetime of freedom.'
  }
];

export function getJourneyPhase(days: number): JourneyPhase {
  return JOURNEY_PHASES.find(p => days >= p.range[0] && days < p.range[1]) || JOURNEY_PHASES[JOURNEY_PHASES.length - 1];
}
