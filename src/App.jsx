import { useState } from 'react'
import UploadPage from './components/UploadPage'
import AnalysisPage from './components/AnalysisPage'
import { extractPdfText } from './utils/pdfExtractor'
import { extractImageText } from './utils/ocrExtractor'
import { analyzeContent } from './utils/contentAnalyzer'
import './index.css'

function App() {
  const [view, setView] = useState('upload') // 'upload' | 'analysis'
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [platform, setPlatform] = useState('general')

  const [extractedText, setExtractedText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  const handleFileSelected = (selectedFile) => {
    setError('')
    setExtractedText('')
    setAnalysis(null)
    setFile(selectedFile)
    setFileName(selectedFile.name)
  }

  const handleAnalyze = async () => {
    if (!file) return

    const isPdf = file.type === 'application/pdf'
    const isImage = file.type.startsWith('image/')

    if (!isPdf && !isImage) {
      setError('Unsupported file type. Please upload a PDF or an image (PNG/JPG).')
      return
    }

    setError('')
    setLoading(true)
    setProgress(0)

    try {
      const text = isPdf
        ? await extractPdfText(file, setProgress)
        : await extractImageText(file, setProgress)

      if (!text) {
        setError('No text could be extracted from this file.')
        setLoading(false)
        return
      }

      const result = analyzeContent(text, platform)
      setExtractedText(text)
      setAnalysis(result)
      setView('analysis')
    } catch (err) {
      console.error(err)
      setError('Something went wrong while processing the file. Please try again.')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }

  const handleBack = () => {
    setView('upload')
    setFile(null)
    setFileName('')
    setExtractedText('')
    setAnalysis(null)
    setError('')
  }

  return (
    <div className="app">
      {view === 'upload' ? (
        <UploadPage
          file={file}
          fileName={fileName}
          platform={platform}
          onPlatformChange={setPlatform}
          onFileSelected={handleFileSelected}
          onAnalyze={handleAnalyze}
          loading={loading}
          progress={progress}
          error={error}
        />
      ) : (
        <AnalysisPage
          analysis={analysis}
          extractedText={extractedText}
          fileName={fileName}
          onBack={handleBack}
        />
      )}
    </div>
  )
}

export default App