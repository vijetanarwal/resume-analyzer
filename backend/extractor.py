import json
import re
import spacy
from pathlib import Path

# Load taxonomy once at module level
TAXONOMY_PATH = Path(__file__).parent.parent / "data" / "skills_taxonomy.json"
with open(TAXONOMY_PATH) as f:
    TAXONOMY = json.load(f)

# Flatten all skills into a single set for fast lookup
ALL_SKILLS = set()
SKILL_CATEGORY_MAP = {}
for category, skills in TAXONOMY.items():
    for skill in skills:
        ALL_SKILLS.add(skill.lower())
        SKILL_CATEGORY_MAP[skill.lower()] = category

# Load spaCy model (run: python -m spacy download en_core_web_sm)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError("Run: python -m spacy download en_core_web_sm")


def extract_skills(text: str) -> dict:
    """
    Extract skills from resume text.
    Returns dict with matched skills grouped by category.
    """
    text_lower = text.lower()
    
    found_skills = {}
    
    for skill in ALL_SKILLS:
        # Use word boundary matching to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            category = SKILL_CATEGORY_MAP[skill]
            if category not in found_skills:
                found_skills[category] = []
            found_skills[category].append(skill)
    
    # Also run spaCy NER for any person/org/product entities
    # (catches things not in taxonomy like company names)
    doc = nlp(text[:5000])  # limit to first 5000 chars for speed
    named_entities = [ent.text for ent in doc.ents if ent.label_ in ("ORG", "PRODUCT")]
    
    return {
        "skills_by_category": found_skills,
        "all_skills": list({s for skills in found_skills.values() for s in skills}),
        "total_count": sum(len(v) for v in found_skills.values()),
        "named_entities": named_entities[:20]
    }


def extract_contact_info(text: str) -> dict:
    """Extract email and phone from resume text."""
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'\b[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}\b'
    
    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    
    return {
        "email": emails[0] if emails else None,
        "phone": phones[0] if phones else None
    }