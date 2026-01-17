import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CareerCoach = () => {
  const [userProfile, setUserProfile] = useState({
    currentRole: 'Senior Software Engineer',
    experience: 4,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Git'],
    interests: ['Machine Learning', 'Cloud Architecture', 'Team Leadership', 'Product Management'],
    careerGoal: 'Tech Lead',
    timeline: '2 years'
  });

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      title: 'Tech Lead Path',
      description: 'Based on your experience and skills, you\'re well-positioned for a Tech Lead role.',
      steps: [
        'Complete leadership training',
        'Lead a small project team',
        'Get AWS Solutions Architect certification',
        'Improve mentoring skills'
      ],
      timeline: '12-18 months',
      confidence: 85
    },
    {
      id: 2,
      title: 'Cloud Specialist',
      description: 'Your AWS skills combined with interest in cloud architecture make this a strong path.',
      steps: [
        'Get AWS Certified Solutions Architect',
        'Complete GCP/Azure fundamentals',
        'Build a cloud migration project',
        'Join cloud architecture team'
      ],
      timeline: '6-12 months',
      confidence: 78
    }
  ]);

  const [skillGap, setSkillGap] = useState([
    { skill: 'System Design', current: 65, target: 90, importance: 'High' },
    { skill: 'Team Management', current: 40, target: 85, importance: 'High' },
    { skill: 'DevOps', current: 60, target: 80, importance: 'Medium' },
    { skill: 'AI/ML Basics', current: 30, target: 70, importance: 'Medium' }
  ]);

  const [marketData, setMarketData] = useState({
    techLeadSalary: '₹25-35 LPA',
    demand: 'High',
    growth: '22% annually',
    companies: ['Amazon', 'Microsoft', 'Google', 'Flipkart', 'Zomato']
  });

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your AI Career Coach. How can I help you today?", time: '10:00 AM' },
    { id: 2, sender: 'user', text: "What career paths are best for me?", time: '10:01 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // AI Chat Functions
  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const newUserMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newUserMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your profile, I'd recommend focusing on leadership skills for the Tech Lead path.",
        "Your AWS skills are strong! Consider getting certified as an AWS Solutions Architect.",
        "I notice you're interested in ML. Would you like learning recommendations?",
        "Here's what you need to reach your goal in 2 years..."
      ];
      
      const aiResponse = {
        id: chatMessages.length + 2,
        sender: 'ai',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setChatInput('');
  };

  // Skill Gap Analysis Card
  const SkillGapCard = ({ skill }) => (
    <div className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors bg-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          skill.importance === 'High' ? 'bg-red-100 text-red-800' :
          skill.importance === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {skill.importance}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Current: {skill.current}%</span>
          <span className="text-gray-600">Target: {skill.target}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            style={{ width: `${skill.current}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-500">
          Gap: {skill.target - skill.current}% to reach target
        </div>
      </div>
    </div>
  );

  // Career Path Card
  const CareerPathCard = ({ path }) => (
    <div className="p-5 rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:scale-[1.02] bg-white shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{path.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{path.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-purple-600">{path.confidence}% Match</div>
          <div className="text-xs text-gray-500">Timeline: {path.timeline}</div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-gray-900 text-sm">Next Steps:</h4>
        <ul className="space-y-1">
          {path.steps.map((step, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <span className="text-green-500 mr-2">✓</span>
              {step}
            </li>
          ))}
        </ul>
      </div>
      
      <button className="w-full mt-3 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
        View Detailed Plan
      </button>
    </div>
  );

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-purple-50 via-white to-pink-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-purple-200/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pink-200/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                AI Career Coach
              </h1>
              <p className="mt-2 text-gray-600">
                Personalized career guidance and path recommendations powered by AI
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                Export Plan
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
                Update Profile
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chat & Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* AI Chat Assistant */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Career Coach AI</h3>
                    <p className="text-xs text-gray-600">Ask me anything about your career!</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 h-96 overflow-y-auto">
                <div className="space-y-4">
                  {chatMessages.map(msg => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-none' 
                          : 'bg-gray-100 text-gray-900 rounded-bl-none'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                    placeholder="Ask about career paths, skills, or opportunities..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    onClick={handleChatSend}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg transition-all duration-200"
                  >
                    Send
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {["What skills should I learn?", "Career path suggestions", "Salary trends", "Interview tips"].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setChatInput(suggestion)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Path Recommendations */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recommended Career Paths</h2>
                <span className="text-sm text-purple-600 font-medium">AI-Generated</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map(path => (
                  <CareerPathCard key={path.id} path={path} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Analysis */}
          <div className="space-y-8">
            {/* Skill Gap Analysis */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Skill Gap Analysis</h2>
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                  4 gaps identified
                </span>
              </div>
              
              <div className="space-y-4">
                {skillGap.map((skill, index) => (
                  <SkillGapCard key={index} skill={skill} />
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full py-2 border border-purple-300 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium">
                  View Learning Resources
                </button>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Market Insights</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-900">Target Role:</span>
                    <span className="font-bold text-green-900">{userProfile.careerGoal}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Avg Salary:</span>
                      <span className="font-medium">{marketData.techLeadSalary}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Demand:</span>
                      <span className={`font-medium ${
                        marketData.demand === 'High' ? 'text-green-600' : 
                        marketData.demand === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {marketData.demand}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-700">Growth Rate:</span>
                      <span className="font-medium">{marketData.growth}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Top Hiring Companies</h4>
                  <div className="flex flex-wrap gap-2">
                    {marketData.companies.map((company, index) => (
                      <span key={index} className="px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <span className="text-gray-700">Schedule Career Counseling</span>
                  <span className="text-purple-600">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <span className="text-gray-700">Update Career Goals</span>
                  <span className="text-purple-600">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                  <span className="text-gray-700">Download Career Report</span>
                  <span className="text-purple-600">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerCoach;