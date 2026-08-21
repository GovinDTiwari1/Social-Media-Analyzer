import Tesseract from 'tesseract.js'

// Preprocess the image before OCR: upscale, grayscale, and boost contrast.
// This significantly improves accuracy on screenshots with photos/backgrounds
// behind the text (like Instagram/social media posts).
function preprocessImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = 2 // upscale for better OCR on small text
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Grayscale + contrast boost
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const contrast = 1.4 // >1 increases contrast
      const intercept = 128 * (1 - contrast)

      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        const adjusted = gray * contrast + intercept
        const clamped = Math.max(0, Math.min(255, adjusted))
        data[i] = data[i + 1] = data[i + 2] = clamped
      }

      ctx.putImageData(imageData, 0, 0)
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export async function extractImageText(file, onProgress) {
  const processedBlob = await preprocessImage(file)

  const result = await Tesseract.recognize(processedBlob, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(m.progress * 100))
      }
    },
  })

  return result.data.text.trim()
}