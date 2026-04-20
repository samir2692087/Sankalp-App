
/**
 * @fileOverview Guardian Engine for content filtering and risk detection.
 */

const BLOCKED_KEYWORDS = [
  'porn', 'sex', 'nude', 'adult', 'xxx', 'hentai', 'escort', 'gamble', 'betting', 'casino'
];

const BLOCKED_DOMAINS = [
  'pornhub.com', 'xvideos.com', 'xnxx.com', 'onlyfans.com', 'chaturbate.com'
];

const WHITELIST_DOMAINS = [
  'google.com', 'wikipedia.org', 'coursera.org', 'duolingo.com', 'github.com', 'stackoverflow.com', 'nextjs.org'
];

export interface GuardianRiskAssessment {
  isBlocked: boolean;
  reason: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedAction?: string;
}

export function assessContentSafety(input: string): GuardianRiskAssessment {
  const normalized = input.toLowerCase().trim();
  
  // 1. Keyword Check
  for (const keyword of BLOCKED_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        isBlocked: true,
        reason: `Explicit keyword detected: "${keyword}"`,
        riskLevel: 'HIGH',
        suggestedAction: 'Redirecting to neural grounding protocol.'
      };
    }
  }

  // 2. Domain Check
  for (const domain of BLOCKED_DOMAINS) {
    if (normalized.includes(domain)) {
      return {
        isBlocked: true,
        reason: `Blacklisted domain detected: ${domain}`,
        riskLevel: 'HIGH'
      };
    }
  }

  return {
    isBlocked: false,
    reason: 'Content within safety parameters.',
    riskLevel: 'LOW'
  };
}

export function isEmergencyWhitelistMode(streak: number, riskLevel: string): boolean {
  // If user is at high risk or very low streak, enable stricter filtering
  return streak < 3 || riskLevel === 'CRITICAL';
}

export function filterSearchQuery(query: string): string {
  // Simple scrubbing for safe search behavior
  return query.replace(/[^\w\s]/gi, '');
}
