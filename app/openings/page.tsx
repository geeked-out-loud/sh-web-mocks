"use client";

import React from "react";
import { MapPin, CalendarDays, Download } from "lucide-react";
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
		<main className="min-h-screen bg-black text-white">
			<div className="bg-gradient-to-br from-[#0F387A]/18 to-[#126F7D]/18 w-full min-h-screen">
				<Nav />
				<div className="max-w-7xl mx-auto px-4 py-4">
					<h1 className="text-2xl sm:text-3xl font-bold text-white mb-6 drop-shadow">
						Current Job Openings
					</h1>
										<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
											{openings.map((job) => (
												<div
													key={job.id}
													className="bg-[linear-gradient(rgba(67,101,113,0.08),rgba(54,73,72,0.06))] backdrop-blur-xl rounded-xl shadow p-4 sm:p-6 flex flex-col border border-white/10 relative transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl group"
												>
													{/* Top: Title/Company (left), Type badge (right) */}
													<div className="flex items-center justify-between mb-3">
														<div className="flex flex-col">
															<span className="text-base sm:text-lg font-semibold text-white leading-tight">{job.title}</span>
															<span className="text-xs sm:text-sm text-blue-200 leading-tight">{job.company}</span>
														</div>
														<span className="flex-shrink-0 px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] shadow text-right self-center">
															{job.type}
														</span>
													</div>
													{/* Middle: Location + Posted row, then Candidates pill */}
													<div className="flex items-center gap-3 mb-2">
														<span className="flex items-center px-2 py-1 rounded-full bg-[#232b3a]/70 text-blue-100 border border-white/10 text-xs sm:text-sm">
															<MapPin className="inline h-4 w-4 mr-1 text-blue-200" />{job.location}
														</span>
														<span className="flex items-center px-2 py-1 rounded-full bg-[#232b3a]/70 text-blue-100 border border-white/10 text-xs sm:text-sm">
															<CalendarDays className="inline h-4 w-4 mr-1 text-blue-200" />{job.posted}
														</span>
													</div>
													<div className="flex flex-wrap gap-2 mb-3">
														<span className="px-3 py-1 bg-gradient-to-r from-[#0F387A]/30 to-[#126F7D]/30 text-blue-100 rounded-full text-xs font-medium border border-white/10">
															{job.candidates} Candidates
														</span>
													</div>
													{/* Bottom: Actions row */}
													<div className="flex items-center gap-3 mt-auto">
														<Link
															href={job.jdUrl}
															className="flex-1 flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all border bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a] cursor-pointer"
														>
															View JD
														</Link>
														<a
															href={job.jdUrl}
															download
															className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0F387A]/10 hover:bg-[#0F387A]/20 transition shadow border border-white/10"
															title="Download JD"
														>
															<Download className="h-5 w-5 text-[#0F387A]" />
														</a>
													</div>
												</div>
											))}
										</div>
				</div>
			</div>
		</main>
	);
}
