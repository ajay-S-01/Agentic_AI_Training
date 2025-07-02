import { useState, useContext, useEffect, useRef } from 'react';
import { AgentContext } from '../context/AgentContext';
import { Download, MapPin, Target, Award, Users, CheckCircle, Clock, ArrowRight, GitCommitHorizontal, Briefcase, Star, TrendingUp } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

// Modal for errors
const CustomModal = ({ message, onClose }) => (
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

// Loading spinner
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
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

// Profile summary at the top
const ProfileSummary = ({ specialty, goal, skills, certifications, targetSpecialty }) => (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="w-6 h-6 mr-3 text-blue-600" />
            Your Starting Point
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Current & Target Roles */}
            <div className="space-y-4">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Current Specialty</p>
                        <p className="text-md font-semibold text-gray-800">{specialty || 'Not Set'}</p>
                    </div>
                </div>
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Target Specialty</p>
                        <p className="text-md font-semibold text-gray-800">{targetSpecialty || 'Not Set'}</p>
                    </div>
                </div>
                 <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Career Goal</p>
                        <p className="text-md font-semibold text-gray-800">{goal || 'Not Set'}</p>
                    </div>
                </div>
            </div>

            {/* Column 2: Skill Gaps */}
            <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Star className="w-4 h-4 mr-2 text-purple-500" />Skill Gaps to Address</h4>
                {Array.isArray(skills) && skills.length > 0 ? (
                    <ul className="space-y-2">
                        {skills.map((skillObj, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-800">
                                <ArrowRight className="w-3 h-3 mr-2 text-purple-400 flex-shrink-0" />
                                {skillObj.text || skillObj.skill || skillObj}
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-gray-500">No skill gaps identified.</p>}
            </div>

            {/* Column 3: Certifications */}
            <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><Award className="w-4 h-4 mr-2 text-yellow-500" />Recommended Certifications</h4>
                {Array.isArray(certifications) && certifications.length > 0 ? (
                    <ul className="space-y-2">
                        {certifications.map((cert, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-800">
                                <ArrowRight className="w-3 h-3 mr-2 text-yellow-400 flex-shrink-0" />
                                <strong>{cert.title || cert}</strong>
                            </li>
                        ))}
                    </ul>
                 ) : <p className="text-sm text-gray-500">No specific certifications recommended yet.</p>}
            </div>
        </div>
    </div>
);

// Timeline phase card
const TimelinePhase = ({ phase, isLast }) => (
    <div className="relative flex items-start">
        {!isLast && <div className="absolute top-5 left-5 w-0.5 h-full bg-blue-200"></div>}
        <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center z-10">
                <GitCommitHorizontal className="w-5 h-5" />
            </div>
        </div>
        <div className="ml-6 pb-12 w-full">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 transform hover:scale-[1.02] transition-transform duration-300">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{phase.phase || phase.title}</h4>
                <ul className="space-y-2">
                    {phase.tasks && phase.tasks.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default function Agent5Page() {
    const { specialty, goal, skills, certifications, mobility, targetSpecialty } = useContext(AgentContext);
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const componentRef = useRef();

    // Fetch roadmap from backend
    const fetchRoadmap = async () => {
        if (!specialty || !goal) {
            setModalMessage("Please ensure your Specialty and Career Goal are set from the previous steps.");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("current_specialty", specialty);
            formData.append("career_goal", goal);
            formData.append("skill_gaps", JSON.stringify(skills));
            formData.append("certifications", JSON.stringify(certifications));
            formData.append("mobility_info", mobility);

            const response = await fetch(
                `${process.env.REACT_APP_API_URL || "http://localhost:8000"}/career-roadmap`,
                { method: "POST", body: formData }
            );
            if (!response.ok) throw new Error("Failed to fetch roadmap");
            const data = await response.json();
            setRoadmap(data.roadmap.structured_roadmap);
        } catch (error) {
            setModalMessage("Failed to fetch roadmap. Please try again.");
            setRoadmap(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (specialty && goal) {
            fetchRoadmap();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [specialty, goal]);

    // Print functionality
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Career-Roadmap-${specialty}-to-${targetSpecialty}`,
        pageStyle: `
            @import url('https://rsms.me/inter/inter.css');
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; color-adjust: exact; }
            .print-container { padding: 0 !important; }
            .no-print { display: none !important; }
            .timeline-step-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
            h1, h2, h3, h4 { color: #111827 !important; break-after: avoid; }
            p, span, li { color: #374151 !important; }
        `,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">Your Career Roadmap</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A personalized journey to achieve your career goals, tailored just for you.
                        </p>
                    </div>

                    {/* Profile Summary */}
                    <ProfileSummary
                        specialty={specialty}
                        goal={goal}
                        skills={skills}
                        certifications={certifications}
                        targetSpecialty={targetSpecialty}
                    />

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
                        {loading ? (
                            <LoadingComponent />
                        ) : roadmap ? (
                            <div ref={componentRef}>
                                <div className="p-8 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Your Generated Path</h2>
                                            <p className="text-gray-500">Follow these steps to reach your goal.</p>
                                        </div>
                                        <button
                                            onClick={handlePrint}
                                            className="no-print flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg w-full sm:w-auto"
                                        >
                                            <Download className="w-5 h-5" />
                                            <span>Download PDF</span>
                                        </button>
                                    </div>
                                </div>

                                {/* --- Enhanced Roadmap Sections --- */}
                                <div ref={componentRef} className="p-8 print-container space-y-8">
                                    {/* Career Path */}
                                    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-xl shadow-sm">
                                        <h2 className="text-2xl font-bold text-blue-800 mb-2">Suggested Career Path</h2>
                                        <p className="text-gray-700 whitespace-pre-line">{roadmap.career_path}</p>
                                    </div>
                                    {/* Mobility Score */}
                                    <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-xl shadow-sm">
                                        <h2 className="text-xl font-bold text-indigo-800 mb-2">Mobility Score & Meaning</h2>
                                        <p className="text-gray-700 whitespace-pre-line">{roadmap.mobility_score}</p>
                                    </div>
                                    {/* Skill Gaps */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h3 className="font-semibold text-gray-700 mb-2">Skill Gaps to Address</h3>
                                        <ul className="list-disc pl-6">
                                            {roadmap.skill_gaps && roadmap.skill_gaps.map((s, i) => (
                                                <li key={i} className="mb-1">{s.skill || s}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Certifications */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h3 className="font-semibold text-gray-700 mb-2">Certifications to Pursue</h3>
                                        <ul className="list-disc pl-6">
                                            {roadmap.certifications && roadmap.certifications.map((c, i) => (
                                                <li key={i} className="mb-1">
                                                    <span className="font-bold">{(c.title || '').replace(/\*\*/g, '')}:</span> {c.description}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Timeline */}
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h3 className="font-semibold text-gray-700 mb-4">Action Plan & Timeline</h3>
                                        {roadmap.timeline_phases && roadmap.timeline_phases.map((phase, i) => (
                                            <TimelinePhase
                                                key={i}
                                                phase={phase}
                                                isLast={i === roadmap.timeline_phases.length - 1}
                                            />
                                        ))}
                                    </div>
                                    {/* Encouragement */}
                                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-xl shadow-sm">
                                        <h3 className="font-semibold text-green-700 mb-2">Encouragement</h3>
                                        <p className="text-gray-700">{roadmap.encouragement}</p>
                                    </div>
                                </div>
                                
                                {/* Action Footer */}
                                <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 no-print">
                                    <div className="flex items-center justify-end">
                                        <button
                                            onClick={fetchRoadmap}
                                            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-700 font-medium transition-colors duration-200"
                                        >
                                            <Clock className="w-4 h-4" />
                                            <span>Regenerate Roadmap</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Generate Your Roadmap?</h3>
                                <p className="text-gray-600 mb-6">Complete the previous steps and click below to create your personalized career path.</p>
                                <button
                                    onClick={fetchRoadmap}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                                >
                                    Generate My Roadmap
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {modalMessage && <CustomModal message={modalMessage} onClose={() => setModalMessage('')} />}
        </div>
    );
}