// src/pages/Agent3Page.js
import SkillGapDetector from '../components/SkillGapDetector';
import { useNavigate } from 'react-router-dom';

export default function Agent3Page() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* SkillGapDetector Component - the main content for this page */}
      <SkillGapDetector />
      {/* Navigation button to Agent 4 */}
      <button
        onClick={() => navigate('/agent4')}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      >
        Next: Lateral Mobility Score &rarr;
      </button>
    </div>
  );
}
