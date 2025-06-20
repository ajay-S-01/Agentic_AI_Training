// src/components/SpecialtyUpload.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function SpecialtyUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // State for custom modal message

  const { setSpecialty } = useContext(AgentContext);
  const navigate = useNavigate();

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload and API call
  const handleUpload = async () => {
    if (!file) {
      setModalMessage('Please select a file first!'); // Set modal message
      return;
    }
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/analyze-specialty', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const detectedSpecialty = res.data.specialty; // Access 'specialty' key from response
      // Optionally use res.data.focus if needed
      
      setResult(detectedSpecialty);
      setSpecialty(detectedSpecialty); // Store specialty in context
      navigate('/agent2'); // Auto-navigate to Agent 2
    } catch (err) {
      console.error("Upload failed:", err);
      setModalMessage('Upload failed! Please try again.'); // Set modal message for error
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Clinical Profile (PDF)</h2>
      
      {/* File input area */}
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg mb-6 hover:border-blue-500 transition-colors duration-200">
        <label htmlFor="file-upload" className="cursor-pointer">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L40 32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-blue-600 hover:text-blue-500">Upload a file</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PDF up to 10MB</p>
          <input id="file-upload" type="file" accept=".pdf" onChange={handleFileChange} className="sr-only" />
        </label>
        {file && <p className="mt-2 text-sm text-gray-700">Selected file: <span className="font-semibold">{file.name}</span></p>}
      </div>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className={`w-full px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out
          ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75'}
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          'Analyze Specialty'
        )}
      </button>

      {/* Display detected specialty result */}
      {result && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm animate-fade-in">
          <h3 className="text-xl font-bold text-blue-700 mb-3">Detected Specialty:</h3>
          <p className="text-lg text-gray-700 whitespace-pre-wrap font-mono bg-blue-100 p-3 rounded-md border border-blue-300">{result}</p>
        </div>
      )}

      {/* Custom Modal rendering */}
      {modalMessage && <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />}
    </div>
  );
}
