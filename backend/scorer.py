import re


def score_resume(text: str, extracted_skills: dict, sections: dict) -> dict:
    """
    Score a resume from 0-100 based on:
    - Skills count       (30 pts)
    - Sections present   (25 pts)
    - Projects           (20 pts)
    - Quantified impact  (15 pts)
    - Keywords           (10 pts)
    """
    score = 0
    breakdown = {}
    suggestions = []

    # 1. Skills score (30 pts)
    skill_count = extracted_skills.get("total_count", 0)
    skills_score = min(30, skill_count * 2)
    score += skills_score
    breakdown["skills"] = skills_score
    if skill_count < 8:
        suggestions.append("Add more technical skills — aim for at least 10-15 relevant skills.")

    # 2. Sections present (25 pts)
    key_sections = ["education", "experience", "skills", "projects"]
    section_score = 0
    for sec in key_sections:
        if sections.get(sec):
            section_score += 6
        else:
            suggestions.append(f"Add a '{sec}' section — it's expected by most ATS systems.")
    if sections.get("summary"):
        section_score += 1
    score += min(25, section_score)
    breakdown["sections"] = min(25, section_score)

    # 3. Projects mentioned (20 pts)
    project_patterns = [
        r'\bbuilt\b', r'\bdeveloped\b', r'\bcreated\b', r'\bdesigned\b',
        r'\bimplemented\b', r'\bdeployed\b', r'\barchitected\b'
    ]
    project_hits = sum(1 for p in project_patterns if re.search(p, text.lower()))
    project_score = min(20, project_hits * 4)
    score += project_score
    breakdown["projects"] = project_score
    if project_hits < 3:
        suggestions.append("Describe your projects with action verbs (built, developed, deployed).")

    # 4. Quantified impact (15 pts) — looks for numbers/percentages
    quant_pattern = r'\b\d+[\%xX]?\b|\b\d+\s*(percent|users|million|thousand|k\b)'
    quant_hits = len(re.findall(quant_pattern, text.lower()))
    quant_score = min(15, quant_hits * 2)
    score += quant_score
    breakdown["quantified_impact"] = quant_score
    if quant_hits < 3:
        suggestions.append("Add numbers to your achievements (e.g. 'reduced load time by 40%', 'served 10k users').")

    # 5. Resume keywords (10 pts)
    power_keywords = [
        "collaborated", "led", "optimized", "scalable", "automated",
        "api", "rest", "agile", "open source", "production"
    ]
    kw_hits = sum(1 for kw in power_keywords if kw in text.lower())
    kw_score = min(10, kw_hits * 2)
    score += kw_score
    breakdown["keywords"] = kw_score

    return {
        "total_score": round(score),
        "breakdown": breakdown,
        "grade": _grade(score),
        "suggestions": suggestions
    }


def _grade(score: int) -> str:
    if score >= 80: return "Excellent"
    if score >= 65: return "Good"
    if score >= 50: return "Average"
    return "Needs Work"