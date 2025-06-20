
from app.rag.retriever import get_relevant_certifications
from app.rag.append_web_results import fetch_and_store_online

def recommend_certifications(specialty: str):
    fetch_and_store_online(specialty)
    docs = get_relevant_certifications(specialty)
    return [{"title": doc.metadata.get("title", "Untitled"), "summary": doc.page_content} for doc in docs]
