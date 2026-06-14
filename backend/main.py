from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import os

from rag import (
    search_documents,
    build_context,
    generate_answer,
    add_document_pages
)

from parser import parse_pdf

app = FastAPI()
UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs("page_images", exist_ok=True)

# Serve page images
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
async def upload_document(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    pages = parse_pdf(file_path)

    add_document_pages(
        pages,
        file.filename
    )

    return {
        "filename": file.filename,
        "pages": len(pages)
    }


@app.post("/chat")
def chat(request: ChatRequest):

    results = search_documents(
        request.question
    )

    if not results["documents"][0]:
        return {
            "answer": "No relevant information found.",
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
