import { UserData } from './types';
import { Language } from './translations';

export function calculateStreak(lastRelapseTimestamp: number | null): number {
  if (!lastRelapseTimestamp || typeof lastRelapseTimestamp !== 'number' || isNaN(lastRelapseTimestamp)) return 0;
  try {
    const diff = Date.now() - lastRelapseTimestamp;
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  } catch (e) {
    return 0;
  }
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function calculateXP(data: UserData): number {
  const checkInPoints = (data.checkIns?.length || 0) * 50;
  const urgePoints = (data.urges?.length || 0) * 30;
  const streakPoints = (data.currentStreak || 0) * 10;
  return checkInPoints + urgePoints + streakPoints;
}

export function calculateDisciplineScore(data: UserData): number {
  if (!data) return 0;
  const urges = Array.isArray(data.urges) ? data.urges : [];
  const relapses = Array.isArray(data.relapses) ? data.relapses : [];
  const checkIns = Array.isArray(data.checkIns) ? data.checkIns : [];
  
  const currentStreak = typeof data.currentStreak === 'number' && !isNaN(data.currentStreak) ? data.currentStreak : 0;
  const streakFactor = Math.min(currentStreak * 2, 50);
  const urgeFactor = Math.min(urges.length * 3, 40);
  const checkInFactor = Math.min(checkIns.length * 0.5, 20);
  const relapsePenalty = Math.min(relapses.length * 15, 90);
  
  const rawScore = 40 + streakFactor + urgeFactor + checkInFactor - relapsePenalty;
  return Math.max(0, Math.min(100, Math.round(rawScore)));
}

export function getBehavioralInsights(data: UserData, lang: Language = 'en') {
  const relapses = Array.isArray(data.relapses) ? data.relapses : [];
  const urges = Array.isArray(data.urges) ? data.urges : [];

  const getMostFrequent = (arr: string[]) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const counts = arr.reduce((acc, val) => {
      if (val) acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const entries = Object.entries(counts);
    if (entries.length === 0) return null;
    return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
  };

  const reasons = relapses.map(r => r?.reason).filter((r): r is string => !!r);
  const mostCommonTrigger = getMostFrequent(reasons) || (lang === 'en' ? "Consistent data required" : "लगातार डेटा की आवश्यकता है");

  const times = relapses.map(r => r?.timeOfDay).filter((t): t is string => !!t);
  const highRiskWindow = getMostFrequent(times) || "N/A";

  const totalBattles = urges.length + relapses.length;
  const winRate = totalBattles > 0 ? Math.round((urges.length / totalBattles) * 100) : 100;

  const now = Date.now();
  const recentUrges = urges.filter(u => u?.timestamp && (now - u.timestamp < 1000 * 60 * 60 * 48)).length;
  const streak = data.currentStreak || 0;
  
  let riskLevel: 'STABLE' | 'ELEVATED' | 'CRITICAL' = 'STABLE';
  if (recentUrges >= 3 || (recentUrges >= 1 && streak < 3)) {
    riskLevel = 'CRITICAL';
  } else if (recentUrges >= 1) {
    riskLevel = 'ELEVATED';
  }

  const messages = {
    STABLE: { en: "Stay focused. Every minute of control is a victory.", hi: "केंद्रित रहें। नियंत्रण का हर मिनट एक जीत है।" },
    ELEVATED: { en: "Stay sharp. Awareness is your primary focus.", hi: "सतर्क रहें। जागरूकता आपका प्राथमिक फोकस है।" },
    CRITICAL: { en: "Take a moment to reset. Your resolve is being tested.", hi: "रीसेट करने के लिए कुछ समय लें। आपके संकल्प की परीक्षा ली जा रही है।" }
  };

  return { 
    mostCommonTrigger, 
    highRiskWindow,
    winRate,
    resilienceLevel: winRate > 85 ? 'Fortress' : winRate > 60 ? 'Steady' : 'Vulnerable',
    riskLevel,
    protectionMessage: messages[riskLevel][lang]
  };
}

export function getWeeklyData(data: UserData) {
  if (!data) return [];
  const urges = Array.isArray(data.urges) ? data.urges : [];
  const relapses = Array.isArray(data.relapses) ? data.relapses : [];
  const checkIns = Array.isArray(data.checkIns) ? data.checkIns : [];
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return last7Days.map(date => ({
    name: date.split('-').slice(1).join('/') || date,
    urges: urges.filter(u => u?.timestamp && new Date(u.timestamp).toISOString().split('T')[0] === date).length,
    relapses: relapses.filter(r => r?.timestamp && new Date(r.timestamp).toISOString().split('T')[0] === date).length,
    checkins: checkIns.filter(c => c?.date === date).length
  }));
}

export function getAchievements(streak: number, score: number) {
  const s = streak || 0;
  const sc = score || 0;
  return [
    { id: '1', name: 'Starting', desc: 'First 24 hours held', unlocked: s >= 1 },
    { id: '2', name: 'Steady', desc: '7 Day path reached', unlocked: s >= 7 },
    { id: '3', name: 'Clear Mind', desc: '30 Day resolve', unlocked: s >= 30 },
    { id: '4', name: 'Iron Will', desc: '90 Day mastery complete', unlocked: s >= 90 },
    { id: '5', name: 'Grounded', desc: 'Inner Strength > 90', unlocked: sc >= 90 },
  ];
}

export function getDailyChallenge(streak: number, lang: Language = 'en') {
  const s = streak || 0;
  const challenges = {
    low: [
      { en: "Identify one distraction and remove it.", hi: "एक व्याकुलता को पहचानें और उसे हटा दें।" },
      { en: "Do 10 pushups if you feel restless.", hi: "यदि आप बेचैन महसूस करते हैं तो 10 पुशअप्स करें।" },
      { en: "Drink a glass of cold water now.", hi: "अभी एक गिलास ठंडा पानी पियें।" },
      { en: "Write 1 goal for tomorrow.", hi: "कल के लिए 1 लक्ष्य लिखें।" }
    ],
    mid: [
      { en: "Reflect quietly for 10 minutes.", hi: "10 मिनट के लिए शांति से चिंतन करें।" },
      { en: "Take a quick 2-minute cold shower.", hi: "जल्दी से 2 मिनट का ठंडा शॉवर लें।" },
      { en: "Unplug for 2 hours.", hi: "2 घंटे के लिए अनप्लग करें।" },
      { en: "Read 10 pages for growth.", hi: "विकास के लिए 10 पृष्ठ पढ़ें।" }
    ],
    high: [
      { en: "Complete a 24-hour focus fast.", hi: "24 घंटे का फोकस फास्ट पूरा करें।" },
      { en: "Go for a run for clarity.", hi: "स्पष्टता के लिए दौड़ें।" },
      { en: "Help someone else stay disciplined.", hi: "किसी और को अनुशासित रहने में मदद करें।" },
      { en: "Reflect on your 90-day growth.", hi: "अपने 90 दिनों के विकास पर विचार करें।" }
    ]
  };

  const pool = s >= 90 ? challenges.high : s >= 30 ? challenges.mid : challenges.low;
  const now = Date.now();
  const dayOfYear = Math.floor((now - new Date(new Date(now).getFullYear(), 0, 0).getTime()) / 86400000);
  return pool[dayOfYear % pool.length][lang];
}
