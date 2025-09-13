'use client';

import React, { useState } from 'react';
import { Plus, User, Calendar, FileText, ChevronRight, CheckCheck, Sparkles, Bot, Trash, Download } from 'lucide-react';
import Image from 'next/image';
import Nav from '@/app/components/Nav';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('postJob');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [modalPage, setModalPage] = useState(1);
  const [editableJobTitle, setEditableJobTitle] = useState('');
  const [editableJobRole, setEditableJobRole] = useState('Full-time');
  const [stipend, setStipend] = useState<string | null>(null);
  const [openings, setOpenings] = useState<string>('');
  const [payRangeFrom, setPayRangeFrom] = useState<string>('');
  const [payRangeTo, setPayRangeTo] = useState<string>('');
  const [applicationDeadline, setApplicationDeadline] = useState<{month: string, day: string, year: string}>({
    month: '',
    day: '',
    year: ''
  });
  
  // New job form state
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    company: 'Your Company', // Default value
    location: '',
    type: 'Full time', // Default value
    description: '',
    requirements: '',
    compensationType: 'salary', // salary or stipend
    openings: '',
    payRangeFrom: '',
    payRangeTo: '',
    deadline: {
      month: '',
      day: '',
      year: ''
    }
  });
  const [newJobModalPage, setNewJobModalPage] = useState(1);
  const profileImage = '/image.png'; // Assuming you have this image in your public folder
  
  // Initial data for AI-suggested jobs
  const initialSuggestedJobs = [
    {
      id: 1,
      title: 'Senior UX Designer',
      company: 'Your Company',
      location: 'Bangalore',
      logo: 'AI',
      logoType: 'text',
      logoColor: 'blue',
      match: '98%',
      reason: 'Based on your hiring history',
      skills: ['Figma', 'User Research', 'Design Systems']
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'Your Company',
      location: 'Remote',
      logo: 'AI',
      logoType: 'text',
      logoColor: 'blue',
      match: '95%',
      reason: 'Trending in your industry',
      skills: ['React', 'Node.js', 'GraphQL']
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'Your Company',
      location: 'Hybrid',
      logo: 'AI',
      logoType: 'text',
      logoColor: 'blue',
      match: '92%',
      reason: 'Competitor hiring pattern',
      skills: ['Agile', 'Data Analysis', 'User Stories']
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Your Company',
      location: 'Bangalore',
      logo: 'AI',
      logoType: 'text',
      logoColor: 'blue',
      match: '90%',
      reason: 'Market demand analysis',
      skills: ['Python', 'ML', 'Data Visualization']
    }
  ];
  
  // State to manage the AI-suggested jobs list
  const [suggestedJobs, setSuggestedJobs] = useState(initialSuggestedJobs);
  
  // Function to handle deletion of a job card
  const handleDeleteJob = (jobId: number) => {
    setSuggestedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };
  
  // Function to handle opening the job details modal
  const openJobModal = (job: any) => {
    setSelectedJob(job);
    // Initialize editable content based on default values
    setEditableJobTitle(job.title);
    setEditableJobRole(job.type || 'Full-time');
    setJobDescription('We are seeking a skilled and motivated Software Developer to join our dynamic team. The ideal candidate will be responsible for designing, coding, testing, and deploying');
    setJobRequirements('Develop, test, and maintain software applications and systems.\nCollaborate with product managers, designers, and QA engineers to translate business requirements into technical solutions.');
    setIsEditMode(false);
    setModalOpen(true);
    
    // Reset scroll position when opening modal
    setTimeout(() => {
      const container = document.getElementById('modalScrollContainer');
      if (container) {
        container.scrollTop = 0;
      }
    }, 50);
  };
  
  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
    setIsEditMode(false);
    setModalPage(1); // Reset modal page
  };
  
  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };
  
  // Function to save changes
  const saveChanges = () => {
    // Here you could update the job in your database
    // For now, we'll just update the selectedJob with edited values
    setSelectedJob({
      ...selectedJob,
      title: editableJobTitle,
      type: editableJobRole
    });
    // Exit edit mode
    setIsEditMode(false);
  };
  
  // Function to go to the next page of the modal
  const goToNextPage = () => {
    // Simple validation for the first page
    if (!jobDescription.trim()) {
      alert('Please add a job description before proceeding.');
      return;
    }
    
    if (!jobRequirements.trim()) {
      alert('Please add job requirements before proceeding.');
      return;
    }
    
    // If validation passes, go to the next page
    setModalPage(2);
    
    // Reset scroll position
    setTimeout(() => {
      const container = document.getElementById('modalScrollContainer');
      if (container) {
        container.scrollTop = 0;
      }
    }, 50);
  };
  
  // Function to post job
  const postJob = () => {
    // Validate day and year inputs
    if (applicationDeadline.day && (parseInt(applicationDeadline.day) < 1 || parseInt(applicationDeadline.day) > 31)) {
      alert('Please enter a valid day (1-31)');
      return;
    }
    
    if (applicationDeadline.year && applicationDeadline.year.length !== 4) {
      alert('Please enter a valid 4-digit year');
      return;
    }
    
    // Format day to ensure it's two digits
    const formattedDay = applicationDeadline.day ? 
      applicationDeadline.day.padStart(2, '0') : '';
    
    // Create a formatted date from the applicationDeadline components
    const formattedDeadline = applicationDeadline.year && applicationDeadline.month && formattedDay
      ? `${applicationDeadline.year}-${applicationDeadline.month}-${formattedDay}`
      : '';
    
    // Here you would handle job posting logic
    console.log('Job Posted:', {
      job: selectedJob,
      description: jobDescription,
      requirements: jobRequirements,
      stipend,
      openings: openings ? parseInt(openings, 10) : 0,
      payRange: { 
        from: payRangeFrom ? parseInt(payRangeFrom, 10) : 0, 
        to: payRangeTo ? parseInt(payRangeTo, 10) : 0 
      },
      applicationDeadline: formattedDeadline
    });
    
    // Show a success message (you could use a toast notification here)
    alert('Job posted successfully!');
    
    // Close the modal and reset the form
    closeModal();
  };
  
  // Function to download job details as a text file from the AI modal
  const downloadJobDetails = () => {
    // Combine all job information
    const jobDetails = `
Job Title: ${editableJobTitle}
Company: ${selectedJob.company}
Location: ${selectedJob.location}
Job Type: ${editableJobRole}

Description:
${jobDescription}

Requirements:
${jobRequirements}

${openings ? `Number of Openings: ${openings}` : ''}
${stipend ? `Stipend Available: ${stipend === 'yes' ? 'Yes' : 'No'}` : ''}
${payRangeFrom && payRangeTo ? `Pay Range: ₹${payRangeFrom} - ₹${payRangeTo}` : ''}
${applicationDeadline.day && applicationDeadline.month && applicationDeadline.year ? 
  `Application Deadline: ${applicationDeadline.day}/${applicationDeadline.month}/${applicationDeadline.year}` : ''}
    `;
    
    // Create a blob with the text content
    const blob = new Blob([jobDetails], { type: 'text/plain' });
    
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${editableJobTitle.replace(/\s+/g, '_')}_JD.txt`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };
  
  // Function to handle the new job form changes
  const handleNewJobFormChange = (field: string, value: any) => {
    setNewJobForm(prev => {
      if (field.startsWith('deadline.')) {
        const deadlineField = field.split('.')[1];
        return {
          ...prev,
          deadline: {
            ...prev.deadline,
            [deadlineField]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  // Function to go to next page of new job modal
  const goToNextNewJobPage = () => {
    // Validate first page
    if (!newJobForm.title.trim()) {
      alert('Please enter a job title');
      return;
    }
    if (!newJobForm.location.trim()) {
      alert('Please enter a job location');
      return;
    }
    if (!newJobForm.description.trim()) {
      alert('Please enter a job description');
      return;
    }
    if (!newJobForm.requirements.trim()) {
      alert('Please enter job requirements');
      return;
    }
    
    setNewJobModalPage(2);
    
    // Reset scroll position
    setTimeout(() => {
      const container = document.getElementById('newJobModalScrollContainer');
      if (container) {
        container.scrollTop = 0;
      }
    }, 50);
  };
  
  // Function to post a new job
  const postNewJob = () => {
    // Validation for second page
    if (!newJobForm.openings) {
      alert('Please enter the number of openings');
      return;
    }
    if (!newJobForm.payRangeFrom || !newJobForm.payRangeTo) {
      alert('Please enter the pay range');
      return;
    }
    if (!newJobForm.deadline.month || !newJobForm.deadline.day || !newJobForm.deadline.year) {
      alert('Please enter the application deadline');
      return;
    }
    
    // Format deadline
    const formattedDeadline = `${newJobForm.deadline.year}-${newJobForm.deadline.month}-${newJobForm.deadline.day.padStart(2, '0')}`;
    
    // Here you would handle job posting logic
    console.log('New Job Posted:', {
      ...newJobForm,
      deadline: formattedDeadline
    });
    
    // Show success message
    alert('New job posted successfully!');
    
    // Close the modal
    setIsNewJobModalOpen(false);
  };
  
  // Function to download job JD as a text file
  const downloadJobJD = () => {
    // Combine all job information
    const jobDetails = `
Job Title: ${newJobForm.title}
Company: ${newJobForm.company}
Location: ${newJobForm.location}
Job Type: ${newJobForm.type}

Description:
${newJobForm.description}

Requirements:
${newJobForm.requirements}

Number of Openings: ${newJobForm.openings}
Compensation: ${newJobForm.compensationType === 'yes' ? 'Available' : 'Not Available'}
${newJobForm.payRangeFrom && newJobForm.payRangeTo ? `Pay Range: ₹${newJobForm.payRangeFrom} - ₹${newJobForm.payRangeTo}` : ''}
Application Deadline: ${newJobForm.deadline.day}/${newJobForm.deadline.month}/${newJobForm.deadline.year}
    `;
    
    // Create a blob with the text content
    const blob = new Blob([jobDetails], { type: 'text/plain' });
    
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${newJobForm.title.replace(/\s+/g, '_')}_JD.txt`;
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };
  
  // Function to close the new job modal
  const closeNewJobModal = () => {
    setIsNewJobModalOpen(false);
    setNewJobModalPage(1);
  };
  
  // Sample data for different tabs
  const recentOpenings = [
    {
      id: 1,
      title: 'UI Developer',
      company: 'Manusmriti',
      location: 'Bangalore',
      logo: 'MS',
      logoType: 'text',
      logoColor: 'teal',
      type: 'Full time',
      applications: 250
    },
    {
      id: 2,
      title: 'Front End Developer',
      company: 'Google Maps',
      location: 'Bangalore',
      logo: '/globe.svg',
      logoType: 'image',
      type: 'Full time',
      applications: 250
    },
    {
      id: 3,
      title: 'Front End Developer',
      company: 'Amazon',
      location: 'Bangalore',
      logo: '/file.svg',
      logoType: 'image',
      type: 'Full time',
      applications: 250
    },
    {
      id: 4,
      title: 'Front End Developer',
      company: 'Amazon',
      location: 'Bangalore',
      logo: '/file.svg',
      logoType: 'image',
      type: 'Internship',
      applications: 250
    }
  ];
  
  const completedHires = [
    {
      id: 5,
      title: 'UX Designer',
      company: 'Microsoft',
      location: 'Hyderabad',
      logo: 'MS',
      logoType: 'text',
      logoColor: 'blue',
      type: 'Full time',
      hiredDate: '15 Aug 2025',
      candidate: 'Alex Johnson'
    },
    {
      id: 6,
      title: 'Product Manager',
      company: 'Adobe',
      location: 'Bangalore',
      logo: 'AD',
      logoType: 'text',
      logoColor: 'red',
      type: 'Full time',
      hiredDate: '10 Aug 2025',
      candidate: 'Sarah Miller'
    },
    {
      id: 7,
      title: 'Backend Developer',
      company: 'Flipkart',
      location: 'Bangalore',
      logo: 'FK',
      logoType: 'text',
      logoColor: 'yellow',
      type: 'Contract',
      hiredDate: '5 Aug 2025',
      candidate: 'Rahul Sharma'
    }
  ];
  
  // No longer need handleSearch as it's moved to the Nav component
  
  return (
    <main className="min-h-screen bg-white flex flex-col">

      <div className="flex-1 overflow-auto">
        {/* Top Section Container */}
        <div className='bg-gradient-to-br from-[#0F387A]/25 to-[#126F7D]/25 rounded-b-4xl'>
        <Nav />
          {/* Welcome section */}
          <div className="px-6 pt-10 flex items-center justify-start">
            <div className="flex items-center">
              <div className="relative h-16 w-16 rounded-full overflow-hidden mr-4 border-2 border-white shadow-sm">
                <Image 
                  src={profileImage} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              </div>
              <p className="text-2xl font-medium text-[#1c2e4a]">Welcome Back, Recruiter</p>
            </div>
          </div>
        
          {/* Stats cards - horizontal scrollable row */}
          <div className="px-6 py-12">
            <div className="flex overflow-x-auto scrollbar-hide pb-2">
              <div className="bg-white/85 rounded-xl shadow-sm p-4 backdrop-blur-xl transition-all hover:shadow-md cursor-pointer mr-4 flex-shrink-0" style={{ width: '300px' }}>
                <p className="text-sm text-gray-500 mb-1">Time to shortlist</p>
                <p className="text-3xl font-semibold text-[#1c2e4a]">09</p>
                <p className="text-xs text-gray-500 mt-1">Avg last 7 days</p>
              </div>
              
              <div className="bg-white/85 rounded-xl shadow-sm p-4 backdrop-blur-xl transition-all hover:shadow-md cursor-pointer mr-4 flex-shrink-0" style={{ width: '300px' }}>
                <p className="text-sm text-gray-500 mb-1">Active jobs</p>
                <p className="text-3xl font-semibold text-[#1c2e4a]">09</p>
                <p className="text-xs text-gray-500 mt-1">2 new this week</p>
              </div>
              
              <div className="bg-white/85 rounded-xl shadow-sm p-4 backdrop-blur-xl transition-all hover:shadow-md cursor-pointer mr-4 flex-shrink-0" style={{ width: '300px' }}>
                <p className="text-sm text-gray-500 mb-1">Candidates in Pipeline</p>
                <p className="text-3xl font-semibold text-[#1c2e4a]">09</p>
                <p className="text-xs text-gray-500 mt-1">↓ 12%</p>
              </div>

              <div className="bg-white/85 rounded-xl shadow-sm p-4 backdrop-blur-xl transition-all hover:shadow-md cursor-pointer mr-4 flex-shrink-0" style={{ width: '300px' }}>
                <p className="text-sm text-gray-500 mb-1">Offer Acceptance Rate</p>
                <p className="text-3xl font-semibold text-[#1c2e4a]">26</p>
                <p className="text-xs text-gray-500 mt-1">↓ 3%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section Container */}
        <div>
          {/* Tab navigation - Pill buttons with divider */}
          <div className="px-6 pt-8 pb-4 flex items-center">
            <div className="flex items-center">
              {/* Fixed "Post New Job" button on the left */}
              <button 
                onClick={() => setActiveTab('postJob')} 
                className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 text-sm sm:text-sm md:text-md font-medium rounded-full transition-all ${
                  activeTab === 'postJob' 
                    ? 'bg-[#0F387A] text-white' 
                    : 'bg-[#0F387A]/6 text-[#0F387A] hover:bg-[#0F387A]/10'
                }`}
              >
                Post New Job
              </button>
              
              {/* Divider */}
              <div className="mx-3 sm:mx-3 md:mx-4 h-7 sm:h-7 md:h-8 border-r border-gray-300"></div>
              
              {/* Scrollable container for other buttons */}
              <div className="overflow-x-auto scrollbar-hide flex space-x-3 sm:space-x-3 md:space-x-4">
                <button 
                  onClick={() => setActiveTab('recent')} 
                  className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 text-sm sm:text-sm md:text-md font-medium rounded-full transition-all ${
                    activeTab === 'recent' 
                      ? 'bg-[#0F387A] text-white' 
                      : 'bg-[#0F387A]/6 text-[#0F387A] hover:bg-[#0F387A]/10'
                  }`}
                >
                  Recent Openings
                </button>
                <button 
                  onClick={() => setActiveTab('completed')} 
                  className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 text-sm sm:text-sm md:text-md font-medium rounded-full transition-all ${
                    activeTab === 'completed' 
                      ? 'bg-[#0F387A] text-white' 
                      : 'bg-[#0F387A]/6 text-[#0F387A] hover:bg-[#0F387A]/10'
                  }`}
                >
                  Completed Hires
                </button>
              </div>
            </div>
          </div>
        
          {/* Content based on active tab */}
          {activeTab === 'postJob' && (
            <div className="px-6 py-6">
                <div className="flex items-center mb-4">
                  <h2 className="text-xl font-bold text-[#1c2e4a]">AI Suggested Jobs</h2>
                  <div className="ml-2 p-1 bg-[#0F387A]/10 rounded-full">
                    <Bot className="h-5 w-5 text-[#0F387A]" />
                  </div>
                </div>              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestedJobs.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm p-4 relative transition-all border border-dashed border-[#0F387A]/20 animate-fadeIn">
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center bg-[#0F387A]/10 rounded-full px-2 py-0.5">
                        <Sparkles className="h-3 w-3 text-[#0F387A] mr-1" />
                        <span className="text-xs font-medium text-[#0F387A]">AI Suggested</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-md bg-[#0F387A]/10 flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-[#0F387A]">{job.logo}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-[#1c2e4a]">{job.title}</h3>
                        <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">Full time</span>
                      <div className="flex items-center space-x-1.5">
                        <button 
                          onClick={() => openJobModal(job)}
                          className="flex items-center px-2 py-1.5 text-sm font-medium rounded-full bg-[#0F387A]/12 text-[#0F387A] hover:bg-[#0F387A]/10 cursor-pointer transition-all"
                        >
                          Continue
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="bg-[#0F387A]/12 text-[#0F387A] rounded-full p-2 hover:bg-gray-200 transition-all cursor-pointer"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add New Jobs card */}
                <div 
                  onClick={() => {
                    setIsNewJobModalOpen(true);
                    setNewJobModalPage(1);
                    // Reset the form
                    setNewJobForm({
                      title: '',
                      company: 'Your Company',
                      location: '',
                      type: 'Full time',
                      description: '',
                      requirements: '',
                      compensationType: 'salary',
                      openings: '',
                      payRangeFrom: '',
                      payRangeTo: '',
                      deadline: {
                        month: '',
                        day: '',
                        year: ''
                      }
                    });
                  }}
                  className="bg-white rounded-lg shadow-sm p-4 relative transition-all border-2 border-dashed border-gray-200 hover:border-[#0F387A]/30 hover:shadow-md cursor-pointer flex items-center justify-center animate-fadeIn"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#0F387A]/10 flex items-center justify-center mr-3">
                      <Plus className="h-5 w-5 text-[#0F387A]" />
                    </div>
                    <p className="text-md font-medium text-[#1c2e4a]">Add New Jobs</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recent' && (
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1c2e4a]">Recent Job Openings</h2>
                <button className="bg-gray-100 text-gray-600 rounded-full p-2 hover:bg-gray-200 transition">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentOpenings.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm p-4 relative transition-all hover:shadow-md cursor-pointer" onClick={() => openJobModal(job)}>
                    <div className="absolute top-3 right-3">
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {job.logoType === 'text' ? (
                        <div className={`w-10 h-10 rounded-md ${job.logoColor === 'teal' ? 'bg-teal-100' : 'bg-blue-100'} flex items-center justify-center mr-3`}>
                          <span className={`text-xs font-bold ${job.logoColor === 'teal' ? 'text-teal-600' : 'text-blue-600'}`}>{job.logo}</span>
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3 bg-white flex items-center justify-center border border-gray-100">
                          <Image 
                            src={job.logo} 
                            alt={job.company} 
                            width={24} 
                            height={24} 
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-grow">
                        <h3 className="font-medium text-[#1c2e4a]">{job.title}</h3>
                        <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full">{job.type}</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        <span>{job.applications} applications</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'completed' && (
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#1c2e4a]">Completed Hires</h2>
                <button className="bg-gray-100 text-gray-600 rounded-full p-2 hover:bg-gray-200 transition">
                  <FileText className="h-5 w-5" />
                </button>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedHires.map(job => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm p-4 relative transition-all hover:shadow-md cursor-pointer">
                    <div className="absolute top-3 right-3">
                      <CheckCheck className="h-5 w-5 text-gray-500" />
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 rounded-md ${
                        job.logoColor === 'blue' ? 'bg-blue-100' : 
                        job.logoColor === 'red' ? 'bg-red-100' : 
                        'bg-yellow-100'
                      } flex items-center justify-center mr-3`}>
                        <span className={`text-xs font-bold ${
                          job.logoColor === 'blue' ? 'text-blue-600' : 
                          job.logoColor === 'red' ? 'text-red-600' : 
                          'text-yellow-600'
                        }`}>{job.logo}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-[#1c2e4a]">{job.title}</h3>
                        <p className="text-xs text-gray-500">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500">Hired on {job.hiredDate}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500">{job.candidate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Job Details Modal */}
      {modalOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={closeModal}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-xl h-[70vh] relative overflow-hidden animate-fadeIn flex flex-col">
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            {/* Header with job icon and title - Fixed at top */}
            <div className="px-8 pt-8 pb-4 flex-shrink-0">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-blue-600">{selectedJob.logo}</span>
                </div>
                <div className="flex-1">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={editableJobTitle}
                      onChange={(e) => setEditableJobTitle(e.target.value)}
                      className="w-full text-xl font-bold text-[#1c2e4a] bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg px-3 py-1 mb-2 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-[#1c2e4a]">{editableJobTitle}</h2>
                  )}
                  {isEditMode ? (
                    <select
                      value={editableJobRole}
                      onChange={(e) => setEditableJobRole(e.target.value)}
                      className="text-sm text-gray-600 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg px-2 py-1 w-full transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  ) : (
                    <p className="text-sm text-gray-600">Role: {editableJobRole}</p>
                  )}
                </div>
              </div>
              
              {/* Page indicator - only show when we have multiple pages */}
              {modalPage > 0 && (
                <div className="flex items-center mt-4">
                  <div className={`h-1 w-6 rounded-full mr-1 ${modalPage === 1 ? 'bg-[#0F387A]' : 'bg-gray-300'}`}></div>
                  <div className={`h-1 w-6 rounded-full ${modalPage === 2 ? 'bg-[#0F387A]' : 'bg-gray-300'}`}></div>
                </div>
              )}
            </div>
            
            {/* Scrollable content area - with auto vertical centering */}
            <div id="modalScrollContainer" className="px-8 flex-1 overflow-y-auto scrollbar-hide flex flex-col relative pb-0">
              
              {modalPage === 1 ? (
                <div className="my-auto py-6 pb-8">
                  <h3 className="text-md font-medium text-[#1c2e4a] mb-2">Job Description</h3>
                  {isEditMode ? (
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 mb-4 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30 h-24"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 mb-4">
                      {jobDescription}
                    </p>
                  )}
                  
                  <h3 className="text-md font-medium text-[#1c2e4a] mb-2">Requirements</h3>
                  {isEditMode ? (
                    <textarea
                      value={jobRequirements}
                      onChange={(e) => setJobRequirements(e.target.value)}
                      className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 mb-6 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30 h-24"
                    />
                  ) : (
                    <ul className="list-disc pl-5 mb-6">
                      {jobRequirements.split('\n').map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 mb-1">
                          {req}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="my-auto py-6 pb-8">
                  <h3 className="text-md font-medium text-[#1c2e4a] mb-5">Job Details</h3>
                  
                  {/* 2x2 Grid Layout for Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                    {/* Stipend Radio Buttons */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#1c2e4a]">
                        Stipend Available
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-[#0F387A] h-4 w-4"
                            name="stipend"
                            value="yes"
                            checked={stipend === 'yes'}
                            onChange={() => setStipend('yes')}
                          />
                          <span className="ml-2 text-sm text-gray-600">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-[#0F387A] h-4 w-4"
                            name="stipend"
                            value="no"
                            checked={stipend === 'no'}
                            onChange={() => setStipend('no')}
                          />
                          <span className="ml-2 text-sm text-gray-600">No</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Number of Openings */}
                    <div className="space-y-2">
                      <label htmlFor="openings" className="block text-sm font-medium text-[#1c2e4a]">
                        Number of Openings
                      </label>
                      <input
                        type="number"
                        id="openings"
                        min="1"
                        placeholder="e.g., 5"
                        className="w-full p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                        value={openings}
                        onChange={(e) => setOpenings(e.target.value)}
                      />
                    </div>
                    
                    {/* Pay Range */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#1c2e4a]">
                        Pay Range (₹)
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="w-full p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          placeholder="From"
                          value={payRangeFrom}
                          onChange={(e) => setPayRangeFrom(e.target.value)}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="number"
                          className="w-full p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          placeholder="To"
                          value={payRangeTo}
                          onChange={(e) => setPayRangeTo(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {/* Application Deadline */}
                    <div className="space-y-2">
                      <label htmlFor="deadline" className="block text-sm font-medium text-[#1c2e4a]">
                        Application Deadline
                      </label>
                      <div className="flex space-x-2">
                        {/* Custom Styled Month Dropdown */}
                        <div className="relative w-1/3">
                          <select 
                            className="w-full appearance-none p-2 pr-8 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                            value={applicationDeadline.month}
                            onChange={(e) => setApplicationDeadline({...applicationDeadline, month: e.target.value})}
                          >
                            <option value="">Month</option>
                            <option value="01">Jan</option>
                            <option value="02">Feb</option>
                            <option value="03">Mar</option>
                            <option value="04">Apr</option>
                            <option value="05">May</option>
                            <option value="06">Jun</option>
                            <option value="07">Jul</option>
                            <option value="08">Aug</option>
                            <option value="09">Sep</option>
                            <option value="10">Oct</option>
                            <option value="11">Nov</option>
                            <option value="12">Dec</option>
                          </select>
                          {/* Custom dropdown arrow */}
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#0F387A]">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Day Text Box */}
                        <input
                          type="text"
                          placeholder="DD"
                          className="w-1/4 p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          value={applicationDeadline.day}
                          onChange={(e) => {
                            // Allow only numbers and limit to 2 digits
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                            // Ensure day is between 1-31
                            if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                              setApplicationDeadline({...applicationDeadline, day: value});
                            }
                          }}
                        />
                        
                        {/* Year Text Box */}
                        <input
                          type="text"
                          placeholder="YYYY"
                          className="w-1/3 p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          value={applicationDeadline.year}
                          onChange={(e) => {
                            // Allow only numbers and limit to 4 digits
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                            setApplicationDeadline({...applicationDeadline, year: value});
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action buttons - Fixed at bottom */}
            <div className="flex justify-between space-x-3 p-5 bg-gradient-to-br from-[#0F387A]/20 to-[#126F7D]/20 flex-shrink-0">
              {modalPage === 1 ? (
                <>
                  <div></div> {/* Empty div for spacing */}
                  <div className="flex items-center space-x-3">
                    {isEditMode ? (
                      <button 
                        onClick={saveChanges}
                        className="px-5 py-2.5 border border-[#0F387A] text-[#0F387A] rounded-full hover:bg-[#0F387A]/5 transition-all flex items-center"
                      >
                        Save Changes
                      </button>
                    ) : (
                      <button 
                        onClick={toggleEditMode}
                        className="px-5 py-2.5 border border-[#0F387A] text-[#0F387A] rounded-full hover:bg-[#0F387A]/5 transition-all flex items-center"
                      >
                        Make Changes
                      </button>
                    )}
                    <button 
                      onClick={goToNextPage}
                      className={`p-3 ${isEditMode ? 'bg-[#0F387A]/50 cursor-not-allowed' : 'bg-[#0F387A] hover:bg-[#0F387A]/90 cursor-pointer'} text-white rounded-full transition-all`}
                      disabled={isEditMode}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setModalPage(1)}
                    className="px-5 py-2.5 border border-[#0F387A] text-[#0F387A] rounded-full hover:bg-[#0F387A]/5 transition-all flex items-center"
                  >
                    Back
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={postJob}
                      className="px-6 py-2.5 bg-[#0F387A] text-white rounded-full hover:bg-[#0F387A]/90 transition-all flex items-center"
                    >
                      Post Job
                    </button>
                    <button
                      onClick={downloadJobDetails}
                      className="p-3 bg-[#0F387A] text-white rounded-full hover:bg-[#0F387A]/90 transition-all flex items-center justify-center"
                      title="Download Job Description"
                    >
                      <Download className="h-5.5 w-5.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* New Job Modal */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={closeNewJobModal}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-2xl h-[80vh] relative overflow-hidden animate-fadeIn flex flex-col">
            {/* Close button */}
            <button 
              onClick={closeNewJobModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            {/* Header with title - Fixed at top */}
            <div className="px-8 pt-8 pb-4 flex-shrink-0">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0F387A]/10 flex items-center justify-center mr-4">
                  <Plus className="h-7 w-7 text-[#0F387A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1c2e4a]">Add New Job</h2>
                  <p className="text-sm text-gray-600">Fill in the details to create a new job posting</p>
                </div>
              </div>
              
              {/* Page indicator */}
              <div className="flex items-center mt-4">
                <div className={`h-1 w-6 rounded-full mr-1 ${newJobModalPage === 1 ? 'bg-[#0F387A]' : 'bg-gray-300'}`}></div>
                <div className={`h-1 w-6 rounded-full ${newJobModalPage === 2 ? 'bg-[#0F387A]' : 'bg-gray-300'}`}></div>
              </div>
            </div>
            
            {/* Scrollable content area */}
            <div id="newJobModalScrollContainer" className="px-8 flex-1 overflow-y-auto scrollbar-hide flex flex-col relative pb-0">
              
              {newJobModalPage === 1 ? (
                <div className="my-auto py-6 pb-8">
                  {/* Job Title */}
                  <div className="mb-4">
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-[#1c2e4a] mb-2">
                      Job Title*
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      placeholder="e.g., Senior UI Developer"
                      className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                      value={newJobForm.title}
                      onChange={(e) => handleNewJobFormChange('title', e.target.value)}
                    />
                  </div>
                  
                  {/* Company Name */}
                  <div className="mb-4">
                    <label htmlFor="company" className="block text-sm font-medium text-[#1c2e4a] mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                      value={newJobForm.company}
                      onChange={(e) => handleNewJobFormChange('company', e.target.value)}
                    />
                  </div>
                  
                  {/* Job Type and Location - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Job Type */}
                    <div>
                      <label htmlFor="jobType" className="block text-sm font-medium text-[#1c2e4a] mb-2">
                        Job Type*
                      </label>
                      <select
                        id="jobType"
                        className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                        value={newJobForm.type}
                        onChange={(e) => {
                          handleNewJobFormChange('type', e.target.value);
                          // Update compensation type based on job type
                          if (e.target.value === 'Internship' || e.target.value === 'Part time') {
                            handleNewJobFormChange('compensationType', 'stipend');
                          } else {
                            handleNewJobFormChange('compensationType', 'salary');
                          }
                        }}
                      >
                        <option value="Full time">Full time</option>
                        <option value="Part time">Part time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                    
                    {/* Job Location */}
                    <div>
                      <label htmlFor="jobLocation" className="block text-sm font-medium text-[#1c2e4a] mb-2">
                        Job Location*
                      </label>
                      <input
                        type="text"
                        id="jobLocation"
                        placeholder="e.g., Bangalore, Remote, Hybrid"
                        className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                        value={newJobForm.location}
                        onChange={(e) => handleNewJobFormChange('location', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Job Description */}
                  <div className="mb-4">
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-[#1c2e4a] mb-2">
                      Job Description*
                    </label>
                    <textarea
                      id="jobDescription"
                      rows={4}
                      placeholder="Describe the responsibilities, expectations, and details about the role..."
                      className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                      value={newJobForm.description}
                      onChange={(e) => handleNewJobFormChange('description', e.target.value)}
                    />
                  </div>
                  
                  {/* Requirements */}
                  <div className="mb-4">
                    <label htmlFor="requirements" className="block text-sm font-medium text-[#1c2e4a] mb-2">
                      Requirements*
                    </label>
                    <textarea
                      id="requirements"
                      rows={4}
                      placeholder="List the skills, qualifications, and experience required..."
                      className="w-full p-3 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                      value={newJobForm.requirements}
                      onChange={(e) => handleNewJobFormChange('requirements', e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="my-auto py-6 pb-8">
                  <h3 className="text-md font-medium text-[#1c2e4a] mb-5">Job Details</h3>
                  
                  {/* 2x2 Grid Layout for Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                    {/* Compensation Type */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#1c2e4a]">
                        {newJobForm.type === 'Full time' || newJobForm.type === 'Contract' ? 'Salary' : 'Stipend'} Available
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-[#0F387A] h-4 w-4"
                            name="compensationType"
                            value="yes"
                            checked={newJobForm.compensationType === 'yes'}
                            onChange={() => handleNewJobFormChange('compensationType', 'yes')}
                          />
                          <span className="ml-2 text-sm text-gray-600">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio text-[#0F387A] h-4 w-4"
                            name="compensationType"
                            value="no"
                            checked={newJobForm.compensationType === 'no'}
                            onChange={() => handleNewJobFormChange('compensationType', 'no')}
                          />
                          <span className="ml-2 text-sm text-gray-600">No</span>
                        </label>
                      </div>
                    </div>
                    
                    {/* Number of Openings */}
                    <div className="space-y-2">
                      <label htmlFor="openings" className="block text-sm font-medium text-[#1c2e4a]">
                        Number of Openings*
                      </label>
                      <input
                        type="number"
                        id="openings"
                        min="1"
                        placeholder="e.g., 5"
                        className="w-full p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                        value={newJobForm.openings}
                        onChange={(e) => handleNewJobFormChange('openings', e.target.value)}
                      />
                    </div>
                    
                    {/* Pay Range */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#1c2e4a]">
                        Pay Range (₹)*
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          className="w-full p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          placeholder="From"
                          value={newJobForm.payRangeFrom}
                          onChange={(e) => handleNewJobFormChange('payRangeFrom', e.target.value)}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                          type="number"
                          className="w-full p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          placeholder="To"
                          value={newJobForm.payRangeTo}
                          onChange={(e) => handleNewJobFormChange('payRangeTo', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {/* Application Deadline */}
                    <div className="space-y-2">
                      <label htmlFor="deadline" className="block text-sm font-medium text-[#1c2e4a]">
                        Application Deadline*
                      </label>
                      <div className="flex space-x-2">
                        <select 
                          className="w-1/3 p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          value={newJobForm.deadline.month}
                          onChange={(e) => handleNewJobFormChange('deadline.month', e.target.value)}
                        >
                          <option value="">Month</option>
                          <option value="01">Jan</option>
                          <option value="02">Feb</option>
                          <option value="03">Mar</option>
                          <option value="04">Apr</option>
                          <option value="05">May</option>
                          <option value="06">Jun</option>
                          <option value="07">Jul</option>
                          <option value="08">Aug</option>
                          <option value="09">Sep</option>
                          <option value="10">Oct</option>
                          <option value="11">Nov</option>
                          <option value="12">Dec</option>
                        </select>
                        
                        <input
                          type="text"
                          placeholder="DD"
                          className="w-1/4 p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          value={newJobForm.deadline.day}
                          onChange={(e) => {
                            // Allow only numbers and limit to 2 digits
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
                            // Ensure day is between 1-31
                            if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 31)) {
                              handleNewJobFormChange('deadline.day', value);
                            }
                          }}
                        />
                        
                        <input
                          type="text"
                          placeholder="YYYY"
                          className="w-1/3 p-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-600 transition-all duration-300 focus:outline-none focus:border-[#0F387A]/40 focus:ring-1 focus:ring-[#0F387A]/30"
                          value={newJobForm.deadline.year}
                          onChange={(e) => {
                            // Allow only numbers and limit to 4 digits
                            const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                            handleNewJobFormChange('deadline.year', value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action buttons - Fixed at bottom */}
            <div className="flex justify-between space-x-3 p-5 bg-gradient-to-br from-[#0F387A]/20 to-[#126F7D]/20 flex-shrink-0">
              {newJobModalPage === 1 ? (
                <>
                  <button 
                    onClick={closeNewJobModal}
                    className="px-5 py-2.5 border border-[#0F387A] text-[#0F387A] rounded-full hover:bg-[#0F387A]/5 transition-all flex items-center"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={goToNextNewJobPage}
                    className="px-6 py-2.5 bg-[#0F387A] text-white rounded-full hover:bg-[#0F387A]/90 transition-all flex items-center"
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setNewJobModalPage(1)}
                    className="px-5 py-2.5 border border-[#0F387A] text-[#0F387A] rounded-full hover:bg-[#0F387A]/5 transition-all flex items-center"
                  >
                    Back
                  </button>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={postNewJob}
                      className="px-6 py-2.5 bg-[#0F387A] text-white rounded-full hover:bg-[#0F387A]/90 transition-all flex items-center"
                    >
                      Post Job
                    </button>
                    <button
                      onClick={downloadJobJD}
                      className="p-3 bg-[#0F387A] text-white rounded-full hover:bg-[#0F387A]/90 transition-all flex items-center justify-center"
                      title="Download Job Description"
                    >
                      <Download className="h-5.5 w-5.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
