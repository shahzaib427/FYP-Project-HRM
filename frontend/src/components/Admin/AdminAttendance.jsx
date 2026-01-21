import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { FiSearch, FiDownload, FiFilter, FiX } from 'react-icons/fi';
import { CSVLink } from 'react-csv'; // You'll need to install: npm install react-csv

const AdminAttendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    employeeId: '',
    dateFrom: '',
    dateTo: ''
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const csvLinkRef = useRef(null);

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, [filters]);

 const fetchAttendance = async () => {
  try {
    setLoading(true);
    setError(null);
    
    // Build query params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    console.log('🔍 API Request URL:', `/attendance?${params}`);
    console.log('🔍 Filters being sent:', filters);
    
    const response = await axiosInstance.get(`/attendance?${params}`);
    
    console.log('✅ Full API Response:', response);
    console.log('✅ Response data:', response.data);
    console.log('✅ Response data.data:', response.data.data);
    
    const data = response.data.data || [];
    console.log('✅ Data to render:', data);
    console.log('✅ First record if exists:', data[0]);
    
    setAttendances(data);
    
    // Prepare CSV data
    prepareCSVData(data);
  } catch (error) {
    console.error('❌ Admin attendance error:', error);
    console.error('❌ Error response:', error.response);
    setError(error.response?.data?.error || 'Failed to fetch attendance');
  } finally {
    setLoading(false);
  }
};

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('/employees');
      if (response.data.success) {
        setEmployees(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const prepareCSVData = (data) => {
    const csvData = data.map(record => ({
      'Employee ID': record.employee?.employeeId || 'N/A',
      'Employee Name': record.employee?.name || 'Unknown',
      'Email': record.employee?.email || 'N/A',
      'Department': record.employee?.department || 'N/A',
      'Date': new Date(record.date).toLocaleDateString('en-US'),
      'Check In': record.checkIn 
        ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Not Checked In',
      'Check Out': record.checkOut 
        ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Not Checked Out',
      'Total Hours': record.totalHours?.toFixed(2) || '0.00',
      'Status': record.status?.toUpperCase() || 'N/A',
      'Remarks': record.remarks || '',
      'Late Minutes': record.lateMinutes || '0',
      'Overtime Hours': record.overtimeHours || '0.00',
      'Work Location': record.workLocation || 'Office'
    }));
    
    // Add summary row
    const summary = {
      'Employee ID': 'SUMMARY',
      'Employee Name': '',
      'Email': '',
      'Department': '',
      'Date': '',
      'Check In': '',
      'Check Out': '',
      'Total Hours': data.reduce((sum, r) => sum + (parseFloat(r.totalHours) || 0), 0).toFixed(2),
      'Status': `Total Records: ${data.length}`,
      'Remarks': `Present: ${data.filter(r => r.status === 'present').length} | Absent: ${data.filter(r => r.status === 'absent').length}`,
      'Late Minutes': data.reduce((sum, r) => sum + (parseInt(r.lateMinutes) || 0), 0),
      'Overtime Hours': data.reduce((sum, r) => sum + (parseFloat(r.overtimeHours) || 0), 0).toFixed(2),
      'Work Location': ''
    };
    
    setCsvData([summary, ...csvData]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      employeeId: '',
      dateFrom: '',
      dateTo: ''
    });
    setShowFilters(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
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

  const exportCSV = () => {
    if (csvLinkRef.current) {
      csvLinkRef.current.link.click();
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (!confirm(`Set status to "${status}" for all filtered records?`)) return;
    
    try {
      const attendanceIds = attendances.map(a => a._id);
      await axiosInstance.post('/attendance/bulk-update', {
        attendanceIds,
        status
      });
      fetchAttendance();
      alert(`Successfully updated ${attendanceIds.length} records to ${status}`);
    } catch (error) {
      console.error('Bulk update error:', error);
      alert('Failed to update records');
    }
  };

  if (loading && attendances.length === 0) {
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

      {/* Search Bar and Controls */}
      <div className="bg-white shadow-xl rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by employee name, email, or ID..."
              value={filters.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
            
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <FiDownload />
              <span>Export CSV</span>
            </button>
            
            <CSVLink
              ref={csvLinkRef}
              data={csvData}
              filename={`attendance-report-${new Date().toISOString().split('T')[0]}.csv`}
              className="hidden"
            />
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t pt-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <FiX size={14} />
                Clear All Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select
                  name="employeeId"
                  value={filters.employeeId}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId} - {emp.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="half-day">Half Day</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats and Bulk Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-medium text-gray-500">Total Records</h4>
          <p className="text-3xl font-bold text-blue-600">{attendances.length}</p>
          <p className="text-xs text-gray-500 mt-1">Showing filtered results</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-medium text-gray-500">Present Today</h4>
          <p className="text-3xl font-bold text-green-600">
            {attendances.filter(a => a.status === 'present').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-medium text-gray-500">Total Hours</h4>
          <p className="text-3xl font-bold text-purple-600">
            {attendances.reduce((sum, a) => sum + (parseFloat(a.totalHours) || 0), 0).toFixed(1)}h
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-medium text-gray-500">Late Arrivals</h4>
          <p className="text-3xl font-bold text-orange-600">
            {attendances.filter(a => a.status === 'late').length}
          </p>
        </div>
      </div>

      {/* Bulk Actions */}
      {attendances.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-yellow-800">Bulk Actions</h4>
              <p className="text-sm text-yellow-700">Apply changes to all filtered records</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleBulkStatusUpdate('present')}
                className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Mark All as Present
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('absent')}
                className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                Mark All as Absent
              </button>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-1"
              >
                <FiDownload size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Attendance Records</h2>
            <p className="text-blue-100 mt-1">
              {attendances.length} records found
              {filters.search && ` for "${filters.search}"`}
            </p>
          </div>
          <div className="text-sm bg-blue-500/30 px-3 py-1 rounded-full">
            Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Employee Details</th>
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
                        {Object.values(filters).some(val => val) 
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
                      <div className="text-xs text-gray-400">
                        {record.employee?.employeeId || 'N/A'} • {record.employee?.department || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.checkIn 
                          ? new Date(record.checkIn).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })
                          : '-'
                        }
                      </div>
                      {record.lateMinutes > 0 && (
                        <div className="text-xs text-red-500">
                          Late: {record.lateMinutes} min
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.checkOut 
                          ? new Date(record.checkOut).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })
                          : '-'
                        }
                      </div>
                      {record.overtimeHours > 0 && (
                        <div className="text-xs text-green-500">
                          OT: {record.overtimeHours}h
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-lg text-blue-600">
                        {record.totalHours?.toFixed(1) || 0}h
                      </div>
                      <div className="text-xs text-gray-500">
                        Regular: {record.regularHours?.toFixed(1) || 0}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        record.status === 'present' ? 'bg-green-100 text-green-800 border border-green-200' :
                        record.status === 'half-day' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        record.status === 'late' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                        record.status === 'absent' ? 'bg-red-100 text-red-800 border border-red-200' :
                        record.status === 'leave' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {record.status?.toUpperCase() || 'N/A'}
                      </span>
                      {record.remarks && (
                        <div className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={record.remarks}>
                          {record.remarks}
                        </div>
                      )}
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
        
        {/* Table Footer */}
        {attendances.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{attendances.length}</span> records
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <FiDownload />
              Download CSV Report
            </button>
          </div>
        )}
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
                <label className="block text-sm font-bold mb-2 text-gray-700">Check In Time</label>
                <input
                  type="time"
                  name="checkIn"
                  value={editing.checkIn ? new Date(editing.checkIn).toISOString().substr(11, 5) : ''}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Check Out Time</label>
                <input
                  type="time"
                  name="checkOut"
                  value={editing.checkOut ? new Date(editing.checkOut).toISOString().substr(11, 5) : ''}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <option value="leave">🏖️ On Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">Remarks</label>
                <textarea
                  name="remarks"
                  value={editing.remarks || ''}
                  onChange={handleEditChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add any remarks..."
                />
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
                  💾 Update Record
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