from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
import json
import re

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

def parse_structured_roadmap(raw_roadmap):
    """
    Parse the raw roadmap text into structured JSON format for better frontend rendering
    """
    sections = {
        "career_path": "",
        "mobility_score": "",
        "skill_gaps": [],
        "certifications": [],
        "timeline_phases": [],
        "encouragement": ""
    }
    
    # Split content by main sections
    content_sections = re.split(r'###?\s*\d+\.\s*\*\*([^*]+)\*\*', raw_roadmap)
    
    for i in range(1, len(content_sections), 2):
        section_title = content_sections[i].strip().lower()
        section_content = content_sections[i + 1].strip() if i + 1 < len(content_sections) else ""
        
        if "suggested career path" in section_title:
            sections["career_path"] = section_content
            
        elif "mobility score" in section_title:
            sections["mobility_score"] = section_content
            
        elif "skill gaps" in section_title:
            # Extract bullet points
            skills = re.findall(r'\*\s+(.+)', section_content)
            sections["skill_gaps"] = [{"skill": skill.strip(), "priority": "high"} for skill in skills]
            
        elif "certifications" in section_title:
            # Extract certifications with descriptions
            cert_matches = re.findall(r'\*\s+([^:]+):\s*(.+)', section_content)
            sections["certifications"] = [
                {"title": cert[0].strip(), "description": cert[1].strip(), "priority": "essential"}
                for cert in cert_matches
            ]
            
        elif "action plan" in section_title or "timeline" in section_title:
            # Extract timeline phases
            phase_pattern = r'\*\*Months?\s+(\d+(?:-\d+)?):\*\*\s*\n\n((?:\*\s+.+\n?)+)'
            phases = re.findall(phase_pattern, section_content)
            
            for phase_time, phase_content in phases:
                tasks = re.findall(r'\*\s+(.+)', phase_content)
                sections["timeline_phases"].append({
                    "phase": f"Months {phase_time}",
                    "title": f"Phase {len(sections['timeline_phases']) + 1}",
                    "timeframe": phase_time,
                    "tasks": [task.strip() for task in tasks],
                    "status": "pending"
                })
                
        elif "encouragement" in section_title:
            sections["encouragement"] = section_content
    
    return sections

def generate_roadmap(current_specialty, career_goal, skill_gaps, certifications, mobility_info, target_specialty=None):
    formatted_skills = format_skills(skill_gaps)
    formatted_certs = format_certs(certifications)

    template = """
You are an AI career coach specialized in medical transitions. Create a comprehensive, actionable career roadmap.

Based on the following inputs:
- Current Specialty: {current_specialty}
- Target Specialty: {target_specialty}
- Career Goal: {career_goal}
- Skill Gaps: {formatted_skills}
- Recommended Certifications: {formatted_certs}
- Lateral Mobility Info: {mobility_info}

Create a detailed roadmap with the following structure:

### 1. **Suggested Career Path**
Provide a clear, specific path from current to target specialty. Include key transition points and strategic decisions.

### 2. **Mobility Score & Meaning**
Analyze the mobility score and explain what it means for the transition difficulty, timeline, and success probability.

### 3. **Skill Gaps to Address**
List 8-12 specific, actionable skill gaps as bullet points:
* Advanced skill 1 with specific context
* Technical skill 2 with application area
* Certification requirement 3
(Make each item specific and actionable)

### 4. **Certifications to Pursue**
List 4-6 essential certifications with clear explanations:
* Certification Name: Detailed explanation of why it's crucial and how it advances the career goal
* Next Certification: Specific benefits and requirements
(Prioritize by importance and timeline)

### 5. **Action Plan & Timeline**
Create a detailed 12-18 month timeline with specific phases:

**Months 1-3:**

* Complete specific training or course
* Gain hands-on experience in specific area
* Network with professionals in target field

**Months 4-6:**

* Pursue primary certification
* Develop advanced skills through practice
* Seek mentorship opportunities

**Months 7-9:**

* Apply theoretical knowledge in clinical setting
* Complete additional certifications
* Build professional portfolio

**Months 10-12:**

* Apply for target positions or fellowship programs
* Prepare for interviews and assessments
* Finalize transition preparations

### 6. **Encouragement**
Provide motivational, supportive message that acknowledges challenges while emphasizing achievable success.

Make everything specific, actionable, and realistic for medical professionals.
"""

    prompt = PromptTemplate.from_template(template)

    llm = ChatGroq(
        model="llama3-70b-8192",
        temperature=0.3,
        api_key=os.getenv("GROQ_API_KEY"),
    )

    chain = LLMChain(prompt=prompt, llm=llm)
    
    # Generate the raw roadmap
    raw_roadmap = chain.run({
        "current_specialty": current_specialty,
        "target_specialty": target_specialty or "",
        "career_goal": career_goal,
        "formatted_skills": formatted_skills,
        "formatted_certs": formatted_certs,
        "mobility_info": mobility_info
    })
    
    # Parse into structured format
    structured_roadmap = parse_structured_roadmap(raw_roadmap)
    
    # Return both formats for compatibility
    return {
        "raw_roadmap": raw_roadmap,
        "structured_roadmap": structured_roadmap,
        "success": True
    }