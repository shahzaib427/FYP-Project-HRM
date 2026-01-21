import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import {
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaCalendarDay,
  FaHistory,
  FaUserClock
} from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 HR Attendance Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🚨</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">HR Attendance Error</h2>
            <p className="text-gray-700 mb-6">Something went wrong loading HR attendance data.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-medium"
            >
              🔄 Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const HRAttendanceContent = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    averageHours: 0
  });

  useEffect(() => {
    loadHRAttendance();
  }, []);

  const loadHRAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosInstance.get('/attendance/my-attendance');
      
      const data = res.data.data || [];
      setHistory(data);
      
      const today = new Date().toDateString();
      const todayRecord = data.find(r => 
        r.date && new Date(r.date).toDateString() === today
      ) || null;
      setTodayAttendance(todayRecord);
      
      // Calculate stats
      const presentDays = data.filter(r => r.status === 'present' || r.status === 'half-day').length;
      const totalHours = data.reduce((sum, r) => sum + (r.totalHours || 0), 0);
      
      setStats({
        totalDays: data.length,
        presentDays,
        averageHours: data.length > 0 ? totalHours / data.length : 0
      });
    } catch (error) {
      console.error('🚨 HR Attendance load error:', error);
      setError('Failed to load HR attendance data');
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
      await loadHRAttendance();
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
      await loadHRAttendance();
    } catch (error) {
      alert(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Loading HR Attendance...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">HR Attendance</h1>
        <p className="text-gray-600">Track your daily attendance and work hours</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex items-center">
            <FaTimesCircle className="text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={loadHRAttendance} 
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium mb-1">Total Days</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalDays}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FaCalendarDay className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium mb-1">Present Days</p>
              <p className="text-3xl font-bold text-green-900">{stats.presentDays}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FaUserClock className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium mb-1">Avg. Hours/Day</p>
              <p className="text-3xl font-bold text-purple-900">{stats.averageHours.toFixed(1)}h</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FaClock className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Attendance Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">
              <FaCalendarDay className="inline mr-3" />
              Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            
            <div className="flex items-center space-x-6 mt-4">
              <div>
                <p className="text-sm text-blue-200">Check In</p>
                <p className="text-xl font-semibold">
                  {todayAttendance?.checkIn 
                    ? new Date(todayAttendance.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : '--:--'
                  }
                </p>
              </div>
              
              <div>
                <p className="text-sm text-blue-200">Check Out</p>
                <p className="text-xl font-semibold">
                  {todayAttendance?.checkOut 
                    ? new Date(todayAttendance.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : '--:--'
                  }
                </p>
              </div>
              
              <div>
                <p className="text-sm text-blue-200">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  todayAttendance?.status === 'present' ? 'bg-green-500' :
                  todayAttendance?.status === 'half-day' ? 'bg-yellow-500' :
                  todayAttendance?.status === 'late' ? 'bg-orange-500' :
                  todayAttendance?.checkIn ? 'bg-blue-500' : 'bg-gray-500'
                }`}>
                  {todayAttendance?.status === 'present' ? 'Present' :
                   todayAttendance?.status === 'half-day' ? 'Half Day' :
                   todayAttendance?.status === 'late' ? 'Late' :
                   todayAttendance?.checkIn ? 'Checked In' : 'Not Checked In'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            {!todayAttendance?.checkIn && !loading && (
              <button 
                onClick={handleCheckIn}
                disabled={loading}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <FaCheckCircle className="mr-2" />
                Check In Now
              </button>
            )}

            {todayAttendance?.checkIn && !todayAttendance?.checkOut && !loading && (
              <button 
                onClick={handleCheckOut}
                disabled={loading}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <FaTimesCircle className="mr-2" />
                Check Out Now
              </button>
            )}

            {todayAttendance?.checkIn && todayAttendance?.checkOut && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                <div className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-2" />
                  <p className="font-semibold">Today Complete!</p>
                </div>
                <p className="text-sm mt-1 text-green-200">
                  Worked: {todayAttendance.totalHours?.toFixed(1) || 0} hours
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaHistory className="text-gray-600 mr-3 text-xl" />
              <h2 className="text-2xl font-bold text-gray-800">Attendance History</h2>
            </div>
            <button 
              onClick={loadHRAttendance}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {history.length === 0 && !loading && (
            <div className="mt-4 p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHistory className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 text-lg">No attendance records found</p>
              <p className="text-gray-400 text-sm mt-1">Start by checking in today!</p>
            </div>
          )}
        </div>
        
        {history.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {history.map((record, index) => (
                  <tr 
                    key={record._id || index} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkIn 
                        ? new Date(record.checkIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        : <span className="text-gray-400">--:--</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {record.checkOut 
                        ? new Date(record.checkOut).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                        : <span className="text-gray-400">--:--</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.totalHours?.toFixed(1) || '0.0'}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'late' ? 'bg-orange-100 text-orange-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status === 'present' ? 'Present' :
                         record.status === 'half-day' ? 'Half Day' :
                         record.status === 'late' ? 'Late' :
                         record.status === 'absent' ? 'Absent' :
                         'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Wrap with Error Boundary
const HRAttendance = () => (
  <ErrorBoundary>
    <HRAttendanceContent />
  </ErrorBoundary>
);

export default HRAttendance;