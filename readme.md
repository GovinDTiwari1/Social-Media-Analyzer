# Social Media Content Analyzer

A web application that extracts text from uploaded PDFs and scanned images (via OCR), 
then analyzes the content to suggest engagement improvements for social media posts.

## Live Demo

👉 https://social-media-analyzer-sage.vercel.app/

## Features
- 📄 Upload PDFs or scanned images via drag-and-drop or file picker
- 👁️ Live file preview before analysis (embedded PDF viewer / image preview)
- 🔍 PDF text extraction with structure preserved across pages
- 🖼️ In-browser OCR for images, with preprocessing (upscale, grayscale, contrast, sharpening) for better accuracy on low-contrast or blurry uploads
- 🧹 OCR noise filtering so word counts reflect the real caption, not misread artifacts
- 🎯 Platform-aware suggestions for Twitter/X, Instagram, LinkedIn, or General
- 📊 Word/character count, hashtags, mentions, reading time, and readability score
- 🟢 Tone checks for ALL CAPS overuse, exclamation spam, and call-to-action presence
- 🏆 Overall 0–100 engagement score with a color-coded gauge
- ✨ Hashtags and mentions highlighted inline in the extracted text
- 📋 Copy extracted text or download it as .txt
- 🧭 Two-page flow: upload/preview, then an analysis dashboard
- ⏳ Loading states and error handling throughout


## Tech Stack

- **Frontend:** React (Vite)
- **PDF Parsing:** pdf.js
- **OCR:** Tesseract.js, with custom canvas-based image preprocessing
- **Upload UI:** react-dropzone

## Technical Details
- Client-side only — no backend, all processing happens in the browser
- Two-page flow (upload → analysis) managed with React state, no router
- PDF text extracted via pdf.js, preserving structure across all pages
- Image OCR via Tesseract.js, with canvas-based preprocessing (2x upscale, grayscale, contrast boost, sharpening) before recognition
- Post-OCR noise filter removes garbled lines using letter-ratio, word-length, and symbol-density heuristics
- Content analysis: word/char count, hashtags, mentions, reading time, Flesch Reading Ease readability score
- Tone checks: ALL CAPS overuse, exclamation-mark spam, call-to-action detection
- Platform-aware rules (Twitter/X, Instagram, LinkedIn, General) with different char-limit and hashtag-range thresholds
- Weighted 0–100 engagement score rendered as a color-coded SVG gauge
- Copy-to-clipboard and download as text file of extracted text; hashtags/mentions highlighted inline

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

```bash
git clone https://github.com/GovindTiwari1/Social-Media-Analyzer.git
cd social-media-analyzer
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://127.0.0.1:5173/`

### Build for Production

```bash
npm run build
```

## Approach
- Client-side only, built with React — no backend, keeps content private
- PDFs parsed in-browser with structure preserved across pages
- Images processed with in-browser OCR after canvas preprocessing (upscale, grayscale, contrast, sharpen) to improve accuracy on messy screenshots
- Noise filter removes garbled OCR lines before analysis for cleaner word counts
- Analyzes word/char count, hashtags, mentions, reading time, and readability
- Flags ALL CAPS overuse, exclamation spam, and missing call-to-action
- Combines all signals into a single 0–100 engagement score
- Platform-aware rules for Twitter/X, Instagram, and LinkedIn
- Trade-off: client-side keeps it simple and private, but OCR accuracy depends on image quality and decorative fonts remain a weak spot