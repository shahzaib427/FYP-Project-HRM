import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

// 🔥 ERROR BOUNDARY CLASS
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Attendance Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚨</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Attendance Error</h2>
            <p className="text-gray-700 mb-6">Something went wrong loading attendance data.</p>
            <div className="bg-red-100 p-4 rounded-xl mb-6 border-l-4 border-red-400">
              <p className="font-mono text-sm text-red-800">{this.state.error?.message || 'Unknown error'}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium"
              >
                🔄 Reload Page
              </button>
              <button 
                onClick={() => window.history.back()} 
                className="bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 font-medium"
              >
                ← Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const EmployeeAttendanceContent = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('/attendance/my-attendance');
      
      // ✅ SAFE DATA HANDLING
      const data = res.data.data || [];
      setHistory(data);
      
      const today = new Date().toDateString();
      const todayRecord = data.find(r => 
        r.date && new Date(r.date).toDateString() === today
      ) || null;
      setTodayAttendance(todayRecord);
    } catch (error) {
      console.error('🚨 Attendance load error:', error);
      setError('Failed to load attendance data');
      setHistory([]);
      setTodayAttendance(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/attendance/checkin');
      await loadAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/attendance/checkout');
      await loadAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Attendance</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
          <button onClick={loadAttendance} className="mt-2 text-blue-600 underline">
            Retry
          </button>
        </div>
      )}

      {/* TODAY CARD */}
      <div className="bg-blue-600 text-white p-6 rounded-xl mb-6">
        <h2 className="text-xl font-bold mb-2">
          Today: {new Date().toLocaleDateString()}
        </h2>
        <p>Status: {todayAttendance?.status || 'Not Checked In'}</p>

        {!todayAttendance?.checkIn && !loading && (
          <button 
            onClick={handleCheckIn} 
            disabled={loading}
            className="mt-4 bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? '...' : '✅ Check In'}
          </button>
        )}

        {todayAttendance?.checkIn && !todayAttendance?.checkOut && !loading && (
          <button 
            onClick={handleCheckOut} 
            disabled={loading}
            className="mt-4 bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? '...' : '🚪 Check Out'}
          </button>
        )}

        {todayAttendance?.checkIn && todayAttendance?.checkOut && (
          <div className="mt-4 p-4 bg-green-500/20 rounded-lg">
            <p className="font-medium">✅ Completed Today</p>
            <p className="text-sm">
              {todayAttendance.totalHours || 0}h worked
            </p>
          </div>
        )}
      </div>

      {/* HISTORY */}
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Attendance History</h2>
          {history.length === 0 && !loading && (
            <p className="text-gray-500 mt-2">No attendance records found</p>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {history.map(h => (
                <tr key={h._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(h.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {h.checkIn ? new Date(h.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {h.checkOut ? new Date(h.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {h.totalHours?.toFixed(1) || 0}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      h.status === 'Present' ? 'bg-green-100 text-green-800' :
                      h.status === 'Absent' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 🔥 WRAP WITH ERROR BOUNDARY
const EmployeeAttendance = () => (
  <ErrorBoundary>
    <EmployeeAttendanceContent />
  </ErrorBoundary>
);

export default EmployeeAttendance;
