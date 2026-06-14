# Document Intelligence + Agentic RAG

## Overview

Document Intelligence + Agentic RAG is a full-stack application that enables users to upload documents, automatically classify them, index their contents using semantic embeddings, and chat with their knowledge base using Retrieval-Augmented Generation (RAG).

The system supports document ingestion, semantic search, citation-aware responses, page image previews, and multi-document querying.

## Features

### Document Processing

* PDF document upload
* OCR/text extraction pipeline
* Page image generation
* Multi-document support

### Classification

* AI-powered document classification
* Document type detection
* Topic identification
* Sensitivity analysis
* Table detection

### Retrieval-Augmented Generation

* SentenceTransformer embeddings
* ChromaDB vector storage
* Semantic similarity search
* Recursive text chunking
* Context-aware retrieval

### Citations

* Source document tracking
* Page-level citations
* Source page image previews
* Citation-aware answers

### Security

* File type validation
* File size restrictions
* Filename sanitization
* CORS configuration
* Empty-result handling

## Architecture

Frontend:

* Next.js 16
* TypeScript
* Tailwind CSS

Backend:

* FastAPI
* ChromaDB
* Sentence Transformers
* Gemini API (with fallback mode)

Flow:

Upload Document
→ Parse PDF
→ Extract Text
→ Generate Page Images
→ Create Chunks
→ Generate Embeddings
→ Store in ChromaDB

User Question
→ Semantic Search
→ Retrieve Relevant Chunks
→ Generate Answer
→ Return Citations

## Project Structure

backend/

* main.py
* rag.py
* parser.py
* classifier.py

frontend/

* app/
* components/
* lib/

vector_db/
uploads/
page_images/

## Setup

### Backend

cd backend

python -m venv venv

source venv/bin/activate

pip install -r requirements.txt

uvicorn main:app --reload

### Frontend

cd frontend

npm install

npm run dev

## Security Decisions

* Uploaded filenames are sanitized using pathlib.
* Unsupported file types are rejected.
* Files larger than 10 MB are blocked.
* Empty search results are handled gracefully.
* Generated assets are excluded from version control.
* Environment variables are used for API keys.

## Future Improvements

* Multi-modal document understanding
* Table-aware extraction
* Advanced agent workflows
* Role-based access control
* Cloud storage integration
* Streaming responses

## Screenshots

(Add screenshots after UI improvements)

## Author

Hrishikesh Rathod
