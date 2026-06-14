from fastapi import FastAPI, UploadFile, File
import os

from parser import parse_pdf
app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def home():
    return {"message": "API Running"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(await file.read())

    pages = parse_pdf(file_path)

    return {
        "filename": file.filename,
        "pages": len(pages),
        "data": pages
    }