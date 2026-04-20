
import { UserData, RelapseLog, UrgeLog } from './types';

export function calculateStreak(lastRelapseTimestamp: number | null): number {
  if (lastRelapseTimestamp === null) return 0;
  const diff = Date.now() - lastRelapseTimestamp;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculateDisciplineScore(data: UserData): number {
  const streakFactor = Math.min(data.currentStreak * 2, 50);
  const urgeFactor = Math.min(data.urges.length * 2, 30);
  const relapsePenalty = Math.min(data.relapses.length * 10, 80);
  
  const rawScore = 50 + streakFactor + urgeFactor - relapsePenalty;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getBehavioralInsights(data: UserData) {
  const reasons = data.relapses.map(r => r.reason);
  const mostCommonTrigger = reasons.length > 0 
    ? reasons.reduce((a, b, i, arr) => 
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
      ) 
    : "Consistent data required";

  const times = data.relapses.map(r => r.timeOfDay);
  const highRiskWindow = times.length > 0
    ? times.reduce((a, b, i, arr) => 
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
      )
    : "Morning Protocol Active";

  const totalBattles = data.urges.length + data.relapses.length;
  const winRate = totalBattles > 0 ? Math.round((data.urges.length / totalBattles) * 100) : 100;

  return { 
    mostCommonTrigger, 
    highRiskWindow,
    winRate,
    resilienceLevel: winRate > 80 ? 'Fortress' : winRate > 50 ? 'Steel' : 'Vulnerable'
  };
}

export function getWeeklyData(data: UserData) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return last7Days.map(date => ({
    name: date.split('-').slice(1).join('/'),
    urges: data.urges.filter(u => new Date(u.timestamp).toISOString().split('T')[0] === date).length,
    relapses: data.relapses.filter(r => new Date(r.timestamp).toISOString().split('T')[0] === date).length,
    checkins: data.checkIns.filter(c => c.date === date).length
  }));
}

export function getAchievements(streak: number, score: number) {
  return [
    { id: '1', name: 'Initiate', desc: 'First 24 hours clean', unlocked: streak >= 1 },
    { id: '2', name: 'Warrior', desc: '7 Day Streak reached', unlocked: streak >= 7 },
    { id: '3', name: 'Steel Mind', desc: '30 Day Mastery', unlocked: streak >= 30 },
    { id: '4', name: 'Iron Will', desc: '90 Day Ascension', unlocked: streak >= 90 },
    { id: '5', name: 'Elite Status', desc: 'Score over 80', unlocked: score >= 80 },
  ];
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
