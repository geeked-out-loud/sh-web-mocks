"use client";
import Aurora from '../components/backgrounds/Aurora';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import SignupModal from '../components/auth/signupmodal';
import LoginModal from '../components/auth/loginmodal';
import { signInWithGoogle, signUpWithGoogle, signInWithLinkedIn, signUpWithLinkedIn } from '../../config/auth';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import CompanyOnboardModal from '../components/CompanyOnboardModal';

export default function TestHomepage() {
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<any | null>(null);
  const router = useRouter();
  const targetRef = useRef<HTMLElement | null>(null);

  const handleCtaClick = (e: any) => {
    e.preventDefault();
    const target = targetRef.current || document.getElementById('features');
    if (target) {
      const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior = prefersReducedMotion ? 'auto' : 'smooth';
      try {
        (target as HTMLElement).scrollIntoView({ behavior: behavior as ScrollBehavior, block: 'start' });
      } catch (err) {
        (target as HTMLElement).scrollIntoView();
      }
    }
  };
  // Handlers for social auth and form submissions
  async function handleGoogle(isLoginMode: boolean) {
    try {
      if (isLoginMode) {
        const res = await signInWithGoogle();
        if (res) {
          // assume backend set token via cookie or returned token handled by auth helper
          setLoginOpen(false);
          router.push('/home');
        }
      } else {
        const res = await signUpWithGoogle();
        // on signup success, store any returned prefill into sessionStorage (helpers do this elsewhere)
        setSignupOpen(false);
        // open company onboarding
        setShowCompanyModal(true);
      }
    } catch (e: any) {
      console.error('Google auth error', e);
      alert(e?.message || 'Google authentication failed');
    }
  }

  async function handleLinkedIn(isLoginMode: boolean) {
    try {
      if (isLoginMode) {
        const payload = await signInWithLinkedIn();
        if (payload) {
          setLoginOpen(false);
          router.push('/home');
        }
      } else {
        const payload = await signUpWithLinkedIn();
        setSignupOpen(false);
        setShowCompanyModal(true);
      }
    } catch (e: any) {
      console.error('LinkedIn auth error', e);
      alert(e?.message || 'LinkedIn authentication failed');
    }
  }

  async function handleCompanySaved(companyId: string | number | null, payload: any) {
    try {
      // call createRecruiterProfile after company creation
      const rpPayload: any = { company_id: companyId };
      if (payload && payload.linkedin_url) rpPayload.linkedin_url = payload.linkedin_url;
      await api.createRecruiterProfile(rpPayload);
      setShowCompanyModal(false);
      router.push('/home');
    } catch (e: any) {
      console.error('Failed to create recruiter profile', e);
      alert(e?.message || 'Failed to create recruiter profile.');
    }
  }

  return (
  <div className="relative min-h-screen overflow-auto bg-gradient-to-b from-transparent via-black/10 to-black/15"> 
      {/* Fixed full-viewport background */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
        <Aurora
          colorStops={["#275E5A", "#364948", "#031348"]}
          blend={1.0}
          amplitude={2.2}
          speed={0.6}
        />
      </div>
      {/* Page content that scrolls over the fixed background */}
      <main className="relative z-10 flex items-center justify-center h-screen sm:h-screen px-4 sm:px-6">
  <div className="w-full max-w-6xl text-start relative">
          <h1 className="font-garet text-4xl sm:text-5xl md:text-8xl font-extrabold text-white leading-tight drop-shadow-md">
            SmartHire
          </h1>

          <p className="font-garet-book font-bold text-base sm:text-lg text-white/85 mt-2">Your AI-Powered Hiring Partner.</p>

          <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-6">
            <button onClick={() => setSignupOpen(true)} className="inline-block rounded-full px-5 py-3 text-sm sm:text-base font-medium shadow-md bg-white text-gray-900 transform transition-all duration-200 hover:scale-[1.02]">
              Get Started
            </button>

            <button onClick={() => setLoginOpen(true)} className="inline-block border border-white/10 bg-black/10 backdrop-blur-lg text-white rounded-full px-4 py-3 text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-colors duration-200 hover:bg-white/10">
              <span>Log In</span>
              <ChevronRight size={18} className="shrink-0" />
            </button>
          </div>

          {/* Inline callout: centered under hero CTAs (absolute inside hero wrapper) */}
          <div className="absolute left-1/2 top-full mt-36 transform -translate-x-1/2">
            <div className="mx-auto max-w-max px-3 py-2 rounded-full bg-white/6 sm:backdrop-blur-sm border border-white/10 text-white/90 text-sm inline-flex items-center gap-2">
              <Link href="#exclusive-offerings" onClick={handleCtaClick} className="inline-flex items-center gap-2 hover:underline">
                <span className="font-garet-book font-bold text-sm">Scroll to Learn More</span>
                <ChevronDown size={18} className="shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <section id='features' className="relative z-10 bg-transparent px-4 sm:px-6 pt-10 sm:pt-12 pb-20">
        <div className="max-w-6xl mx-auto text-white/90">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
            <div>
              <h3 className="text-2xl font-semibold text-white">Affordable Platform</h3>
              <p className="mt-3 text-white/80">Streamline your hiring process with cost-efficient solutions that maximize value without compromising on quality.</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white">All-In-One Hiring Platform</h3>
              <p className="mt-3 text-white/80">Transform your recruitment with SmartHire’s AI-powered job posting, smart shortlisting, and seamless candidate management.</p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white">Automated Smart Hiring</h3>
              <p className="mt-3 text-white/80">From job creation to shortlisting, experience hiring that’s faster, smarter, and fully automated.</p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <h3 id="exclusive-offerings" className="text-2xl sm:text-3xl font-semibold text-white mb-4 sm:mb-6">Exclusive Offerings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h4 className="text-base sm:text-lg font-semibold text-white">AI-Generated Job Descriptions</h4>
                <p className="mt-2 text-white/80 text-sm">Auto-create tailored JDs in seconds</p>
              </div>

              <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white">Smart Role Predictions</h4>
                <p className="mt-2 text-white/80">AI suggests roles based on market trends and past hiring</p>
              </div>

              <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white">One-Click Job Posting</h4>
                <p className="mt-2 text-white/80">Publish across multiple platforms instantly</p>
              </div>

              <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white">Intelligent Candidate Matching</h4>
                <p className="mt-2 text-white/80">AI shortlists the best-fit candidates automatically</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Separator + bottom CTAs */}
      <div className="relative z-10 w-full">
        <div className="max-w-full mx-auto">
          <hr className="border-t border-white/10" /> 
          <Footer />
        </div>
      </div>

      <SignupModal open={signupOpen} onCloseAction={() => setSignupOpen(false)} onSubmitAction={(data) => { console.log('signup', data); setSignupOpen(false); }} />
      <LoginModal open={loginOpen} onCloseAction={() => setLoginOpen(false)} onSubmitAction={(data) => { console.log('login', data); setLoginOpen(false); }} />
    </div>
  );
}
