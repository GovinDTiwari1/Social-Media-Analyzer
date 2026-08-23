function ScoreGauge({ score }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  let colorClass = 'score-red'
  if (score >= 80) colorClass = 'score-green'
  else if (score >= 50) colorClass = 'score-yellow'

  return (
    <div className={`score-gauge ${colorClass}`}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} className="score-track" strokeWidth="12" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          className="score-fill"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="score-label">
        <span className="score-number">{score}</span>
        <span className="score-max">/100</span>
      </div>
    </div>
  )
}

export default ScoreGauge