# Social Media Content Analyzer

A web application that extracts text from uploaded PDFs and scanned images (via OCR), 
then analyzes the content to suggest engagement improvements for social media posts.

## Features

- 📄 Upload PDF files or scanned images (drag-and-drop or file picker)
- 🔍 Extract text from PDFs while preserving structure
- 🖼️ OCR-based text extraction from images
- 📊 Basic content analysis (word count, hashtags, mentions, readability)
- 💡 Simple engagement improvement suggestions
- ⏳ Loading states and error handling for a smooth user experience

## Tech Stack

- **Frontend:** React (Vite)
- **PDF Parsing:** pdf.js
- **OCR:** Tesseract.js
- **Upload UI:** react-dropzone

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
git clone https://github.com/<your-username>/social-media-analyzer.git
cd social-media-analyzer
npm install
```

### Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Approach
The Social Media Content Analyzer is built using React with Vite to provide a fast, responsive, and component-based frontend. Vite was chosen for its lightweight setup and fast development experience. react-dropzone is used to provide an intuitive drag-and-drop and file-picker interface for uploading PDF and image files.

For PDF files, pdf.js extracts text directly from the document while preserving the available text structure as much as possible. For image files such as screenshots or scanned social media posts, Tesseract.js performs OCR directly in the browser to recognize and extract the text.

After extraction, the application analyzes the content to calculate metrics such as word count, character count, hashtags, mentions, and estimated reading time, and provides engagement-related suggestions based on the extracted content.

A key trade-off was choosing client-side processing instead of a backend service. This keeps the application simple, reduces server requirements, and improves privacy because uploaded content can be processed locally. However, OCR performance can depend on image quality and browser resources, and complex PDFs may not preserve their original formatting perfectly. Overall, the chosen technologies provide a lightweight solution while satisfying the required upload, extraction, analysis, and usability features.

## Live Demo

👉 https://social-media-analyzer-cgcx.vercel.app/