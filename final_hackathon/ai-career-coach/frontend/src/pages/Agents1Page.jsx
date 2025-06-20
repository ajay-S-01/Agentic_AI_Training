// src/pages/Agents1Page.js - Renamed to Agents1Page.js to match App.js import
import { useNavigate } from 'react-router-dom';
import SpecialtyUpload from '../components/SpecialtyUpload';

export default function Agent1Page() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-blue-800 mb-8 tracking-tight">
        Agent 1: Specialty Analyzer
      </h1>
      {/* SpecialtyUpload Component */}
      <SpecialtyUpload />
      {/* Navigation button to Agent 2 */}
      {/* This button will be less relevant as SpecialtyUpload now auto-navigates, but kept for sequential flow option */}
      <button
        onClick={() => navigate('/agent2')}
        className="mt-8 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
      >
        Next: Map Career Paths &rarr;
      </button>
    </div>
  );
}
