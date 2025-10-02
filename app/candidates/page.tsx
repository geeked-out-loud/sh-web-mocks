"use client";

import React, { useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { User, Briefcase, Mail, Download, Funnel, X, ChevronUp, ChevronDown } from "lucide-react";
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
		<main className="min-h-screen bg-black text-white">
			<div className="bg-gradient-to-br from-[#0F387A]/18 to-[#126F7D]/18 w-full min-h-screen">
        <Nav />
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">Candidate Profiles</h1>
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
              <div className="fixed top-0 right-0 h-screen w-full sm:w-[400px] bg-[linear-gradient(rgba(67,101,113,0.08),rgba(54,73,72,0.06))] backdrop-blur-2xl shadow-2xl z-50 border-l border-white/10 flex flex-col transition-transform duration-300 text-white"
                style={{ transform: showFilterMenu ? 'translateX(0)' : 'translateX(100%)', pointerEvents: showFilterMenu ? 'auto' : 'none', opacity: showFilterMenu ? 1 : 0 }}>
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                  <h2 className="text-lg font-semibold text-white">Filtering Options</h2>
                  <button
                    className="text-white hover:text-[#0F387A] p-1 rounded-full"
                    onClick={() => setShowFilterMenu(false)}
                    aria-label="Close filter menu"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="w-full absolute bottom-0 left-0 bg-transparent px-5 py-5 border-t border-white/10 flex justify-center">
                  <button
                    className="w-full max-w-sm py-3 bg-gradient-to-br from-[#0F387A]/25 to-[#126F7D]/25 text-white rounded-full text-base font-semibold transition shadow-lg"
                    onClick={() => {
                      // Placeholder for filter logic
                      setShowFilterMenu(false);
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                  {/* ATS Score Range Selector */}
                  <div className="mb-6">
                    <div className="font-semibold text-white mb-2">ATS Score Range</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base text-white">{ratingRange[0]}</span>
                      <span className="text-base text-white">{ratingRange[1]}</span>
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
                      className={`w-full flex justify-between items-center py-3 px-3 rounded-lg text-base font-medium bg-transparent hover:bg-[#0F387A]/10 transition text-white ${accordionOpen.status ? 'rounded-none border-b border-white/10' : ''}`}
                      onClick={() => handleAccordion('status')}
                    >
                      Application Status
                      {accordionOpen.status ? (
                        <ChevronUp className="h-5 w-5 text-white" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white" />
                      )}
                    </button>
                    {accordionOpen.status && (
                      <div className="pl-3 py-3 flex flex-col gap-3">
                        {statusFilters.map(option => (
                          <label key={option} className="flex items-center gap-3 text-base text-white">
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
                      className={`w-full flex justify-between items-center py-3 px-3 rounded-lg text-base font-medium bg-transparent hover:bg-[#0F387A]/10 transition text-white ${accordionOpen.application ? 'rounded-none border-b border-white/10' : ''}`}
                      onClick={() => handleAccordion('application')}
                    >
                      Application Stage
                      {accordionOpen.application ? (
                        <ChevronUp className="h-5 w-5 text-white" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white" />
                      )}
                    </button>
                    {accordionOpen.application && (
                      <div className="pl-3 py-3 flex flex-col gap-3">
                        {applicationFilters.map(option => (
                          <label key={option} className="flex items-center gap-3 text-base text-white">
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
            {candidates.map((candidate) => {
              // Skills display logic: max 4, show '+N more' if overflow
              const maxSkills = 4;
              const shownSkills = candidate.skills.slice(0, maxSkills);
              const extraSkills = candidate.skills.length - maxSkills;
              return (
                <Link
                  key={candidate.id}
                  href={`/candidates/${candidate.id}`}
                  className="bg-[linear-gradient(rgba(67,101,113,0.08),rgba(54,73,72,0.06))] backdrop-blur-xl rounded-xl shadow p-4 sm:p-6 flex flex-col border border-white/10 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl group cursor-pointer"
                >
                  {/* Top: Avatar, Name/Role (left), Score (right) */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#0F387A]/10 flex items-center justify-center">
                        <User className="h-7 w-7 text-[#0F387A]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-semibold text-white leading-tight">{candidate.name}</span>
                        <span className="text-xs sm:text-sm text-blue-200 leading-tight">{candidate.role}</span>
                      </div>
                    </div>
                    <span className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] shadow text-right self-center">
                      {candidate.atsScore}
                    </span>
                  </div>
                  {/* Middle: Experience + Location row, then Skills row */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center px-2 py-1 rounded-full bg-[#232b3a]/70 text-blue-100 border border-white/10 text-xs sm:text-sm">
                      <Briefcase className="inline h-4 w-4 mr-1 text-blue-200" />{candidate.experience}
                    </span>
                    <span className="flex items-center px-2 py-1 rounded-full bg-[#232b3a]/70 text-blue-100 border border-white/10 text-xs sm:text-sm">
                      <svg className="inline h-4 w-4 mr-1 text-blue-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
                      {candidate.location}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {shownSkills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gradient-to-r from-[#0F387A]/30 to-[#126F7D]/30 text-blue-100 rounded-full text-xs font-medium border border-white/10">
                        {skill}
                      </span>
                    ))}
                    {extraSkills > 0 && (
                      <span className="px-3 py-1 bg-[#232b3a]/70 text-blue-100 rounded-full text-xs font-medium border border-white/10">+{extraSkills} more</span>
                    )}
                  </div>
                  {/* Bottom: Email (own line, muted, icon), then Actions row */}
                  <div className="flex items-center mb-2">
                    <span
                      className="flex items-center text-blue-200/80 hover:underline text-xs sm:text-sm cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        window.location.href = `mailto:${candidate.email}`;
                      }}
                    >
                      <Mail className="h-4 w-4 mr-1 text-blue-200/80" />
                      {candidate.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <span className="flex-1 flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all border bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a] cursor-pointer">
                      View Profile
                    </span>
                    <button
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0F387A]/10 hover:bg-[#0F387A]/20 transition shadow border border-white/10"
                      title="Download Resume"
                      onClick={e => e.stopPropagation()}
                    >
                      <Download className="h-5 w-5 text-[#0F387A]" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
