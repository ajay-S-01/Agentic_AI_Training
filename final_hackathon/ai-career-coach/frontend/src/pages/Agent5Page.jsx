import { useState, useContext, useEffect, useRef } from 'react';
import { AgentContext } from '../context/AgentContext'; // <-- ADD THIS LINE
import { Download, MapPin, Target, Award, Users, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';


// Custom Modal Component with improved styling
const CustomModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-md w-full transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-800 mb-6 text-center leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 font-medium"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

// Loading component with better animation
const LoadingComponent = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
    </div>
    <div className="mt-6 text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Crafting Your Career Roadmap</h3>
      <p className="text-gray-600">Analyzing your profile and generating personalized recommendations...</p>
    </div>
    <div className="mt-4 flex space-x-1">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
    </div>
  </div>
);

// Profile summary component
const ProfileSummary = ({ specialty, goal, skills, certifications, mobility }) => (
  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <Users className="w-5 h-5 mr-2 text-blue-600" />
      Your Profile Summary
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <MapPin className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Current Specialty</p>
          <p className="text-gray-800">{specialty}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <Target className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Career Goal</p>
          <p className="text-gray-800">{goal}</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <Award className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Skills & Certifications</p>
          <p className="text-gray-800">{skills || certifications || 'Not specified'}</p>
        </div>
      </div>
      {/* <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
          <Clock className="w-4 h-4 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Work Preference</p>
          <p className="text-gray-800">{mobility || 'Flexible'}</p>
        </div>
      </div> */}
    </div>
  </div>
);

export default function Agent5Page() {
  // Mock context usage - replace with your actual useContext
  const { specialty, goal, skills, certifications, mobility } = useContext(AgentContext);
  
  const [roadmap, setRoadmap] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const componentRef = useRef();

  // Mock roadmap data for demonstration
  const mockRoadmap = `# Your Personalized Career Roadmap

## Phase 1: Foundation Building (Months 1-3)
• Master advanced React patterns and hooks
• Deep dive into TypeScript for better code quality
• Learn testing frameworks (Jest, React Testing Library)
• Build 2-3 portfolio projects showcasing your skills

## Phase 2: Backend & Full Stack (Months 4-6)
• Strengthen Node.js and Express.js knowledge
• Learn database design (SQL and NoSQL)
• Understand API design and RESTful services
• Practice with microservices architecture

## Phase 3: Cloud & DevOps (Months 7-9)
• Get AWS Certified Solutions Architect
• Learn Docker and container orchestration
• Understand CI/CD pipelines
• Practice with infrastructure as code

## Phase 4: Leadership & Advanced Skills (Months 10-12)
• Develop system design skills
• Learn team leadership and mentoring
• Contribute to open source projects
• Build a personal brand through tech blogging

## Recommended Resources:
- Online courses: Udemy, Pluralsight, freeCodeCamp
- Books: Clean Code, System Design Interview
- Practice: LeetCode, HackerRank for algorithms
- Networking: Join tech meetups and conferences`;

  const fetchRoadmap = async () => {
    if (!specialty || !goal) {
      setModalMessage("Please ensure your Specialty and Career Goal are set from previous steps.");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRoadmap(mockRoadmap);
      setLoading(false);
    }, 3000);
  };

useEffect(() => {
  if (specialty && goal) {
    fetchRoadmap();
  }
}, [specialty, goal, skills, certifications, mobility]);

  // Hook for printing functionality
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Personalized Career Roadmap',
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      .print-container {
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        background: white !important;
      }
      .gradient-bg {
        background: white !important;
      }
      .shadow-xl, .shadow-lg {
        box-shadow: none !important;
      }
      .border {
        border: 1px solid #e5e7eb !important;
      }
      h1, h2, h3, h4, h5, h6 {
        color: #1f2937 !important;
        break-after: avoid;
      }
      p, pre {
        color: #374151 !important;
      }
      pre {
        white-space: pre-wrap !important;
        word-break: break-word !important;
        background-color: #f9fafb !important;
        padding: 1rem !important;
        border-radius: 0.5rem !important;
        border: 1px solid #e5e7eb !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
      }
      .no-print {
        display: none !important;
      }
    `,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Career Roadmap</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A personalized journey to achieve your career goals, tailored specifically for you
            </p>
          </div>

          {/* Profile Summary */}
          <ProfileSummary 
            specialty={specialty}
            goal={goal}
            skills={skills}
            certifications={certifications}
            mobility={mobility}
          />

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {loading ? (
              <LoadingComponent />
            ) : roadmap ? (
              <>
                {/* Roadmap Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 gradient-bg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-white" />
                      <div>
                        <h2 className="text-2xl font-bold text-white">Roadmap Generated</h2>
                        <p className="text-blue-100">Your personalized path to success</p>
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm no-print"
                    >
                      <Download className="w-5 h-5" />
                      <span className="font-medium">Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Roadmap Content */}
                <div ref={componentRef} className="p-8 print-container">
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100 gradient-bg">
                      <pre className="text-gray-800 whitespace-pre-wrap font-sans leading-relaxed text-base">
                        {roadmap}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 no-print">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Roadmap ready for download</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={fetchRoadmap}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Regenerate</span>
                      </button>
                      <button
                        onClick={handlePrint}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Generate Your Roadmap</h3>
                <p className="text-gray-600 mb-6">Complete the previous steps to get your personalized career roadmap</p>
                <button
                  onClick={fetchRoadmap}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium"
                >
                  Generate Roadmap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Modal */}
      {modalMessage && <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />}
    </div>
  );
}