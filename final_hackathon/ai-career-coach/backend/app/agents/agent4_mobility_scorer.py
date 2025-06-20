
import json

def load_mobility_map(path="app/data/mobility_map.json"):
    with open(path) as f:
        return json.load(f)

def score_specialty_mobility(specialty: str) -> dict:
    graph = load_mobility_map()
    related = graph.get(specialty, {})

    if not related:
        return {
            "score": 40,
            "message": f"No strong lateral paths found for '{specialty}'.",
            "alternatives": []
        }

    score = 70 + len(related) * 5
    results = []
    for idx, (target, why) in enumerate(related.items()):
        weight = 90 - idx * 10
        results.append({
            "target": target,
            "score": weight,
            "why": why
        })

    return {
        "score": score,
        "message": f"Mobility Score for {specialty} is {score}/100.",
        "alternatives": results
    }
