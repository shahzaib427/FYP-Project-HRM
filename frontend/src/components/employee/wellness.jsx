import React, { useState } from 'react';

const Wellness = () => {
  const [wellnessScore, setWellnessScore] = useState({
    overall: 78,
    physical: 82,
    mental: 75,
    emotional: 70,
    social: 85
  });

  const [dailyCheckIn, setDailyCheckIn] = useState({
    mood: 'Good',
    energy: 7,
    stress: 4,
    sleep: 7,
    productivity: 8
  });

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      type: 'meditation',
      title: 'Mindful Breathing',
      duration: '10 mins',
      benefit: 'Reduce stress',
      icon: '🧘',
      priority: 'high'
    },
    {
      id: 2,
      type: 'exercise',
      title: 'Desk Stretches',
      duration: '5 mins',
      benefit: 'Improve posture',
      icon: '💪',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'nutrition',
      title: 'Hydration Reminder',
      duration: 'Ongoing',
      benefit: 'Stay hydrated',
      icon: '💧',
      priority: 'high'
    },
    {
      id: 4,
      type: 'break',
      title: 'Micro-break',
      duration: '2 mins',
      benefit: 'Prevent burnout',
      icon: '☕',
      priority: 'low'
    }
  ]);

  const [stressPatterns, setStressPatterns] = useState([
    { day: 'Mon', value: 65, peak: '10:00 AM', cause: 'Morning meetings' },
    { day: 'Tue', value: 55, peak: '2:00 PM', cause: 'Project deadlines' },
    { day: 'Wed', value: 70, peak: '11:00 AM', cause: 'Client calls' },
    { day: 'Thu', value: 45, peak: '4:00 PM', cause: 'Code reviews' },
    { day: 'Fri', value: 50, peak: '3:00 PM', cause: 'Weekend planning' }
  ]);

  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your wellness assistant. How are you feeling today?", time: '9:00 AM' },
    { id: 2, sender: 'user', text: "A bit stressed about deadlines", time: '9:01 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Mood tracking
  const moods = ['😢', '😔', '😐', '🙂', '😊', '🤩'];
  const [selectedMood, setSelectedMood] = useState(3);

  // Wellness Score Card
  const ScoreCard = ({ title, score, color }) => (
    <div className="text-center p-4 rounded-xl border bg-white">
      <div className="text-3xl mb-2">{getScoreIcon(score)}</div>
      <div className={`text-2xl font-bold mb-1 ${color}`}>{score}%</div>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className={`h-2 rounded-full ${color.replace('text', 'bg')}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
    </div>
  );

  const getScoreIcon = (score) => {
    if (score >= 80) return '🌟';
    if (score >= 70) return '👍';
    if (score >= 60) return '😊';
    return '😔';
  };

  // Recommendation Card
  const RecommendationCard = ({ rec }) => (
    <div className={`p-4 rounded-xl border ${
      rec.priority === 'high' ? 'border-red-200 bg-red-50' :
      rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
      'border-green-200 bg-green-50'
    }`}>
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-2xl">{rec.icon}</div>
        <div>
          <h4 className="font-bold text-gray-900">{rec.title}</h4>
          <p className="text-sm text-gray-600">{rec.benefit}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">⏱️ {rec.duration}</span>
        <button className="px-3 py-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm">
          Start
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-rose-50 via-white to-pink-50/30">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-rose-200/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-pink-200/20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
                AI Wellness Coach
              </h1>
              <p className="mt-2 text-gray-600">
                Your personal assistant for mental and physical wellbeing
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg">
                <span className="font-bold">Wellness Score: {wellnessScore.overall}%</span>
              </div>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                Daily Check-in
              </button>
            </div>
          </div>
        </div>

        {/* Wellness Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <ScoreCard title="Overall" score={wellnessScore.overall} color="text-purple-600" />
          <ScoreCard title="Physical" score={wellnessScore.physical} color="text-green-600" />
          <ScoreCard title="Mental" score={wellnessScore.mental} color="text-blue-600" />
          <ScoreCard title="Emotional" score={wellnessScore.emotional} color="text-yellow-600" />
          <ScoreCard title="Social" score={wellnessScore.social} color="text-pink-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Daily Check-in & Chat */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Check-in */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Daily Check-in</h2>
                <span className="text-sm text-gray-500">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="space-y-6">
                {/* Mood Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    How are you feeling today?
                  </label>
                  <div className="flex justify-between">
                    {moods.map((mood, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedMood(index)}
                        className={`text-3xl transition-transform ${
                          selectedMood === index 
                            ? 'scale-125 transform' 
                            : 'opacity-50 hover:opacity-100'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">{dailyCheckIn.energy}/10</div>
                    <div className="text-xs text-blue-800">Energy</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-600">{dailyCheckIn.stress}/10</div>
                    <div className="text-xs text-red-800">Stress</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-lg font-bold text-purple-600">{dailyCheckIn.sleep} hrs</div>
                    <div className="text-xs text-purple-800">Sleep</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-600">{dailyCheckIn.productivity}/10</div>
                    <div className="text-xs text-green-800">Productivity</div>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-700 hover:to-pink-600 text-white rounded-xl font-bold transition-all duration-200">
                  Submit Check-in
                </button>
              </div>
            </div>

            {/* Stress Patterns */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Stress Patterns</h2>
              
              <div className="space-y-4">
                {stressPatterns.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 text-sm text-gray-600">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                            style={{ width: `${day.value}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{day.value}%</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Peak: {day.peak} • {day.cause}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💡</span>
                  <div>
                    <p className="font-medium text-blue-900">AI Insight:</p>
                    <p className="text-sm text-blue-700">
                      Your stress peaks during morning meetings. Try 5-min meditation before meetings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recommendations & Chat */}
          <div className="space-y-8">
            {/* AI Recommendations */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">AI Recommendations</h2>
                <span className="text-sm text-rose-600 font-medium">Updated Daily</span>
              </div>
              
              <div className="space-y-4">
                {recommendations.map(rec => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Wellness Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                  <span className="text-gray-700">Breathing Exercise</span>
                  <span className="text-rose-600">🧘 →</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                  <span className="text-gray-700">Guided Meditation</span>
                  <span className="text-rose-600">🎧 →</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                  <span className="text-gray-700">Desk Yoga</span>
                  <span className="text-rose-600">🧘 →</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors">
                  <span className="text-gray-700">Mood Journal</span>
                  <span className="text-rose-600">📝 →</span>
                </button>
              </div>
            </div>

            {/* Wellness Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Wellness Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Meditation Streak</span>
                  <span className="font-bold text-green-600">7 days 🔥</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Avg Sleep</span>
                  <span className="font-bold text-purple-600">7.2 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Work Breaks</span>
                  <span className="font-bold text-blue-600">85% Daily Goal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Screen Time</span>
                  <span className="font-bold text-amber-600">6.5 hrs/day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;