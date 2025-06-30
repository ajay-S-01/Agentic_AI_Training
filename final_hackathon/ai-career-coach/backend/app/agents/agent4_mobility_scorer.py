from app.agents.agent2_career_mapper import recommend_career_paths

def score_specialty_mobility(specialty: str, goal: str = "") -> dict:
    # Get career paths from Agent 2 logic
    paths = recommend_career_paths(specialty, goal).get("paths", [])
    if not paths:
        return {
            "score": 40,
            "message": f"No strong lateral paths found for '{specialty}'.",
            "alternatives": []
        }
    # Assign scores (e.g., 90, 80, 70...) to each path
    results = []
    for idx, path in enumerate(paths):
        score = 90 - idx * 10
        results.append({
            "specialty": path["career"],
            "summary": path["summary"],
            "score": score
        })
    return {
        "score": results[0]["score"],
        "message": f"Mobility Score for {specialty} is {results[0]['score']}/100.",
        "alternatives": results
    }