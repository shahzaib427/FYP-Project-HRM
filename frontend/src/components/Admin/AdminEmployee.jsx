import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminEmployee = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  // Fetch employees
// Fetch employees
const fetchEmployees = async () => {
  try {
    setLoading(true);
    setError('');
    
    console.log('📡 Fetching employees from /employees'); // Updated
    
    // ✅ CORRECT: No /api prefix since axiosInstance already has it
    const res = await axiosInstance.get('/employees');
    
    console.log('✅ API RESPONSE:', res.data);
    
    if (res.data.success && res.data.data) {
      const employeeData = Array.isArray(res.data.data) ? res.data.data : [];
      console.log('📊 Setting employees array with length:', employeeData.length);
      setEmployees(employeeData);
    } else {
      console.warn('⚠️ No valid employee data received');
      setEmployees([]);
    }
  } catch (err) {
    console.error('❌ FULL ERROR:', err);
    console.error('❌ Error response:', err.response?.data);
    setError(err.response?.data?.error || 'Failed to fetch employees');
  } finally {
    setLoading(false);
  }
};

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    if (!emp) return false;
    
    // Search filter
    const matchesSearch = 
      (emp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.employeeId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.position?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // Department filter
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'active' && emp.isActive !== false) ||
      (selectedStatus === 'inactive' && emp.isActive === false);
    
    // Role filter
    const matchesRole = selectedRole === 'all' || emp.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesRole;
  });

  // Get unique values for filters
  const departments = ['all', ...new Set(employees
    .map(emp => emp?.department)
    .filter(dept => dept && dept.trim() !== ''))];

  const roles = ['all', ...new Set(employees
    .map(emp => emp?.role)
    .filter(role => role))];

  // Stats calculation
  const stats = {
    total: employees.length,
    active: employees.filter(emp => emp?.isActive !== false).length,
    inactive: employees.filter(emp => emp?.isActive === false).length,
    admins: employees.filter(emp => emp?.role === 'admin').length,
    hr: employees.filter(emp => emp?.role === 'hr').length,
    regular: employees.filter(emp => emp?.role === 'employee').length
  };

  // Delete employee
  const handleDelete = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

 const confirmDelete = async () => {
  try {
    // ✅ Use axiosInstance instead of raw axios
    await axiosInstance.delete(`/employees/${employeeToDelete._id}`);
    
    setEmployees(employees.filter(emp => emp._id !== employeeToDelete._id));
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
    
    alert('✅ Employee deleted successfully');
  } catch (err) {
    console.error('Error deleting employee:', err);
    alert(err.response?.data?.message || 'Failed to delete employee');
  }
};
  // Toggle employee status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`/api/employees/${id}`, 
        { isActive: !currentStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchEmployees(); // Refresh list
      alert('✅ Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  useEffect(() => {
    if (!currentUser?.role || !['admin', 'hr'].includes(currentUser.role)) {
      navigate('/login');
      return;
    }
    fetchEmployees();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600 mt-1">Manage your organization's workforce</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => navigate('/admin/employees/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-2">➕</span>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-green-600">{stats.active}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-semibold text-red-600">{stats.inactive}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-semibold text-purple-600">{stats.admins}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">HR</p>
              <p className="text-2xl font-semibold text-orange-600">{stats.hr}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Employees</p>
              <p className="text-2xl font-semibold text-blue-600">{stats.regular}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'all' ? 'All Roles' : 
                     role === 'admin' ? 'Administrator' :
                     role === 'hr' ? 'HR Manager' : 'Employee'}
                  </option>
                ))}
              </select>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-end">
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-2 rounded ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  title="Card View"
                >
                  <span className="text-lg">📇</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  title="Table View"
                >
                  <span className="text-lg">📊</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-4">
        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredEmployees.length}</span> of{' '}
            <span className="font-semibold">{employees.length}</span> employees
          </p>
          <button
            onClick={fetchEmployees}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-red-600 mr-2">❌</span>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Cards View */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee) => (
              <div key={employee._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Card Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          {employee.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{employee.name || 'Unnamed'}</h3>
                        <p className="text-sm text-gray-500">{employee.employeeId || 'No ID'}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      employee.role === 'hr' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {employee.role === 'admin' ? 'Admin' : 
                       employee.role === 'hr' ? 'HR' : 'Employee'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📧</span>
                      <span className="truncate">{employee.email || 'No email'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🏢</span>
                      <span>{employee.department || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💼</span>
                      <span>{employee.position || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📱</span>
                      <span>{employee.phone || 'No phone'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    employee.isActive !== false
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.isActive !== false ? '✓ Active' : '✗ Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Edit"
                    >
                      <span className="text-lg">✏️</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(employee._id, employee.isActive)}
                      className={`p-1 ${employee.isActive !== false ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'}`}
                      title={employee.isActive !== false ? 'Deactivate' : 'Activate'}
                    >
                      {employee.isActive !== false ? (
                        <span className="text-lg">⭕</span>
                      ) : (
                        <span className="text-lg">✅</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(employee)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Delete"
                    >
                      <span className="text-lg">🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {employee.name?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-500">{employee.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.email}</div>
                        <div className="text-sm text-gray-500">{employee.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.department || '—'}</div>
                        <div className="text-sm text-gray-500">{employee.position || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          employee.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          employee.role === 'hr' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {employee.role === 'admin' ? 'Admin' : 
                           employee.role === 'hr' ? 'HR' : 'Employee'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          employee.isActive !== false
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/employees/edit/${employee._id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(employee._id, employee.isActive)}
                            className={`px-2 py-1 text-xs rounded ${
                              employee.isActive !== false
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {employee.isActive !== false ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(employee)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredEmployees.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <span className="text-6xl">👥</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No employees found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || selectedDepartment !== 'all' || selectedStatus !== 'all' || selectedRole !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first employee'}
            </p>
            {!searchTerm && selectedDepartment === 'all' && selectedStatus === 'all' && selectedRole === 'all' && (
              <button
                onClick={() => navigate('/admin/employees/new')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <span className="mr-2">➕</span>
                Add Employee
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && employeeToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <span className="text-red-600 font-bold text-lg">
                  {employeeToDelete.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{employeeToDelete.name}</p>
                <p className="text-sm text-gray-500">{employeeToDelete.employeeId} • {employeeToDelete.department}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployee;