from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv


load_dotenv()

def generate_roadmap(current_specialty, career_goal, skill_gaps, certifications, mobility_info):
    template = """
You are an AI career coach specialized in medical transitions.

Based on the following inputs, create a personalized career roadmap:

- Current Specialty: {current_specialty}
- Career Goal: {career_goal}
- Skill Gaps: {skill_gaps}
- Recommended Certifications: {certifications}
- Lateral Mobility Info: {mobility_info}

Output a structured, clear and motivating roadmap that includes:
1. Suggested career path
2. Mobility Score and meaning
3. Actionable next steps with timeline
4. Certifications to complete and why
5. Encouragement

Make it sound professional but supportive.
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
        "career_goal": career_goal,
        "skill_gaps": skill_gaps,
        "certifications": certifications,
        "mobility_info": mobility_info
    })
