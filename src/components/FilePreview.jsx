import { useEffect, useMemo } from 'react'

function FilePreview({ file }) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  if (!file || !url) return null

  const isPdf = file.type === 'application/pdf'

  return (
    <div className="preview-card">
      <h3>Preview</h3>
      {isPdf ? (
        <iframe src={url} title="PDF preview" className="preview-pdf" />
      ) : (
        <img src={url} alt="Upload preview" className="preview-image" />
      )}
    </div>
  )
}

export default FilePreview