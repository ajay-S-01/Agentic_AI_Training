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

def classify_specialty(text: str) -> dict:
    prompt = f"""
You are a medical CV analyzer AI. Your job is to read the professional history of a doctor and extract:

1. Their current or most probable specialty (e.g., Pediatrics, Radiology)
2. Their clinical focus area (e.g., Diagnostic, Surgical, Neonatal, Emergency, Preventive)

Based on this CV:
{text}

Respond strictly in this format:
Specialty: <value>
Focus: <value>
"""

    response = llm.invoke(prompt)
    
    # Extract values
    lines = response.content.strip().splitlines()
    specialty = None
    focus = None
    for line in lines:
        if "Specialty:" in line:
            specialty = line.split("Specialty:")[1].strip()
        elif "Focus:" in line:
            focus = line.split("Focus:")[1].strip()

    return {
        "specialty": specialty or "Unknown",
        "focus": focus or "Unknown"
    }
