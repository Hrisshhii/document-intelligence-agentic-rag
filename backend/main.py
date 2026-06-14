from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path

from rag import (
    collection,
    search_documents,
    build_context,
    generate_answer,
    add_document_pages,
)

from classifier import classify_document
from parser import parse_pdf

import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs("page_images", exist_ok=True)

app.mount(
    "/images",
    StaticFiles(directory="page_images"),
    name="images"
)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "API Running"
    }


@app.post("/upload")
async def upload_document(
    file: UploadFile = File(...)
):
    safe_filename = Path(
        file.filename
    ).name

    file_extension = os.path.splitext(
        safe_filename
    )[1].lower()

    if file_extension not in ALLOWED_EXTENSIONS:
        return {
            "error":
            "Only PDF and TXT files are allowed."
        }

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        return {
            "error":
            "File exceeds 10MB limit."
        }

    file_path = os.path.join(
        UPLOAD_DIR,
        safe_filename
    )

    with open(file_path, "wb") as f:
        f.write(content)

    pages = parse_pdf(file_path)

    add_document_pages(
        pages,
        safe_filename
    )

    all_text = "\n".join(
        page["text"]
        for page in pages
    )

    try:
        classification = json.loads(
            classify_document(all_text)
        )
    except Exception:
        classification = {
            "document_type": "Unknown",
            "topic": "Unknown",
            "sensitivity": "Unknown",
            "contains_tables": False,
            "summary": "Classification unavailable"
        }

    return {
        "filename": safe_filename,
        "pages": len(pages),
        "classification": classification
    }


@app.post("/chat")
def chat(request: ChatRequest):

    if len(request.question) > 1000:
        return {
            "answer":
            "Question exceeds maximum length.",
            "citations": []
        }

    results = search_documents(
        request.question
    )

    if not results["documents"][0]:
        return {
            "answer":
            "No relevant information found.",
            "citations": []
        }

    context, citations = build_context(
        results
    )

    answer = generate_answer(
        request.question,
        results
    )

    return {
        "answer": answer,
        "citations": citations
    }


@app.get("/documents")
def get_documents():

    data = collection.get(
        include=["metadatas"]
    )

    documents = {}

    for meta in data["metadatas"]:

        filename = meta["filename"]

        if filename not in documents:
            documents[filename] = {
                "filename": filename,
                "pages": set(),
            }

        documents[filename]["pages"].add(
            meta["page"]
        )

    result = []

    for doc in documents.values():
        result.append({
            "filename": doc["filename"],
            "pages": len(doc["pages"])
        })

    return sorted(
        result,
        key=lambda x: x["filename"]
    )