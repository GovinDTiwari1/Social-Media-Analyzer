import Tesseract from 'tesseract.js'

// Applies a 3x3 sharpen convolution kernel to counteract blur — helps
// noticeably on slightly out-of-focus phone photos of screens/documents.
function sharpen(imageData) {
  const { data, width, height } = imageData
  const output = new Uint8ClampedArray(data)
  const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0
        let k = 0
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c
            sum += data[idx] * kernel[k]
            k++
          }
        }
        const outIdx = (y * width + x) * 4 + c
        output[outIdx] = Math.max(0, Math.min(255, sum))
      }
    }
  }

  return new ImageData(output, width, height)
}

// Preprocess the image before OCR: upscale, grayscale, boost contrast,
// and sharpen. Significantly improves accuracy on screenshots with photo
// backgrounds and on slightly blurry uploads.
function preprocessImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = 2
      const canvas = document.createElement('canvas')
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const contrast = 1.4
      const intercept = 128 * (1 - contrast)

      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        const adjusted = gray * contrast + intercept
        const clamped = Math.max(0, Math.min(255, adjusted))
        data[i] = data[i + 1] = data[i + 2] = clamped
      }

      // Skip sharpening on very large images to keep this fast in-browser.
      const pixelCount = canvas.width * canvas.height
      if (pixelCount < 4_000_000) {
        imageData = sharpen(imageData)
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