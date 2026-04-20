
import { UserData, CheckInLog } from './types';

export function calculateStreak(lastRelapseTimestamp: number | null): number {
  if (lastRelapseTimestamp === null) {
    // If never relapsed, streak is days since first record or just 0
    return 0;
  }
  const diff = Date.now() - lastRelapseTimestamp;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculateDisciplineScore(data: UserData): number {
  const streakFactor = Math.min(data.currentStreak * 2, 50); // Up to 50 points for 25 days streak
  const urgeFactor = Math.min(data.urges.length * 2, 30); // Up to 30 points for resisting urges
  const relapsePenalty = Math.min(data.relapses.length * 10, 80); // Up to 80 points penalty
  
  const rawScore = 50 + streakFactor + urgeFactor - relapsePenalty;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getBehavioralInsights(data: UserData) {
  const reasons = data.relapses.map(r => r.reason);
  const mostCommonTrigger = reasons.length > 0 
    ? reasons.reduce((a, b, i, arr) => 
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
      ) 
    : "No data yet";

  const times = data.relapses.map(r => r.timeOfDay);
  const highRiskWindow = times.length > 0
    ? times.reduce((a, b, i, arr) => 
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
      )
    : "No data yet";

  return { mostCommonTrigger, highRiskWindow };
}

export function getDailyChallenge() {
  const challenges = [
    "Do 20 pushups right now.",
    "Drink a full glass of water.",
    "Meditate for 5 minutes.",
    "Read 5 pages of a book.",
    "Take a cold shower.",
    "Clean your workspace for 10 minutes.",
    "Go for a 15-minute walk.",
    "Write down 3 things you're grateful for."
  ];
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return challenges[dayOfYear % challenges.length];
}
