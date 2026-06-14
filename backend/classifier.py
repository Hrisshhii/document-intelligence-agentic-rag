import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")


def classify_document(text):

    prompt = f"""
Return ONLY valid JSON.

{{
    "document_type":"",
    "topic":"",
    "sensitivity":"",
    "contains_tables":false,
    "summary":""
}}

Document:
{text[:5000]}
"""

    response = model.generate_content(prompt)
    return response.text