/**
 * ACR Cottons Atelier Content Moderation & Anti-Abuse Sentinel
 * Filters profanity, vulgarity, spam URLs, XSS scripts, and rate-limits rapid submissions.
 */

// Common abusive, vulgar, toxic words and derogatory slurs (English & transliterated Indian slang)
const PROFANITY_TERMS = new Set([
  // English vulgarities & slurs
  'fuck', 'fucking', 'fucker', 'shit', 'shitty', 'bitch', 'asshole', 'bastard', 'cunt', 'dick',
  'pussy', 'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'scam', 'fraud', 'cheat',
  'fake', 'bullshit', 'motherfucker', 'cock', 'porn', 'sex', 'nude', 'viagra', 'casino', 'betting',
  // Transliterated abusive slang
  'chutiya', 'chutiye', 'bhenchod', 'madarchod', 'bc', 'mc', 'laude', 'lund', 'gandu', 'harami',
  'bhosdike', 'kamina', 'randi', 'thevidiya', 'baadu', 'sunni', 'oombu', 'kena', 'pottai',
  'poda', 'lavade', 'kutta', 'kaminey', 'saala', 'kaminey'
]);

// URL & Promotional Link Detection
const URL_PATTERN = /(https?:\/\/|www\.|\.com|\.in|\.org|\.net|\.xyz|\.top|\.ru|\.cn|telegram|t\.me|wa\.me|bit\.ly|tinyurl)/i;

// HTML/Script Injection Detection (XSS defense)
const XSS_PATTERN = /(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|<iframe|javascript:|onerror=|onload=|eval\(|<object|<embed)/i;

// Excessive character repetition (e.g. "aaaaaa", "!!!!!!")
const REPETITION_PATTERN = /(.)\1{5,}/;

export interface ModerationResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Checks a given text for profanity, malicious code, or spam.
 */
export function evaluateContent(text: string): ModerationResult {
  if (!text || !text.trim()) {
    return { allowed: false, reason: 'Field cannot be empty.' };
  }

  // 1. Check for XSS / Script injection
  if (XSS_PATTERN.test(text)) {
    return {
      allowed: false,
      reason: 'HTML tags, scripts, and code execution are strictly prohibited.',
    };
  }

  // 2. Check for URLs / Promotional links
  if (URL_PATTERN.test(text)) {
    return {
      allowed: false,
      reason: 'External web links, telegrams, and promotional URLs are not permitted.',
    };
  }

  // 3. Check for repetitive character spam
  if (REPETITION_PATTERN.test(text)) {
    return {
      allowed: false,
      reason: 'Excessive repetitive character patterns detected. Please provide natural feedback.',
    };
  }

  // 4. Tokenize and check for abusive terms
  // Normalize by stripping punctuation and converting to lowercase
  const normalizedWords = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  for (const word of normalizedWords) {
    if (PROFANITY_TERMS.has(word)) {
      return {
        allowed: false,
        reason: 'Your message contains prohibited or abusive language. Please maintain professional decorum.',
      };
    }
  }

  return { allowed: true };
}

/**
 * Validates a review submission completely.
 */
export function validateReview(data: {
  name: string;
  city: string;
  title: string;
  comment: string;
  rating: number;
}): ModerationResult {
  if (data.rating < 1 || data.rating > 5) {
    return { allowed: false, reason: 'Rating must be between 1 and 5 stars.' };
  }

  if (data.name.trim().length < 2 || data.name.trim().length > 50) {
    return { allowed: false, reason: 'Name must be between 2 and 50 characters.' };
  }

  if (data.city.trim().length < 2 || data.city.trim().length > 60) {
    return { allowed: false, reason: 'City must be between 2 and 60 characters.' };
  }

  if (data.title.trim().length < 3 || data.title.trim().length > 120) {
    return { allowed: false, reason: 'Review title must be between 3 and 120 characters.' };
  }

  if (data.comment.trim().length < 10 || data.comment.trim().length > 1200) {
    return { allowed: false, reason: 'Review comments must be between 10 and 1200 characters.' };
  }

  // Check each field
  const nameCheck = evaluateContent(data.name);
  if (!nameCheck.allowed) return nameCheck;

  const cityCheck = evaluateContent(data.city);
  if (!cityCheck.allowed) return cityCheck;

  const titleCheck = evaluateContent(data.title);
  if (!titleCheck.allowed) return titleCheck;

  const commentCheck = evaluateContent(data.comment);
  if (!commentCheck.allowed) return commentCheck;

  return { allowed: true };
}

/**
 * Validates a bespoke commission submission.
 */
export function validateBespokeRequest(data: {
  fabric: string;
  dimensions: string;
  notes: string;
  quantity: number;
}): ModerationResult {
  if (data.quantity < 1 || data.quantity > 500) {
    return { allowed: false, reason: 'Quantity must be between 1 and 500 pieces.' };
  }

  if (data.dimensions.trim().length < 3 || data.dimensions.trim().length > 80) {
    return { allowed: false, reason: 'Please specify valid dimensions (e.g. 108" x 108").' };
  }

  const dimCheck = evaluateContent(data.dimensions);
  if (!dimCheck.allowed) return dimCheck;

  if (data.notes && data.notes.trim()) {
    if (data.notes.trim().length > 1500) {
      return { allowed: false, reason: 'Notes cannot exceed 1500 characters.' };
    }
    const notesCheck = evaluateContent(data.notes);
    if (!notesCheck.allowed) return notesCheck;
  }

  return { allowed: true };
}

/**
 * Client-side rate-limiter to prevent rapid spam clicking / bot flood.
 */
export function checkRateLimit(actionKey: string, cooldownSeconds = 15): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const key = `acr_rate_${actionKey}`;
    const lastTime = localStorage.getItem(key);
    const now = Date.now();
    if (lastTime) {
      const elapsed = (now - parseInt(lastTime, 10)) / 1000;
      if (elapsed < cooldownSeconds) {
        return false; // Rate limited
      }
    }
    localStorage.setItem(key, now.toString());
    return true; // Allowed
  } catch {
    return true;
  }
}
