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
			<main className="min-h-screen flex flex-col items-center justify-center bg-white">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-[#0F387A] mb-2">
						Candidate Not Found
					</h1>
					<button
						className="mt-4 px-4 py-2 bg-[#0F387A] text-white rounded-full"
						onClick={() => router.push("/candidates")}
					>
						Back to Candidates
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen bg-white">
			<div className="bg-gradient-to-br from-[#0F387A]/25 to-[#126F7D]/25 w-full min-h-screen">
				<Nav />
				<div className="max-w-7xl mx-auto px-8 py-2">
					<div className="flex flex-col w-full">
						<div
							className="flex items-center gap-8 mb-6"
							style={{ minHeight: "6.5rem" }}
						>
							<div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0F387A]/20 to-[#126F7D]/20 flex items-center justify-center shadow-lg">
								<User className="h-14 w-14 text-[#0F387A]" />
							</div>
							<div className="flex flex-col justify-center h-full">
								<h2 className="text-3xl font-bold text-[#1c2e4a] leading-tight">
									{candidate.name}
								</h2>
								<p className="text-base text-gray-500 mt-1">
									{candidate.role}
								</p>
							</div>
							<div className="flex gap-2 ml-auto">
								<button className="px-5 py-2 rounded-full border border-[#0F387A] text-[#0F387A] font-semibold hover:bg-[#0F387A]/10 transition">
									View Resume
								</button>
								<button className="px-5 py-2 rounded-full border border-[#0F387A] text-[#0F387A] font-semibold flex items-center gap-2 hover:bg-[#126F7D]/10 transition">
									<SearchCode className="h-5 w-5" />
									Analyse Resume
								</button>
							</div>
						</div>

						{/* Bio, Experience, Location, Skills, Email */}
						<div className="mb-3 text-gray-700 text-lg">{candidate.bio}</div>
						<div className="flex items-center gap-6 mb-6 text-base text-gray-500">
							<span>
								<Briefcase className="inline h-5 w-5 mr-1" />
								{candidate.experience}
							</span>
							<span>{candidate.location}</span>
						</div>
						<div className="mb-6">
							<h3 className="font-semibold text-[#1c2e4a] mb-2">Skills</h3>
							<div className="flex flex-wrap gap-2">
								{candidate.skills.map((skill, idx) => (
									<span
										key={idx}
										className="px-4 py-2 bg-[#0F387A]/10 text-[#0F387A] rounded-full text-sm font-medium"
									>
										{skill}
									</span>
								))}
							</div>
						</div>
						<div className="flex items-center gap-3 mt-4">
							<a
								href={`mailto:${candidate.email}`}
								className="flex items-center text-[#0F387A] hover:underline text-base"
							>
								<Mail className="h-5 w-5 mr-2" />
								{candidate.email}
							</a>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default CandidatePage;