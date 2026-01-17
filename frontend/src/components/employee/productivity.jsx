import React, { useState, useEffect } from 'react';

const Productivity = () => {
  const [productivityScore, setProductivityScore] = useState({
    today: 78,
    week: 82,
    month: 75,
    focus: 65,
    efficiency: 85
  });

  const [timeTracking, setTimeTracking] = useState({
    productiveHours: 6.5,
    meetings: 2.0,
    breaks: 1.5,
    distractions: 0.8,
    deepWork: 3.2
  });

  const [focusSessions, setFocusSessions] = useState([
    { id: 1, task: 'Code Review', duration: 45, focus: 88, completed: true },
    { id: 2, task: 'Project Planning', duration: 60, focus: 92, completed: true },
    { id: 3, task: 'Documentation', duration: 30, focus: 75, completed: false },
    { id: 4, task: 'API Development', duration: 90, focus: 95, completed: false }
  ]);

  const [distractions, setDistractions] = useState([
    { source: 'Email', count: 12, time: 45 },
    { source: 'Slack', count: 8, time: 30 },
    { source: 'Social Media', count: 5, time: 25 },
    { source: 'Meetings', count: 3, time: 120 }
  ]);

  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: 1,
      title: 'Batch Email Processing',
      description: 'Check emails only at 11 AM, 2 PM, and 4 PM',
      impact: 'Save 30 mins daily',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Meeting Optimization',
      description: 'Reduce meeting duration from 60 to 45 mins',
      impact: 'Save 3 hrs weekly',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Focus Time Blocks',
      description: 'Schedule deep work from 9-11 AM daily',
      impact: 'Increase focus by 25%',
      priority: 'high'
    }
  ]);

  const [activeSession, setActiveSession] = useState(null);
  const [sessionTime, setSessionTime] = useState(0);

  // Start focus session
  const startFocusSession = () => {
    setActiveSession({
      id: Date.now(),
      task: 'Deep Work Session',
      startTime: new Date(),
      focusLevel: 0
    });
    setSessionTime(0);
  };

  // Stop focus session
  const stopFocusSession = () => {
    if (activeSession) {
      const newSession = {
        ...activeSession,
        duration: sessionTime,
        focus: Math.floor(Math.random() * 30) + 70,
        completed: true
      };
      setFocusSessions([newSession, ...focusSessions]);
      setActiveSession(null);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Focus Session Card
  const FocusSessionCard = ({ session }) => (
    <div className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors bg-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900">{session.task}</h4>
          <p className="text-sm text-gray-600">{session.duration} mins</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          session.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {session.completed ? 'Completed' : 'In Progress'}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Focus Score</span>
          <span className="font-medium text-gray-900">{session.focus}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
            style={{ width: `${session.focus}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  // Distraction Card
  const DistractionCard = ({ distraction }) => (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
      <div>
        <p className="font-medium text-gray-900">{distraction.source}</p>
        <p className="text-xs text-gray-500">{distraction.count} interruptions</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-red-600">{distraction.time} mins</p>
        <p className="text-xs text-gray-500">Time lost</p>
      </div>
    </div>
  );

  // AI Suggestion Card
  const AISuggestionCard = ({ suggestion }) => (
    <div className={`p-4 rounded-xl border ${
      suggestion.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-gray-900">{suggestion.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          suggestion.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {suggestion.priority}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">🎯 {suggestion.impact}</span>
        <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-amber-50 via-white to-orange-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-amber-200/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-orange-200/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                AI Productivity Assistant
              </h1>
              <p className="mt-2 text-gray-600">
                Optimize your workflow and maximize efficiency with AI insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg">
                <span className="font-bold">Score: {productivityScore.today}%</span>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Focus Timer */}
        {activeSession ? (
          <div className="mb-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 text-white text-center">
            <div className="text-5xl font-bold mb-4">{formatTime(sessionTime)}</div>
            <p className="text-xl mb-2">Deep Work Session</p>
            <p className="text-blue-100 mb-6">Focus on your current task without distractions</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={stopFocusSession}
                className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-colors"
              >
                Complete Session
              </button>
              <button className="px-6 py-3 bg-red-500/30 hover:bg-red-500/40 text-white rounded-xl font-bold transition-colors">
                Take Break
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-6 text-white text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="text-xl font-bold">Ready for Focus?</p>
                <p className="text-amber-100">Start a timed focus session</p>
              </div>
            </div>
            <button
              onClick={startFocusSession}
              className="px-8 py-4 bg-white text-amber-600 hover:bg-amber-50 rounded-xl font-bold text-lg transition-all duration-200 hover:scale-105"
            >
              Start Focus Session (25 mins)
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Time Tracking & Focus */}
          <div className="lg:col-span-2 space-y-8">
            {/* Time Distribution */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Time Distribution Today</h2>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{timeTracking.productiveHours}h</div>
                  <div className="text-sm text-green-800">Productive</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{timeTracking.meetings}h</div>
                  <div className="text-sm text-blue-800">Meetings</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-2xl font-bold text-amber-600">{timeTracking.breaks}h</div>
                  <div className="text-sm text-amber-800">Breaks</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="text-2xl font-bold text-red-600">{timeTracking.distractions}h</div>
                  <div className="text-sm text-red-800">Distracted</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600">{timeTracking.deepWork}h</div>
                  <div className="text-sm text-purple-800">Deep Work</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div className="bg-green-500" style={{ width: '50%' }}></div>
                    <div className="bg-blue-500" style={{ width: '15%' }}></div>
                    <div className="bg-amber-500" style={{ width: '12%' }}></div>
                    <div className="bg-red-500" style={{ width: '6%' }}></div>
                    <div className="bg-purple-500" style={{ width: '17%' }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>8 AM</span>
                  <span>12 PM</span>
                  <span>4 PM</span>
                  <span>8 PM</span>
                </div>
              </div>
            </div>

            {/* Focus Sessions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Today's Focus Sessions</h2>
                <span className="text-sm text-blue-600 font-medium">
                  {focusSessions.filter(s => s.completed).length}/{focusSessions.length} Completed
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {focusSessions.map(session => (
                  <FocusSessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Insights & Suggestions */}
          <div className="space-y-8">
            {/* AI Suggestions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">AI Optimization Tips</h2>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  3 suggestions
                </span>
              </div>
              
              <div className="space-y-4">
                {aiSuggestions.map(suggestion => (
                  <AISuggestionCard key={suggestion.id} suggestion={suggestion} />
                ))}
              </div>
            </div>

            {/* Distraction Analysis */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-6">Distraction Analysis</h3>
              
              <div className="space-y-3">
                {distractions.map((distraction, index) => (
                  <DistractionCard key={index} distraction={distraction} />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  <div>
                    <p className="font-medium text-red-900">AI Recommendation:</p>
                    <p className="text-sm text-red-700">
                      Turn off notifications during focus sessions to reduce distractions by 60%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Productivity Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Productivity Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Daily Goal</span>
                  <span className="font-bold text-green-600">85% Achieved</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Focus Time</span>
                  <span className="font-bold text-blue-600">3.2 hrs/day</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Task Completion</span>
                  <span className="font-bold text-purple-600">92% Rate</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Avg. Task Time</span>
                  <span className="font-bold text-amber-600">45 mins</span>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Productivity Tools</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
                  <div className="text-xl mb-1">⏱️</div>
                  <div className="text-sm text-gray-700">Pomodoro</div>
                </button>
                <button className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
                  <div className="text-xl mb-1">📝</div>
                  <div className="text-sm text-gray-700">Task List</div>
                </button>
                <button className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
                  <div className="text-xl mb-1">🎯</div>
                  <div className="text-sm text-gray-700">Goal Set</div>
                </button>
                <button className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center">
                  <div className="text-xl mb-1">📊</div>
                  <div className="text-sm text-gray-700">Analytics</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productivity;