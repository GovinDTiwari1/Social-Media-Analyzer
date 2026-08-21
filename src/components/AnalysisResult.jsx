function AnalysisResult({ analysis }) {
  if (!analysis) return null

  return (
    <div className="analysis">
      <h2>Analysis</h2>
      <ul>
        <li>Word count: {analysis.wordCount}</li>
        <li>Character count: {analysis.charCount}</li>
        <li>Hashtags: {analysis.hashtagCount}</li>
        <li>Mentions: {analysis.mentionCount}</li>
        <li>Estimated reading time: {analysis.readingTimeSec}s</li>
      </ul>

      <h3>Suggestions</h3>
      <ul>
        {analysis.suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
  )
}

export default AnalysisResult