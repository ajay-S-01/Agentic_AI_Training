from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
import json

load_dotenv()

llm = ChatOpenAI(
    openai_api_key=os.getenv("GROQ_API_KEY"),
    openai_api_base="https://api.groq.com/openai/v1",
    model="llama3-70b-8192",
    temperature=0.4,
)

def recommend_career_paths(specialty: str, goal: str) -> dict:
    prompt = f"""
You are a Career Advisor AI for medical professionals.

The user has a background in: {specialty}
Their goal is: {goal}

Recommend 3 logical next career paths that align with their specialty and goal.
For each suggestion, respond as a JSON object with "career" and "summary" fields.
Format your response as a JSON array, like:
[
  {{"career": "Neonatology", "summary": "Subspecialty overlap: NICU exposure"}},
  ...
]
Respond with only the JSON array, no explanation.
"""
    response = llm.invoke(prompt)
    try:
        paths = json.loads(response.content.strip())
    except Exception:
        # fallback: return as text if parsing fails
        return {"paths": []}
    return {"paths": paths}