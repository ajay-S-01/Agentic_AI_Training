from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.agents.agent1_specialty_analyzer import classify_specialty
from app.agents.agent2_career_mapper import recommend_career_paths
from app.agents.agent2_career_mapper import is_goal_medically_valid
from app.agents.agent3_skill_gap_detector import recommend_certifications_for_gap
from app.agents.agent4_mobility_scorer import score_specialty_mobility
from app.agents.agent5_roadmap_generator import generate_roadmap
from fastapi import Form
from app.utils.file_parser import extract_text_from_pdf
import os
import shutil
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/analyze-specialty")
async def analyze_specialty(file: UploadFile = File(...)):
    file_location = f"temp_{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_location)
    result = classify_specialty(text)
    os.remove(file_location)

    # result is already a dict with 'specialty' and 'focus'
    return result

@app.post("/map-career")
async def map_career(specialty: str = Form(...), goal: str = Form(...)):
    if not is_goal_medically_valid(goal):
        return {"error": "Invalid goal. Please describe a medically realistic and meaningful career goal."}
    return recommend_career_paths(specialty, goal)

@app.post("/skill-gap")
def skill_gap(
    current_specialty: str = Form(...),
    target_specialty: str = Form(...)
):
    results = recommend_certifications_for_gap(current_specialty, target_specialty)
    return results

@app.post("/mobility-score")
def mobility_score(specialty: str = Form(...), goal: str = Form("")):
    return score_specialty_mobility(specialty, goal)

@app.post("/career-roadmap")
def career_roadmap(
    current_specialty: str = Form(...),
    career_goal: str = Form(...),
    skill_gaps: str = Form(...),
    certifications: str = Form(...),
    mobility_info: str = Form(...)
):
    # Parse JSON strings
    try:
        skill_gaps = json.loads(skill_gaps)
    except Exception:
        pass
    try:
        certifications = json.loads(certifications)
    except Exception:
        pass
    roadmap = generate_roadmap(current_specialty, career_goal, skill_gaps, certifications, mobility_info)
    return {"roadmap": roadmap}


