/**
 * @fileOverview High-performance Local Guardian Engine.
 * Provides real-time filtering and risk detection without external API dependencies.
 */

const BLOCKED_KEYWORDS = [
  'porn', 'sex', 'nude', 'adult', 'xxx', 'hentai', 'escort', 'gamble', 'betting', 'casino',
  'hookup', 'dating', 'tinder', 'bumble', 'grindr', 'erotic', 'naked', 'lust', 'violence',
  'gore', 'nsfw', 'pussy', 'dick', 'cock'
];

const BLOCKED_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'onlyfans.com', 'chaturbate.com',
  'pokerstars.com', 'draftkings.com', 'roobet.com', 'stake.com', 'tinder.com',
  'bumble.com', 'grindr.com', 'bet365.com'
];

const DISTRACTION_DOMAINS = [
  'instagram.com', 'facebook.com', 'twitter.com', 'x.com', 
  'reddit.com', 'tiktok.com', 'twitch.tv', 'netflix.com'
];

const WHITELIST_DOMAINS = [
  'google.com', 'wikipedia.org', 'coursera.org', 'duolingo.com', 'github.com', 
  'stackoverflow.com', 'nextjs.org', 'reuters.com', 'bbc.com', 'ted.com', 
  'khanacademy.org', 'medium.com', 'scholar.google.com'
];

export interface GuardianRiskAssessment {
  isBlocked: boolean;
  reason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  suggestedAction?: string;
}

/**
 * Assesses content safety entirely locally based on keywords and domains.
 */
export function assessContentSafety(input: string, streak: number = 0): GuardianRiskAssessment {
  const normalized = input.toLowerCase().trim();
  
  // 1. Extreme Block Check (Hard Blocked Keywords/Domains)
  for (const domain of BLOCKED_DOMAINS) {
    if (normalized.includes(domain)) {
      return {
        isBlocked: true,
        reason: "Neural Threat: Blacklisted Domain Intercepted.",
        riskLevel: 'EXTREME'
      };
    }
  }

  for (const keyword of BLOCKED_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isBlocked: true,
        reason: `Neural Breach: Explicit keyword detected ("${keyword}").`,
        riskLevel: 'EXTREME'
      };
    }
  }

  // 2. High Risk (Strong Warning/Blur)
  if (streak < 3) {
    const isWhitelisted = WHITELIST_DOMAINS.some(domain => normalized.includes(domain));
    const isSearching = !normalized.includes('.');
    
    if (!isWhitelisted && !isSearching && normalized.includes('.') && !normalized.includes('google.com')) {
      return {
        isBlocked: false,
        reason: "Emergency Stabilization: High focus required for low streaks.",
        riskLevel: 'HIGH',
        suggestedAction: "Stabilize for 3 days to unlock standard freedom."
      };
    }
  }

  // 3. Distraction Detection (Medium Risk/Soft Blur)
  if (DISTRACTION_DOMAINS.some(d => normalized.includes(d))) {
    return {
      isBlocked: false,
      reason: "High Distraction Potential detected. Neural pulse active.",
      riskLevel: 'MEDIUM'
    };
  }

  return {
    isBlocked: false,
    reason: 'Neural Environment Stable.',
    riskLevel: 'LOW'
  };
}

/**
 * Formats user input into a valid URL or search query.
 */
export function formatBrowserInput(input: string): string {
  const normalized = input.trim();
  if (!normalized) return 'https://www.google.com';

  // Check if it's a URL (contains a dot and no spaces)
  const isUrl = normalized.includes('.') && !normalized.includes(' ');
  
  if (isUrl) {
    // Add protocol if missing
    return normalized.startsWith('http') ? normalized : `https://${normalized}`;
  }

  // Otherwise, treat as a search query
  return `https://www.google.com/search?q=${encodeURIComponent(normalized)}&safe=active`;
}

export function filterSearchQuery(query: string): string {
  return query.replace(/[^\w\s\.\/]/gi, '');
}
