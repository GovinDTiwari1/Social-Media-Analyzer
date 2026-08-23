function AnalysisResult({ analysis }) {
  if (!analysis) return null

  const stats = [
    { label: 'Words', value: analysis.wordCount },
    { label: 'Characters', value: analysis.charCount },
    { label: 'Hashtags', value: analysis.hashtagCount },
    { label: 'Mentions', value: analysis.mentionCount },
    { label: 'Reading time', value: `${analysis.readingTimeSec}s` },
    { label: 'Readability', value: `${analysis.readabilityScore} (${analysis.readabilityLabel})` },
  ]

  return (
    <div className="analysis">
      <h2>Analysis</h2>
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {analysis.positives.length > 0 && (
        <>
          <h3>What's working</h3>
          <ul className="positives-list">
            {analysis.positives.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </>
      )}

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