"use client";

import React, { useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { User, Search, Star, Briefcase, Mail, Download, Funnel, X, ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import Nav from "../components/Nav";    

const candidates = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Frontend Development Role",
    location: "Bangalore",
    experience: "3 years",
    skills: ["React", "TypeScript", "CSS"],
    email: "priya.sharma@email.com",
    atsScore: 92,
  },
  {
    id: 2,
    name: "Amit Verma",
    role: "Backend Development Role",
    location: "Remote",
    experience: "5 years",
    skills: ["Node.js", "Express", "MongoDB"],
    email: "amit.verma@email.com",
    atsScore: 87,
  },
  {
    id: 3,
    name: "Sara Khan",
    role: "UI/UX Design Role",
    location: "Hyderabad",
    experience: "2 years",
    skills: ["Figma", "Sketch", "User Research"],
    email: "sara.khan@email.com",
    atsScore: 95,
  },
];

export default function CandidatesPage() {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState<{ status: boolean; application: boolean }>({ status: false, application: false });
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [applicationOptions, setApplicationOptions] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 100]);

  const statusFilters = ["Shortlisted", "New", "Hired", "Rejected", "Under Review"];
  const applicationFilters = ["Pending", "Sent", "Completed", "Rejected"];

  const handleAccordion = (key: 'status' | 'application') => {
    setAccordionOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStatusChange = (option: string) => {
    setStatusOptions(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };
  const handleApplicationChange = (option: string) => {
    setApplicationOptions(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#0F387A]/25 to-[#126F7D]/25 w-full h-[100vh]">
        <Nav  />
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2e4a]">Candidate Profiles</h1>
            <button
              className="px-4 py-2 bg-[#0F387A]/10 text-[#0F387A] rounded-full text-sm font-medium hover:bg-[#0F387A]/20 transition flex items-center gap-2"
              onClick={() => setShowFilterMenu((v) => !v)}
            >
              <Funnel className="h-4 w-4" />
              Filter
            </button>
          </div>
          {/* Right Side Slider Filter Menu */}
          <div className="relative">
          {showFilterMenu && (
            <div className="fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-white shadow-2xl z-50 border-l border-[#0F387A]/10 flex flex-col transition-transform duration-300"
              style={{ transform: showFilterMenu ? 'translateX(0)' : 'translateX(100%)', pointerEvents: showFilterMenu ? 'auto' : 'none', opacity: showFilterMenu ? 1 : 0 }}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-[#1c2e4a]">Filtering Options</h2>
                  <button
                    className="text-[#1c2e4a] hover:text-[#0F387A] p-1 rounded-full"
                    onClick={() => setShowFilterMenu(false)}
                    aria-label="Close filter menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="w-full absolute bottom-0 left-0 bg-transparent px-5 py-5 border-t border-gray-200 flex justify-center">
                  <button
                    className="w-full max-w-sm py-3 bg-gradient-to-br from-[#0F387A]/25 to-[#126F7D]/25 text-[#264B87] rounded-full text-base font-semibold transition shadow-lg"
                    onClick={() => {
                      // Placeholder for filter logic
                      setShowFilterMenu(false);
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {/* ATS Score Range Selector */}
                  <div className="mb-6">
                    <div className="font-semibold text-[#1c2e4a] mb-2">ATS Score Range</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base text-[#1c2e4a]">{ratingRange[0]}</span>
                      <span className="text-base text-[#1c2e4a]">{ratingRange[1]}</span>
                    </div>
                    <div className="w-full px-2">
                      <Slider
                        range
                        min={0}
                        max={100}
                        value={ratingRange}
                        onChange={val => {
                          if (Array.isArray(val) && val.length === 2) {
                            setRatingRange([val[0], val[1]]);
                          }
                        }}
                        allowCross={false}
                        className="ats-slider"
                      />
                    </div>
                  </div>
                  {/* Accordion: Application Status */}
                  <div className="mb-4">
                    <button
                      className={`w-full flex justify-between items-center py-3 px-3 rounded-lg text-base font-medium bg-transparent hover:bg-[#0F387A]/3 transition text-[#1c2e4a] ${accordionOpen.status ? 'rounded-none border-b border-[#0F387A]/30' : ''}`}
                      onClick={() => handleAccordion('status')}
                    >
                      Application Status
                      {accordionOpen.status ? (
                        <ChevronUp className="h-5 w-5 text-[#1c2e4a]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#1c2e4a]" />
                      )}
                    </button>
                    {accordionOpen.status && (
                      <div className="pl-3 py-3 flex flex-col gap-3">
                        {statusFilters.map(option => (
                          <label key={option} className="flex items-center gap-3 text-base text-[#1c2e4a]">
                            <input
                              type="checkbox"
                              checked={statusOptions.includes(option)}
                              onChange={() => handleStatusChange(option)}
                              className="accent-[#0F387A] h-5 w-5 rounded"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Accordion: Application Stage */}
                  <div className="mb-4">
                    <button
                      className={`w-full flex justify-between items-center py-3 px-3 rounded-lg text-base font-medium bg-transparent hover:bg-[#0F387A]/3 transition text-[#1c2e4a] ${accordionOpen.application ? 'rounded-none border-b border-[#0F387A]/30' : ''}`}
                      onClick={() => handleAccordion('application')}
                    >
                      Application Stage
                      {accordionOpen.application ? (
                        <ChevronUp className="h-5 w-5 text-[#1c2e4a]" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-[#1c2e4a]" />
                      )}
                    </button>
                    {accordionOpen.application && (
                      <div className="pl-3 py-3 flex flex-col gap-3">
                        {applicationFilters.map(option => (
                          <label key={option} className="flex items-center gap-3 text-base text-[#1c2e4a]">
                            <input
                              type="checkbox"
                              checked={applicationOptions.includes(option)}
                              onChange={() => handleApplicationChange(option)}
                              className="accent-[#0F387A] h-5 w-5 rounded"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {candidates.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/candidates/${candidate.id}`}
              className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col space-y-3 border border-[#0F387A]/10 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
            >
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <span className="bg-[#0F387A] text-white text-xs sm:text-sm font-bold px-2 py-1 sm:p-1.5 rounded-full shadow">{candidate.atsScore}</span>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0F387A]/10 flex items-center justify-center">
                    <User className="h-6 w-6 sm:h-7 sm:w-7 text-[#0F387A]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#1c2e4a]">{candidate.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-500">{candidate.role}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 sm:space-x-4">
                <span><Briefcase className="inline h-4 w-4 mr-1" />{candidate.experience}</span>
                <span>{candidate.location}</span>
              </div>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                {candidate.skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-1 sm:px-3 sm:py-1 bg-[#0F387A]/10 text-[#0F387A] rounded-full text-[10px] sm:text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 sm:mt-4 flex-wrap gap-2">
                <span
                  className="flex items-center text-[#0F387A] hover:underline text-xs sm:text-sm cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    window.location.href = `mailto:${candidate.email}`;
                  }}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  {candidate.email}
                </span>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0F387A] text-white rounded-full text-xs sm:text-sm font-medium hover:bg-[#0F387A]/90 transition">
                    View Profile
                  </span>
                  <button
                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#0F387A]/10 hover:bg-[#0F387A]/20 transition shadow border border-[#0F387A]/20"
                    title="Download Resume"
                    onClick={e => e.stopPropagation()}
                  >
                    <Download className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F387A]" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </main>
  );
}
