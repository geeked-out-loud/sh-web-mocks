"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, Mail, SearchCode } from "lucide-react";
import Nav from "../../components/Nav";

// Dummy candidate data (should be replaced with real data source or API)
const candidates = [
	{
		id: 1,
		name: "Priya Sharma",
		role: "Frontend Development Role",
		appliedFor: "Frontend Development Role",
		dateOfApplication: "5 Sept 2025",
		experience: "Fresher",
		resumeStrength: "Strong",
		interviewStatus: "Pending",
		assessmentScore: 95,
		location: "Bangalore",
		skills: ["React", "TypeScript", "CSS"],
		email: "priya.sharma@email.com",
		atsScore: 92,
		bio: "Priya is a passionate frontend developer with a knack for building beautiful and performant web apps.",
	},
	{
		id: 2,
		name: "Amit Verma",
		role: "Backend Development Role",
		appliedFor: "Backend Development Role",
		dateOfApplication: "2 Sept 2025",
		experience: "5 years",
		resumeStrength: "Excellent",
		interviewStatus: "Scheduled",
		assessmentScore: 87,
		location: "Remote",
		skills: ["Node.js", "Express", "MongoDB"],
		email: "amit.verma@email.com",
		atsScore: 87,
		bio: "Amit specializes in scalable backend systems and API design.",
	},
	{
		id: 3,
		name: "Sara Khan",
		role: "UI/UX Design Role",
		appliedFor: "UI/UX Design Role",
		dateOfApplication: "1 Sept 2025",
		experience: "2 years",
		resumeStrength: "Strong",
		interviewStatus: "Pending",
		assessmentScore: 95,
		location: "Hyderabad",
		skills: ["Figma", "Sketch", "User Research"],
		email: "sara.khan@email.com",
		atsScore: 95,
		bio: "Sara creates intuitive user experiences and beautiful interfaces.",
	},
];


const CandidatePage = ({ params }: { params: Promise<{ id: string }> }) => {
	const router = useRouter();
	// Next.js 15: params is a Promise, unwrap with React.use()
	const { id } = React.use(params) as { id: string };
	const candidateId = Number(id);
	const candidate = candidates.find((c) => c.id === candidateId);

	 if (!candidate) {
		 return (
			 <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
				 <div className="text-center">
					 <h1 className="text-2xl font-bold text-[#0F387A] mb-2">
						 Candidate Not Found
					 </h1>
					 <button
						 className="mt-4 px-6 py-2.5 bg-gradient-to-r from-[#436571]/80 via-[#0F387A]/90 to-[#126F7D]/80 text-white rounded-3xl font-semibold shadow-lg border border-white/10 hover:brightness-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F387A]/60 transition"
						 onClick={() => router.push("/candidates")}
					 >
						 Back to Candidates
					 </button>
				 </div>
			 </main>
		 );
	 }

	 return (
		 <main className="min-h-screen bg-black text-white">
			 <div className="bg-gradient-to-br from-[#0F387A]/18 to-[#126F7D]/18 w-full min-h-screen">
				 <Nav />
				 <div className="max-w-7xl mx-auto px-8 py-2">
					 <div className="flex flex-col w-full">
						 <div
							 className="flex items-center gap-8 mb-6"
							 style={{ minHeight: "6.5rem" }}
						 >
							 <div className="w-20 h-20 rounded-full bg-[linear-gradient(rgba(67,101,113,0.13),rgba(54,73,72,0.09))] backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
								 <User className="h-14 w-14 text-[#0F387A]" />
							 </div>
							 <div className="flex flex-col justify-center h-full">
								 <h2 className="text-3xl font-bold text-white leading-tight">
									 {candidate.name}
								 </h2>
								 <p className="text-base text-blue-200 mt-1">
									 {candidate.role}
								 </p>
							 </div>
							 <div className="flex gap-2 ml-auto">
								 <button
									 className="flex-shrink-0 px-6 py-1.5 text-lg font-medium rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] hover:brightness-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F387A]/60"
								 >
									 View Resume
								 </button>
								 <button
									 className="flex-shrink-0 px-6 py-1.5 text-lg font-medium rounded-full transition-all border bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a] focus:outline-none flex items-center"
								 >
									 <SearchCode className="h-5 w-5 text-[#0F387A] mr-2" />
									 <span>Analyse Resume</span>
								 </button>
							 </div>
						 </div>

						 {/* Bio, Experience, Location, Skills, Email */}
						 <div className="mb-3 text-white/90 text-lg">{candidate.bio}</div>
						 <div className="flex items-center gap-6 mb-6 text-base text-blue-200">
							 <span className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all border bg-[#0B283E]/40 text-blue-200 border-[#28334a]">
								 <Briefcase className="inline h-5 w-5 mr-1" />
								 {candidate.experience}
							 </span>
							 <span className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all border bg-[#0B283E]/40 text-blue-200 border-[#28334a]">{candidate.location}</span>
						 </div>
						 <div className="mb-6">
							 <h3 className="font-semibold text-white mb-2">Skills</h3>
							 <div className="flex flex-wrap gap-2">
								 {candidate.skills.map((skill, idx) => (
									 <span
										 key={idx}
										 className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-all border bg-[#0B283E]/40 text-blue-200 border-[#28334a]"
									 >
										 {skill}
									 </span>
								 ))}
							 </div>
						 </div>
						 <div className="flex items-center gap-3 mt-4">
							<a
								href={`mailto:${candidate.email}`}
								className="flex items-center flex-shrink-0 px-6 py-1.5 text-lg font-medium rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] hover:brightness-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F387A]/60"
							>
								<Mail className="h-5 w-5 mr-2 text-white/90" />
								<span>{candidate.email}</span>
							</a>
						 </div>
					 </div>
				 </div>
			 </div>
		 </main>
	 );
};

export default CandidatePage;