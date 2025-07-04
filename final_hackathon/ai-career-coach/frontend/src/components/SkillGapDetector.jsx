// src/components/SkillGapDetector.js
import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { AgentContext } from '../context/AgentContext';
import Select from 'react-select';

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

export default function SkillGapDetector() {
  // Access specialty and its setter from AgentContext, also skills and certifications setters
  const { specialty, setSpecialty, setSkills, setCertifications, targetSpecialty, setTargetSpecialty, careerPaths } = useContext(AgentContext);
  const [recommendations, setRecommendations] = useState([]); // State for certification recommendations
  const [loading, setLoading] = useState(false); // State for loading status
  const [modalMessage, setModalMessage] = useState(''); // State for custom modal message
  const [missingSkills, setMissingSkills] = useState([]);
  const options = careerPaths.map(path => ({
    value: path.career,
    label: `${path.career} - ${path.summary}`
  }));

  // Effect to set default specialty if available in context
  useEffect(() => {
    // If specialty is already in context, pre-fill the input
    // No explicit action needed here as input is controlled by `specialty` state from context
  }, [specialty]);

  // Handle the search for certifications and skill gaps
  const handleSearch = async () => {
    if (!specialty || !targetSpecialty) {
      setModalMessage("Please enter both your current and target specialties.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("current_specialty", specialty);
    formData.append("target_specialty", targetSpecialty);

   try {
  const res = await axios.post("http://localhost:8000/skill-gap", formData);
  setRecommendations(res.data.recommendations || []);
  setSkills(res.data.missing_skills || []); // <-- store as array
  setMissingSkills(res.data.missing_skills || []);
  setCertifications(res.data.recommendations || []); // <-- store as array
} catch (err) {
  setModalMessage("Failed to fetch recommendations. Please try again.");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Agent 3: Certification & Skill Gap Detector</h2>

      {/* Input for specialty */}
      <div className="mb-6">
        <Select
          options={options}
          value={options.find(opt => opt.value === targetSpecialty) || null}
          onChange={option => setTargetSpecialty(option ? option.value : "")}
          isClearable
          isSearchable
          placeholder="Select or type target career path"
        />
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={loading || !specialty}
        className={`w-full px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75'}
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Searching...
          </span>
        ) : (
          'Find Certifications'
        )}
      </button>
      {missingSkills.length > 0 && (
        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm animate-fade-in">
          <h3 className="text-xl font-bold text-yellow-700 mb-4">Skill Gaps:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800">
            {missingSkills.map((skillObj, idx) => (
              <li key={idx}>{skillObj.text}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200 shadow-sm animate-fade-in">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Recommended Certifications:</h3>
          <ul className="space-y-4">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="p-4 bg-white rounded-lg shadow-sm border border-purple-100 flex flex-col items-start">
                <strong className="text-lg font-semibold text-gray-900 mb-1">{rec.title}</strong>
                <p className="text-gray-700 text-sm leading-relaxed">{rec.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Custom Modal rendering */}
      {modalMessage && <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />}
    </div>
  );
}
