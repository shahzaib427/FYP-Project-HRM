import React, { useState, useEffect } from 'react';

const EmployeeProfile = () => {
  const [employeeData, setEmployeeData] = useState({
    personalInfo: {
      fullName: 'John Doe',
      employeeId: 'EMP2024001',
      email: 'john.doe@company.com',
      phone: '+91 9876543210',
      dob: '1990-05-15',
      gender: 'Male',
      bloodGroup: 'O+',
      maritalStatus: 'Married'
    },
    employmentInfo: {
      designation: 'Senior Software Engineer',
      department: 'Engineering',
      dateOfJoining: '2020-06-01',
      workLocation: 'Bangalore Office',
      reportingManager: 'Alex Johnson',
      employmentType: 'Full-time',
      employeeStatus: 'Active'
    },
    contactInfo: {
      address: '123 Main Street, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      pincode: '560034',
      emergencyContact: '+91 8765432109',
      emergencyName: 'Jane Doe (Spouse)'
    },
    bankDetails: {
      accountNumber: '********1234',
      bankName: 'HDFC Bank',
      branch: 'Koramangala Branch',
      ifscCode: 'HDFC0001234',
      accountType: 'Savings'
    }
  });

  const [skills, setSkills] = useState([
    { id: 1, name: 'React', level: 'Expert', category: 'Frontend', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
    { id: 2, name: 'Node.js', level: 'Advanced', category: 'Backend', color: 'bg-gradient-to-r from-green-500 to-emerald-500' },
    { id: 3, name: 'MongoDB', level: 'Intermediate', category: 'Database', color: 'bg-gradient-to-r from-amber-500 to-orange-500' },
    { id: 4, name: 'AWS', level: 'Intermediate', category: 'Cloud', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 5, name: 'Git', level: 'Expert', category: 'Tools', color: 'bg-gradient-to-r from-red-500 to-rose-500' },
    { id: 6, name: 'Docker', level: 'Beginner', category: 'DevOps', color: 'bg-gradient-to-r from-indigo-500 to-blue-500' }
  ]);

  const [documents, setDocuments] = useState([
    { id: 1, name: 'Resume', type: 'PDF', uploadDate: '2024-01-15', size: '1.2 MB', status: 'verified', icon: '📄', color: 'bg-gradient-to-r from-blue-100 to-blue-50' },
    { id: 2, name: 'Aadhar Card', type: 'PDF', uploadDate: '2024-01-10', size: '0.8 MB', status: 'verified', icon: '🆔', color: 'bg-gradient-to-r from-green-100 to-green-50' },
    { id: 3, name: 'PAN Card', type: 'PDF', uploadDate: '2024-01-10', size: '0.5 MB', status: 'verified', icon: '💳', color: 'bg-gradient-to-r from-yellow-100 to-yellow-50' },
    { id: 4, name: 'Experience Letter', type: 'PDF', uploadDate: '2024-01-12', size: '1.5 MB', status: 'pending', icon: '📝', color: 'bg-gradient-to-r from-purple-100 to-purple-50' },
    { id: 5, name: 'Degree Certificate', type: 'PDF', uploadDate: '2024-01-08', size: '2.1 MB', status: 'verified', icon: '🎓', color: 'bg-gradient-to-r from-pink-100 to-pink-50' }
  ]);

  const [workHistory, setWorkHistory] = useState([
    { id: 1, company: 'Tech Solutions Inc', position: 'Software Engineer', duration: '2018-2020', location: 'Mumbai', color: 'bg-gradient-to-r from-blue-100 to-cyan-100' },
    { id: 2, company: 'Digital Innovations', position: 'Web Developer', duration: '2016-2018', location: 'Delhi', color: 'bg-gradient-to-r from-green-100 to-emerald-100' },
    { id: 3, company: 'StartUp Labs', position: 'Junior Developer', duration: '2015-2016', location: 'Bangalore', color: 'bg-gradient-to-r from-purple-100 to-pink-100' }
  ]);

  const [education, setEducation] = useState([
    { id: 1, degree: 'MCA', institution: 'IIT Delhi', year: '2015', grade: '8.5/10', color: 'bg-gradient-to-r from-blue-50 to-cyan-50' },
    { id: 2, degree: 'BCA', institution: 'Delhi University', year: '2012', grade: '8.0/10', color: 'bg-gradient-to-r from-green-50 to-emerald-50' },
    { id: 3, degree: 'Higher Secondary', institution: 'Kendriya Vidyalaya', year: '2009', grade: '85%', color: 'bg-gradient-to-r from-purple-50 to-pink-50' }
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Employee of the Month', date: 'Dec 2023', description: 'Outstanding performance in Q4 projects', icon: '🏆', color: 'bg-gradient-to-r from-yellow-100 to-amber-100' },
    { id: 2, title: 'Best Innovation Award', date: 'Aug 2023', description: 'Developed automation tool saving 20hrs/week', icon: '💡', color: 'bg-gradient-to-r from-blue-100 to-cyan-100' },
    { id: 3, title: 'AWS Certified', date: 'May 2023', description: 'AWS Certified Solutions Architect', icon: '☁️', color: 'bg-gradient-to-r from-orange-100 to-amber-100' },
    { id: 4, title: '5 Years Service', date: 'Jun 2022', description: 'Completed 5 years with the company', icon: '⭐', color: 'bg-gradient-to-r from-purple-100 to-pink-100' }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate', category: 'Technical' });

  // Clone functions
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

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setEmployeeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle skill addition
  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    const getSkillColor = (level) => {
      switch(level) {
        case 'Expert': return 'bg-gradient-to-r from-emerald-500 to-green-500';
        case 'Advanced': return 'bg-gradient-to-r from-blue-500 to-cyan-500';
        case 'Intermediate': return 'bg-gradient-to-r from-amber-500 to-orange-500';
        default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
      }
    };
    
    const skill = {
      id: skills.length + 1,
      name: newSkill.name,
      level: newSkill.level,
      category: newSkill.category,
      color: getSkillColor(newSkill.level)
    };
    
    setSkills([...skills, skill]);
    setNewSkill({ name: '', level: 'Intermediate', category: 'Technical' });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newDocument = {
      id: documents.length + 1,
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'pending',
      icon: '📄',
      color: 'bg-gradient-to-r from-gray-100 to-gray-50'
    };

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setDocuments([newDocument, ...documents]);
        setUploadProgress(0);
      }
    }, 100);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    setIsEditing(false);
  };

  // Tab content
  const TabContent = () => {
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
                      <span className="text-white font-bold text-2xl">JD</span>
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
                  <div key={job.id} className={`p-3 rounded-lg ${job.color} border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:scale-[1.01]`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {job.company.charAt(0)}
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
                  <div key={edu.id} className={`p-3 rounded-lg ${edu.color} border border-green-100 hover:border-green-300 transition-all duration-200 hover:scale-[1.01]`}>
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
                  <div key={achievement.id} className={`p-3 rounded-lg ${achievement.color} border border-amber-100 hover:border-amber-300 transition-all duration-200 hover:scale-[1.01]`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">{achievement.icon}</div>
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
                  <p className="text-xl font-bold text-blue-700">4</p>
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