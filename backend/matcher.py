import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Load sample jobs at module level (later replaced by DB/scraper data)
JOBS_PATH = Path(__file__).parent.parent / "data" / "sample_jobs.json"


def load_jobs() -> list:
    if JOBS_PATH.exists():
        with open(JOBS_PATH) as f:
            return json.load(f)
    return []


def match_jobs(resume_text: str, resume_skills: list, top_n: int = 10, job_list: list = None) -> list:
    """
    Match resume against job listings using TF-IDF cosine similarity.
    Uses job_list if provided (from scraper), otherwise loads from file.
    """
    jobs = job_list if job_list else load_jobs()
    if not jobs:
        return []

    job_texts = [job["description"] for job in jobs]
    corpus = [resume_text] + job_texts

    vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
    tfidf_matrix = vectorizer.fit_transform(corpus)

    resume_vec = tfidf_matrix[0]
    job_vecs = tfidf_matrix[1:]
    similarities = cosine_similarity(resume_vec, job_vecs)[0]

    results = []
    for i, job in enumerate(jobs):
        job_skills = set(s.lower() for s in job.get("required_skills", []))
        resume_skills_set = set(s.lower() for s in resume_skills)
        matching = list(job_skills & resume_skills_set)
        missing = list(job_skills - resume_skills_set)

        results.append({
            "job_id": job.get("id", i),
            "title": job["title"],
            "company": job.get("company", ""),
            "location": job.get("location", ""),
            "match_score": round(float(similarities[i]) * 100, 1),
            "matching_skills": matching,
            "missing_skills": missing,
            "apply_link": job.get("apply_link", "#"),
            "description_snippet": job["description"][:200] + "..."
        })

    results.sort(key=lambda x: x["match_score"], reverse=True)
    return results[:top_n]