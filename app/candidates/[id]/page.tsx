"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { User, Briefcase, Mail, SearchCode, Github, Linkedin } from "lucide-react";
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
		bio: "Priya is a highly skilled and passionate frontend developer who excels at creating visually stunning, user-friendly, and high-performance web applications. With a strong foundation in modern frontend technologies such as HTML5, CSS3, JavaScript, and frameworks like React, Vue.js, and Angular, she brings both technical expertise and creative vision to every project she undertakes.",
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
				 <div className="max-w-7xl mx-auto px-8 py-8">
					 {/* Header: Two-column layout */}
					 <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-8 w-full">
						 {/* Left: Avatar, Name, Role, Quick tags */}
						 <div className="flex items-center gap-6 flex-1 min-w-0">
							 <div className="w-24 h-24 rounded-full bg-[linear-gradient(rgba(67,101,113,0.13),rgba(54,73,72,0.09))] backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10">
								 <User className="h-16 w-16 text-[#0F387A]" />
							 </div>
							 <div className="flex flex-col min-w-0">
								 <h2 className="text-3xl font-bold text-white truncate leading-tight">
									 {candidate.name}
								 </h2>
								 <p className="text-base text-blue-200 mt-1 truncate">
									 {candidate.role}
								 </p>
								 <div className="flex gap-2 mt-2">
									 <span className="flex items-center px-3 py-1 text-xs font-medium rounded-full border bg-[#0B283E]/40 text-blue-200 border-[#28334a]">
										 <Briefcase className="inline h-4 w-4 mr-1" />
										 {candidate.experience}
									 </span>
									 <span className="flex items-center px-3 py-1 text-xs font-medium rounded-full border bg-[#0B283E]/40 text-blue-200 border-[#28334a]">
										 {candidate.location}
									 </span>
								 </div>
							 </div>
						 </div>
						 {/* Right: Action Buttons */}
						 <div className="flex flex-col gap-3 md:items-end">
							 <button
								 className="flex-shrink-0 px-6 py-2 text-base font-semibold rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] hover:brightness-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F387A]/60"
							 >
								 View Resume
							 </button>
							 <button
								 className="flex-shrink-0 px-6 py-2 text-base font-semibold rounded-full transition-all border bg-[#0B283E]/40 text-blue-200 border-[#28334a] hover:bg-[#232b3a] focus:outline-none flex items-center"
							 >
								 <SearchCode className="h-5 w-5 text-[#0F387A] mr-2" />
								 <span>Analyse Resume</span>
							 </button>
						 </div>
					 </section>

					 {/* About / Summary */}
					 <section className="mb-8">
						 <h3 className="font-semibold text-white mb-2 text-lg tracking-wide">About</h3>
						 <div className="text-white/90 text-base leading-relaxed rounded-xl px-2 py-4">
							 {candidate.bio}
						 </div>
					 </section>

					 {/* Experience & Location (row of chips) */}
					 <section className="mb-8">
						 <h3 className="font-semibold text-white mb-2 text-lg tracking-wide">Experience & Location</h3>
						 <div className="flex gap-4 flex-wrap">
							 <span className="flex items-center px-4 py-2 text-sm font-medium rounded-full border bg-[#0B283E]/40 text-blue-200 border-[#28334a]">
								 <Briefcase className="inline h-5 w-5 mr-1" />
								 {candidate.experience}
							 </span>
							 <span className="flex items-center px-4 py-2 text-sm font-medium rounded-full border bg-[#0B283E]/40 text-blue-200 border-[#28334a]">
								 {candidate.location}
							 </span>
						 </div>
					 </section>

					 {/* Skills Section (top 3 highlighted, expandable) */}
					 <section className="mb-8">
						 <h3 className="font-semibold text-white mb-2 text-lg tracking-wide">Skills</h3>
						 <SkillsList skills={candidate.skills} />
					 </section>

					 {/* Contact Info */}
					 <section className="mb-8">
						 <h3 className="font-semibold text-white mb-2 text-lg tracking-wide">Contact Info</h3>
						 <div className="flex flex-row gap-3">
							 <a
								 href={`mailto:${candidate.email}`}
								 className="flex items-center flex-shrink-0 px-6 py-2 text-base font-medium rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] hover:brightness-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F387A]/60"
							 >
								 <Mail className="h-5 w-5 mr-2 text-white/90" />
								 <span>{candidate.email}</span>
							 </a>
							 							 <a
								 href={`mailto:${candidate.email}`}
								 className="flex items-center flex-shrink-0 px-6 py-2 text-base font-medium rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] hover:brightness-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F387A]/60"
							 >
								 <Linkedin className="h-5 w-5 mr-2 text-white/90" />
								 <span>LinkedIn</span>
							 </a>
							 							 <a
								 href={`mailto:${candidate.email}`}
								 className="flex items-center flex-shrink-0 px-6 py-2 text-base font-medium rounded-full transition-all border bg-[#0B283E] text-white border-[#0F387A] hover:brightness-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#0F387A]/60"
							 >
								 <Github className="h-5 w-5 mr-2 text-white/90" />
								 <span>GitHub</span>
							 </a>
							 {/* Add LinkedIn/GitHub if available in real data */}
						 </div>
					 </section>
				 </div>
			 </div>
		 </main>
	 );
// SkillsList component: highlights top 3, expandable for more
function SkillsList({ skills }: { skills: string[] }) {
	const [expanded, setExpanded] = React.useState(false);
	if (!skills || skills.length === 0) return null;
	const topSkills = skills.slice(0, 3);
	const moreSkills = skills.slice(3);
	return (
		<div>
			<div className="flex flex-wrap gap-2 mb-2">
				{topSkills.map((skill, idx) => (
					<span
						key={idx}
						className="flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full border bg-gradient-to-r from-[#0F387A]/80 to-[#126F7D]/80 text-white border-[#28334a] shadow-md"
					>
						{skill}
					</span>
				))}
				{expanded && moreSkills.map((skill, idx) => (
					<span
						key={idx}
						className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full border bg-[#0B283E]/40 text-blue-200 border-[#28334a]"
					>
						{skill}
					</span>
				))}
			</div>
			{moreSkills.length > 0 && (
				<button
					className="text-xs text-blue-300 underline hover:text-blue-100 focus:outline-none"
					onClick={() => setExpanded((e) => !e)}
				>
					{expanded ? 'Show less' : `+${moreSkills.length} more`}
				</button>
			)}
		</div>
	);
}
};

export default CandidatePage;