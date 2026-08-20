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