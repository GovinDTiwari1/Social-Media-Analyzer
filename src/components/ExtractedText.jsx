function ExtractedText({ text }) {
  if (!text) return null

  return (
    <div className="results">
      <h2>Extracted Text</h2>
      <pre className="extracted-text">{text}</pre>
    </div>
  )
}

export default ExtractedText