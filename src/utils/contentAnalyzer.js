// ---------- OCR noise cleanup ----------
function cleanOcrNoise(text) {
  const lines = text.split('\n')

  const commonShortWords = new Set([
    'a', 'i', 'is', 'it', 'to', 'of', 'in', 'on', 'my', 'me', 'we',
    'the', 'and', 'for', 'you', 'are', 'be', 'at', 'or', 'by', 'as',
  ])

  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim()
    if (trimmed.length === 0) return false
    if (/#\w+/.test(trimmed) || /@[\w.]+/.test(trimmed)) return true

    const words = trimmed.split(/\s+/).filter(Boolean)
    if (words.length < 4) return false

    const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length
    const letterRatio = letterCount / trimmed.length
    if (letterRatio < 0.75) return false

    const nonCommonWords = words.filter((w) => !commonShortWords.has(w.toLowerCase()))
    const avgWordLength =
      nonCommonWords.reduce((sum, w) => sum + w.length, 0) / (nonCommonWords.length || 1)
    if (avgWordLength < 3) return false

    const symbolCount = (trimmed.match(/[^a-zA-Z0-9\s.,!?'’"-]/g) || []).length
    const symbolRatio = symbolCount / trimmed.length
    if (symbolRatio > 0.15) return false

    const singleLetterWords = words.filter((w) => w.length === 1).length
    if (singleLetterWords / words.length > 0.3) return false

    return true
  })

  return cleanedLines.join('\n').trim()
}

// ---------- Readability (Flesch Reading Ease, approximate) ----------
function countSyllables(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!cleaned) return 0
  const stripped = cleaned.replace(/e$/, '')
  const matches = stripped.match(/[aeiouy]{1,2}/g)
  return matches ? Math.max(matches.length, 1) : 1
}

function computeReadability(text, words) {
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
  const sentenceCount = sentences.length || 1
  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const wordCount = words.length || 1

  const score =
    206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount)
  const rounded = Math.max(0, Math.min(100, Math.round(score)))

  let label = 'Standard'
  if (rounded >= 90) label = 'Very Easy'
  else if (rounded >= 70) label = 'Easy'
  else if (rounded >= 60) label = 'Fairly Easy'
  else if (rounded >= 50) label = 'Standard'
  else if (rounded >= 30) label = 'Fairly Difficult'
  else label = 'Difficult'

  return { readabilityScore: rounded, readabilityLabel: label }
}

// ---------- Platform config ----------
const PLATFORM_CONFIG = {
  general: { label: 'General', charLimit: null, hashtagIdeal: [3, 12] },
  twitter: { label: 'Twitter / X', charLimit: 280, hashtagIdeal: [1, 2] },
  instagram: { label: 'Instagram', charLimit: null, hashtagIdeal: [5, 10] },
  linkedin: { label: 'LinkedIn', charLimit: null, hashtagIdeal: [0, 3] },
}

const CTA_PHRASES = [
  'comment', 'share', 'tag', 'link in bio', 'dm us', 'click the link',
  'let us know', 'follow', 'subscribe', 'sign up', 'learn more', 'shop now',
  'swipe up', 'save this post',
]

export const PLATFORMS = PLATFORM_CONFIG

// ---------- Main analysis ----------
export function analyzeContent(rawText, platform = 'general') {
  const text = cleanOcrNoise(rawText)
  const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.general

  const words = text.trim().split(/\s+/).filter(Boolean)
  const hashtags = text.match(/#\w+/g) || []
  const mentions = text.match(/@[\w.]+/g) || []
  const charCount = text.length
  const readingTimeSec = Math.ceil(words.length / 3.3)

  const { readabilityScore, readabilityLabel } = computeReadability(text, words)

  const allCapsWords = words.filter((w) => w.length >= 3 && w === w.toUpperCase() && /[A-Z]/.test(w))
  const allCapsRatio = words.length ? allCapsWords.length / words.length : 0
  const exclamationCount = (text.match(/!/g) || []).length
  const lowerText = text.toLowerCase()
  const hasCTA = CTA_PHRASES.some((phrase) => lowerText.includes(phrase))

  // ---------- Score ----------
  let score = 100
  const breakdown = []
  const ding = (label, amount) => {
    score += amount
    breakdown.push({ label, amount })
  }

  const [hashMin, hashMax] = config.hashtagIdeal
  if (hashtags.length === 0 && hashMin > 0) {
    ding(`No hashtags used — ${config.label} posts typically benefit from ${hashMin}-${hashMax}.`, -15)
  } else if (hashtags.length > hashMax + 3) {
    ding(`Too many hashtags for ${config.label} — consider trimming closer to ${hashMax}.`, -10)
  }

  if (mentions.length === 0) {
    ding('No mentions/tags — tagging relevant accounts can help increase reach.', -8)
  }

  if (config.charLimit && charCount > config.charLimit) {
    ding(`Exceeds ${config.label}'s ${config.charLimit} character limit.`, -20)
  } else if (!config.charLimit && words.length > 60) {
    ding('Post is fairly long — consider shortening for higher engagement.', -10)
  }

  if (words.length < 5) {
    ding('Post is very short — consider adding more context.', -15)
  }

  if (allCapsRatio > 0.15) {
    ding('Excessive use of ALL CAPS can come across as shouting.', -8)
  }

  if (exclamationCount > 3) {
    ding('Too many exclamation marks — can look spammy.', -5)
  }

  if (readabilityScore < 30) {
    ding('Text may be hard to read — consider shorter sentences.', -8)
  } else if (readabilityScore >= 90) {
    ding('Very easy to read — great for engagement.', 3)
  }

  if (!hasCTA) {
    ding('No clear call-to-action — try prompting readers to comment, share, or tag someone.', -8)
  } else {
    ding('Includes a clear call-to-action.', 5)
  }

  score = Math.max(0, Math.min(100, Math.round(score)))

  const suggestions = breakdown.filter((b) => b.amount < 0).map((b) => b.label)
  const positives = breakdown.filter((b) => b.amount > 0).map((b) => b.label)
  if (suggestions.length === 0) suggestions.push('Looks good! Your post is well balanced.')

  return {
    cleanedText: text,
    platform,
    wordCount: words.length,
    charCount,
    hashtagCount: hashtags.length,
    mentionCount: mentions.length,
    readingTimeSec,
    readabilityScore,
    readabilityLabel,
    hasCTA,
    score,
    suggestions,
    positives,
  }
}