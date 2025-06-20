from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

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
For each suggestion, explain why it makes sense.
Format your response like this:

1. [Career Path] – [Rationale]
2. ...
3. ...
"""

    response = llm.invoke(prompt)
    return {"paths": response.content.strip()}
