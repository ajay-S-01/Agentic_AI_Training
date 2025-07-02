from fastapi import FastAPI, Form
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os
import json

app = FastAPI()
load_dotenv()

# Initialize LLM
llm = ChatOpenAI(
    openai_api_key=os.getenv("GROQ_API_KEY"),
    openai_api_base="https://api.groq.com/openai/v1",
    model="llama3-70b-8192",
    temperature=0.4,
)

# Step 1: Validate if the goal is realistic & medical
def is_goal_medically_valid(goal: str) -> bool:
    validation_prompt = f"""
You are an intelligent assistant helping validate user career goals.

User's goal: "{goal}"

Is this goal realistic, medically related, and meaningful for a healthcare professional?

Respond only with "yes" or "no".
"""
    try:
        response = llm.invoke(validation_prompt)
        result = response.content.strip().lower()
        return result == "yes"
    except Exception as e:
        print("Validation Error:", e)
        return False

# Step 2: Recommend career paths
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
    try:
        response = llm.invoke(prompt)
        paths = json.loads(response.content.strip())
        return {"paths": paths}
    except Exception as e:
        print("Parsing Error:", e)
        return {"paths": []}