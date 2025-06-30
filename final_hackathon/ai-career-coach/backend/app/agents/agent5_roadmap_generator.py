from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
import json

load_dotenv()

def format_skills(skill_gaps):
    try:
        if isinstance(skill_gaps, str):
            skill_gaps = json.loads(skill_gaps)
    except Exception:
        pass
    if isinstance(skill_gaps, list):
        return "\n".join([f"- {s.get('text', s.get('skill', str(s)))}" if isinstance(s, dict) else f"- {s}" for s in skill_gaps])
    return "-"

def format_certs(certifications):
    try:
        if isinstance(certifications, str):
            certifications = json.loads(certifications)
    except Exception:
        pass
    if isinstance(certifications, list):
        return "\n".join([f"- {c.get('title', '')}: {c.get('summary', '')}" if isinstance(c, dict) else f"- {c}" for c in certifications])
    return "-"

def generate_roadmap(current_specialty, career_goal, skill_gaps, certifications, mobility_info, target_specialty=None):
    formatted_skills = format_skills(skill_gaps)
    formatted_certs = format_certs(certifications)

    template = """
You are an AI career coach specialized in medical transitions.

Based on the following inputs, create a **personalized, real-world applicable, and timeline-specific career roadmap** in clear sections:

- Current Specialty: {current_specialty}
- Target Specialty: {target_specialty}
- Career Goal: {career_goal}
- Skill Gaps:
{formatted_skills}
- Recommended Certifications:
{formatted_certs}
- Lateral Mobility Info: {mobility_info}

Your output MUST use this structure (with section titles):

1. **Suggested Career Path**
   - Clearly state the recommended path from current to target specialty, referencing the user's goal.

2. **Mobility Score & Meaning**
   - Summarize the lateral mobility info and what it means for the user's transition.

3. **Skill Gaps to Address**
   - List the skill gaps as actionable points.

4. **Certifications to Pursue**
   - List the recommended certifications, each with a short reason why it's important.

5. **Action Plan & Timeline**
   - Provide a step-by-step, real-world applicable plan with estimated timeframes for each major step (e.g., "Months 1-3: Complete X", "Months 4-6: Gain Y experience", etc.).

6. **Encouragement**
   - End with a motivating, supportive message.

Respond in clear, readable Markdown.
"""

    prompt = PromptTemplate.from_template(template)

    llm = ChatGroq(
        model="llama3-70b-8192",
        temperature=0.4,
        api_key=os.getenv("GROQ_API_KEY"),
    )

    chain = LLMChain(prompt=prompt, llm=llm)
    return chain.run({
        "current_specialty": current_specialty,
        "target_specialty": target_specialty or "",
        "career_goal": career_goal,
        "formatted_skills": formatted_skills,
        "formatted_certs": formatted_certs,
        "mobility_info": mobility_info
    })