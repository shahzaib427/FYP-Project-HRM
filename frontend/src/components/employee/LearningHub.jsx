import React, { useState } from 'react';

const LearningHub = () => {
  const [learningProfile, setLearningProfile] = useState({
    level: 'Intermediate',
    preferredFormat: 'Video',
    weeklyHours: 5,
    currentSkills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
    targetSkills: ['AWS', 'Docker', 'System Design', 'TypeScript']
  });

  const [recommendedCourses, setRecommendedCourses] = useState([
    {
      id: 1,
      title: 'AWS Certified Solutions Architect',
      platform: 'Udemy',
      duration: '40 hours',
      level: 'Intermediate',
      rating: 4.7,
      students: 150000,
      progress: 65,
      relevance: 92
    },
    {
      id: 2,
      title: 'Advanced React Patterns',
      platform: 'Frontend Masters',
      duration: '12 hours',
      level: 'Advanced',
      rating: 4.8,
      students: 45000,
      progress: 30,
      relevance: 88
    },
    {
      id: 3,
      title: 'System Design for Interviews',
      platform: 'Educative',
      duration: '25 hours',
      level: 'Intermediate',
      rating: 4.6,
      students: 75000,
      progress: 0,
      relevance: 85
    },
    {
      id: 4,
      title: 'Docker & Kubernetes Mastery',
      platform: 'Pluralsight',
      duration: '18 hours',
      level: 'Beginner',
      rating: 4.5,
      students: 90000,
      progress: 0,
      relevance: 79
    }
  ]);

  const [learningPlan, setLearningPlan] = useState([
    { week: 1, focus: 'AWS Fundamentals', hours: 8, resources: 3 },
    { week: 2, focus: 'EC2 & S3', hours: 6, resources: 2 },
    { week: 3, focus: 'VPC & Security', hours: 8, resources: 4 },
    { week: 4, focus: 'Advanced Services', hours: 10, resources: 3 }
  ]);

  const [dailyRecommendation, setDailyRecommendation] = useState({
    topic: 'AWS IAM Roles & Policies',
    format: 'Interactive Lab',
    duration: '45 minutes',
    skills: ['AWS', 'Security'],
    priority: 'High'
  });

  const [activeTab, setActiveTab] = useState('courses');

  // Course Card Component
  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] shadow-sm">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {course.platform}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                {course.level}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500">⭐</span>
              <span className="font-bold text-gray-900">{course.rating}</span>
            </div>
            <div className="text-xs text-gray-500">{course.students.toLocaleString()} students</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Duration: {course.duration}</span>
            <span className={`font-medium ${
              course.relevance >= 90 ? 'text-green-600' :
              course.relevance >= 80 ? 'text-blue-600' : 'text-amber-600'
            }`}>
              {course.relevance}% Relevance
            </span>
          </div>
          
          {course.progress > 0 && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          <div className="flex space-x-2 pt-2">
            <button className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm font-medium">
              {course.progress > 0 ? 'Continue' : 'Start'}
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm">
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Learning Plan Week Component
  const LearningWeek = ({ week }) => (
    <div className="p-4 rounded-xl border border-gray-200 hover:border-green-300 transition-colors bg-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900">Week {week.week}</h4>
          <p className="text-sm text-gray-600">{week.focus}</p>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
          {week.hours} hrs
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">📚</span>
          <span>{week.resources} resources</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="mr-2">🎯</span>
          <span>Priority: {week.week === 1 ? 'High' : 'Medium'}</span>
        </div>
      </div>
      
      <button className="w-full mt-3 py-2 text-green-700 hover:bg-green-50 border border-green-300 rounded-lg transition-colors text-sm font-medium">
        View Details
      </button>
    </div>
  );

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-green-50 via-white to-emerald-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-green-200/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-200/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                AI Learning Hub
              </h1>
              <p className="mt-2 text-gray-600">
                Personalized learning recommendations and skill development paths
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg">
                <span className="font-bold">{learningProfile.weeklyHours} hrs/week</span>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                Update Goals
              </button>
            </div>
          </div>
        </div>

        {/* Daily Recommendation */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">🎯</span>
                <span className="font-bold text-lg">Today's Learning Task</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{dailyRecommendation.topic}</h2>
              <div className="flex items-center space-x-4 text-blue-100">
                <span className="flex items-center">
                  <span className="mr-1">⏱️</span>
                  {dailyRecommendation.duration}
                </span>
                <span className="flex items-center">
                  <span className="mr-1">📖</span>
                  {dailyRecommendation.format}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  dailyRecommendation.priority === 'High' ? 'bg-red-500/30' : 'bg-yellow-500/30'
                }`}>
                  {dailyRecommendation.priority} Priority
                </span>
              </div>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-colors">
              Start Learning
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-200">
                {['courses', 'path', 'skills', 'resources'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'courses' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Recommended Courses</h3>
                      <span className="text-sm text-gray-500">
                        AI-matched to your career goals
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recommendedCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'path' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">4-Week Learning Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {learningPlan.map(week => (
                        <LearningWeek key={week.week} week={week} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skill Progress */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Development Progress</h3>
              
              <div className="space-y-4">
                {learningProfile.targetSkills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-900">{skill}</span>
                      <span className="text-sm text-gray-600">Target: 80%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.random() * 30 + 20}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Beginner</span>
                      <span>Intermediate</span>
                      <span>Advanced</span>
                      <span>Expert</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Learning Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-6">Learning Statistics</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">18</div>
                    <div className="text-sm text-blue-800">Hours This Month</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <div className="text-sm text-green-800">Courses Completed</div>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-900">Learning Streak</span>
                    <span className="font-bold text-purple-600">7 days 🔥</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-2">
                    <div className="w-7/12 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Tutor */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xl">
                  🧠
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">AI Tutor</h3>
                  <p className="text-sm text-gray-600">Get instant help</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  <span className="text-gray-700">Explain AWS IAM</span>
                  <span className="text-green-600">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  <span className="text-gray-700">Code Review</span>
                  <span className="text-green-600">→</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  <span className="text-gray-700">Quiz Me</span>
                  <span className="text-green-600">→</span>
                </button>
              </div>
            </div>

            {/* Quick Resources */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Resources</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-blue-600">📖</span>
                  <div>
                    <p className="font-medium text-gray-900">React Documentation</p>
                    <p className="text-xs text-gray-500">Official docs & tutorials</p>
                  </div>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-green-600">🎥</span>
                  <div>
                    <p className="font-medium text-gray-900">AWS Free Tier Labs</p>
                    <p className="text-xs text-gray-500">Hands-on practice</p>
                  </div>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <span className="text-purple-600">💻</span>
                  <div>
                    <p className="font-medium text-gray-900">Code Challenges</p>
                    <p className="text-xs text-gray-500">Daily practice problems</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;