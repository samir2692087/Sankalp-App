
import { UserData, RelapseLog, UrgeLog, CheckInLog } from './types';

export function calculateStreak(lastRelapseTimestamp: number | null): number {
  if (!lastRelapseTimestamp) return 0;
  try {
    const diff = Date.now() - lastRelapseTimestamp;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  } catch (e) {
    return 0;
  }
}

export function calculateDisciplineScore(data: UserData): number {
  if (!data) return 0;
  const urges = Array.isArray(data.urges) ? data.urges : [];
  const relapses = Array.isArray(data.relapses) ? data.relapses : [];
  const checkIns = Array.isArray(data.checkIns) ? data.checkIns : [];
  
  const currentStreak = data.currentStreak || 0;
  const streakFactor = Math.min(currentStreak * 2, 50);
  const urgeFactor = Math.min(urges.length * 3, 40);
  const checkInFactor = Math.min(checkIns.length * 0.5, 20);
  const relapsePenalty = Math.min(relapses.length * 15, 90);
  
  const rawScore = 40 + streakFactor + urgeFactor + checkInFactor - relapsePenalty;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getBehavioralInsights(data: UserData) {
  const relapses = Array.isArray(data?.relapses) ? data.relapses : [];
  const urges = Array.isArray(data?.urges) ? data.urges : [];
  
  const reasons = relapses.map(r => r?.reason || "Unknown").filter(Boolean);
  const mostCommonTrigger = reasons.length > 0 
    ? reasons.reduce((a, b, i, arr) => 
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
      ) 
    : "Consistent data required";

  const times = relapses.map(r => r?.timeOfDay || "N/A").filter(t => t !== "N/A");
  const highRiskWindow = times.length > 0
    ? times.reduce((a, b, i, arr) => 
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b)
      )
    : "N/A";

  const totalBattles = urges.length + relapses.length;
  const winRate = totalBattles > 0 ? Math.round((urges.length / totalBattles) * 100) : 100;

  // Streak Protection: Risk Detection
  const recentUrges = urges.filter(u => u?.timestamp && (Date.now() - u.timestamp < 1000 * 60 * 60 * 48)).length;
  const riskLevel = recentUrges >= 3 ? 'CRITICAL' : recentUrges >= 1 ? 'ELEVATED' : 'STABLE';

  return { 
    mostCommonTrigger, 
    highRiskWindow,
    winRate,
    resilienceLevel: winRate > 85 ? 'Fortress' : winRate > 60 ? 'Steel' : 'Vulnerable',
    riskLevel,
    protectionMessage: riskLevel === 'CRITICAL' ? "High relapse risk detected. Deploy Emergency Protocol." :
                       riskLevel === 'ELEVATED' ? "Pattern of urges noted. Stay vigilant." :
                       "Neural paths stabilizing. Keep focus."
  };
}

export function getWeeklyData(data: UserData) {
  const urges = Array.isArray(data?.urges) ? data.urges : [];
  const relapses = Array.isArray(data?.relapses) ? data.relapses : [];
  const checkIns = Array.isArray(data?.checkIns) ? data.checkIns : [];
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    try {
      return d.toISOString().split('T')[0];
    } catch (e) {
      return new Date().toISOString().split('T')[0];
    }
  });

  return last7Days.map(date => ({
    name: date.split('-').slice(1).join('/') || date,
    urges: urges.filter(u => {
      if (!u?.timestamp) return false;
      try {
        return new Date(u.timestamp).toISOString().split('T')[0] === date;
      } catch (e) {
        return false;
      }
    }).length,
    relapses: relapses.filter(r => {
      if (!r?.timestamp) return false;
      try {
        return new Date(r.timestamp).toISOString().split('T')[0] === date;
      } catch (e) {
        return false;
      }
    }).length,
    checkins: checkIns.filter(c => c?.date === date).length
  }));
}

export function getAchievements(streak: number, score: number) {
  const s = streak || 0;
  const sc = score || 0;
  return [
    { id: '1', name: 'Initiate', desc: 'First 24 hours clean', unlocked: s >= 1 },
    { id: '2', name: 'Warrior', desc: '7 Day Streak reached', unlocked: s >= 7 },
    { id: '3', name: 'Steel Mind', desc: '30 Day Mastery', unlocked: s >= 30 },
    { id: '4', name: 'Iron Will', desc: '90 Day Ascension', unlocked: s >= 90 },
    { id: '5', name: 'Fortress', desc: 'Maintain Score > 90', unlocked: sc >= 90 },
  ];
}

export function getDailyChallenge(streak: number) {
  const s = streak || 0;
  const lowStreak = [
    "Identify one trigger and remove it.",
    "Do 10 pushups when an urge hits.",
    "Drink a glass of cold water now.",
    "Write 1 goal for tomorrow."
  ];
  const midStreak = [
    "Meditate for 10 minutes.",
    "Take a 2-minute cold shower.",
    "No social media for 2 hours.",
    "Read 10 pages of self-improvement."
  ];
  const highStreak = [
    "Complete a 24-hour dopamine fast.",
    "Run 3 miles for mental clarity.",
    "Mentor someone else in discipline.",
    "Reflect on your 90-day transformation."
  ];

  const pool = s >= 90 ? highStreak : s >= 30 ? midStreak : lowStreak;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return pool[Math.max(0, dayOfYear % pool.length)];
}
