
import json
from langchain.vectorstores import Chroma
from langchain.schema import Document
from langchain.embeddings import HuggingFaceEmbeddings

def load_and_index(path="app/rag/certifications.json"):
    with open(path) as f:
        data = json.load(f)

    docs = [Document(page_content=item["summary"], metadata={"title": item["title"], "specialties": item["specialties"]}) for item in data]

    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vectorstore = Chroma.from_documents(documents=docs, embedding=embedding, persist_directory="app/rag/chroma_index")
    vectorstore.persist()
