// src/pages/Agent2Page.js
import { useNavigate } from 'react-router-dom';
import CareerMapper from '../components/CareerMapper';

export default function Agent2Page() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* CareerMapper Component - the main content for this page */}
      <CareerMapper />
      {/* Navigation button to Agent 3 */}
      <button
        onClick={() => navigate('/agent3')}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      >
        Next: Detect Skill Gaps &rarr;
      </button>
    </div>
  );
}
