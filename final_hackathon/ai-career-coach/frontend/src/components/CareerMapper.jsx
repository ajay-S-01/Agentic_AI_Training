import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AgentContext } from '../context/AgentContext';

const CustomModal = ({ message, onClose }) => (
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

export default function CareerMapper() {
  const { specialty, setSpecialty, goal, setGoal, careerPaths, setCareerPaths } = useContext(AgentContext);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [goalError, setGoalError] = useState(''); // <-- NEW

  const specialties = [
    "General Medicine",
    "Pediatrics",
    "Radiology",
    "Surgery",
    "Gynecology",
    "Emergency Medicine",
    "Family Medicine"
  ];

  useEffect(() => {
    if (specialty && !goal) {
      setGoal('');
    }
  }, [specialty, goal, setGoal]);

  const handleSubmit = async () => {
    setGoalError(''); // clear previous error
    if (!specialty || !goal) {
      setGoalError("Please select a specialty and enter your goal.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("specialty", specialty);
    formData.append("goal", goal);

    try {
      const res = await axios.post("http://localhost:8000/map-career", formData);
      if (res.data.error) {
        setGoalError(res.data.error); // Show backend error below the field
        setCareerPaths([]);
      } else {
        setCareerPaths(res.data.paths || []);
      }
    } catch (err) {
      setModalMessage("Failed to fetch career paths. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-200 animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Agent 2: Career Progression Mapper</h2>

      {/* Select current specialty */}
      <div className="mb-6">
        <label htmlFor="specialty-select" className="block text-gray-700 text-sm font-bold mb-2">
          Select your current specialty
        </label>
        <select
          id="specialty-select"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
        >
          <option value="">-- Select Specialty --</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      {/* Input for career goal */}
      <div className="mb-8">
        <label htmlFor="goal-input" className="block text-gray-700 text-sm font-bold mb-2">
          What's your goal?
        </label>
        <input
          id="goal-input"
          type="text"
          placeholder="e.g., become a senior pediatrician, move into medical research"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
        />
        {goalError && (
          <p className="text-red-600 text-sm mt-2">{goalError}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !specialty || !goal}
        className={`w-full px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75'}
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Mapping...
          </span>
        ) : (
          'Suggest Career Paths'
        )}
      </button>

      {/* Display suggested career paths */}
      {careerPaths.length > 0 && (
        <div className="mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200 shadow-sm animate-fade-in">
          <h3 className="text-xl font-bold text-emerald-700 mb-4">Suggested Career Paths:</h3>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            {careerPaths.map((path, index) => (
              <li key={index} className="pl-2 leading-relaxed text-base">
                <span className="font-semibold">{path.career}:</span> {path.summary}
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalMessage && <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />}
    </div>
  );
}