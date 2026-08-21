import { useState } from 'react'
import UploadBox from './components/UploadBox'
import LoadingSpinner from './components/LoadingSpinner'
import ExtractedText from './components/ExtractedText'
import AnalysisResult from './components/AnalysisResult'
import { extractPdfText } from './utils/pdfExtractor'
import { extractImageText } from './utils/ocrExtractor'
import { analyzeContent } from './utils/contentAnalyzer'
import './index.css'

function App() {
  const [extractedText, setExtractedText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const handleFile = async (file) => {
    setError('')
    setExtractedText('')
    setAnalysis(null)
    setProgress(0)
    setFileName(file.name)

    if (!file) return

    const isPdf = file.type === 'application/pdf'
    const isImage = file.type.startsWith('image/')

    if (!isPdf && !isImage) {
      setError('Unsupported file type. Please upload a PDF or an image (PNG/JPG).')
      return
    }

    setLoading(true)
    try {
      const text = isPdf
        ? await extractPdfText(file, setProgress)
        : await extractImageText(file, setProgress)

      if (!text) {
        setError('No text could be extracted from this file.')
        setLoading(false)
        return
      }

      setExtractedText(text)
      setAnalysis(analyzeContent(text))
    } catch (err) {
      console.error(err)
      setError('Something went wrong while processing the file. Please try again.')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="app">
      <h1>Social Media Content Analyzer</h1>
      <p className="subtitle">
        Upload a PDF or scanned image to extract text and get engagement suggestions.
      </p>

      <UploadBox onFileAccepted={handleFile} fileName={fileName} loading={loading} />

      {loading && <LoadingSpinner progress={progress} />}

      {error && <p className="error">{error}</p>}

      <ExtractedText text={extractedText} />

      {analysis && (
        <div className="results">
          <AnalysisResult analysis={analysis} />
        </div>
      )}
    </div>
  )
}

export default App