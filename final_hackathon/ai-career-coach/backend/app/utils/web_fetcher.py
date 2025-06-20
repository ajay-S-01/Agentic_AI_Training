
from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv()

client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

def search_certifications(query):
    results = client.search(query=query, max_results=3, include_answer=True)
    return [{"title": r["title"], "content": r["content"]} for r in results["results"]]
