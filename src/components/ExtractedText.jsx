import { useState } from 'react'

function highlight(text) {
  const parts = text.split(/(#\w+|@[\w.]+)/g)
  return parts.map((part, i) => {
    if (/^#\w+/.test(part)) return <span key={i} className="tag-hashtag">{part}</span>
    if (/^@[\w.]+/.test(part)) return <span key={i} className="tag-mention">{part}</span>
    return part
  })
}

function ExtractedText({ text }) {
  const [copied, setCopied] = useState(false)

  if (!text) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted-text.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="results">
      <div className="results-header">
        <h2>Extracted Text</h2>
        <div className="button-row">
          <button type="button" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button type="button" className="secondary-button" onClick={handleDownload}>
            Download .txt
          </button>
        </div>
      </div>
      <pre className="extracted-text">{highlight(text)}</pre>
    </div>
  )
}

export default ExtractedText