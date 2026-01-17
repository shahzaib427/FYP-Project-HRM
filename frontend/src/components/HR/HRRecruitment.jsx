import React, { useState } from 'react';
import { 
  BriefcaseIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  PlusIcon,
  FilterIcon,
  SearchIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/outline';

const HRRecruitment = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for job postings
  const [jobPostings, setJobPostings] = useState([
    { 
      id: 1, 
      title: 'Senior Frontend Developer', 
      department: 'Engineering', 
      type: 'Full-time', 
      location: 'Remote', 
      salary: '$120k - $150k',
      applicants: 42,
      status: 'Open',
      postedDate: '2024-01-05',
      deadline: '2024-02-05'
    },
    { 
      id: 2, 
      title: 'Product Manager', 
      department: 'Product', 
      type: 'Full-time', 
      location: 'San Francisco', 
      salary: '$140k - $180k',
      applicants: 28,
      status: 'Open',
      postedDate: '2024-01-10',
      deadline: '2024-02-10'
    },
    { 
      id: 3, 
      title: 'UX Designer', 
      department: 'Design', 
      type: 'Contract', 
      location: 'Remote', 
      salary: '$90k - $110k',
      applicants: 35,
      status: 'Closed',
      postedDate: '2023-12-15',
      deadline: '2024-01-15'
    },
    { 
      id: 4, 
      title: 'DevOps Engineer', 
      department: 'Engineering', 
      type: 'Full-time', 
      location: 'New York', 
      salary: '$130k - $160k',
      applicants: 19,
      status: 'Open',
      postedDate: '2024-01-12',
      deadline: '2024-02-12'
    },
  ]);

  // Mock data for candidates
  const [candidates, setCandidates] = useState([
    { 
      id: 1, 
      name: 'Alex Johnson', 
      position: 'Senior Frontend Developer', 
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      experience: '8 years',
      education: 'Masters in CS',
      status: 'Interview',
      appliedDate: '2024-01-08',
      rating: 4.5,
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind']
    },
    { 
      id: 2, 
      name: 'Maria Garcia', 
      position: 'Product Manager', 
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 987-6543',
      location: 'Remote',
      experience: '6 years',
      education: 'MBA',
      status: 'Applied',
      appliedDate: '2024-01-12',
      rating: 4.2,
      skills: ['Product Strategy', 'Agile', 'Data Analysis']
    },
    { 
      id: 3, 
      name: 'David Chen', 
      position: 'UX Designer', 
      email: 'david.chen@example.com',
      phone: '+1 (555) 456-7890',
      location: 'New York, NY',
      experience: '5 years',
      education: 'BFA Design',
      status: 'Rejected',
      appliedDate: '2024-01-05',
      rating: 3.8,
      skills: ['Figma', 'User Research', 'Prototyping']
    },
    { 
      id: 4, 
      name: 'Sarah Miller', 
      position: 'DevOps Engineer', 
      email: 'sarah.miller@example.com',
      phone: '+1 (555) 789-0123',
      location: 'Remote',
      experience: '7 years',
      education: 'BS Computer Science',
      status: 'Hired',
      appliedDate: '2024-01-15',
      rating: 4.7,
      skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform']
    },
  ]);

  // Statistics
  const recruitmentStats = {
    totalJobs: jobPostings.length,
    activeJobs: jobPostings.filter(job => job.status === 'Open').length,
    totalCandidates: candidates.length,
    hiredThisMonth: 3,
    interviewScheduled: 8,
    rejectionRate: '15%'
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Hired': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Open': 
      case 'Hired': return <CheckCircleIcon className="h-4 w-4" />;
      case 'Applied': 
      case 'Interview': return <ClockIcon className="h-4 w-4" />;
      case 'Closed': 
      case 'Rejected': return <XCircleIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon 
            key={i} 
            className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  const renderJobPostings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Job Openings</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <PlusIcon className="h-5 w-5" />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobPostings.map((job) => (
          <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                <p className="text-gray-600 text-sm">{job.department} • {job.type}</p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                {getStatusIcon(job.status)}
                <span className="ml-1">{job.status}</span>
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <LocationMarkerIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">{job.salary}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">{job.applicants} applicants</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Closes {job.deadline}</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors">
                View Applicants ({job.applicants})
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCandidates = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Candidate Pipeline</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <SearchIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Hired">Hired</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {candidate.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{candidate.name}</h4>
                  <p className="text-blue-600 font-medium">{candidate.position}</p>
                  
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MailIcon className="h-4 w-4 mr-1" />
                      <span>{candidate.email}</span>
                    </div>
                    <div className="flex items-center">
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      <span>{candidate.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <LocationMarkerIcon className="h-4 w-4 mr-1" />
                      <span>{candidate.location}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-end space-y-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                  {getStatusIcon(candidate.status)}
                  <span className="ml-1">{candidate.status}</span>
                </span>
                
                {renderStars(candidate.rating)}
                
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Schedule Interview
                  </button>
                  <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Accelerate Your Hiring</h3>
            <p className="mt-2 opacity-90">Post jobs, review candidates, and schedule interviews</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold transition-colors">
              Post New Job
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold transition-colors">
              Review Applications
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900">{recruitmentStats.activeJobs}</p>
            </div>
            <BriefcaseIcon className="h-12 w-12 text-blue-100" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-green-600">
              <span>+2 this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900">{recruitmentStats.totalCandidates}</p>
            </div>
            <UserGroupIcon className="h-12 w-12 text-green-100" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-blue-600">
              <span>{recruitmentStats.interviewScheduled} interviews scheduled</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Hired This Month</p>
              <p className="text-3xl font-bold text-gray-900">{recruitmentStats.hiredThisMonth}</p>
            </div>
            <CheckCircleIcon className="h-12 w-12 text-purple-100" />
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-600">
              <span>Rejection rate: {recruitmentStats.rejectionRate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Interviews</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">AJ</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Alex Johnson</h4>
                  <p className="text-sm text-gray-600">Senior Frontend Developer • 10:00 AM Today</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
                Join Meeting
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recruitment Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage job postings, candidates, and hiring workflow</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['dashboard', 'jobs', 'candidates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'dashboard' ? 'Overview' : tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'jobs' && renderJobPostings()}
          {activeTab === 'candidates' && renderCandidates()}
        </div>

        {/* Footer Notes */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help? Contact the recruitment team at recruitment@company.com</p>
        </div>
      </div>
    </div>
  );
};

export default HRRecruitment;