
from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings

def get_relevant_certifications(specialty: str) -> list:
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    db = Chroma(persist_directory="app/rag/chroma_index", embedding_function=embedding)
    retriever = db.as_retriever(search_kwargs={"k": 3})
    return retriever.invoke(specialty)
