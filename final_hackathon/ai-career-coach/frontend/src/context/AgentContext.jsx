// src/context/AgentContext.js
import { createContext, useState } from 'react';

// Create the AgentContext
export const AgentContext = createContext();

// Create the AgentProvider component to wrap the application
export const AgentProvider = ({ children }) => {
  // State variables to store data across different agents/pages
  const [specialty, setSpecialty] = useState("");
  const [targetSpecialty, setTargetSpecialty] = useState("");
  const [goal, setGoal] = useState("");
const [skills, setSkills] = useState([]); // should be an array
const [certifications, setCertifications] = useState([]); // should be an array
  const [mobility, setMobility] = useState("");
  const [careerPaths, setCareerPaths] = useState([]);

  return (
    // Provide the state variables and their setters to the context consumers
    <AgentContext.Provider value={{
      specialty, setSpecialty,
      targetSpecialty, setTargetSpecialty,
      goal, setGoal,
      skills, setSkills,
      certifications, setCertifications,
      mobility, setMobility,
      careerPaths, setCareerPaths
    }}>
      {children} {/* Render child components that will consume this context */}
    </AgentContext.Provider>
  );
};