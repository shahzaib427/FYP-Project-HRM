import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const AdminPayroll = () => {
  // All states
  const [payrolls, setPayrolls] = useState([]);
  const [stats, setStats] = useState({
    totalPayrolls: 0,
    pendingPayments: 0,
    paidPayments: 0,
    failedPayments: 0,
    totalAmount: 0,
    averageSalary: 0
  });
  const [employees, setEmployees] = useState([]);
  const [monthsYears, setMonthsYears] = useState({ 
    months: [], 
    years: [] 
  });
  const [filters, setFilters] = useState({ 
    year: new Date().getFullYear().toString(), 
    month: 'all', 
    status: 'all',
    page: 1, 
    limit: 10 
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [bulkMonth, setBulkMonth] = useState('');
  const [bulkYear, setBulkYear] = useState('');
  const [bulkDepartment, setBulkDepartment] = useState('all');
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [updateData, setUpdateData] = useState({
    basicSalary: '',
    netSalary: '',
    hra: '',
    da: '',
    conveyance: '',
    medicalAllowance: '',
    specialAllowance: '',
    tds: '',
    pf: '',
    professionalTax: '',
    notes: ''
  });
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    currentPage: 1
  });

  // Load data
  useEffect(() => {
    fetchPayrolls();
    fetchStats();
    fetchEmployees();
    fetchMonthsYears();
  }, [filters]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: filters.page.toString(),
        limit: filters.limit.toString()
      }).toString();
      
      const res = await axiosInstance.get(`/admin/payroll?${params}`);
      setPayrolls(res.data.data || []);
      setPagination({
        total: res.data.total || 0,
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1
      });
    } catch (error) {
      console.error('Payrolls fetch error:', error.response?.data || error.message);
      alert('Failed to load payrolls: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams({
        month: filters.month,
        year: filters.year
      }).toString();
      
      const res = await axiosInstance.get(`/admin/payroll/stats?${params}`);
      setStats(res.data.data || {});
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get('/admin/payroll/employees');
      setEmployees(res.data.data || []);
    } catch (error) {
      console.error('Employees error:', error);
    }
  };

