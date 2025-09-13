"use client";

import React from "react";
import { Briefcase, MapPin, CalendarDays, Download } from "lucide-react";
import Link from "next/link";
import Nav from "../components/Nav";

const openings = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Bangalore",
    posted: "2 days ago",
    type: "Full-time",
    candidates: 23,
    jdUrl: "#",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "CloudSync",
    location: "Remote",
    posted: "5 days ago",
    type: "Contract",
    candidates: 12,
    jdUrl: "#",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Designify",
    location: "Hyderabad",
    posted: "1 day ago",
    type: "Full-time",
    candidates: 31,
    jdUrl: "#",
  },
];

export default function OpeningsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-[#0F387A]/25 to-[#126F7D]/25 w-full h-[100vh]">
        <Nav  />
        <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1c2e4a] mb-6">Current Job Openings</h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {openings.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col space-y-3 border border-[#0F387A]/10 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div className="flex items-center justify-between flex-wrap gap-2 relative">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-[#1c2e4a]">{job.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-500">{job.company}</p>
                  </div>
                  <span className="absolute top-0 right-0 text-xs sm:text-sm text-gray-400 font-semibold mt-2 mr-2 select-none">{job.type}</span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 sm:space-x-4">
                    <span className="flex items-center gap-1"><MapPin className="inline h-4 w-4" />{job.location}</span>
                    <span className="flex items-center gap-1"><CalendarDays className="inline h-4 w-4" />{job.posted}</span>
                  </div>
                  <div className="flex items-center justify-between ml-1">
                    <span className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                      Number of Candidates: <span className="font-semibold text-[#126F7D] ml-1">{job.candidates}</span>
                    </span>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Link href={job.jdUrl} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#0F387A] text-white rounded-full text-xs sm:text-sm font-medium hover:bg-[#0F387A]/90 transition">
                        View JD
                      </Link>
                      <a
                        href={job.jdUrl}
                        download
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#0F387A]/10 hover:bg-[#0F387A]/20 transition shadow border border-[#0F387A]/20"
                        title="Download JD"
                      >
                        <Download className="h-4 w-4 sm:h-5 sm:w-5 text-[#0F387A]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
