import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';  // ✅ axiosInstance has /api baseURL

const AdminAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ FIXED: `/attendance` ONLY - axiosInstance adds /api automatically
      const params = new URLSearchParams(filters).toString();
      const response = await axiosInstance.get(`/attendance?${params}`);
      
      console.log('✅ Attendance API Response:', response.data);
      setAttendances(response.data.data || []);
    } catch (error) {
      console.error('❌ Admin attendance error:', error.response?.data || error);
      setError(error.response?.data?.error || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this attendance record?')) {
      try {
        await axiosInstance.delete(`/attendance/${id}`);
        fetchAttendance();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete attendance');
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/attendance/${editing._id}`, editing);
      setEditing(null);
      fetchAttendance();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update attendance');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditing({ ...editing, [name]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Attendance Management</h1>
        <p className="text-gray-600">View, edit, and manage all employee attendance records</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="date" 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />
          <input 
            type="date" 
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
          <button 
            onClick={fetchAttendance}
            className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            🔍 Filter
          </button>
          <button 
            onClick={() => {
              setFilters({});
              setAttendances([]);
            }}
            className="bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-medium text-gray-500">Total Records</h4>
          <p className="text-3xl font-bold text-blue-600">{attendances.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-medium text-gray-500">Present Today</h4>
          <p className="text-3xl font-bold text-green-600">
            {attendances.filter(a => a.status === 'present').length}
          </p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <h2 className="text-2xl font-bold">Attendance Records</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Hours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-lg">No attendance records found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {filters.dateFrom || filters.dateTo 
                          ? 'Try adjusting your filters or clear them to see all records'
                          : 'No attendance data available'
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                attendances.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {record.employee?.name || 'Unknown Employee'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {record.employee?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkIn 
                        ? new Date(record.checkIn).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.checkOut 
                        ? new Date(record.checkOut).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-bold text-lg text-blue-600">
                        {record.totalHours?.toFixed(1) || 0}h
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        record.status === 'present' ? 'bg-green-100 text-green-800' :
                        record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800' :
                        record.status === 'late' ? 'bg-orange-100 text-orange-800' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status || 'Not Checked In'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditing(record)}
                        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record._id)}
                        className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Edit Attendance</h3>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Employee</label>
                <input
                  type="text"
                  value={editing.employee?.name || 'N/A'}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Date</label>
                <input
                  type="date"
                  value={new Date(editing.date).toISOString().split('T')[0]}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Status *</label>
                <select
                  name="status"
                  value={editing.status || ''}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="present">✅ Present</option>
                  <option value="absent">❌ Absent</option>
                  <option value="late">⏰ Late</option>
                  <option value="half-day">🕐 Half Day</option>
                </select>
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  💾 Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
