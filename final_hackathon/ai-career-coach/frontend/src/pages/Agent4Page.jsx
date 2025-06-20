// src/pages/Agent4Page.js
import MobilityScorer from '../components/MobilityScorer';
import { useNavigate } from 'react-router-dom';

export default function Agent4Page() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* MobilityScorer Component - the main content for this page */}
      <MobilityScorer />
      {/* Navigation button to Agent 5 */}
      <button
        onClick={() => navigate('/agent5')}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      >
        Next: Road Map &rarr;
      </button>
    </div>
  );
}