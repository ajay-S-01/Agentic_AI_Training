
# 🧠 AI Career Coach – Cross-Specialty Mobility Advisor 🩺

> 🚀 Final Hackathon Submission | Team: CareerAI | Tech Stack: React + FastAPI + LangChain + RAG

This project is a complete AI-driven assistant designed to help doctors and clinicians navigate **career mobility across medical specialties**. It evaluates CVs, detects current specialty, understands career goals, maps skill gaps, and generates a personalized roadmap using advanced LLM and RAG pipelines.

---

## 📌 Problem Statement

Medical professionals often seek to transition to different specialties due to interest, burnout, or evolving career goals. However, there's no structured tool that:

- Analyzes their current specialty from documents
- Suggests relevant lateral transitions
- Identifies skill gaps and certifications
- Generates a customized action plan

✅ Our solution builds **5 modular AI agents** to handle this end-to-end flow dynamically.

---

## 🧠 Agents Overview

| Agent | Name | Description |
|-------|------|-------------|
| **Agent 1** | `Specialty Analyzer` | Extracts medical specialty from uploaded CV (PDF) using LangChain agent + Groq |
| **Agent 2** | `Career Progression Mapper` | Accepts future career goal and suggests transitions |
| **Agent 3** | `Skill Gap & Certification Detector` | Uses ChromaDB + RAG + web search to recommend micro-certifications and fill gaps |
| **Agent 4** | `Lateral Mobility Scorer` | Scores potential specialty shifts using a graph and context-aware justification |
| **Agent 5** | `Career Roadmap Generator` | Aggregates all prior agent data and generates an AI-generated PDF-ready roadmap using Groq LLM |

---

## 🧱 Tech Stack

### Backend – FastAPI + LangChain
- `LangChain Agents`, `LLMChain`, `PromptTemplate`
- `Groq API` for LLM (LLaMA3 70B)
- `ChromaDB` for RAG with persistent local vector store
- `Tavily` for web search (optional)
- `FastAPI` with clean endpoints for each agent
- `.env` support via `python-dotenv`

### Frontend – React.js
- Multi-page SPA using `react-router-dom`
- `AgentContext` (React Context) to persist agent state across flows
- Dynamic forms and result cards per agent
- PDF export in Agent 5 using `react-to-print`

---

## 🗂 Folder Structure

```
ai-career-coach/
├── backend/
│   ├── app/
│   │   ├── agents/                # Agent 1–5 logic
│   │   ├── rag/                   # RAG vector search and web fetch
│   │   └── main.py                # FastAPI app entry
│   ├── data/                      # Graph mappings, samples
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/                 # Agent1Page to Agent5Page
    │   ├── components/            # File uploads, specialty inputs
    │   └── context/AgentContext.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY in .env
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze-specialty` | POST (PDF) | Upload CV and detect specialty |
| `/career-goal` | POST | Submit career goal |
| `/skill-gap` | POST | Return certification + skill gap recommendations |
| `/mobility-score` | POST | Return lateral transition options and score |
| `/career-roadmap` | POST | Final roadmap generation from all context |

---

## 🧠 LangChain Architecture

- `initialize_agent()` used for Agent 1, 2, and 4
- `LLMChain + PromptTemplate` used in Agent 5
- `Vectorstore Retriever` + `ChromaDB` used in Agent 3
- Modular `Tool()` interfaces for specialization
- Web results dynamically appended and embedded to improve document recall

---

## 🎯 Agent Flow (UI)

1. **Agent 1 Page**
   - Upload PDF
   - Backend extracts and returns specialty
2. **Agent 2 Page**
   - Input career goal
   - Auto-saves in context
3. **Agent 3 Page**
   - Shows top certifications + skill gaps (from RAG)
   - Based on real-time search + embedding match
4. **Agent 4 Page**
   - Shows lateral paths + score
   - Visual cards for related specialties
5. **Agent 5 Page**
   - AI-generated roadmap summary
   - Download as PDF button

---

## 📄 Sample Output (Agent 5)

```
🎯 Career Roadmap for Dr. Aditi Mehra

- Current Specialty: Pediatrics
- Goal: Neonatology

📊 Lateral Mobility Score: 85/100

✅ Recommended Certifications:
- Neonatal Intensive Care
- Pediatric Emergency Procedures

🛠️ Action Plan:
1. Complete certifications by Q3 2025
2. Join monthly CME Neonatal webinars
3. Apply for NICU fellowship by Q4 2025

Keep learning and stay passionate — you’re on the right path!
```

---

## 📦 Hackathon Ready Highlights

✅ Multi-agent orchestration  
✅ Modular & scalable backend  
✅ Clean React frontend per agent  
✅ Real-time document search & LLM explanation  
✅ Beautiful roadmap PDF download  
✅ High maintainability & extendability

---

## 👥 Authors & Credits

Built with ❤️ by Team CareerAI  
Mentorship: [Your Hackathon Guide or Mentor]  
APIs used: GROQ, LangChain, Tavily, ChromaDB, FastAPI

---

## 📜 License

MIT License © 2025  
Use and modify for educational and career guidance tools.
