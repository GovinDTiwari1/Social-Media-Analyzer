export function analyzeContent(text) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const hashtags = text.match(/#\w+/g) || []
  const mentions = text.match(/@\w+/g) || []
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
    wordCount: words.length,
    charCount,
    hashtagCount: hashtags.length,
    mentionCount: mentions.length,
    readingTimeSec,
    suggestions,
  }
}