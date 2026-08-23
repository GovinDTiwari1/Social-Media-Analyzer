import UploadBox from './UploadBox'
import FilePreview from './FilePreview'
import LoadingSpinner from './LoadingSpinner'
import { PLATFORMS } from '../utils/contentAnalyzer'

function UploadPage({
  file,
  fileName,
  platform,
  onPlatformChange,
  onFileSelected,
  onAnalyze,
  loading,
  progress,
  error,
}) {
  return (
    <div className="upload-page">
      <h1>Social Media Content Analyzer</h1>
      <p className="subtitle">
        Upload a PDF or scanned image to extract text and get an engagement score.
      </p>

      <div className="platform-select-row">
        <label htmlFor="platform">Target platform</label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => onPlatformChange(e.target.value)}
        >
          {Object.entries(PLATFORMS).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      <UploadBox onFileAccepted={onFileSelected} fileName={fileName} />

      <FilePreview file={file} />

      {loading && <LoadingSpinner progress={progress} />}

      {error && <p className="error">{error}</p>}

      <button
        type="button"
        className="analyze-button"
        onClick={onAnalyze}
        disabled={!file || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </div>
  )
}

export default UploadPage
