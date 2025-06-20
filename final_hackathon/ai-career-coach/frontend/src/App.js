// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AgentProvider } from './context/AgentContext';
// Reverted Agent1Page import to match the original filename 'Agents1Page' from your provided code.
import Agent1Page from './pages/Agents1Page';
import Agent2Page from './pages/Agent2Page';
import Agent3Page from './pages/Agent3Page';
import Agent4Page from './pages/Agent4Page';
import Agent5Page from './pages/Agent5Page';

function App() {
  return (
    // AgentProvider wraps the entire application to provide context
    <AgentProvider>
      <Router>
        {/* Main container with basic Tailwind styling for font and background */}
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
          <Routes>
            {/* Redirect root to Agent1Page */}
            <Route path="/" element={<Navigate to="/agent1" />} />
            {/* Define routes for each agent page */}
            <Route path="/agent1" element={<Agent1Page />} />
            <Route path="/agent2" element={<Agent2Page />} />
            <Route path="/agent3" element={<Agent3Page />} />
            <Route path="/agent4" element={<Agent4Page />} />
            <Route path="/agent5" element={<Agent5Page />} />
          </Routes>
        </div>
      </Router>
    </AgentProvider>
   
  );
}

export default App;
