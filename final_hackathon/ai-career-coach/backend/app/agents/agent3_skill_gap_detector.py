import os
import re
from app.rag.retriever import get_relevant_certifications
from app.rag.append_web_results import fetch_and_store_online
from app.utils.web_fetcher import search_certifications
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(
    openai_api_key=os.getenv("GROQ_API_KEY"),
    openai_api_base="https://api.groq.com/openai/v1",
    model="llama3-70b-8192",
    temperature=0.3,
)

def detect_skill_gap_llm(current_specialty, target_specialty):
    prompt = f"""
You are a medical career advisor AI.
Given a professional with specialty '{current_specialty}' who wants to transition to '{target_specialty}', list the top 5 skills or knowledge areas they are likely missing for the target specialty. 
Respond as a Python list of strings, no explanation.
"""
    response = llm.invoke(prompt)
    # Try to safely eval the list from LLM output
    try:
        import ast
        skills = ast.literal_eval(response.content.strip())
        if isinstance(skills, list):
            return [s.strip() for s in skills if len(s.strip()) > 2]
    except Exception:
        # fallback: split by newlines or commas
        return [s.strip("-• \n") for s in response.content.splitlines() if len(s.strip()) > 2]
    return []

def recommend_certifications_for_gap(current_specialty: str, target_specialty: str):
    # 1. Detect skill gap using LLM
    missing_skills = detect_skill_gap_llm(current_specialty, target_specialty)

    recommendations = []
    for skill in missing_skills:
        certs = get_relevant_certifications(skill)
        # If not found in DB, fetch from Tavily and store
        if not certs:
            fetch_and_store_online(skill)
            certs = get_relevant_certifications(skill)
        # If still not found, fallback to direct Tavily search (not stored)
        if not certs:
            web_results = search_certifications(f"certifications for {skill}")
            for w in web_results:
                recommendations.append({
                    "title": w["title"],
                    "summary": w["content"],
                    "link": w.get("url", "")
                })
        else:
            for doc in certs:
                recommendations.append({
                    "title": doc.metadata.get("title", "Untitled"),
                    "summary": doc.page_content,
                    "link": doc.metadata.get("url", "")
                })

    # Remove duplicates by title
    seen = set()
    unique_recommendations = []
    for rec in recommendations:
        if rec["title"] not in seen:
            unique_recommendations.append(rec)
            seen.add(rec["title"])

    # For frontend: missing_skills as array of { skill, text }
    missing_skills_structured = [{"skill": s, "text": s.capitalize()} for s in missing_skills]

    return {
        "missing_skills": missing_skills_structured,
        "recommendations": unique_recommendations
    }