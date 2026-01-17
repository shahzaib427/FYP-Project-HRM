import React, { useState, useEffect, useRef } from 'react';

const EmployeeLeave = () => {
  const [leaveBalances, setLeaveBalances] = useState({
    annual: 12,
    casual: 7,
    sick: 10,
    earned: 5,
    maternity: 180,
    paternity: 15
  });
  
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: 'annual', startDate: '2024-02-10', endDate: '2024-02-14', days: 5, status: 'pending', reason: 'Family vacation', appliedOn: '2024-01-25', manager: 'Alex Johnson' },
    { id: 2, type: 'casual', startDate: '2024-01-30', endDate: '2024-01-30', days: 1, status: 'approved', reason: 'Doctor appointment', appliedOn: '2024-01-20', manager: 'Sarah Chen' },
    { id: 3, type: 'sick', startDate: '2024-01-15', endDate: '2024-01-16', days: 2, status: 'rejected', reason: 'Medical emergency', appliedOn: '2024-01-14', manager: 'Alex Johnson' },
    { id: 4, type: 'earned', startDate: '2024-02-05', endDate: '2024-02-05', days: 1, status: 'pending', reason: 'Personal work', appliedOn: '2024-01-28', manager: 'Mike Rodriguez' },
  ]);
  
  const [upcomingLeaves, setUpcomingLeaves] = useState([
    { id: 1, type: 'annual', startDate: '2024-02-10', endDate: '2024-02-14', days: 5, reason: 'Family vacation', approvedBy: 'Alex Johnson' },
    { id: 2, type: 'casual', startDate: '2024-02-20', endDate: '2024-02-20', days: 1, reason: 'Wedding ceremony', approvedBy: 'Sarah Chen' },
    { id: 3, type: 'annual', startDate: '2024-03-15', endDate: '2024-03-20', days: 6, reason: 'Holiday trip', approvedBy: 'Alex Johnson' },
  ]);

  const [teamLeaves] = useState([
    { id: 1, name: 'Alex Johnson', role: 'Team Lead', leaveType: 'annual', startDate: '2024-02-01', endDate: '2024-02-05', days: 5, avatar: 'AJ', status: 'on leave' },
    { id: 2, name: 'Sarah Chen', role: 'Senior Developer', leaveType: 'work from home', startDate: '2024-01-30', endDate: '2024-01-30', days: 1, avatar: 'SC', status: 'remote' },
    { id: 3, name: 'Mike Rodriguez', role: 'UI/UX Designer', leaveType: 'sick', startDate: '2024-01-25', endDate: '2024-01-26', days: 2, avatar: 'MR', status: 'on leave' },
    { id: 4, name: 'Emily Davis', role: 'Data Analyst', leaveType: 'annual', startDate: '2024-02-12', endDate: '2024-02-16', days: 5, avatar: 'ED', status: 'upcoming' },
  ]);

  const [selectedType, setSelectedType] = useState('all');
  const [showNewLeaveForm, setShowNewLeaveForm] = useState(false);
  
  // Form state - SIMPLIFIED
  const [formData, setFormData] = useState({
    type: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
    contactNumber: ''
  });

  const leaveTypes = [
    { id: 'annual', name: 'Annual Leave', icon: '🏖️', color: 'bg-gradient-to-br from-blue-500 to-cyan-500', bgColor: 'bg-gradient-to-br from-blue-500 to-cyan-500', days: 12 },
    { id: 'casual', name: 'Casual Leave', icon: '😊', color: 'bg-gradient-to-br from-green-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-green-500 to-emerald-500', days: 7 },
    { id: 'sick', name: 'Sick Leave', icon: '🏥', color: 'bg-gradient-to-br from-red-500 to-pink-500', bgColor: 'bg-gradient-to-br from-red-500 to-pink-500', days: 10 },
    { id: 'earned', name: 'Earned Leave', icon: '⭐', color: 'bg-gradient-to-br from-amber-500 to-orange-500', bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500', days: 5 },
    { id: 'maternity', name: 'Maternity Leave', icon: '👶', color: 'bg-gradient-to-br from-purple-500 to-pink-500', bgColor: 'bg-gradient-to-br from-purple-500 to-pink-500', days: 180 },
    { id: 'paternity', name: 'Paternity Leave', icon: '👨', color: 'bg-gradient-to-br from-blue-500 to-indigo-500', bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-500', days: 15 }
  ];

  // SIMPLE FORM HANDLER - This will work for all inputs
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to: ${value}`); // Debug
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // SIMPLE leave type selection
  const handleTypeSelect = (typeId) => {
    console.log(`Selecting type: ${typeId}`); // Debug
    setFormData(prev => ({
      ...prev,
      type: typeId
    }));
  };

  const handleEditRequest = (requestId) => {
    const request = leaveRequests.find(r => r.id === requestId);
    if (request) {
      setFormData({
        type: request.type,
        startDate: request.startDate,
        endDate: request.endDate,
        reason: request.reason,
        contactNumber: ''
      });
      setShowNewLeaveForm(true);
    }
  };

  const handleCancelRequest = (requestId) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      setLeaveRequests(leaveRequests.filter(r => r.id !== requestId));
    }
  };

  const handleReapplyRequest = (request) => {
    setFormData({
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
      contactNumber: ''
    });
    setShowNewLeaveForm(true);
  };

  // SIMPLIFIED FORM COMPONENT
  const NewLeaveForm = () => {
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          handleClose();
        }
      };

      const handleEscapeKey = (event) => {
        if (event.key === 'Escape') {
          handleClose();
        }
      };

      if (showNewLeaveForm) {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscapeKey);
        document.body.style.overflow = 'unset';
      };
    }, [showNewLeaveForm]);

    const calculateDays = () => {
      if (!formData.startDate || !formData.endDate) return 0;
      
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    };

    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.startDate) {
        newErrors.startDate = 'Start date is required';
      }
      
      if (!formData.endDate) {
        newErrors.endDate = 'End date is required';
      } else if (formData.startDate && formData.endDate < formData.startDate) {
        newErrors.endDate = 'End date cannot be before start date';
      }
      
      if (!formData.reason.trim()) {
        newErrors.reason = 'Reason is required';
      }
      
      const selectedTypeInfo = leaveTypes.find(t => t.id === formData.type);
      const daysRequested = calculateDays();
      
      if (selectedTypeInfo && daysRequested > 0) {
        if (daysRequested > leaveBalances[formData.type]) {
          newErrors.days = `Insufficient balance. You have ${leaveBalances[formData.type]} days remaining, but requested ${daysRequested} days.`;
        }
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Submitting form:', formData); // Debug
      
      if (!validateForm()) {
        console.log('Validation errors:', errors);
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const daysRequested = calculateDays();
        const newRequest = {
          id: leaveRequests.length > 0 ? Math.max(...leaveRequests.map(r => r.id)) + 1 : 1,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days: daysRequested,
          status: 'pending',
          reason: formData.reason,
          appliedOn: new Date().toISOString().split('T')[0],
          manager: 'Alex Johnson'
        };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update state
        setLeaveRequests([newRequest, ...leaveRequests]);
        
        // Update leave balance
        setLeaveBalances(prev => ({
          ...prev,
          [formData.type]: prev[formData.type] - daysRequested
        }));
        
        // Add to upcoming leaves for demo
        const newUpcomingLeave = {
          id: upcomingLeaves.length > 0 ? Math.max(...upcomingLeaves.map(l => l.id)) + 1 : 1,
          type: formData.type,
          startDate: formData.startDate,
          endDate: formData.endDate,
          days: daysRequested,
          reason: formData.reason,
          approvedBy: 'Alex Johnson'
        };
        
        setUpcomingLeaves([newUpcomingLeave, ...upcomingLeaves]);
        
        alert('Leave application submitted successfully!');
        handleCloseModal();
      } catch (error) {
        alert('Failed to submit leave application. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      const hasChanges = formData.startDate || formData.endDate || formData.reason || formData.contactNumber;
      
      if (hasChanges) {
        const shouldClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
        if (shouldClose) {
          handleCloseModal();
        }
      } else {
        handleCloseModal();
      }
    };

    const handleCloseModal = () => {
      setShowNewLeaveForm(false);
      // Reset form after a short delay
      setTimeout(() => {
        setFormData({
          type: 'casual',
          startDate: '',
          endDate: '',
          reason: '',
          contactNumber: ''
        });
        setErrors({});
      }, 300);
    };

    const daysRequested = calculateDays();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Apply for Leave</h3>
              <button 
                onClick={handleClose}
                type="button"
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Leave Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Leave Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {leaveTypes.map((type) => (
                    <button
                      type="button"
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        formData.type === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${type.bgColor} text-white`}>
                          <span className="text-lg">{type.icon}</span>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{type.name}</p>
                          <p className="text-xs text-gray-600">
                            Balance: {leaveBalances[type.id]}/{type.days} days
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Date Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    value={formData.endDate}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>
              
              {/* Calculate days */}
              {daysRequested > 0 && (
                <div className={`p-4 rounded-lg border ${
                  daysRequested > leaveBalances[formData.type] 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Total days requested: <span className="font-semibold">{daysRequested}</span> days
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Available balance: {leaveBalances[formData.type]} days
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      daysRequested > leaveBalances[formData.type] 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {daysRequested > leaveBalances[formData.type] ? 'Insufficient Balance' : 'Sufficient Balance'}
                    </div>
                  </div>
                  {errors.days && (
                    <p className="mt-2 text-sm text-red-600">{errors.days}</p>
                  )}
                </div>
              )}
              
              {/* REASON FIELD - SIMPLIFIED */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave *
                </label>
                <textarea
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleFormChange}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                    errors.reason ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Please provide details about your leave..."
                  onKeyDown={(e) => console.log('Key pressed in reason:', e.key)} // Debug
                  onInput={(e) => console.log('Input in reason:', e.target.value)} // Debug
                />
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Current value: "{formData.reason}"
                </p>
              </div>
              
              {/* CONTACT NUMBER FIELD - SIMPLIFIED */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="+91 9876543210"
                  onKeyDown={(e) => console.log('Key pressed in contact:', e.key)} // Debug
                  onInput={(e) => console.log('Input in contact:', e.target.value)} // Debug
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional - Provide a contact number in case of emergency
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Current value: "{formData.contactNumber}"
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || daysRequested > leaveBalances[formData.type]}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const handleQuickAction = (action) => {
    if (action === 'Apply Leave') {
      setShowNewLeaveForm(true);
    } else {
      alert(`Opening ${action}...`);
    }
  };

  const filteredLeaveRequests = selectedType === 'all' 
    ? leaveRequests 
    : leaveRequests.filter(request => request.type === selectedType);

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-200/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-200/20 blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Leave Management</h1>
              <p className="mt-2 text-gray-600">
                Manage your leave balances and applications
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="all">All Leave Types</option>
                  {leaveTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => handleQuickAction('Apply Leave')}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Apply Leave
              </button>
            </div>
          </div>
        </div>

        {/* Leave Balances Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {leaveTypes.map((type, index) => {
            const balance = leaveBalances[type.id];
            const percentage = (balance / type.days) * 100;
            
            return (
              <div 
                key={type.id}
                className="rounded-2xl shadow-2xl border border-gray-100 p-6 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 group bg-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${type.bgColor} text-white shadow-lg`}>
                      <span className="text-2xl">{type.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{type.name}</h4>
                      <p className="text-sm text-gray-600">Balance: {balance}/{type.days} days</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining Balance</span>
                    <span className="font-medium text-gray-900">{balance} days</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full ${type.bgColor} rounded-full transition-all duration-1000`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {Math.round(percentage)}% of annual allocation remaining
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="rounded-2xl shadow-2xl border border-gray-100 p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <span className="font-medium text-sm text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                  View all →
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleQuickAction('Apply Leave')}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 transition-all duration-300 transform hover:scale-[1.02] group shadow-lg hover:shadow-xl hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md">
                      <span className="text-xl">📝</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">Apply for Leave</h4>
                      <p className="text-sm mt-1 text-gray-600 group-hover:text-gray-700">Submit a new leave request</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-blue-500 text-lg">→</span>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleQuickAction('View Leave Policy')}
                  className="w-full text-left p-4 rounded-xl border border-gray-200 transition-all duration-300 transform hover:scale-[1.02] group shadow-lg hover:shadow-xl hover:border-purple-300 hover:bg-purple-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-md">
                      <span className="text-xl">📋</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 transition-colors duration-300 group-hover:text-purple-600">View Leave Policy</h4>
                      <p className="text-sm mt-1 text-gray-600 group-hover:text-gray-700">Company leave rules and guidelines</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-purple-500 text-lg">→</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Leave Requests */}
            <div className="rounded-2xl shadow-2xl border border-gray-100 p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Leave Requests</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    Showing {filteredLeaveRequests.length} of {leaveRequests.length} requests
                  </span>
                  <span className="font-medium text-sm text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                    View History →
                  </span>
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {filteredLeaveRequests.length > 0 ? (
                  filteredLeaveRequests.map((request, index) => {
                    const typeInfo = leaveTypes.find(t => t.id === request.type);
                    
                    return (
                      <div 
                        key={request.id}
                        className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:scale-[1.02] bg-white group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${typeInfo?.bgColor} text-white`}>
                              <span className="text-lg">{typeInfo?.icon}</span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{typeInfo?.name}</h4>
                              <p className="text-sm text-gray-600">{request.startDate} to {request.endDate}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium text-gray-900">{request.days} {request.days > 1 ? 'days' : 'day'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Applied on</span>
                            <span className="text-gray-900">{request.appliedOn}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Approver</span>
                            <span className="font-medium text-gray-900">{request.manager}</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {request.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleEditRequest(request.id)}
                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm border border-blue-200"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleCancelRequest(request.id)}
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm border border-red-200"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm border border-green-200">
                              View Details
                            </button>
                          )}
                          {request.status === 'rejected' && (
                            <button 
                              onClick={() => handleReapplyRequest(request)}
                              className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm border border-gray-200"
                            >
                              Re-apply
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg mb-2">No leave requests found</p>
                    <p className="text-sm">Click "Apply Leave" to create a new request</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Leaves */}
            <div className="rounded-2xl shadow-2xl border border-gray-100 p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Leaves</h2>
                <span className="font-medium text-sm text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                  Calendar →
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {upcomingLeaves.map((leave, index) => {
                  const typeInfo = leaveTypes.find(t => t.id === leave.type);
                  
                  return (
                    <div 
                      key={leave.id}
                      className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-green-200 bg-green-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${typeInfo?.bgColor} text-white`}>
                        <span className="text-lg">{typeInfo?.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{typeInfo?.name}</p>
                        <p className="text-xs text-gray-600">
                          {leave.startDate} - {leave.endDate}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{leave.reason}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-900">{leave.days}d</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Leaves */}
            <div className="rounded-2xl shadow-2xl border border-gray-100 p-6 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Team Leaves</h2>
                <span className="font-medium text-sm text-blue-500 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                  View all →
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {teamLeaves.map((member, index) => {
                  const typeInfo = leaveTypes.find(t => t.id === member.leaveType) || 
                                  { name: 'Work From Home', icon: '🏠', bgColor: 'bg-gradient-to-br from-gray-500 to-gray-700' };
                  
                  return (
                    <div 
                      key={member.id}
                      className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-300 transform hover:scale-[1.02] group"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                          {member.avatar}
                        </div>
                        <div className={`w-2 h-2 rounded-full border-2 border-white absolute -top-0.5 -right-0.5 ${
                          member.status === 'on leave' ? 'bg-red-500' :
                          member.status === 'remote' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            member.status === 'on leave' ? 'bg-red-100 text-red-800' :
                            member.status === 'remote' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{member.role}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`p-1 rounded ${typeInfo.bgColor} text-white`}>
                            <span className="text-xs">{typeInfo.icon}</span>
                          </div>
                          <span className="text-xs text-gray-700">{typeInfo.name}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">{member.days}d</p>
                        <p className="text-xs text-gray-500">
                          {member.startDate} - {member.endDate}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Leave Form Modal */}
      {showNewLeaveForm && <NewLeaveForm />}
    </div>
  );
};

export default EmployeeLeave;