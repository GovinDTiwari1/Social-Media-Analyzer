import ScoreGauge from './ScoreGauge'
import AnalysisResult from './AnalysisResult'
import ExtractedText from './ExtractedText'
import { PLATFORMS } from '../utils/contentAnalyzer'

function AnalysisPage({ analysis, extractedText, fileName, onBack }) {
  if (!analysis) return null

  const platformLabel = PLATFORMS[analysis.platform]?.label || 'General'

  return (
    <div className="analysis-page">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back to upload
      </button>

      <div className="dashboard-header">
        <div>
          <h1>Analysis Results</h1>
          <p className="subtitle">
            {fileName} · {platformLabel}
          </p>
        </div>
        <ScoreGauge score={analysis.score} />
      </div>

      <AnalysisResult analysis={analysis} />
      <ExtractedText text={extractedText} />
    </div>
  )
}

export default AnalysisPage