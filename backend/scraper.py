import os
import re
import json
import httpx
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).parent.parent
load_dotenv(BASE_DIR / ".env")

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "")
print(f"DEBUG - API Key loaded: '{RAPIDAPI_KEY[:10]}...'" if RAPIDAPI_KEY else "DEBUG - NO API KEY FOUND")

JOBS_CACHE_PATH = Path(__file__).parent.parent / "data" / "sample_jobs.json"


async def fetch_jobs_from_api(query: str = "python developer india", num_pages: int = 1) -> list:
    if not RAPIDAPI_KEY:
        print("No RAPIDAPI_KEY found, using local jobs")
        return load_local_jobs()

    print(f"DEBUG - Calling JSearch API with query: {query}")

    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
    }
    params = {
        "query": query,
        "page": "1",
        "num_pages": "1",
        "language": "en",
        "date_posted": "all",
    }

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.get(url, headers=headers, params=params)
            print(f"DEBUG - API Response status: {response.status_code}")
            print(f"DEBUG - API Response preview: {response.text[:300]}")
            response.raise_for_status()
            data = response.json()

        print(f"DEBUG - Jobs received from API: {len(data.get('data', []))}")

        jobs = []
        for item in data.get("data", []):
            description = item.get("job_description", "")
            required_skills = extract_skills_from_text(description)

            jobs.append({
                "id": item.get("job_id", ""),
                "title": item.get("job_title", ""),
                "company": item.get("employer_name", ""),
                "location": f"{item.get('job_city') or ''}, {item.get('job_country') or ''}".strip(", "),
                "description": description[:500],
                "required_skills": required_skills,
                "apply_link": item.get("job_apply_link", "#"),
                "source": "jsearch"
            })

        if jobs:
            save_jobs_to_cache(jobs)
            print(f"DEBUG - Saved {len(jobs)} jobs to cache")
            return jobs
        else:
            print("DEBUG - No jobs from API, using local")
            return load_local_jobs()

    except Exception as e:
        print(f"DEBUG - API fetch failed: {e}, falling back to local jobs")
        return load_local_jobs()


def extract_skills_from_text(text: str) -> list:
    all_skills = [
        "python", "java", "javascript", "typescript", "sql", "r", "scala", "go",
        "machine learning", "deep learning", "nlp", "tensorflow", "pytorch",
        "scikit-learn", "keras", "xgboost", "pandas", "numpy",
        "react", "reactjs", "nodejs", "fastapi", "django", "flask", "spring boot",
        "postgresql", "mongodb", "mysql", "redis", "elasticsearch",
        "aws", "azure", "gcp", "docker", "kubernetes", "git", "ci/cd", "linux",
        "tableau", "power bi", "matplotlib", "spark", "kafka", "airflow",
        "hugging face", "bert", "llm", "transformers"
    ]

    text_lower = text.lower()
    found = []
    for skill in all_skills:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.append(skill)

    return found


def load_local_jobs() -> list:
    if JOBS_CACHE_PATH.exists():
        with open(JOBS_CACHE_PATH) as f:
            return json.load(f)
    return []


def save_jobs_to_cache(jobs: list):
    with open(JOBS_CACHE_PATH, "w") as f:
        json.dump(jobs, f, indent=2)
    print(f"DEBUG - Cached {len(jobs)} jobs to {JOBS_CACHE_PATH}")


async def search_jobs_for_resume(resume_skills: list, top_skills: list = None) -> list:
    if top_skills and len(top_skills) > 0:
        # Remove sqlite-like niche skills, keep main ones
        main_skills = [s for s in top_skills if s in [
            "python", "javascript", "java", "react", "sql", "nodejs",
            "machine learning", "data science", "django", "fastapi",
            "aws", "docker", "typescript", "mongodb", "postgresql"
        ]]
        if main_skills:
            query = main_skills[0] + " developer jobs india"
        else:
            query = "software developer jobs india"
    else:
        query = "software developer jobs india"

    print(f"DEBUG - Final query: {query}")
    return await fetch_jobs_from_api(query=query)