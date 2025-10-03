"use client";
import Aurora from '@/app/components/backgrounds/Aurora';

import React, { useState, useEffect } from 'react';
import { Plus, User, Calendar, FileText, ChevronRight, CheckCheck, Sparkles, Bot, Trash, Download, Briefcase, Timer, Users, Handshake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Dropdown from "../components/ui/Dropdown";
import Image from 'next/image';
import Nav from '@/app/components/Nav';
import { getRecruiterProfile, createRecruiterProfile, getJobs, createJob, getJobById, generateJobJD, updateJob } from '@/lib/api';
import { getAccessToken } from '@/config/auth';

export default function HomePage() {
  // Top-level component state (kept company onboarding out of this page)
  const [activeTab, setActiveTab] = useState('postJob');
  const [modalOpen, setModalOpen] = useState(false);
  type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    logo: string;
    logoType: string;
    logoColor?: string;
    match?: string;
    reason?: string;
    skills?: string[];
    type?: string;
    applications?: number;
    hiredDate?: string;
    candidate?: string;
  };
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isGeneratingJD, setIsGeneratingJD] = useState(false);
  const [isGeneratingRequirements, setIsGeneratingRequirements] = useState(false);
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
  const [newJobModalPage, setNewJobModalPage] = useState(1);
  const profileImage = '/image.png'; // Assuming you have this image in your public folder
  const [recruiterProfile, setRecruiterProfile] = useState<any | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // Load recruiter profile on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRecruiterProfile();
        if (mounted) setRecruiterProfile(data);
      } catch (e) {
        // silently ignore for now; could show toast or fallback
        // console.error('Failed to load recruiter profile', e);
      }
    })();
    (async () => {
      setJobsLoading(true);
      try {
        const res = await getJobs({ page: 1, page_size: 50 });
        if (mounted && res && Array.isArray(res.jobs)) {
          // Normalize upstream job fields to the shape the UI expects
          const normalized = res.jobs.map((j: any) => ({
            ...j,
            // prefer existing UI-friendly names, fall back to API names
            type: j.type ?? j.job_type ?? j.jobType ?? undefined,
            hiredDate: j.hiredDate ?? j.hired_date ?? undefined,
            // ensure status is a lowercase string for comparisons
            status: j.status ? String(j.status).toLowerCase() : undefined,
            // applications fallback
            applications: j.applications ?? j.no_of_applications ?? j.no_of_openings ?? 0,
            // logo heuristics: if upstream provides no logo, use company initial
            logo: j.logo ?? (j.company ? String(j.company).charAt(0) : ''),
            logoType: j.logoType ?? (j.logo && typeof j.logo === 'string' && j.logo.startsWith('http') ? 'image' : 'text')
          }));
          setJobs(normalized);
        }
      } catch (e) {
        // ignore - keep sample data
      } finally {
        setJobsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  
  // Function to save changes (local-only; API is triggered via the Post/Update button)
  const saveChanges = () => {
    if (selectedJob) {
      setSelectedJob({
        ...selectedJob,
        title: editableJobTitle,
        type: editableJobRole,
        // keep other properties intact
        id: selectedJob.id,
        company: selectedJob.company,
        location: selectedJob.location,
        logo: selectedJob.logo,
        logoType: selectedJob.logoType,
        logoColor: selectedJob.logoColor,
        match: selectedJob.match,
        reason: selectedJob.reason,
        skills: selectedJob.skills,
        applications: selectedJob.applications,
        hiredDate: selectedJob.hiredDate,
        candidate: selectedJob.candidate
      });
    }

    // Exit edit mode
    setIsEditMode(false);
  };

  // Placeholder generator handlers (can be wired to an AI service later)
  // Combined generate action: run both generators concurrently
  const generateAll = async () => {
    console.log('Generate (combined) clicked');
    setIsGeneratingJD(true);
    setIsGeneratingRequirements(true);
    try {
      if (selectedJob && selectedJob.id) {
        // Call the generate JD endpoint
        try {
          const res: any = await generateJobJD(selectedJob.id);
          const desc = res?.description ?? res?.data?.description ?? '';
          const reqs = res?.requirements ?? res?.data?.requirements ?? [];
          if (desc) setJobDescription(desc);
          if (Array.isArray(reqs) && reqs.length) setJobRequirements(reqs.join('\n'));
        } catch (e) {
          // fallback to simulation if API call fails
          await Promise.all([
            new Promise((res) => setTimeout(res, 800)),
            new Promise((res) => setTimeout(res, 900))
          ]);
          if (!jobDescription || !jobDescription.trim()) {
            setJobDescription('Generated job description (placeholder). Edit as needed.');
          }
          if (!jobRequirements || !jobRequirements.trim()) {
            setJobRequirements('• Requirement 1\n• Requirement 2\n• Requirement 3');
          }
        }
      } else {
        // No selected job, simulate generation
        await Promise.all([
          new Promise((res) => setTimeout(res, 800)),
          new Promise((res) => setTimeout(res, 900))
        ]);
        if (!jobDescription || !jobDescription.trim()) {
          setJobDescription('Generated job description (placeholder). Edit as needed.');
        }
        if (!jobRequirements || !jobRequirements.trim()) {
          setJobRequirements('• Requirement 1\n• Requirement 2\n• Requirement 3');
        }
      }
    } finally {
      setIsGeneratingJD(false);
      setIsGeneratingRequirements(false);
    }
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
  
  // Function to post job (calls API)
  const postJob = async () => {
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
    const formattedDay = applicationDeadline.day ? applicationDeadline.day.padStart(2, '0') : '';

    // Create a validated ISO timestamp (end of day) for the deadline so upstream can parse it
    let formattedDeadline = '';
    if (applicationDeadline.year && applicationDeadline.month && formattedDay) {
      const y = Number(applicationDeadline.year);
      const m = Number(applicationDeadline.month);
      const d = Number(formattedDay);
      const dt = new Date(y, m - 1, d, 23, 59, 59);
      // Validate that the constructed date matches the inputs (catches invalid dates like Feb 30)
      if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
        formattedDeadline = dt.toISOString();
      } else {
        alert('Please enter a valid application deadline');
        return;
      }
    }

    // Build payload similarly to postNewJob but using the edited modal fields
    try {
      const payKind = (String(editableJobRole || '').toLowerCase().includes('part') || String(editableJobRole || '').toLowerCase().includes('intern')) ? 'stipend' : 'salary';
      const stipendFlag = stipend === 'yes' || payKind === 'stipend';

      const requirementsArr = typeof jobRequirements === 'string'
        ? jobRequirements.split('\n').map(r => r.trim()).filter(Boolean)
        : Array.isArray(jobRequirements) ? jobRequirements : [];

      const payload: any = {
        title: editableJobTitle || (selectedJob?.title ?? ''),
        company: selectedJob?.company ?? 'Your Company',
        location: selectedJob?.location ?? '',
        description: jobDescription || '',
        requirements: requirementsArr,
        stipend: stipendFlag,
        stipend_min: null,
        stipend_max: null,
        salary_min: null,
        salary_max: null,
        post_on: [],
        job_type: String(editableJobRole || 'Full time').toLowerCase().replace(/\s+/g, '-'),
        experience: '',
        skills: [],
        deadline: formattedDeadline,
        no_of_openings: openings ? parseInt(openings, 10) : 0
      };

      const from = payRangeFrom ? Number(payRangeFrom) : null;
      const to = payRangeTo ? Number(payRangeTo) : null;
      if (payKind === 'stipend') {
        payload.stipend_min = from;
        payload.stipend_max = to;
      } else {
        payload.salary_min = from;
        payload.salary_max = to;
      }

      // If editing an existing job, PATCH; otherwise POST to create
      if (selectedJob && selectedJob.id) {
        try {
          // For updates we only send description and requirements per spec
          const updatePayload: any = {
            description: jobDescription || '',
            requirements: requirementsArr
          };
          await updateJob(selectedJob.id, updatePayload);
          // Refresh jobs list
          try {
            const updated = await getJobs({ page: 1, page_size: 50 });
            if (updated && Array.isArray(updated.jobs)) {
              const normalized = updated.jobs.map((j: any) => ({
                ...j,
                type: j.type ?? j.job_type ?? j.jobType ?? undefined,
                hiredDate: j.hiredDate ?? j.hired_date ?? undefined,
                status: j.status ? String(j.status).toLowerCase() : undefined,
                applications: j.applications ?? j.no_of_applications ?? j.no_of_openings ?? 0,
                logo: j.logo ?? (j.company ? String(j.company).charAt(0) : ''),
                logoType: j.logoType ?? (j.logo && typeof j.logo === 'string' && j.logo.startsWith('http') ? 'image' : 'text')
              }));
              setJobs(normalized);
            }
          } catch (e) {
            // ignore refresh error
          }

          alert('Job updated successfully!');
          closeModal();
        } catch (err) {
          console.error('Error updating job', err);
          alert('Error updating job');
        }
      } else {
        // Create new job
        const created = await createJob(payload);
        try {
          const updated = await getJobs({ page: 1, page_size: 50 });
          if (updated && Array.isArray(updated.jobs)) {
            const normalized = updated.jobs.map((j: any) => ({
              ...j,
              type: j.type ?? j.job_type ?? j.jobType ?? undefined,
              hiredDate: j.hiredDate ?? j.hired_date ?? undefined,
              status: j.status ? String(j.status).toLowerCase() : undefined,
              applications: j.applications ?? j.no_of_applications ?? j.no_of_openings ?? 0,
              logo: j.logo ?? (j.company ? String(j.company).charAt(0) : ''),
              logoType: j.logoType ?? (j.logo && typeof j.logo === 'string' && j.logo.startsWith('http') ? 'image' : 'text')
            }));
            setJobs(normalized);
          }
        } catch (e) {
          // Ignore refresh error
        }

        alert('Job posted successfully!');
        closeModal();
      }
    } catch (err) {
      console.error('Error posting job', err);
      alert('Error posting job');
    }
  };
  
  // Function to download job details as a text file from the AI modal
  const downloadJobDetails = () => {
    // Combine all job information
    const jobDetails = `
Job Title: ${editableJobTitle}
Company: ${selectedJob ? selectedJob.company : ''}
Location: ${selectedJob ? selectedJob.location : ''}
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
  const handleNewJobFormChange = (field: string, value: string) => {
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
    // Determine if compensation ranges are required based on compensation selection
    const compAvailable = newJobForm.compensationType !== 'no';
    if (compAvailable && (!newJobForm.payRangeFrom || !newJobForm.payRangeTo)) {
      alert('Please enter the pay range');
      return;
    }
    if (!newJobForm.deadline.month || !newJobForm.deadline.day || !newJobForm.deadline.year) {
      alert('Please enter the application deadline');
      return;
    }
    
    // Build a validated ISO timestamp for the deadline (end of day)
    let formattedDeadline = '';
    try {
      const y = Number(newJobForm.deadline.year);
      const m = Number(newJobForm.deadline.month);
      const d = Number(newJobForm.deadline.day.padStart(2, '0'));
      const dt = new Date(y, m - 1, d, 23, 59, 59);
      if (dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d) {
        formattedDeadline = dt.toISOString();
      } else {
        alert('Please enter a valid application deadline');
        return;
      }
    } catch (e) {
      alert('Please enter a valid application deadline');
      return;
    }
    
    // Build payload according to API contract
    const payKind = (newJobForm.type === 'Part time' || newJobForm.type === 'Internship') ? 'stipend' : 'salary';

    const stipendFlag = payKind === 'stipend';

    const payload: any = {
      title: newJobForm.title,
      company: newJobForm.company,
      location: newJobForm.location,
      description: newJobForm.description,
      requirements: Array.isArray(newJobForm.requirements) ? newJobForm.requirements : typeof newJobForm.requirements === 'string' ? newJobForm.requirements.split('\n') : newJobForm.requirements,
      stipend: stipendFlag && compAvailable ? true : false,
      stipend_min: null,
      stipend_max: null,
      salary_min: null,
      salary_max: null,
      post_on: [],
      job_type: String(newJobForm.type).toLowerCase().replace(/\s+/g, '-'),
      experience: '',
      skills: [],
      deadline: formattedDeadline,
      no_of_openings: parseInt(newJobForm.openings || '0', 10)
    };

    if (compAvailable) {
      const from = Number(newJobForm.payRangeFrom) || null;
      const to = Number(newJobForm.payRangeTo) || null;
      if (payKind === 'stipend') {
        payload.stipend_min = from;
        payload.stipend_max = to;
      } else {
        payload.salary_min = from;
        payload.salary_max = to;
      }
    }

    // POST to the create-job API (server proxy will forward to API_BASE)
    (async () => {
      try {
        const body = await createJob(payload).catch((err) => {
          console.error('Failed to create job', err);
          throw err;
        });

  // Success - refresh jobs list and close modal
        try {
          const updated = await getJobs({ page: 1, page_size: 50 });
          if (updated && Array.isArray(updated.jobs)) setJobs(updated.jobs.map((j: any) => ({
            ...j,
            type: j.type ?? j.job_type ?? j.jobType ?? undefined,
            hiredDate: j.hiredDate ?? j.hired_date ?? undefined,
            status: j.status ? String(j.status).toLowerCase() : undefined,
            applications: j.applications ?? j.no_of_applications ?? j.no_of_openings ?? 0,
            logo: j.logo ?? (j.company ? String(j.company).charAt(0) : ''),
            logoType: j.logoType ?? (j.logo && typeof j.logo === 'string' && j.logo.startsWith('http') ? 'image' : 'text')
          })));
        } catch (e) {
          // ignore refresh error
        }

        alert('New job posted successfully!');
        setIsNewJobModalOpen(false);
        setNewJobModalPage(1);
      } catch (err) {
        console.error('Error posting new job', err);
        alert('Error posting new job');
      }
    })();
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
  // If API provides jobs use them; otherwise fall back to static sample data below
  // Use only API-provided jobs. recentOpenings = jobs with future deadlines or no deadline and not draft.
  const now = new Date();
  const recentOpenings = jobs.filter((j) => {
    if (j.status && String(j.status).toLowerCase() === 'draft') return false;
    if (!j.deadline) return true;
    const d = new Date(j.deadline);
    return d >= now;
  });

  // completedHires = jobs that are filled or have passed their deadline or have a hired date
  const completedHires = jobs.filter((j) => {
    if (j.status && String(j.status).toLowerCase() === 'filled') return true;
    if (j.hired_date || j.hiredDate) return true;
    if (!j.deadline) return false;
    const d = new Date(j.deadline);
    return d < now;
  });
  
  // Sample AI suggested jobs (stateful so we can delete/modify)
  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);

  // Draft jobs (status === 'draft')
  const drafts = jobs.filter((j) => String(j.status).toLowerCase() === 'draft');

  // Hoisted helper functions so they can be used by earlier functions too
  function openJobModal(job: Job) {
    // Fetch full job details from the API and populate modal fields
    (async () => {
      try {
        const body: any = await getJobById(job.id).catch(() => null);
        const jobObj = body?.job ?? body ?? job;

        setSelectedJob(jobObj);
        setEditableJobTitle(jobObj.title ?? job.title);
        // Normalize job type to UI label
        const typeLabel = jobObj.job_type ? (jobObj.job_type === 'part-time' ? 'Part time' : jobObj.job_type === 'internship' ? 'Internship' : 'Full time') : (jobObj.type || 'Full time');
        setEditableJobRole(typeLabel);

        // Populate modal fields
        setJobDescription(typeof jobObj.description === 'string' ? jobObj.description : (jobObj.description ?? ''));
        if (Array.isArray(jobObj.requirements)) {
          setJobRequirements(jobObj.requirements.join('\n'));
        } else {
          setJobRequirements(jobObj.requirements ?? '');
        }
        setOpenings(jobObj.no_of_openings ? String(jobObj.no_of_openings) : '');
        // Salary/stipend ranges
        setPayRangeFrom(jobObj.stipend_min != null ? String(jobObj.stipend_min) : jobObj.salary_min != null ? String(jobObj.salary_min) : '');
        setPayRangeTo(jobObj.stipend_max != null ? String(jobObj.stipend_max) : jobObj.salary_max != null ? String(jobObj.salary_max) : '');

        // Deadline parsing: fill applicationDeadline fields if present
        if (jobObj.deadline) {
          try {
            const d = new Date(jobObj.deadline);
            setApplicationDeadline({
              month: String(d.getMonth() + 1).padStart(2, '0'),
              day: String(d.getDate()).padStart(2, '0'),
              year: String(d.getFullYear())
            });
          } catch (e) {
            // ignore
          }
        } else {
          setApplicationDeadline({ month: '', day: '', year: '' });
        }

      } catch (e) {
        // Fallback to basic job info
        setSelectedJob(job);
        setEditableJobTitle(job.title);
        setEditableJobRole(job.type || 'Full time');
      } finally {
        setModalOpen(true);
        setModalPage(1);
      }
    })();
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedJob(null);
    setIsEditMode(false);
    setModalPage(1);
  }

  function handleDeleteJob(id: number) {
    setSuggestedJobs(prev => prev.filter(j => j.id !== id));
  }

  // No longer need handleSearch as it's moved to the Nav component
  
  return (
    <div className="relative min-h-screen overflow-auto bg-black">
      <main className="min-h-screen flex flex-col text-white">
      <div className="flex-1 overflow-auto">
        {/* Top Section Container */}
  <div className='bg-gradient-to-br from-[#0F387A]/32 to-[#126F7D]/32 rounded-b-4xl'>
        <Nav />
          {/* Company onboarding moved to landing page; removed modal from this home view. */}
          {/* Welcome section */}
          <div className="px-6 pt-10 flex items-center justify-start">
            <div className="flex items-center">
              <div className="relative h-16 w-16 mr-4">
                <div className="absolute inset-0 rounded-full bg-[#4ecdc4] flex items-center justify-center">
                  <svg className="hidden" /> {/* fallback for SSR */}
                  {/* Lucide CircleUser icon */}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user w-10 h-10 text-white">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="10" r="3" />
                      <path d="M6.8 18.7A6.7 6.7 0 0 1 12 16a6.7 6.7 0 0 1 5.2 2.7" />
                    </svg>
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <Image 
                    src={profileImage} 
                    alt="Profile" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-2xl font-medium text-white drop-shadow">{"Welcome Back, " + (recruiterProfile?.profile?.full_name ?? 'Recruiter')}</p>
              </div>
            </div>
          </div>
        
          {/* Stats cards - horizontal scrollable row */}
          <div className="px-6 py-12">
            <div className="flex overflow-x-auto scrollbar-hide pb-2 gap-4">
              {/* Active Jobs - Main KPI */}
              <div className="relative bg-gradient-to-br from-[#0F387A]/90 to-[#126F7D]/80 rounded-2xl shadow-xl p-6 flex-shrink-0 border-2 border-[#0F387A] min-w-[320px] max-w-xs flex flex-col justify-between hover:scale-[1.04] hover:shadow-2xl transition-transform duration-200 group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-white/10 p-2 rounded-full"><Briefcase className="w-6 h-6 text-blue-200" /></span>
                  <span className="text-lg font-bold text-white drop-shadow">Active Jobs</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-white drop-shadow">09</span>
                  <span className="text-green-400 flex items-center text-sm font-semibold ml-2"><ArrowUpRight className="w-4 h-4 mr-1" />+2</span>
                </div>
                <span className="text-xs text-blue-100 mt-2">2 new this week</span>
                {/* Sparkline placeholder */}
                <div className="absolute bottom-3 right-3 opacity-30"><svg width="60" height="18"><polyline points="0,15 10,10 20,12 30,7 40,9 50,4 60,8" fill="none" stroke="#fff" strokeWidth="2"/></svg></div>
              </div>
              {/* Time to Shortlist */}
              <div className="relative bg-[#12243D]/80 rounded-2xl shadow-lg p-5 flex-shrink-0 border border-[#28334a]/60 min-w-[220px] max-w-xs flex flex-col justify-between hover:scale-[1.03] hover:shadow-xl transition-transform duration-200 group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/10 p-2 rounded-full"><Timer className="w-5 h-5 text-blue-200" /></span>
                  <span className="text-base font-semibold text-white">Time to Shortlist</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">09</span>
                  <span className="text-red-400 flex items-center text-xs font-semibold ml-1"><ArrowDownRight className="w-4 h-4 mr-1" />-1</span>
                </div>
                <span className="text-xs text-blue-100 mt-1">Avg last 7 days</span>
                <div className="absolute bottom-3 right-3 opacity-20"><svg width="50" height="14"><polyline points="0,10 10,8 20,9 30,6 40,7 50,4" fill="none" stroke="#fff" strokeWidth="2"/></svg></div>
              </div>
              {/* Candidates in Pipeline */}
              <div className="relative bg-[#12243D]/80 rounded-2xl shadow-lg p-5 flex-shrink-0 border border-[#28334a]/60 min-w-[220px] max-w-xs flex flex-col justify-between hover:scale-[1.03] hover:shadow-xl transition-transform duration-200 group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/10 p-2 rounded-full"><Users className="w-5 h-5 text-blue-200" /></span>
                  <span className="text-base font-semibold text-white">Candidates in Pipeline</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">09</span>
                  <span className="text-red-400 flex items-center text-xs font-semibold ml-1"><ArrowDownRight className="w-4 h-4 mr-1" />-12%</span>
                </div>
                <span className="text-xs text-blue-100 mt-1">↓ 12% this week</span>
                <div className="absolute bottom-3 right-3 opacity-20"><svg width="50" height="14"><polyline points="0,12 10,10 20,11 30,8 40,9 50,6" fill="none" stroke="#fff" strokeWidth="2"/></svg></div>
              </div>
              {/* Offer Acceptance Rate */}
              <div className="relative bg-[#12243D]/80 rounded-2xl shadow-lg p-5 flex-shrink-0 border border-[#28334a]/60 min-w-[220px] max-w-xs flex flex-col justify-between hover:scale-[1.03] hover:shadow-xl transition-transform duration-200 group">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/10 p-2 rounded-full"><Handshake className="w-5 h-5 text-blue-200" /></span>
                  <span className="text-base font-semibold text-white">Offer Acceptance Rate</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">26%</span>
                  <span className="text-red-400 flex items-center text-xs font-semibold ml-1"><ArrowDownRight className="w-4 h-4 mr-1" />-3%</span>
                </div>
                <span className="text-xs text-blue-100 mt-1">↓ 3% this week</span>
                <div className="absolute bottom-3 right-3 opacity-20"><svg width="50" height="14"><polyline points="0,8 10,10 20,9 30,12 40,11 50,14" fill="none" stroke="#fff" strokeWidth="2"/></svg></div>
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
                className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 text-sm sm:text-sm md:text-md font-medium rounded-full transition-all border ${
                  activeTab === 'postJob' 
                    ? 'bg-[#0B283E] text-white border-[#0F387A]' 
                    : 'bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a]'
                }`}
              >
                Post New Job
              </button>
              {/* Divider */}
              <div className="mx-3 sm:mx-3 md:mx-4 h-7 sm:h-7 md:h-8 border-r border-[#28334a]/70"></div>
              {/* Scrollable container for other buttons */}
              <div className="overflow-x-auto scrollbar-hide flex space-x-3 sm:space-x-3 md:space-x-4">
                <button 
                  onClick={() => setActiveTab('recent')} 
                  className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 text-sm sm:text-sm md:text-md font-medium rounded-full transition-all border ${
                    activeTab === 'recent' 
                    ? 'bg-[#0B283E] text-white border-[#0F387A]' 
                    : 'bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a]'
                  }`}
                >
                  Recent Openings
                </button>
                <button 
                  onClick={() => setActiveTab('drafts')} 
                  className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 text-sm sm:text-sm md:text-md font-medium rounded-full transition-all border ${
                    activeTab === 'drafts' 
                    ? 'bg-[#0B283E] text-white border-[#0F387A]' 
                    : 'bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a]'
                  }`}
                >
                  Drafts
                </button>
                <button 
                  onClick={() => setActiveTab('completed')} 
                  className={`flex-shrink-0 px-4 sm:px-5 md:px-6 py-2 sm:py-2 md:py-2.5 text-sm sm:text-sm md:text-md font-medium rounded-full transition-all border ${
                    activeTab === 'completed' 
                    ? 'bg-[#0B283E] text-white border-[#0F387A]' 
                    : 'bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a]'
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
                  <h2 className="text-xl font-bold text-white">AI Suggested Jobs</h2>
                  <div className="ml-2 p-1 bg-[#0F387A]/10 rounded-full">
                    <Bot className="h-5 w-5 text-[#0F387A]" />
                  </div>
                </div>              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(suggestedJobs.length ? suggestedJobs : recentOpenings.slice(0, 6)).map(job => (
                  <div key={job.id} className="bg-[#181f2a]/90 rounded-lg shadow-sm p-4 relative transition-all border border-dashed border-[#0F387A]/30 animate-fadeIn">
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center bg-[#0F387A]/10 rounded-full px-2 py-0.5">
                        <Sparkles className="h-3 w-3 text-[#0F387A] mr-1" />
                        <span className="text-xs font-medium text-[#0F387A]">AI Suggested</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-md bg-[#0F387A]/10 flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-blue-200">{job.logo}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-white">{job.title}</h3>
                        <p className="text-xs text-blue-200">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="bg-[#0F387A]/20 text-blue-200 text-xs px-2.5 py-0.5 rounded-full">{job.type ?? 'Full time'}</span>
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
                  className="bg-[#181f2a]/90 rounded-lg shadow-sm p-4 relative transition-all border-2 border-dashed border-[#0F387A]/30 hover:border-blue-400/40 hover:shadow-md cursor-pointer flex items-center justify-center animate-fadeIn"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#0F387A]/10 flex items-center justify-center mr-3">
                      <Plus className="h-5 w-5 text-[#0F387A]" />
                    </div>
                    <p className="text-md font-medium text-white">Add New Jobs</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'recent' && (
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Job Openings</h2>
                <button className="bg-gray-100 text-gray-600 rounded-full p-2 hover:bg-gray-200 transition">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentOpenings.map(job => (
                  <div key={job.id} className="bg-[#181f2a]/90 rounded-lg shadow-sm p-4 relative transition-all hover:shadow-md cursor-pointer border border-[#28334a]/60" onClick={() => openJobModal(job)}>
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
                        <h3 className="font-medium text-white">{job.title}</h3>
                        <p className="text-xs text-blue-200">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="bg-[#0F387A]/20 text-blue-200 text-xs px-2.5 py-0.5 rounded-full">{job.type}</span>
                      <div className="flex items-center text-xs text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        <span className="text-blue-200">{job.applications} applications</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'drafts' && (
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Drafts</h2>
                <button className="bg-gray-100 text-gray-600 rounded-full p-2 hover:bg-gray-200 transition">
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500">No drafts</div>
                ) : (
                  drafts.map(job => (
                    <div key={job.id} className="bg-[#181f2a]/90 rounded-lg shadow-sm p-4 relative transition-all hover:shadow-md cursor-pointer border border-[#28334a]/60" onClick={() => openJobModal(job)}>
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
                          <h3 className="font-medium text-white">{job.title}</h3>
                          <p className="text-xs text-blue-200">{job.company} · {job.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="bg-[#0F387A]/20 text-blue-200 text-xs px-2.5 py-0.5 rounded-full">{job.type}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="h-3 w-3 mr-1" />
                          <span className="text-blue-200">{job.applications} applications</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'completed' && (
            <div className="px-6 py-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Completed Hires</h2>
                <button className="bg-gray-100 text-gray-600 rounded-full p-2 hover:bg-gray-200 transition">
                  <FileText className="h-5 w-5" />
                </button>
              </div>
            
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedHires.map(job => (
                  <div key={job.id} className="bg-[#181f2a]/90 rounded-lg shadow-sm p-4 relative transition-all hover:shadow-md cursor-pointer border border-[#28334a]/60">
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
                        <h3 className="font-medium text-white">{job.title}</h3>
                        <p className="text-xs text-blue-200">{job.company} · {job.location}</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-xs text-blue-200">Hired on {job.hiredDate}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-xs text-blue-200">{job.candidate}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={closeModal} />
          {/* Modal Content */}
          <div className="relative w-full max-w-3xl rounded-2xl p-1" aria-modal="true" role="dialog" aria-label="Job Details">
            <div className="w-full bg-[linear-gradient(rgba(67,101,113,0.08),rgba(54,73,72,0.06))] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between">
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
                        className="w-full text-xl font-bold text-white bg-[#436571]/10 border border-white/10 rounded-md px-3 py-1 mb-2 focus:outline-none focus:border-[#436571] focus:border-1"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-white">{editableJobTitle}</h2>
                    )}
                    {isEditMode ? (
                      <select
                        value={editableJobRole}
                        onChange={(e) => setEditableJobRole(e.target.value)}
                        className="text-sm text-white/80 bg-[#436571]/10 border border-white/10 rounded-md px-2 py-1 w-full focus:outline-none focus:border-[#436571] focus:border-1"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    ) : (
                      <p className="text-sm text-white/70">Role: {editableJobRole}</p>
                    )}
                  </div>
                </div>
                <button type="button" onClick={closeModal} aria-label="Close" className="text-white/90 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="border-t border-white/6" />
              {/* Page indicator - only show when we have multiple pages */}
              {modalPage > 0 && (
                <div className="flex items-center mt-2 px-4">
                  <div className={`h-1 w-6 rounded-full mr-1 ${modalPage === 1 ? 'bg-[#0F387A]' : 'bg-white/20'}`}></div>
                  <div className={`h-1 w-6 rounded-full ${modalPage === 2 ? 'bg-[#0F387A]' : 'bg-white/20'}`}></div>
                </div>
              )}
              {/* Scrollable content area */}
              <div id="modalScrollContainer" className="flex-1 overflow-y-auto px-4 py-4 flex flex-col relative scrollbar-hide">
                {modalPage === 1 ? (
                  <div className="my-auto py-6 pb-8">
                    <h3 className="text-md font-medium text-white mb-2">Job Description</h3>
                    {isEditMode ? (
                      <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full p-3 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white mb-4 focus:outline-none focus:border-[#436571] focus:border-1 h-24"
                      />
                    ) : (
                      <p className="text-sm text-white/80 mb-4">
                        {jobDescription}
                      </p>
                    )}
                    <h3 className="text-md font-medium text-white mb-2">Requirements</h3>
                    {isEditMode ? (
                      <textarea
                        value={jobRequirements}
                        onChange={(e) => setJobRequirements(e.target.value)}
                        className="w-full p-3 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white mb-6 focus:outline-none focus:border-[#436571] focus:border-1 h-24"
                      />
                    ) : (
                      <ul className="list-disc pl-5 mb-6">
                        {jobRequirements.split('\n').map((req, index) => (
                          <li key={index} className="text-sm text-white/80 mb-1">
                            {req}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <div className="my-auto py-6 pb-8">
                    <h3 className="text-md font-medium text-white mb-5">Job Details</h3>
                    {/* 2x2 Grid Layout for Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                      {/* Stipend Radio Buttons */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
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
                            <span className="ml-2 text-sm text-white/80">Yes</span>
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
                            <span className="ml-2 text-sm text-white/80">No</span>
                          </label>
                        </div>
                      </div>
                      {/* Number of Openings */}
                      <div className="space-y-2">
                        <label htmlFor="openings" className="block text-sm font-medium text-white">
                          Number of Openings
                        </label>
                        <input
                          type="number"
                          id="openings"
                          min="1"
                          placeholder="e.g., 5"
                          className="w-full p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                          value={openings}
                          onChange={(e) => setOpenings(e.target.value)}
                        />
                      </div>
                      {/* Pay Range */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Pay Range (₹)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            className="w-full p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                            placeholder="From"
                            value={payRangeFrom}
                            onChange={(e) => setPayRangeFrom(e.target.value)}
                          />
                          <span className="text-white/60">to</span>
                          <input
                            type="number"
                            className="w-full p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                            placeholder="To"
                            value={payRangeTo}
                            onChange={(e) => setPayRangeTo(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* Application Deadline */}
                      <div className="space-y-2">
                        <label htmlFor="deadline" className="block text-sm font-medium text-white">
                          Application Deadline
                        </label>
                        <div className="flex space-x-2">
                          {/* Custom Styled Month Dropdown */}
                          <div className="relative w-1/3">
                            <select 
                              className="w-full appearance-none p-2 pr-8 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
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
                            className="w-1/4 p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
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
                            className="w-1/3 p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
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
              <div className="flex justify-between space-x-3 p-5 bg-gradient-to-br from-[#436571]/20 to-[#0F387A]/10 flex-shrink-0">
                {modalPage === 1 ? (
                  <>
                    <div></div>
                    <div className="flex items-center space-x-3">
                      {isEditMode ? (
                        <>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={generateAll}
                              className={`px-4 py-2 bg-[#436571]/70 text-white rounded-3xl hover:brightness-95 transition flex items-center ${(isGeneratingJD || isGeneratingRequirements) ? 'opacity-60 cursor-wait' : ''}`}
                              disabled={isGeneratingJD || isGeneratingRequirements}
                            >
                              {(isGeneratingJD || isGeneratingRequirements) ? 'Generating…' : 'Generate'}
                            </button>
                          </div>
                          <button 
                            onClick={saveChanges}
                            className="px-5 py-2.5 border border-white/20 text-white rounded-3xl hover:bg-[#436571]/10 transition flex items-center"
                          >
                            Save Changes
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={toggleEditMode}
                          className="px-5 py-2.5 border border-white/20 text-white rounded-3xl hover:bg-[#436571]/10 transition flex items-center"
                        >
                          Make Changes
                        </button>
                      )}
                      <button 
                        onClick={goToNextPage}
                        className={`p-3 ${isEditMode ? 'bg-[#436571]/40 cursor-not-allowed' : 'bg-[#436571]/70 hover:brightness-95 cursor-pointer'} text-white rounded-3xl transition`}
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
                      className="px-5 py-2.5 border border-white/20 text-white rounded-3xl hover:bg-[#436571]/10 transition flex items-center"
                    >
                      Back
                    </button>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={postJob}
                        className="px-6 py-2.5 bg-[#436571]/70 text-white rounded-3xl hover:brightness-95 transition flex items-center"
                      >
                        {selectedJob && selectedJob.id ? 'Update Job' : 'Post Job'}
                      </button>
                      <button
                        onClick={downloadJobDetails}
                        className="p-3 bg-[#436571]/70 text-white rounded-3xl hover:brightness-95 transition flex items-center justify-center"
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
        </div>
      )}
      
      {/* New Job Modal */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={closeNewJobModal} />
          {/* Modal Content */}
          <div className="relative w-full max-w-3xl rounded-2xl p-1" aria-modal="true" role="dialog" aria-label="Add New Job">
            <div className="w-full bg-[linear-gradient(rgba(67,101,113,0.08),rgba(54,73,72,0.06))] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-[#0F387A]/10 flex items-center justify-center mr-4">
                    <Plus className="h-7 w-7 text-[#0F387A]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Add New Job</h2>
                    <p className="text-sm text-white/70">Fill in the details to create a new job posting</p>
                  </div>
                </div>
                <button type="button" onClick={closeNewJobModal} aria-label="Close" className="text-white/90 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="border-t border-white/6" />
              {/* Page indicator */}
              <div className="flex items-center mt-2 px-4">
                <div className={`h-1 w-6 rounded-full mr-1 ${newJobModalPage === 1 ? 'bg-[#0F387A]' : 'bg-white/20'}`}></div>
                <div className={`h-1 w-6 rounded-full ${newJobModalPage === 2 ? 'bg-[#0F387A]' : 'bg-white/20'}`}></div>
              </div>
              {/* Scrollable content area */}
              <div id="newJobModalScrollContainer" className="flex-1 overflow-y-auto px-4 py-4 flex flex-col relative scrollbar-hide">
                {newJobModalPage === 1 ? (
                  <div className="my-auto py-6 pb-8">
                    {/* Job Title */}
                    <div className="mb-4">
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-white mb-2">
                        Job Title*
                      </label>
                      <input
                        type="text"
                        id="jobTitle"
                        placeholder="e.g., Senior UI Developer"
                        className="w-full p-3 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                        value={newJobForm.title}
                        onChange={(e) => handleNewJobFormChange('title', e.target.value)}
                      />
                    </div>
                    {/* Company Name */}
                    <div className="mb-4">
                      <label htmlFor="company" className="block text-sm font-medium text-white mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        className="w-full p-3 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                        value={newJobForm.company}
                        onChange={(e) => handleNewJobFormChange('company', e.target.value)}
                      />
                    </div>
                    {/* Job Type and Location - 2 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Job Type */}
                      <div>
                        <label htmlFor="jobType" className="block text-sm font-medium text-white mb-2">
                          Job Type*
                        </label>
                        <Dropdown
                          value={newJobForm.type}
                          options={[
                            { value: 'Full time', label: 'Full time' },
                            { value: 'Part time', label: 'Part time' },
                            { value: 'Internship', label: 'Internship' },
                            { value: 'Contract', label: 'Contract' },
                            { value: 'Freelance', label: 'Freelance' },
                          ]}
                          onChangeAction={(v) => {
                            handleNewJobFormChange('type', v);
                            if (v === 'Internship' || v === 'Part time') {
                              handleNewJobFormChange('compensationType', 'stipend');
                            } else {
                              handleNewJobFormChange('compensationType', 'salary');
                            }
                          }}
                          placeholder="Select job type"
                          className="w-full"
                        />
                      </div>
                      {/* Job Location */}
                      <div>
                        <label htmlFor="jobLocation" className="block text-sm font-medium text-white mb-2">
                          Job Location*
                        </label>
                        <input
                          type="text"
                          id="jobLocation"
                          placeholder="e.g., Bangalore, Remote, Hybrid"
                          className="w-full p-3 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                          value={newJobForm.location}
                          onChange={(e) => handleNewJobFormChange('location', e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Job Description */}
                    <div className="mb-4">
                      <label htmlFor="jobDescription" className="block text-sm font-medium text-white mb-2">
                        Job Description*
                      </label>
                      <textarea
                        id="jobDescription"
                        rows={4}
                        placeholder="Describe the responsibilities, expectations, and details about the role..."
                        className="w-full p-3 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                        value={newJobForm.description}
                        onChange={(e) => handleNewJobFormChange('description', e.target.value)}
                      />
                    </div>
                    {/* Requirements */}
                    <div className="mb-4">
                      <label htmlFor="requirements" className="block text-sm font-medium text-white mb-2">
                        Requirements*
                      </label>
                      <textarea
                        id="requirements"
                        rows={4}
                        placeholder="List the skills, qualifications, and experience required..."
                        className="w-full p-3 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                        value={newJobForm.requirements}
                        onChange={(e) => handleNewJobFormChange('requirements', e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="my-auto py-6 pb-8">
                    <h3 className="text-md font-medium text-white mb-5">Job Details</h3>
                    {/* 2x2 Grid Layout for Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                      {/* Compensation Type */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
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
                            <span className="ml-2 text-sm text-white/80">Yes</span>
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
                            <span className="ml-2 text-sm text-white/80">No</span>
                          </label>
                        </div>
                      </div>
                      {/* Number of Openings */}
                      <div className="space-y-2">
                        <label htmlFor="openings" className="block text-sm font-medium text-white">
                          Number of Openings*
                        </label>
                        <input
                          type="number"
                          id="openings"
                          min="1"
                          placeholder="e.g., 5"
                          className="w-full p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
                          value={newJobForm.openings}
                          onChange={(e) => handleNewJobFormChange('openings', e.target.value)}
                        />
                      </div>
                      {/* Pay Range */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-white">
                          Pay Range (₹)*
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            className={`w-full p-2 rounded-md text-sm transition-all duration-300 ${newJobForm.compensationType === 'no' ? 'bg-gray-100 border border-gray-200 text-gray-400' : 'bg-[#436571]/10 border border-white/10 text-white focus:outline-none focus:border-[#436571] focus:border-1'}`}
                            placeholder="From"
                            value={newJobForm.payRangeFrom}
                            onChange={(e) => handleNewJobFormChange('payRangeFrom', e.target.value)}
                            disabled={newJobForm.compensationType === 'no'}
                          />
                          <span className="text-white/60">to</span>
                          <input
                            type="number"
                            className={`w-full p-2 rounded-md text-sm transition-all duration-300 ${newJobForm.compensationType === 'no' ? 'bg-gray-100 border border-gray-200 text-gray-400' : 'bg-[#436571]/10 border border-white/10 text-white focus:outline-none focus:border-[#436571] focus:border-1'}`}
                            placeholder="To"
                            value={newJobForm.payRangeTo}
                            onChange={(e) => handleNewJobFormChange('payRangeTo', e.target.value)}
                            disabled={newJobForm.compensationType === 'no'}
                          />
                        </div>
                      </div>
                      {/* Application Deadline */}
                      <div className="space-y-2">
                        <label htmlFor="deadline" className="block text-sm font-medium text-white">
                          Application Deadline*
                        </label>
                        <div className="flex space-x-2">
                          <Dropdown
                            value={newJobForm.deadline.month}
                            options={[
                              { value: '', label: 'Month' },
                              { value: '01', label: 'Jan' },
                              { value: '02', label: 'Feb' },
                              { value: '03', label: 'Mar' },
                              { value: '04', label: 'Apr' },
                              { value: '05', label: 'May' },
                              { value: '06', label: 'Jun' },
                              { value: '07', label: 'Jul' },
                              { value: '08', label: 'Aug' },
                              { value: '09', label: 'Sep' },
                              { value: '10', label: 'Oct' },
                              { value: '11', label: 'Nov' },
                              { value: '12', label: 'Dec' },
                            ]}
                            onChangeAction={(v) => handleNewJobFormChange('deadline.month', v)}
                            placeholder="Month"
                            className="w-1/3"
                          />
                          <input
                            type="text"
                            placeholder="DD"
                            className="w-1/4 p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
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
                            className="w-1/3 p-2 bg-[#436571]/10 border border-white/10 rounded-md text-sm text-white focus:outline-none focus:border-[#436571] focus:border-1"
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
              <div className="flex justify-between space-x-3 p-5 bg-gradient-to-br from-[#436571]/20 to-[#0F387A]/10 flex-shrink-0">
                {newJobModalPage === 1 ? (
                  <>
                    <button 
                      onClick={closeNewJobModal}
                      className="px-5 py-2.5 border border-white/20 text-white rounded-3xl hover:bg-[#436571]/10 transition flex items-center"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={goToNextNewJobPage}
                      className="px-6 py-2.5 bg-[#436571]/70 text-white rounded-3xl hover:brightness-95 transition flex items-center"
                    >
                      Next
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setNewJobModalPage(1)}
                      className="px-5 py-2.5 border border-white/20 text-white rounded-3xl hover:bg-[#436571]/10 transition flex items-center"
                    >
                      Back
                    </button>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={postNewJob}
                        className="px-6 py-2.5 bg-[#436571]/70 text-white rounded-3xl hover:brightness-95 transition flex items-center"
                      >
                        Post Job
                      </button>
                      <button
                        onClick={downloadJobJD}
                        className="p-3 bg-[#436571]/70 text-white rounded-3xl hover:brightness-95 transition flex items-center justify-center"
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
        </div>
      )}
      </main>
    </div>
  );
}