const fetchMonthsYears = async () => {
  try {
    const res = await axiosInstance.get('/admin/payroll/months-years');
    console.log('📅 MonthsYears API Response:', res.data); // Debug log
    
    const data = res.data.data || [];
    console.log('📅 Raw data from API:', data); // Debug log
    
    let months = [];
    let years = [];
    
    // If API returns array with data, extract months and years
    if (Array.isArray(data) && data.length > 0) {
      // Extract unique months
      months = [...new Set(data.map(item => item.month))].sort((a, b) => {
        const monthOrder = {
          'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
          'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
        };
        return monthOrder[a] - monthOrder[b];
      });
      
      // Extract unique years and sort descending
      years = [...new Set(data.map(item => item.year))].sort((a, b) => b - a);
    } else {
      // If no payroll data exists yet, use current and future months/years
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth(); // 0-indexed
      
      // Generate months for the whole year
      months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      // Generate years: current year and next year
      years = [currentYear, currentYear + 1].map(year => year.toString());
    }
    
    console.log('📅 Extracted months:', months); // Debug log
    console.log('📅 Extracted years:', years); // Debug log
    
    setMonthsYears({ months, years });
  } catch (error) {
    console.error('❌ Months/Years error:', error);
    // Set default months and years
    const currentYear = new Date().getFullYear();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const years = [currentYear, currentYear + 1].map(year => year.toString());
    
    console.log('📅 Setting default months:', months); // Debug log
    console.log('📅 Setting default years:', years); // Debug log
    
    setMonthsYears({ months, years });
  }
};

  // Get current year for default
  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };

  const handleGeneratePayroll = async (e) => {
    e.preventDefault();
    
    console.log('🔍 Debug - Form values:', {
      selectedEmployee,
      selectedMonth,
      selectedYear,
      employeesCount: employees.length
    });
    
    // ✅ VALIDATE BEFORE API CALL
    if (!selectedEmployee) {
      alert('❌ Please select an Employee');
      return;
    }
    
    if (!selectedMonth) {
      alert('❌ Please select a Month');
      return;
    }
    
    if (!selectedYear) {
      alert('❌ Please select a Year');
      return;
    }
    
    // Validate year
    if (parseInt(selectedYear) < 2020 || parseInt(selectedYear) > 2030) {
      alert('❌ Please select a valid year (2020-2030)');
      return;
    }
    
    try {
      setGenerating(true);
      console.log('🚀 Sending to API:', { 
        employeeId: selectedEmployee, 
        month: selectedMonth, 
        year: parseInt(selectedYear) 
      });
      
      const response = await axiosInstance.post('/admin/payroll/generate', {
        employeeId: selectedEmployee,
        month: selectedMonth,
        year: parseInt(selectedYear)
      });
      
      console.log('✅ API Response:', response.data);
      
      setShowGenerateModal(false);
      setSelectedEmployee('');
      setSelectedMonth('');
      setSelectedYear('');
      fetchPayrolls(); // Refresh the list
      fetchStats(); // Refresh stats
      fetchMonthsYears(); // Refresh months/years
      alert('✅ Payroll generated successfully!');
    } catch (error) {
      console.error('❌ Generate error:', error.response?.data || error.message);
      alert('❌ ' + (error.response?.data?.error || 'Generation failed'));
    } finally {
      setGenerating(false);
    }
  };

  const handleBulkGenerate = async (e) => {
    e.preventDefault();
    
    if (!bulkMonth || !bulkYear) {
      alert('❌ Please select Month and Year');
      return;
    }
    
    try {
      setGenerating(true);
      
      // Get all employees for bulk generation
      const selectedEmployees = employees
        .filter(emp => bulkDepartment === 'all' || emp.department === bulkDepartment)
        .map(emp => emp._id);
      
      if (selectedEmployees.length === 0) {
        alert('❌ No employees found for the selected department');
        return;
      }
      
      const res = await axiosInstance.post('/admin/payroll/bulk-generate', {
        employeeIds: selectedEmployees,
        month: bulkMonth,
        year: parseInt(bulkYear)
      });
      
      setShowBulkModal(false);
      setBulkMonth('');
      setBulkYear('');
      setBulkDepartment('all');
      fetchPayrolls();
      fetchStats();
      fetchMonthsYears(); // Refresh months/years
      alert('✅ ' + res.data.message);
    } catch (error) {
      console.error('❌ Bulk generate error:', error);
      alert('❌ ' + (error.response?.data?.error || 'Bulk generation failed'));
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('🗑️ Are you sure you want to delete this payroll record?')) {
      return;
    }
    
    try {
      await axiosInstance.delete(`/admin/payroll/${id}`);
      fetchPayrolls();
      fetchStats();
      alert('✅ Payroll deleted successfully!');
    } catch (error) {
      alert('❌ Delete failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axiosInstance.patch(`/admin/payroll/${id}/status`, { 
        paymentStatus: status,
        paymentDate: status === 'Paid' ? new Date().toISOString().split('T')[0] : null
      });
      fetchPayrolls();
      fetchStats();
      alert('✅ Status updated successfully!');
    } catch (error) {
      alert('❌ Status update failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleOpenUpdateModal = (payroll) => {
    setSelectedPayroll(payroll);
    setUpdateData({
      basicSalary: payroll.basicSalary || '',
      netSalary: payroll.netSalary || '',
      hra: payroll.hra || '',
      da: payroll.da || '',
      conveyance: payroll.conveyance || '',
      medicalAllowance: payroll.medicalAllowance || '',
      specialAllowance: payroll.specialAllowance || '',
      tds: payroll.tds || '',
      pf: payroll.pf || '',
      professionalTax: payroll.professionalTax || '',
      notes: payroll.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdatePayroll = async (e) => {
    e.preventDefault();
    
    if (!selectedPayroll) return;
    
    try {
      setGenerating(true);
      
      const updatedData = { ...updateData };
      
      // Convert string values to numbers
      Object.keys(updatedData).forEach(key => {
        if (key !== 'notes' && updatedData[key] !== '') {
          updatedData[key] = parseFloat(updatedData[key]);
        }
      });
      
      const res = await axiosInstance.put(`/admin/payroll/${selectedPayroll._id}`, updatedData);
      
      setShowUpdateModal(false);
      setSelectedPayroll(null);
      setUpdateData({
        basicSalary: '',
        netSalary: '',
        hra: '',
        da: '',
        conveyance: '',
        medicalAllowance: '',
        specialAllowance: '',
        tds: '',
        pf: '',
        professionalTax: '',
        notes: ''
      });
      
      fetchPayrolls();
      fetchStats();
      alert('✅ Payroll updated successfully!');
    } catch (error) {
      console.error('❌ Update error:', error);
      alert('❌ Update failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters({ ...filters, page: newPage });
    }
  };

  if (loading && payrolls.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-2xl font-bold text-gray-700">Loading Payroll Dashboard...</p>
          <p className="text-gray-500 mt-2">Your enterprise payroll system is ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center md:text-left mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            💰 Payroll Dashboard
          </h1>
          <p className="text-xl text-gray-600 font-semibold max-w-2xl mx-auto md:mx-0">
            Complete payroll management with attendance integration & payslip generation
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-12">
          <button
            onClick={() => setShowBulkModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg"
          >
            🚀 Bulk Generate Payroll
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center gap-2 text-lg"
          >
            ➕ Individual Payroll
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group">
          <div className="text-4xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {stats.totalPayrolls || 0}
          </div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Payrolls</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group">
          <div className="text-4xl font-black text-emerald-600 mb-2">{stats.paidPayments || 0}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">✅ Paid</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group">
          <div className="text-4xl font-black text-amber-600 mb-2">{stats.pendingPayments || 0}</div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">⏳ Pending</div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300 group">
          <div className="text-4xl font-black text-blue-600 mb-2">
            PKR {(stats.totalAmount || 0).toLocaleString()}
          </div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">💰 Total Amount</div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="max-w-7xl mx-auto space-y-8 px-4">
        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            🔍 Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value, page: 1 })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Years</option>
                {monthsYears.years?.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value, page: 1 })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Months</option>
                {monthsYears.months?.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={() => setFilters({ year: '', month: 'all', status: 'all', page: 1, limit: 10 })}
                className="px-4 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-3xl border border-white/50 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-3xl font-black">📋 Payroll Records</h2>
              <div className="flex items-center gap-4">
                <span className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-2xl text-lg font-bold">
                  {payrolls.length} of {pagination.total} records
                </span>
                <span className="px-4 py-2 bg-white/10 rounded-xl">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">👤 Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">📅 Period</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">💵 Basic</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">💰 Net</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">📊 Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payrolls.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-xl text-gray-500">
                      📭 No payroll records found.{' '}
                      <span 
                        className="font-bold text-blue-600 cursor-pointer hover:underline" 
                        onClick={() => setShowGenerateModal(true)}
                      >
                        👆 Click to generate your first payroll
                      </span>
                    </td>
                  </tr>
                ) : (
                  payrolls.map((payroll) => (
                    <tr key={payroll._id} className="hover:bg-blue-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg text-gray-900">{payroll.employeeName || 'Unknown'}</div>
                        <div className="text-sm text-gray-500 flex flex-wrap gap-2 mt-1">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs">
                            ID: {payroll.employeeIdCode || 'N/A'}
                          </span>
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs">
                            📧 {payroll.employeeEmail || 'N/A'}
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-xs">
                            {payroll.employeeDepartment || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg">{payroll.month || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{payroll.year || 'N/A'}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(payroll.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-xl font-bold text-blue-600">
                          PKR {(payroll.basicSalary || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-2xl font-black text-emerald-600">
                          PKR {(payroll.netSalary || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                          payroll.paymentStatus === 'Paid' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : payroll.paymentStatus === 'Pending'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {payroll.paymentStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`/admin/payroll/payslip/${payroll._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
                          >
                            📄 Payslip
                          </a>
                          <button
                            onClick={() => handleOpenUpdateModal(payroll)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <select
                            onChange={(e) => handleStatusUpdate(payroll._id, e.target.value)}
                            value={payroll.paymentStatus || 'Pending'}
                            className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-semibold bg-white text-sm"
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Paid">✅ Paid</option>
                            <option value="Failed">❌ Failed</option>
                          </select>
                          <button
                            onClick={() => handleDelete(payroll._id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-bold">{((pagination.currentPage - 1) * filters.limit) + 1}</span> to{' '}
                <span className="font-bold">
                  {Math.min(pagination.currentPage * filters.limit, pagination.total)}
                </span>{' '}
                of <span className="font-bold">{pagination.total}</span> records
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  ← Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Individual Payroll Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-white/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ➕ Generate Individual Payroll
              </h3>
              <button
                onClick={() => {
                  setShowGenerateModal(false);
                  setSelectedEmployee('');
                  setSelectedMonth('');
                  setSelectedYear('');
                }}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleGeneratePayroll} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">👤 Employee</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg shadow-lg"
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.employeeId}) - {emp.department} - PKR {emp.salary?.toLocaleString() || 'N/A'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">📅 Month</label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg shadow-lg"
                      required
                    >
                      <option value="">Select Month</option>
                      {monthsYears.months?.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-lg font-bold text-gray-700 mb-3">📅 Year</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 text-lg shadow-lg"
                      required
                    >
                      <option value="">Select Year</option>
                      {monthsYears.years?.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                      {/* Add current year if not in list */}
                      {!monthsYears.years?.includes(getCurrentYear()) && (
                        <option value={getCurrentYear()}>{getCurrentYear()}</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowGenerateModal(false);
                    setSelectedEmployee('');
                    setSelectedMonth('');
                    setSelectedYear('');
                  }}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-lg font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-lg font-black text-white rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    '💰 Generate Payroll'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Payroll Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-white/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                🚀 Bulk Generate Payroll
              </h3>
              <button
                onClick={() => {
                  setShowBulkModal(false);
                  setBulkMonth('');
                  setBulkYear('');
                  setBulkDepartment('all');
                }}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleBulkGenerate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">📅 Month</label>
                  <select
                    value={bulkMonth}
                    onChange={(e) => setBulkMonth(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 text-lg shadow-lg"
                    required
                  >
                    <option value="">Select Month</option>
                    {monthsYears.months?.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">📅 Year</label>
                  <select
                    value={bulkYear}
                    onChange={(e) => setBulkYear(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 text-lg shadow-lg"
                    required
                  >
                    <option value="">Select Year</option>
                    {monthsYears.years?.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                    {/* Add current year if not in list */}
                    {!monthsYears.years?.includes(getCurrentYear()) && (
                      <option value={getCurrentYear()}>{getCurrentYear()}</option>
                    )}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-lg font-bold text-gray-700 mb-3">🏢 Department</label>
                  <select
                    value={bulkDepartment}
                    onChange={(e) => setBulkDepartment(e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 text-lg shadow-lg"
                  >
                    <option value="all">🌐 All Departments</option>
                    <option value="IT">💻 IT</option>
                    <option value="HR">👥 HR</option>
                    <option value="Finance">💰 Finance</option>
                    <option value="Marketing">📈 Marketing</option>
                    <option value="Sales">📊 Sales</option>
                    <option value="Operations">⚙️ Operations</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-2">
                    {employees.filter(emp => bulkDepartment === 'all' || emp.department === bulkDepartment).length} employees will be processed
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkMonth('');
                    setBulkYear('');
                    setBulkDepartment('all');
                  }}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-lg font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-lg font-black text-white rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    '🚀 Generate All Payrolls'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Payroll Modal */}
      {showUpdateModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-white/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-gray-900 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✏️ Update Payroll
              </h3>
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedPayroll(null);
                  setUpdateData({
                    basicSalary: '',
                    netSalary: '',
                    hra: '',
                    da: '',
                    conveyance: '',
                    medicalAllowance: '',
                    specialAllowance: '',
                    tds: '',
                    pf: '',
                    professionalTax: '',
                    notes: ''
                  });
                }}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="font-bold text-lg text-blue-800 mb-2">
                {selectedPayroll.employeeName} • {selectedPayroll.month} {selectedPayroll.year}
              </div>
              <div className="text-sm text-blue-600">
                Current Net Salary: PKR {selectedPayroll.netSalary?.toLocaleString() || '0'}
              </div>
            </div>
            
            <form onSubmit={handleUpdatePayroll} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="md:col-span-2">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">💰 Earnings</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Basic Salary</label>
                  <input
                    type="number"
                    value={updateData.basicSalary}
                    onChange={(e) => setUpdateData({...updateData, basicSalary: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter basic salary"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">HRA</label>
                  <input
                    type="number"
                    value={updateData.hra}
                    onChange={(e) => setUpdateData({...updateData, hra: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter HRA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">DA</label>
                  <input
                    type="number"
                    value={updateData.da}
                    onChange={(e) => setUpdateData({...updateData, da: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter DA"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Conveyance</label>
                  <input
                    type="number"
                    value={updateData.conveyance}
                    onChange={(e) => setUpdateData({...updateData, conveyance: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter conveyance"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Medical Allowance</label>
                  <input
                    type="number"
                    value={updateData.medicalAllowance}
                    onChange={(e) => setUpdateData({...updateData, medicalAllowance: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter medical allowance"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Special Allowance</label>
                  <input
                    type="number"
                    value={updateData.specialAllowance}
                    onChange={(e) => setUpdateData({...updateData, specialAllowance: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter special allowance"
                  />
                </div>
                
                {/* Deductions */}
                <div className="md:col-span-2 mt-8">
                  <h4 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">📉 Deductions</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">TDS</label>
                  <input
                    type="number"
                    value={updateData.tds}
                    onChange={(e) => setUpdateData({...updateData, tds: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter TDS"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">PF</label>
                  <input
                    type="number"
                    value={updateData.pf}
                    onChange={(e) => setUpdateData({...updateData, pf: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter PF"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Professional Tax</label>
                  <input
                    type="number"
                    value={updateData.professionalTax}
                    onChange={(e) => setUpdateData({...updateData, professionalTax: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter professional tax"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Net Salary</label>
                  <input
                    type="number"
                    value={updateData.netSalary}
                    onChange={(e) => setUpdateData({...updateData, netSalary: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter net salary"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={updateData.notes}
                    onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any notes or adjustments..."
                    rows="3"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedPayroll(null);
                    setUpdateData({
                      basicSalary: '',
                      netSalary: '',
                      hra: '',
                      da: '',
                      conveyance: '',
                      medicalAllowance: '',
                      specialAllowance: '',
                      tds: '',
                      pf: '',
                      professionalTax: '',
                      notes: ''
                    });
                  }}
                  className="flex-1 px-8 py-4 border-2 border-gray-300 text-lg font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-lg font-black text-white rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    '💾 Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayroll;