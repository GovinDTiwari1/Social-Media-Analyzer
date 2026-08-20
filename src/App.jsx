import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as pdfjsLib from 'pdfjs-dist'
import Tesseract from 'tesseract.js'
import './index.css'

// Point pdf.js to its worker (served from node_modules via Vite)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

function App() {
  const [extractedText, setExtractedText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((item) => item.str).join(' ')
      fullText += pageText + '\n\n'
      setProgress(Math.round((i / pdf.numPages) * 100))
    }
    return fullText.trim()
  }

  const extractImageText = async (file) => {
    const result = await Tesseract.recognize(file, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100))
        }
      },
    })
    return result.data.text.trim()
  }

  const analyzeContent = (text) => {
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
      const text = isPdf ? await extractPdfText(file) : await extractImageText(file)

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

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) handleFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
  })

  return (
    <div className="app">
      <h1>Social Media Content Analyzer</h1>
      <p className="subtitle">Upload a PDF or scanned image to extract text and get engagement suggestions.</p>

      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the file here...</p>
        ) : (
          <p>Drag & drop a PDF or image here, or click to select a file</p>
        )}
      </div>

      {fileName && !loading && <p className="filename">Selected: {fileName}</p>}

      {loading && (
        <div className="loading">
          <p>Processing... {progress}%</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      {extractedText && (
        <div className="results">
          <h2>Extracted Text</h2>
          <pre className="extracted-text">{extractedText}</pre>

          {analysis && (
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
                {analysis.suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App