from app.agents.agent2_career_mapper import recommend_career_paths
from app.agents.agent3_skill_gap_detector import recommend_certifications_for_gap

def score_specialty_mobility(specialty: str, goal: str = "") -> dict:
    paths = recommend_career_paths(specialty, goal).get("paths", [])
    if not paths:
        return {
            "score": 40,
            "message": f"No strong lateral paths found for '{specialty}'.",
            "alternatives": []
        }
    results = []
    for path in paths:
        target = path["career"]
        skill_gap_info = recommend_certifications_for_gap(specialty, target)
        missing_skills = skill_gap_info.get("missing_skills", [])
        # Score: 100 - (number of missing skills * 10), min 40
        score = max(40, 100 - len(missing_skills) * 10)
        results.append({
            "specialty": target,
            "summary": path["summary"],
            "score": score,
            "missing_skills": missing_skills
        })
    # Sort by score descending
    results.sort(key=lambda x: x["score"], reverse=True)
    return {
        "score": results[0]["score"],
        "message": f"Mobility Score for {specialty} is {results[0]['score']}/100.",
        "alternatives": results
    }