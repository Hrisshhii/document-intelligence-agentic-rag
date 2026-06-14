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

def local_classify(text):

    lower = text.lower()

    if "education" in lower and "skills" in lower:
        return {
            "document_type": "Resume",
            "topic": "Software Engineering",
            "sensitivity": "Low",
            "contains_tables": False
        }

    if "invoice" in lower:
        return {
            "document_type": "Invoice",
            "topic": "Finance",
            "sensitivity": "Medium",
            "contains_tables": True
        }

    if "abstract" in lower:
        return {
            "document_type": "Research Paper",
            "topic": "Artificial Intelligence",
            "sensitivity": "Low",
            "contains_tables": False
        }

    if "meeting notes" in lower:
        return {
            "document_type": "Meeting Notes",
            "topic": "Project Management",
            "sensitivity": "Internal",
            "contains_tables": False
        }

    if "employee handbook" in lower:
        return {
            "document_type": "Policy Document",
            "topic": "Human Resources",
            "sensitivity": "Internal",
            "contains_tables": False
        }

    if "financial report" in lower:
        return {
            "document_type": "Financial Report",
            "topic": "Finance",
            "sensitivity": "Confidential",
            "contains_tables": True
        }

    return {
        "document_type": "Unknown",
        "topic": "Unknown",
        "sensitivity": "Unknown",
        "contains_tables": False
    }
