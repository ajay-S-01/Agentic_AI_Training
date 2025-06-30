// src/components/MobilityScorer.js
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AgentContext } from '../context/AgentContext';

// Custom Modal Component for alerts (replaces native alert())
const CustomModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full text-center">
        <p className="text-lg font-semibold text-gray-800 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-all duration-200"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default function MobilityScorer() {
  // Access specialty and setMobility from AgentContext
  const { specialty, setMobility, goal } = useContext(AgentContext);
  const [result, setResult] = useState(null); // State to store mobility score results
  const [loading, setLoading] = useState(false); // State for loading status
  const [modalMessage, setModalMessage] = useState(''); // State for custom modal message

  // Function to fetch mobility score from the API
  const fetchScore = async () => {
    if (!specialty) {
      // If no specialty is selected, do not proceed with API call
      // You might want to display a message or disable the component until specialty is set.
      return;
    }

    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append("specialty", specialty);
    formData.append("goal", goal); // Include goal in the request

    try {
      const res = await axios.post("http://localhost:8000/mobility-score", formData);
      setResult(res.data); // Set the result with data from API
      setMobility(JSON.stringify(res.data)); // Save the whole result as a string in context for Agent 5
    } catch (err) {
      console.error("Failed to fetch mobility score:", err);
      setModalMessage("Failed to fetch mobility score. Please ensure specialty is correct.");
    } finally {
      setLoading(false); // End loading
    }
  };

  // useEffect hook to call fetchScore when the component mounts or specialty changes
  useEffect(() => {
    fetchScore();
    // eslint-disable-next-line
  }, [specialty]); // Dependency array: re-run effect if specialty changes

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Agent 4: Lateral Mobility Scorer</h2>

      {/* Loading indicator */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600">Calculating mobility score...</p>
        </div>
      )}

      {/* Display results if available */}
      {result && (
        <>
          {/* Mobility Score Card */}
          <div className="bg-blue-100 p-6 rounded-xl shadow-md border border-blue-200 mb-8 text-center animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">Mobility Score</h3>
            <div className="w-32 h-32 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-extrabold shadow-lg mb-4 transform hover:scale-105 transition-transform duration-300">
              {result.score}
            </div>
            <p className="text-lg text-blue-700 font-medium">{result.message}</p>
          </div>

          {/* Top Related Specialties */}
          <h4 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-2">Top Related Specialties:</h4>
          <ul className="space-y-4">
            {result.alternatives.map((alt, i) => (
              <li key={i} className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200 transform hover:scale-[1.02] transition-transform duration-200 flex flex-col items-start">
                <strong className="text-xl font-semibold text-blue-700 mb-2">
                  {alt.specialty} <span className="text-gray-600 text-base">({alt.score}/100)</span>
                </strong>
                <p className="text-gray-700 text-base leading-relaxed">{alt.summary}</p>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Custom Modal rendering */}
      {modalMessage && <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />}
    </div>
  );
}