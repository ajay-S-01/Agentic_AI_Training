from app.utils.web_fetcher import search_certifications
from langchain.schema import Document
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

def fetch_and_store_online(specialty: str):
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2" , model_kwargs={"device": "cpu"})
    db = Chroma(persist_directory="app/rag/chroma_index", embedding_function=embedding)

    web_docs = search_certifications(f"certifications for {specialty}")
    # Get existing titles to avoid duplicates
    existing_docs = db.similarity_search(specialty, k=20)
    existing_titles = {doc.metadata.get("title") for doc in existing_docs}

    new_docs = []
    for d in web_docs:
        if d["title"] not in existing_titles:
            new_docs.append(Document(page_content=d["content"], metadata={"title": d["title"]}))
    if new_docs:
        db.add_documents(new_docs)
        db.persist()