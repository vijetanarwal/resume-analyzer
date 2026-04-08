# AI Resume Analyzer & Career Copilot

An AI-powered resume analysis platform that scores your resume, extracts skills, detects weaknesses, and matches you with real-time job opportunities.

---

## Features

- **Resume Parsing** — Supports PDF and DOCX formats
- **Skill Extraction** — NLP-based extraction using spaCy and a custom skills taxonomy
- **Resume Scoring** — Rule-based scoring system (0–100) across skills, projects, experience, and keywords
- **Weakness Detection** — Identifies missing sections, skills, and quantified achievements
- **Job Matching** — TF-IDF cosine similarity matching against real job listings
- **Real-Time Job Fetching** — Live jobs fetched from JSearch API (LinkedIn, Indeed, Glassdoor)
- **Skill Gap Analysis** — Shows matching and missing skills per job

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| NLP | spaCy |
| ML | scikit-learn (TF-IDF + Cosine Similarity) |
| Job Data | JSearch API (RapidAPI) |
| PDF Parsing | pdfminer.six |
| DOCX Parsing | python-docx |

<img width="680" height="486" alt="image" src="https://github.com/user-attachments/assets/bf33fec3-a237-4866-ac5f-471f185e5be6" />

<img width="713" height="506" alt="image" src="https://github.com/user-attachments/assets/2e9c7ef7-f76a-4e3f-b314-08c31143db14" />


---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- pip
- A free [RapidAPI](https://rapidapi.com) account for JSearch

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

---

### 2. Backend Setup

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Create a `.env` file in the root folder:

```env
RAPIDAPI_KEY=your_rapidapi_key_here
```

Start the backend:

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/upload-resume` | Upload and analyze resume |
| GET | `/jobs` | Get job matches |

---

## Scoring Breakdown

| Category | Max Points | What it checks |
|----------|-----------|----------------|
| Skills | 30 | Number of technical skills detected |
| Sections | 25 | Education, Experience, Skills, Projects present |
| Projects | 20 | Action verbs like built, developed, deployed |
| Quantified Impact | 15 | Numbers, percentages, metrics in achievements |
| Keywords | 10 | Power words like scalable, optimized, automated |

---

## How Job Matching Works

1. Resume text and job descriptions are vectorized using **TF-IDF**
2. **Cosine similarity** is computed between the resume vector and each job vector
3. Jobs are ranked by similarity score (0–100%)
4. Matching and missing skills are computed using set intersection/difference

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RAPIDAPI_KEY` | RapidAPI key for JSearch (get free at rapidapi.com) |

---

