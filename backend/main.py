from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from rag import collection
from classifier import classify_document
import json
import os

from rag import (
    search_documents,
    build_context,
    generate_answer,
    add_document_pages
)

from parser import parse_pdf

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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

    all_text = "\n".join(
        [page["text"] for page in pages]
    )

    try:
        classification = json.loads(
            classify_document(all_text)
        )
    except:
        classification = {
            "document_type": "Unknown"
        }

    return {
        "filename": file.filename,
        "pages": len(pages),
        "classification": classification
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

    return result

