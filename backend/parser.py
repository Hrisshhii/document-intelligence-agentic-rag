import pdfplumber
import pytesseract

from pdf2image import convert_from_path
from PIL import Image

import os

def parse_pdf(pdf_path):

    results = []
    filename = os.path.splitext(
        os.path.basename(pdf_path)
    )[0]
    os.makedirs("page_images", exist_ok=True)
    images = convert_from_path(pdf_path)

    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            image_path = (
                f"page_images/"
                f"{filename}_page_{i+1}.png"
            )
            images[i].save(image_path)

            if len(text.strip()) < 50:
                ocr_text = pytesseract.image_to_string(
                    Image.open(image_path)
                )
                text = ocr_text

            tables = page.extract_tables()

            results.append({
                "page": i + 1,
                "text": text,
                "tables": tables,
                "image": image_path
            })

    return results