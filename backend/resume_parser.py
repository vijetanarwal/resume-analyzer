import re
from pathlib import Path
from io import BytesIO

def parse_resume(file_bytes: bytes, filename: str) -> dict:
    """
    Accepts file bytes + filename, returns structured dict with
    raw_text and detected sections.
    """
    filename = filename.lower()
    
    if filename.endswith(".pdf"):
        raw_text = _parse_pdf(file_bytes)
    elif filename.endswith(".docx"):
        raw_text = _parse_docx(file_bytes)
    else:
        raise ValueError("Only PDF and DOCX files are supported.")
    
    cleaned = _clean_text(raw_text)
    sections = _detect_sections(cleaned)
    
    return {
        "raw_text": cleaned,
        "sections": sections,
        "word_count": len(cleaned.split())
    }


def _parse_pdf(file_bytes: bytes) -> str:
    from pdfminer.high_level import extract_text
    return extract_text(BytesIO(file_bytes))


def _parse_docx(file_bytes: bytes) -> str:
    from docx import Document
    doc = Document(BytesIO(file_bytes))
    return "\n".join([para.text for para in doc.paragraphs])


def _clean_text(text: str) -> str:
    # Remove excessive whitespace and non-printable chars
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\x20-\x7E\n]', ' ', text)
    return text.strip()


def _detect_sections(text: str) -> dict:
    """
    Detect common resume sections by looking for headers.
    Returns dict with section name -> content snippet.
    """
    section_keywords = {
        "education": ["education", "academic", "qualification", "degree"],
        "experience": ["experience", "work history", "employment", "internship"],
        "skills": ["skills", "technical skills", "technologies", "competencies"],
        "projects": ["projects", "personal projects", "academic projects"],
        "certifications": ["certifications", "certificates", "courses"],
        "summary": ["summary", "objective", "profile", "about"],
    }
    
    text_lower = text.lower()
    found_sections = {}
    
    for section, keywords in section_keywords.items():
        for kw in keywords:
            if kw in text_lower:
                found_sections[section] = True
                break
    
    return found_sections