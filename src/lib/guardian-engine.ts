/**
 * @fileOverview High-performance Local Guardian Engine.
 * Provides real-time filtering and risk detection without external API dependencies.
 */

const BLOCKED_KEYWORDS = [
  'porn', 'sex', 'nude', 'adult', 'xxx', 'hentai', 'escort', 'gamble', 'betting', 'casino',
  'hookup', 'dating', 'tinder', 'bumble', 'grindr', 'erotic', 'naked', 'lust', 'violence'
];

const BLOCKED_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'onlyfans.com', 'chaturbate.com',
  'pokerstars.com', 'draftkings.com', 'roobet.com', 'stake.com', 'tinder.com'
];

const WHITELIST_DOMAINS = [
  'google.com', 'wikipedia.org', 'coursera.org', 'duolingo.com', 'github.com', 
  'stackoverflow.com', 'nextjs.org', 'reuters.com', 'bbc.com', 'ted.com', 
  'khanacademy.org', 'medium.com'
];

export interface GuardianRiskAssessment {
  isBlocked: boolean;
  reason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedAction?: string;
}

/**
 * Assesses content safety entirely locally based on keywords and domains.
 */
export function assessContentSafety(input: string, streak: number = 0): GuardianRiskAssessment {
  const normalized = input.toLowerCase().trim();
  
  // 1. Strict Whitelist Mode for Low Streaks (Emergency Mode)
  const isEmergency = streak < 3;
  if (isEmergency) {
    const isWhitelisted = WHITELIST_DOMAINS.some(domain => normalized.includes(domain));
    if (!isWhitelisted && normalized.includes('.')) {
      return {
        isBlocked: true,
        reason: "Emergency Focus Protocol: Only educational domains allowed during recovery.",
        riskLevel: 'HIGH',
        suggestedAction: "Complete the 3-day stabilization period to unlock global browsing."
      };
    }
  }

  // 2. Keyword Check (Search Queries or URLs)
  for (const keyword of BLOCKED_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isBlocked: true,
        reason: `Discipline Breach: Explicit pattern detected ("${keyword}").`,
        riskLevel: 'HIGH',
        suggestedAction: "Redirecting to Neural Grounding Protocol."
      };
    }
  }

  // 3. Domain Check
  for (const domain of BLOCKED_DOMAINS) {
    if (normalized.includes(domain)) {
      return {
        isBlocked: true,
        reason: `Threat Detected: Blacklisted domain (${domain}).`,
        riskLevel: 'HIGH'
      };
    }
  }

  // 4. Gray Area Detection (Distractions)
  const distractions = ['youtube.com', 'instagram.com', 'facebook.com', 'twitter.com', 'reddit.com', 'tiktok.com'];
  if (distractions.some(d => normalized.includes(d))) {
    return {
      isBlocked: false,
      reason: "High Distraction Potential detected.",
      riskLevel: 'MEDIUM'
    };
  }

  return {
    isBlocked: false,
    reason: 'Neural Environment Stable.',
    riskLevel: 'LOW'
  };
}

export function filterSearchQuery(query: string): string {
  // Local scrubbing: remove special characters that might be used to bypass filters
  return query.replace(/[^\w\s\.\/]/gi, '');
}
