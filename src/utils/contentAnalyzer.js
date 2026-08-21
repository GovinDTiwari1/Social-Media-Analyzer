// Removes lines that are likely OCR noise (garbled text from photos/backgrounds)
// rather than real caption content. Keeps lines that look like genuine words,
// or that contain hashtags/mentions (which we always want to keep).
//
// STRICTER VERSION: tighter thresholds than the original — catches more noise,
// but has a slightly higher chance of dropping a genuinely short real line too.
function cleanOcrNoise(text) {
  const lines = text.split('\n')

  // Common short English words we don't want to accidentally penalize
  // for being "too short" when checking average word length.
  const commonShortWords = new Set([
    'a', 'i', 'is', 'it', 'to', 'of', 'in', 'on', 'my', 'me', 'we',
    'the', 'and', 'for', 'you', 'are', 'be', 'at', 'or', 'by', 'as',
  ])

  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim()
    if (trimmed.length === 0) return false

    // Always keep lines with hashtags or mentions.
    if (/#\w+/.test(trimmed) || /@[\w.]+/.test(trimmed)) return true

    const words = trimmed.split(/\s+/).filter(Boolean)

    // Stricter: require at least 4 words (was 3)
    if (words.length < 4) return false

    // Stricter: require a higher letter ratio (was 0.6)
    const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length
    const letterRatio = letterCount / trimmed.length
    if (letterRatio < 0.75) return false

    // Stricter: require a higher average word length (was 2.2),
    // but don't penalize lines that are mostly legitimate short words.
    const nonCommonWords = words.filter((w) => !commonShortWords.has(w.toLowerCase()))
    const avgWordLength =
      nonCommonWords.reduce((sum, w) => sum + w.length, 0) / (nonCommonWords.length || 1)
    if (avgWordLength < 3) return false

    // New: reject lines with unusually high punctuation/symbol density
    // (garbled OCR often produces stray symbols like ~, |, *, etc.)
    const symbolCount = (trimmed.match(/[^a-zA-Z0-9\s.,!?'’"-]/g) || []).length
    const symbolRatio = symbolCount / trimmed.length
    if (symbolRatio > 0.15) return false

    // New: reject lines with too many single-letter "words"
    // (classic sign of garbled text broken into fragments)
    const singleLetterWords = words.filter((w) => w.length === 1).length
    if (singleLetterWords / words.length > 0.3) return false

    return true
  })

  return cleanedLines.join('\n').trim()
}

export function analyzeContent(rawText) {
  const text = cleanOcrNoise(rawText)

  const words = text.trim().split(/\s+/).filter(Boolean)
  const hashtags = text.match(/#\w+/g) || []
  const mentions = text.match(/@[\w.]+/g) || []
  const charCount = text.length
  const readingTimeSec = Math.ceil(words.length / 3.3) // ~200 wpm

  const suggestions = []
  if (hashtags.length === 0) suggestions.push('Add a few relevant hashtags to improve discoverability.')
  if (hashtags.length > 10) suggestions.push('Too many hashtags can look spammy — try trimming to 5–10.')
  if (words.length > 60) suggestions.push('Post is fairly long — consider shortening for higher engagement.')
  if (words.length < 5) suggestions.push('Post seems very short — consider adding more context.')
  if (mentions.length === 0) suggestions.push('Tagging relevant accounts can help increase reach.')
  if (suggestions.length === 0) suggestions.push('Looks good! Your post is well balanced.')

  return {
    cleanedText: text,
    wordCount: words.length,
    charCount,
    hashtagCount: hashtags.length,
    mentionCount: mentions.length,
    readingTimeSec,
    suggestions,
  }
}