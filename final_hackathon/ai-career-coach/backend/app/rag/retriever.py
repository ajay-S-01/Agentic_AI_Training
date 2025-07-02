from langchain.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

def get_relevant_certifications(specialty: str) -> list:
    embedding = HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2",
        model_kwargs={"device": "cpu"}  # Force CPU to avoid meta tensor error
    )
    db = Chroma(persist_directory="app/rag/chroma_index", embedding_function=embedding)
    retriever = db.as_retriever(search_kwargs={"k": 3})
    return retriever.invoke(specialty)