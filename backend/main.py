from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from resume_parser import parse_resume
from extractor import extract_skills, extract_contact_info
from scorer import score_resume
from matcher import match_jobs

app = FastAPI(title="Resume Analyzer API", version="1.0.0")

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "Resume Analyzer API running"}


from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from resume_parser import parse_resume
from extractor import extract_skills, extract_contact_info
from scorer import score_resume
from matcher import match_jobs
from scraper import search_jobs_for_resume

app = FastAPI(title="Resume Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "Resume Analyzer API running"}


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    allowed = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files allowed.")

    file_bytes = await file.read()

    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 5MB.")

    try:
        # Step 1: Parse
        parsed = parse_resume(file_bytes, file.filename)

        # Step 2: Extract
        skills_data = extract_skills(parsed["raw_text"])
        contact = extract_contact_info(parsed["raw_text"])

        # Step 3: Score
        score_data = score_resume(
            parsed["raw_text"],
            skills_data,
            parsed["sections"]
        )

        # Step 4: Fetch REAL jobs based on resume skills
        # Uses API if key present, falls back to local JSON
        top_skills = skills_data.get("all_skills", [])[:5]
        live_jobs = await search_jobs_for_resume(
            resume_skills=skills_data.get("all_skills", []),
            top_skills=top_skills
        )

        # Step 5: Match fetched jobs against resume
        jobs = match_jobs(
            parsed["raw_text"],
            skills_data["all_skills"],
            job_list=live_jobs  # pass live jobs directly
        )

        return JSONResponse({
            "status": "success",
            "contact": contact,
            "sections_found": parsed["sections"],
            "word_count": parsed["word_count"],
            "skills": skills_data,
            "score": score_data,
            "job_matches": jobs
        })

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/jobs")
def get_jobs(resume_text: str = "", limit: int = 10):
    """Get job matches for a given resume text snippet."""
    jobs = match_jobs(resume_text, [], top_n=limit)
    return {"jobs": jobs}