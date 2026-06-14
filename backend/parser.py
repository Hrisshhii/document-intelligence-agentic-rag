import pdfplumber
from pdf2image import convert_from_path
import os

def parse_pdf(pdf_path):

    results = []
    images = convert_from_path(pdf_path)
    os.makedirs("page_images", exist_ok=True)
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            image_path = f"page_images/page_{i+1}.png"
            images[i].save(image_path)
            results.append({
                "page": i + 1,
                "text": text,
                "image": image_path
            })

    return results