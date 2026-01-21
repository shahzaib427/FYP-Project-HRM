import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeProfile = () => {
  const { currentUser } = useAuth();
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate', category: 'Technical' });

  // Fetch employee data from API
  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Fetch the logged-in user's profile data
        const response = await axios.get('http://localhost:5000/api/employees/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.success) {
          const data = response.data.data;
          
          // Format the data to match your component structure
          setEmployeeData({
            personalInfo: {
              fullName: data.name || '',
              employeeId: data.employeeId || `EMP${data._id?.substring(-4) || '0000'}`,
              email: data.email || '',
              phone: data.phone || '',
              dob: data.dob || '1990-01-01',
              gender: data.gender || 'Not specified',
              bloodGroup: data.bloodGroup || 'Not specified',
              maritalStatus: data.maritalStatus || 'Not specified'
            },
            employmentInfo: {
              designation: data.position || '',
              department: data.department || '',
              dateOfJoining: data.dateOfJoining || data.createdAt?.split('T')[0] || '',
              workLocation: data.workLocation || '',
              reportingManager: data.reportingManager || 'Not assigned',
              employmentType: data.employmentType || 'Full-time',
              employeeStatus: data.isActive ? 'Active' : 'Inactive'
            },
            contactInfo: {
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              country: data.country || '',
              pincode: data.pincode || '',
              emergencyContact: data.emergencyContact || '',
              emergencyName: data.emergencyContactName || ''
            },
            bankDetails: {
              accountNumber: data.accountNumber || '********1234',
              bankName: data.bankName || '',
              branch: data.branch || '',
              ifscCode: data.ifscCode || '',
              accountType: data.accountType || 'Savings'
            }
          });

          // Fetch additional data if endpoints exist
          await fetchAdditionalData(data._id, token);
        }
      } catch (err) {
        console.error('Error fetching employee data:', err);
        setError('Failed to load employee profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  // Fetch additional data (skills, documents, etc.)
  const fetchAdditionalData = async (employeeId, token) => {
    try {
      // Fetch skills
      const skillsRes = await axios.get(`http://localhost:5000/api/employees/${employeeId}/skills`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (skillsRes.data.success) {
        setSkills(skillsRes.data.data.map(skill => ({
          ...skill,
          color: getSkillColor(skill.level)
        })));
      }

      // Fetch documents
      const docsRes = await axios.get(`http://localhost:5000/api/employees/${employeeId}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (docsRes.data.success) {
        setDocuments(docsRes.data.data.map(doc => ({
          ...doc,
          icon: getDocumentIcon(doc.type),
          color: getDocumentColor(doc.status)
        })));
      }

      // Fetch work history
      const workRes = await axios.get(`http://localhost:5000/api/employees/${employeeId}/work-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (workRes.data.success) {
        setWorkHistory(workRes.data.data);
      }

      // Fetch education
      const eduRes = await axios.get(`http://localhost:5000/api/employees/${employeeId}/education`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (eduRes.data.success) {
        setEducation(eduRes.data.data);
      }

      // Fetch achievements
      const achievementsRes = await axios.get(`http://localhost:5000/api/employees/${employeeId}/achievements`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (achievementsRes.data.success) {
        setAchievements(achievementsRes.data.data);
      }

    } catch (error) {
      console.error('Error fetching additional data:', error);
      // Continue with default data if endpoints don't exist yet
    }
  };

  // Helper functions for styling
  const getSkillColor = (level) => {
    switch(level) {
      case 'Expert': return 'bg-gradient-to-r from-emerald-500 to-green-500';
      case 'Advanced': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'Intermediate': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  const getDocumentIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'pdf': return '📄';
      case 'id': return '🆔';
      case 'card': return '💳';
      case 'certificate': return '🎓';
      default: return '📝';
    }
  };

  const getDocumentColor = (status) => {
    return status === 'verified' 
      ? 'bg-gradient-to-r from-green-100 to-green-50'
      : 'bg-gradient-to-r from-yellow-100 to-yellow-50';
  };

  // Initialize state with default values
  const [skills, setSkills] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [education, setEducation] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    if (!employeeData) return;
    
    setEmployeeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle skill addition
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return;
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/employees/skills', {
        name: newSkill.name,
        level: newSkill.level,
        category: newSkill.category
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        const skill = {
          ...response.data.data,
          color: getSkillColor(newSkill.level)
        };
        setSkills([...skills, skill]);
        setNewSkill({ name: '', level: 'Intermediate', category: 'Technical' });
      }
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill. Please try again.');
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', file.type.split('/')[1].toUpperCase());
      formData.append('name', file.name);

      const response = await axios.post('http://localhost:5000/api/employees/documents', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        const newDocument = {
          ...response.data.data,
          icon: getDocumentIcon(response.data.data.type),
          color: getDocumentColor('pending')
        };
        setDocuments([newDocument, ...documents]);
        setUploadProgress(0);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
      setUploadProgress(0);
    }
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Prepare update data
      const updateData = {
        name: employeeData.personalInfo.fullName,
        email: employeeData.personalInfo.email,
        phone: employeeData.personalInfo.phone,
        dob: employeeData.personalInfo.dob,
        gender: employeeData.personalInfo.gender,
        bloodGroup: employeeData.personalInfo.bloodGroup,
        maritalStatus: employeeData.personalInfo.maritalStatus,
        address: employeeData.contactInfo.address,
        city: employeeData.contactInfo.city,
        state: employeeData.contactInfo.state,
        country: employeeData.contactInfo.country,
        pincode: employeeData.contactInfo.pincode,
        emergencyContact: employeeData.contactInfo.emergencyContact,
        emergencyContactName: employeeData.contactInfo.emergencyName,
        accountNumber: employeeData.bankDetails.accountNumber,
        bankName: employeeData.bankDetails.bankName,
        branch: employeeData.bankDetails.branch,
        ifscCode: employeeData.bankDetails.ifscCode,
        accountType: employeeData.bankDetails.accountType
      };

      const response = await axios.put('http://localhost:5000/api/employees/profile', updateData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data.success) {
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // Clone functions (keep as is for now - you can update these to use API later)
  const cloneAchievement = (id) => {
    const achievementToClone = achievements.find(a => a.id === id);
    if (achievementToClone) {
      const clonedAchievement = {
        ...achievementToClone,
        id: achievements.length + 1,
        title: `${achievementToClone.title} (Copy)`
      };
      setAchievements([...achievements, clonedAchievement]);
    }
  };

  const cloneWorkHistory = (id) => {
    const workToClone = workHistory.find(w => w.id === id);
    if (workToClone) {
      const clonedWork = {
        ...workToClone,
        id: workHistory.length + 1,
        company: `${workToClone.company} (Copy)`
      };
      setWorkHistory([...workHistory, clonedWork]);
    }
  };

  const cloneEducation = (id) => {
    const eduToClone = education.find(e => e.id === id);
    if (eduToClone) {
      const clonedEdu = {
        ...eduToClone,
        id: education.length + 1,
        institution: `${eduToClone.institution} (Copy)`
      };
      setEducation([...education, clonedEdu]);
    }
  };

  const cloneSkill = (id) => {
    const skillToClone = skills.find(s => s.id === id);
    if (skillToClone) {
      const clonedSkill = {
        ...skillToClone,
        id: skills.length + 1,
        name: `${skillToClone.name} (Copy)`
      };
      setSkills([...skills, clonedSkill]);
    }
  };

  const cloneDocument = (id) => {
    const docToClone = documents.find(d => d.id === id);
    if (docToClone) {
      const clonedDoc = {
        ...docToClone,
        id: documents.length + 1,
        name: `${docToClone.name} (Copy)`
      };
      setDocuments([...documents, clonedDoc]);
    }
  };

  // Tab content component (keep existing but use employeeData)
  const TabContent = () => {
    if (!employeeData) return null;

    switch(activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <InfoField
                label="Full Name"
                value={employeeData.personalInfo.fullName}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('personalInfo', 'fullName', value)}
              />
              <InfoField
                label="Employee ID"
                value={employeeData.personalInfo.employeeId}
              />
              <InfoField
                label="Email"
                value={employeeData.personalInfo.email}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('personalInfo', 'email', value)}
                type="email"
              />
              <InfoField
                label="Phone"
                value={employeeData.personalInfo.phone}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('personalInfo', 'phone', value)}
                type="tel"
              />
            </div>
            <div className="space-y-3">
              <InfoField
                label="Date of Birth"
                value={employeeData.personalInfo.dob}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('personalInfo', 'dob', value)}
                type="date"
              />
              <InfoField
                label="Gender"
                value={employeeData.personalInfo.gender}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('personalInfo', 'gender', value)}
              />
              <InfoField
                label="Blood Group"
                value={employeeData.personalInfo.bloodGroup}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('personalInfo', 'bloodGroup', value)}
              />
              <InfoField
                label="Marital Status"
                value={employeeData.personalInfo.maritalStatus}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('personalInfo', 'maritalStatus', value)}
              />
            </div>
          </div>
        );

      case 'employment':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <InfoField
                label="Designation"
                value={employeeData.employmentInfo.designation}
              />
              <InfoField
                label="Department"
                value={employeeData.employmentInfo.department}
              />
              <InfoField
                label="Date of Joining"
                value={employeeData.employmentInfo.dateOfJoining}
              />
              <InfoField
                label="Work Location"
                value={employeeData.employmentInfo.workLocation}
              />
            </div>
            <div className="space-y-3">
              <InfoField
                label="Reporting Manager"
                value={employeeData.employmentInfo.reportingManager}
              />
              <InfoField
                label="Employment Type"
                value={employeeData.employmentInfo.employmentType}
              />
              <InfoField
                label="Employee Status"
                value={employeeData.employmentInfo.employeeStatus}
              />
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <InfoField
                label="Address"
                value={employeeData.contactInfo.address}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('contactInfo', 'address', value)}
              />
              <InfoField
                label="City"
                value={employeeData.contactInfo.city}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('contactInfo', 'city', value)}
              />
              <InfoField
                label="State"
                value={employeeData.contactInfo.state}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('contactInfo', 'state', value)}
              />
              <InfoField
                label="Pincode"
                value={employeeData.contactInfo.pincode}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('contactInfo', 'pincode', value)}
              />
            </div>
            <div className="space-y-3">
              <InfoField
                label="Emergency Contact"
                value={employeeData.contactInfo.emergencyContact}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('contactInfo', 'emergencyContact', value)}
              />
              <InfoField
                label="Emergency Contact Name"
                value={employeeData.contactInfo.emergencyName}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('contactInfo', 'emergencyName', value)}
              />
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <InfoField
                label="Account Number"
                value={employeeData.bankDetails.accountNumber}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('bankDetails', 'accountNumber', value)}
                type="password"
              />
              <InfoField
                label="Bank Name"
                value={employeeData.bankDetails.bankName}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('bankDetails', 'bankName', value)}
              />
              <InfoField
                label="Branch"
                value={employeeData.bankDetails.branch}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('bankDetails', 'branch', value)}
              />
            </div>
            <div className="space-y-3">
              <InfoField
                label="IFSC Code"
                value={employeeData.bankDetails.ifscCode}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('bankDetails', 'ifscCode', value)}
              />
              <InfoField
                label="Account Type"
                value={employeeData.bankDetails.accountType}
                isEditing={isEditing}
                onChange={(value) => handleInputChange('bankDetails', 'accountType', value)}
              />
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-4">
            {isEditing && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2 text-sm">Add New Skill</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                    placeholder="Skill name"
                    className="px-3 py-1.5 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
                    className="px-3 py-1.5 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all duration-200 text-sm"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 hover:border-blue-300 transition-all duration-200 group">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${skill.color} group-hover:scale-105 transition-transform duration-200`}>
                      {skill.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 text-sm">{skill.name}</p>
                      <p className="text-xs text-gray-600">{skill.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${skill.color}`}>
                      {skill.level}
                    </span>
                    <button
                      onClick={() => cloneSkill(skill.id)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      title="Clone"
                    >
                      ⎘
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-bold text-gray-900">Documents</h3>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg transition-all duration-200 font-medium text-sm">
                  + Upload
                </button>
              </div>
            </div>
            
            {uploadProgress > 0 && (
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-bold text-blue-900">Uploading...</span>
                  <span className="text-xs font-bold text-blue-900">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {documents.map(doc => (
                <div key={doc.id} className={`p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:scale-[1.01] ${doc.color}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">{doc.icon}</div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-600">{doc.type} • {doc.size}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Uploaded: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        doc.status === 'verified' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                      }`}>
                        {doc.status}
                      </span>
                      <button
                        onClick={() => cloneDocument(doc.id)}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        title="Clone"
                      >
                        ⎘
                      </button>
                    </div>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <button className="flex-1 px-2 py-1 text-xs border border-blue-300 text-blue-700 rounded hover:bg-blue-50 transition-colors">
                      View
                    </button>
                    <button className="flex-1 px-2 py-1 text-xs bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded transition-all duration-200">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Info Field Component
  const InfoField = ({ label, value, isEditing = false, onChange, type = 'text' }) => (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white text-sm"
        />
      ) : (
        <p className="px-3 py-2 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-300 text-gray-900 font-bold text-sm">{value}</p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen py-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="min-h-screen py-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-4xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Profile Data Found</h2>
          <p className="text-gray-600">Please contact HR to set up your employee profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Employee Profile</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your personal and professional information
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-bold text-sm ${
                  isEditing 
                    ? 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 border border-gray-300' 
                    : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow hover:shadow-md'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg transition-all duration-200 shadow hover:shadow-md font-bold text-sm"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header Card */}
            <div className="rounded-xl shadow-lg border-0 p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden relative">
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-3 border-white/40 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {employeeData.personalInfo.fullName?.charAt(0) || 'E'}
                      </span>
                    </div>
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full border-3 border-white absolute bottom-1 right-1"></div>
                  </div>
                  
                  {/* Name Section */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white">
                          {employeeData.personalInfo.fullName}
                        </h1>
                        <p className="text-lg text-white/90 font-medium mb-3">
                          {employeeData.employmentInfo.designation}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center space-x-1 text-white/80">
                            <span className="text-lg">🏢</span>
                            <span className="font-medium text-sm">{employeeData.employmentInfo.department}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-white/80">
                            <span className="text-lg">📍</span>
                            <span className="font-medium text-sm">{employeeData.employmentInfo.workLocation}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-white/80">
                            <span className="text-lg">📧</span>
                            <span className="font-medium text-sm">{employeeData.personalInfo.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-2">
                          {employeeData.employmentInfo.employeeStatus}
                        </div>
                        <p className="text-white/90 text-xs">Employee ID: <span className="font-bold">{employeeData.personalInfo.employeeId}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                {[
                  { id: 'personal', label: 'Personal', icon: '👤', color: 'from-blue-500 to-cyan-500' },
                  { id: 'employment', label: 'Employment', icon: '💼', color: 'from-purple-500 to-pink-500' },
                  { id: 'contact', label: 'Contact', icon: '📍', color: 'from-green-500 to-emerald-500' },
                  { id: 'bank', label: 'Bank', icon: '🏦', color: 'from-amber-500 to-orange-500' },
                  { id: 'skills', label: 'Skills', icon: '🎯', color: 'from-red-500 to-rose-500' },
                  { id: 'documents', label: 'Docs', icon: '📄', color: 'from-indigo-500 to-blue-500' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 font-bold transition-all duration-200 whitespace-nowrap border-b-2 text-sm ${
                      activeTab === tab.id
                        ? `text-white bg-gradient-to-r ${tab.color} border-transparent`
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/50 border-transparent'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4">
                <TabContent />
              </div>
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Work History */}
            <div className="rounded-lg shadow-lg border border-gray-200 p-4 bg-gradient-to-br from-white to-blue-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Work History</h3>
                <span className="text-xs font-bold text-blue-600">{workHistory.length} positions</span>
              </div>
              <div className="space-y-3">
                {workHistory.map(job => (
                  <div key={job.id} className={`p-3 rounded-lg ${job.color || 'bg-gradient-to-r from-blue-100 to-cyan-100'} border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:scale-[1.01]`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {job.company?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{job.position}</h4>
                          <p className="text-xs text-gray-700 font-medium">{job.company}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600 font-medium">
                            <span>📅 {job.duration}</span>
                            <span>📍 {job.location}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => cloneWorkHistory(job.id)}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        title="Clone"
                      >
                        ⎘
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="rounded-lg shadow-lg border border-gray-200 p-4 bg-gradient-to-br from-white to-green-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">Education</h3>
                <span className="text-xs font-bold text-emerald-600">{education.length} degrees</span>
              </div>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className={`p-3 rounded-lg ${edu.color || 'bg-gradient-to-r from-green-50 to-emerald-50'} border border-green-100 hover:border-green-300 transition-all duration-200 hover:scale-[1.01]`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{edu.degree}</h4>
                        <p className="text-xs text-gray-700 font-medium">{edu.institution}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white px-2 py-1 rounded-full">{edu.year}</span>
                        <button
                          onClick={() => cloneEducation(edu.id)}
                          className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                          title="Clone"
                        >
                          ⎘
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium">Grade: {edu.grade}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="rounded-lg shadow-lg border border-gray-200 p-4 bg-gradient-to-br from-white to-amber-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Achievements</h3>
                <span className="text-xs font-bold text-amber-600">{achievements.length} items</span>
              </div>
              <div className="space-y-3">
                {achievements.map(achievement => (
                  <div key={achievement.id} className={`p-3 rounded-lg ${achievement.color || 'bg-gradient-to-r from-amber-100 to-orange-100'} border border-amber-100 hover:border-amber-300 transition-all duration-200 hover:scale-[1.01]`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">{achievement.icon || '🏆'}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-bold text-gray-900 text-sm">{achievement.title}</h4>
                            <span className="text-xs font-bold text-amber-600 ml-2">{achievement.date}</span>
                          </div>
                          <p className="text-xs text-gray-700 mt-0.5 font-medium">{achievement.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => cloneAchievement(achievement.id)}
                        className="px-1.5 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                        title="Clone"
                      >
                        ⎘
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg shadow-lg border border-gray-200 p-4 bg-gradient-to-br from-white to-purple-50">
              <h3 className="text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">Profile Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-300">
                  <p className="text-xl font-bold text-blue-700">
                    {employeeData.employmentInfo.dateOfJoining 
                      ? Math.floor((new Date() - new Date(employeeData.employmentInfo.dateOfJoining)) / (365.25 * 24 * 60 * 60 * 1000)) 
                      : 0}
                  </p>
                  <p className="text-xs font-bold text-blue-800 mt-0.5">Years Service</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300">
                  <p className="text-xl font-bold text-emerald-700">{skills.length}</p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">Skills</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300">
                  <p className="text-xl font-bold text-purple-700">{documents.length}</p>
                  <p className="text-xs font-bold text-purple-800 mt-0.5">Documents</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300">
                  <p className="text-xl font-bold text-amber-700">{achievements.length}</p>
                  <p className="text-xs font-bold text-amber-800 mt-0.5">Achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;