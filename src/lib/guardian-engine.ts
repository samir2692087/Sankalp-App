/**
 * @fileOverview High-performance Local Guardian Engine.
 * Provides real-time filtering and risk detection without external API dependencies.
 */

const EXPLICIT_KEYWORDS = [
  'porn', 'sex', 'nude', 'adult', 'xxx', 'hentai', 'escort', 'gamble', 'betting', 'casino',
  'hookup', 'dating', 'tinder', 'bumble', 'grindr', 'erotic', 'naked', 'pussy', 'dick', 'cock'
];

const BLOCKED_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'onlyfans.com', 'chaturbate.com',
  'pokerstars.com', 'draftkings.com', 'roobet.com', 'stake.com', 'tinder.com',
  'bumble.com', 'grindr.com', 'bet365.com'
];

const DISTRACTION_DOMAINS = [
  'instagram.com', 'facebook.com', 'twitter.com', 'x.com', 
  'reddit.com', 'tiktok.com', 'twitch.tv', 'netflix.com', 'youtube.com'
];

const KNOWLEDGE_DOMAINS = [
  'wikipedia.org', 'coursera.org', 'duolingo.com', 'github.com', 
  'stackoverflow.com', 'nextjs.org', 'reuters.com', 'bbc.com', 'ted.com', 
  'khanacademy.org', 'medium.com', 'scholar.google.com', 'google.com'
];

export interface GuardianRiskAssessment {
  status: 'SAFE' | 'WARN' | 'BLOCKED';
  reason: string;
  riskScore: number; // 0 to 100
  isBlurRequired: boolean;
}

/**
 * Assesses content safety entirely locally based on keywords and domains.
 * This version allows full browsing but applies non-intrusive "Neural Stabilizers" (blurs).
 */
export function assessContentSafety(input: string, streak: number = 0): GuardianRiskAssessment {
  const normalized = input.toLowerCase().trim();
  
  // 1. Extreme Risk (Blacklisted Domains)
  const isBlacklisted = BLOCKED_DOMAINS.some(domain => normalized.includes(domain));
  if (isBlacklisted) {
    return {
      status: 'BLOCKED',
      reason: "Neural Protocol Violation: Blacklisted environment detected. Soft-fog stabilizers active.",
      riskScore: 100,
      isBlurRequired: true
    };
  }

  // 2. Search Keyword Detection (Pre-execution check)
  const explicitMatch = EXPLICIT_KEYWORDS.find(keyword => normalized.includes(keyword));
  if (explicitMatch) {
    return {
      status: 'BLOCKED',
      reason: `Neural Breach: Explicit content intent detected ("${explicitMatch}"). Fog stabilizers active.`,
      riskScore: 100,
      isBlurRequired: true
    };
  }

  // 3. Distraction Assessment
  const isDistraction = DISTRACTION_DOMAINS.some(domain => normalized.includes(domain));
  if (isDistraction) {
    return {
      status: 'WARN',
      reason: "High Distraction Potential: Neural stabilizers active to preserve focus.",
      riskScore: 60,
      isBlurRequired: streak < 7 // Apply subtle blur to distractions if streak is low
    };
  }

  // 4. Safe Knowledge Hubs
  const isKnowledge = KNOWLEDGE_DOMAINS.some(domain => normalized.includes(domain));
  if (isKnowledge) {
    return {
      status: 'SAFE',
      reason: 'Neural Environment Stable: Knowledge zone verified.',
      riskScore: 0,
      isBlurRequired: false
    };
  }

  // 5. Default "Gray" Browsing
  return {
    status: 'SAFE',
    reason: 'Neural Stability Maintained.',
    riskScore: 20,
    isBlurRequired: false
  };
}

/**
 * Formats user input into a valid URL or search query.
 */
export function formatBrowserInput(input: string): string {
  const normalized = input.trim();
  if (!normalized) return 'https://www.google.com';

  // Heuristic for URL detection
  const isUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(normalized);
  
  if (isUrl && !normalized.includes(' ')) {
    return normalized.startsWith('http') ? normalized : `https://${normalized}`;
  }

  // Treat as search query with SafeSearch active
  return `https://www.google.com/search?q=${encodeURIComponent(normalized)}&safe=active`;
}

export function filterSearchQuery(query: string): string {
  // Removes common malicious or bypass patterns
  return query.replace(/[^\w\s\.\/\?\&\=\-]/gi, '');
}
