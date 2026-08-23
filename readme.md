# Social Media Content Analyzer

A web application that extracts text from uploaded PDFs and scanned images (via OCR), 
then analyzes the content to suggest engagement improvements for social media posts.

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
The app is built with React and runs entirely client-side with no backend, keeping uploaded content private to the user's browser. PDFs are parsed directly in the browser, extracting embedded text across all pages while preserving line structure. Images go through an in-browser OCR engine, but first pass through a canvas-based preprocessing step — upscaling, grayscale conversion, contrast boosting, and sharpening — since testing on real social media screenshots showed raw OCR struggled with captions overlaid on busy photo backgrounds. A noise filter then removes garbled OCR fragments (short, symbol-heavy, or low letter-ratio lines) before analysis, so word counts reflect real caption content rather than misread artifacts.

Extracted text is analyzed for word/character count, hashtags, mentions, reading time, and a Flesch Reading Ease readability score, plus tone checks for ALL CAPS overuse, exclamation-mark spam, and call-to-action presence. These combine into a single 0–100 engagement score, and analysis is platform-aware — Twitter/X, Instagram, and LinkedIn each get different character-limit and hashtag-range checks.

The main trade-off is client-side processing: it's simple, free to host, and private, but OCR accuracy depends on image quality, and decorative fonts remain a known weak point. This was accepted in favor of a fast, lightweight tool that fully covers the upload → extract → analyze → suggest workflow.

## Live Demo

👉 https://social-media-analyzer-sage.vercel.app/