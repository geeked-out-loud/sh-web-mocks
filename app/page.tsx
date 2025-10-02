 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signUpWithGoogle, signInWithLinkedIn, signUpWithLinkedIn } from '../config/auth';
import CompanyOnboardModal from './components/CompanyOnboardModal';
import LoginModal from './components/auth/loginmodal';
import SignupModal from './components/auth/signupmodal';
import api from '@/lib/api';
import Link from 'next/link';
import Footer from './components/Footer';
import Aurora from './components/backgrounds/Aurora';
import { Eye, EyeOff } from 'lucide-react';

export default function Home() {
  // Flow states:
  //  - stage: 'clean' | 'company' | 'auth' | 'done'
  //  - isLogin: whether auth card is in login mode (true) or signup mode (false)
  const [stage, setStage] = useState<'clean' | 'company' | 'auth' | 'done'>('clean');
  const [isLogin, setIsLogin] = useState(true);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  function handleCompanySaved(companyId: string | number | null, payload: any) {
    try { if (companyId) sessionStorage.setItem('signup_company_id', String(companyId)); } catch (_) {}
    try { if (payload?.name) sessionStorage.setItem('signup_company_name', payload.name); } catch (_) {}

    // After company creation, create recruiter profile using company_id and linkedin url from socials
    (async () => {
      try {
        const socials: string[] = payload?.socials ?? [];
        let linkedinUrl: string | null = null;
        for (const s of socials) {
          if (!s) continue;
          const sl = String(s).trim();
          if (sl.toLowerCase().includes('linkedin.com')) {
            linkedinUrl = sl;
            break;
          }
        }

            // Use only the companyId and linkedin_url returned by the modal's create step.
            // Expect companyId to be a truthy id (number or string). If missing, abort.
            if (companyId === null || companyId === undefined) {
              alert('Company created but server did not return an id. Please retry or contact support.');
              return;
            }

            const rp: Record<string, any> = { company_id: companyId };
            if (payload && payload.linkedin_url) rp.linkedin_url = payload.linkedin_url;

        // Call recruiter creation API (requires auth token in session)
        await api.createRecruiterProfile(rp);

        // close modal and navigate only after recruiter profile creation succeeds
        setShowCompanyModal(false);
        router.push('/home');
      } catch (e: any) {
        // If recruiter creation failed, keep modal open and show error
        // eslint-disable-next-line no-console
        console.error('Failed to create recruiter profile after company creation', e);
        alert(e?.message || 'Failed to create recruiter profile. Please retry.');
        // keep modal open so user can edit socials or retry
      }
    })();
  }

      async function handleGoogle() {
    setAuthLoading(true);
    try {
      let result: any = null;
      if (isLogin) {
        result = await signInWithGoogle();
        // successful login -> go to home
        if (result) router.push('/home');
      } else {
        result = await signUpWithGoogle();
        // mark fresh user so home page shows onboarding modal
        try { sessionStorage.setItem('is_fresh_user', '1'); } catch (_) {}

        // If backend returned company-like fields, save them to sessionStorage for prefill
        try {
          if (result && result.response && result.response.data) {
            const d: any = result.response.data;
            if (d.company_name) sessionStorage.setItem('signup_company_name', String(d.company_name));
            if (d.company_website) sessionStorage.setItem('signup_company_website', String(d.company_website));
            if (d.logo_url) sessionStorage.setItem('signup_company_logo_url', String(d.logo_url));
          }
        } catch (_) {}

        // After signup, open company creation modal in the same page
        setIsLogin(false);
        setStage('company');
        setShowCompanyModal(true);
      }
    } catch (e: any) {
      // basic error handling - you can replace with UI toast
      // eslint-disable-next-line no-console
      console.error('Google auth error', e);
      alert(e?.message || 'Google authentication failed');
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLinkedIn() {
    setAuthLoading(true);
    try {
      const payload = isLogin ? await signInWithLinkedIn() : await signUpWithLinkedIn();

      // If this was a signup, mark fresh user for onboarding modal
      if (!isLogin) {
        try { sessionStorage.setItem('is_fresh_user', '1'); } catch (_) {}

        // If backend included company-like fields in payload.data, persist for prefill on /home
        try {
          if (payload && payload.data) {
            const data: any = payload.data;
            if (data.company_name) sessionStorage.setItem('signup_company_name', String(data.company_name));
            if (data.company_website) sessionStorage.setItem('signup_company_website', String(data.company_website));
            if (data.profile_photo_url) sessionStorage.setItem('signup_company_logo_url', String(data.profile_photo_url));
          }
        } catch (_) {}
      }

      // After LinkedIn auth: if login, go to home; if signup, open company creation modal
      if (isLogin) {
        if (payload) router.push('/home');
      } else {
        // signup: open company modal to complete company creation
        setIsLogin(false);
        setStage('company');
        setShowCompanyModal(true);
      }
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error('LinkedIn auth error', e);
      alert(e?.message || 'LinkedIn authentication failed');
    } finally {
      setAuthLoading(false);
    }
  }
  
  // Show company modal when stage === 'company'
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

      {/* Modals */}
      <CompanyOnboardModal open={stage === 'company' || showCompanyModal} onCloseAction={() => { setShowCompanyModal(false); setStage('clean'); }} onSavedAction={handleCompanySaved} />

      <LoginModal
        open={stage === 'auth' && isLogin}
        onCloseAction={() => setStage('clean')}
        onSubmitAction={() => { /* local login still unimplemented */ }}
        onGoogle={handleGoogle}
        onLinkedIn={handleLinkedIn}
      />

      <SignupModal
        open={stage === 'auth' && !isLogin}
        onCloseAction={() => setStage('clean')}
        onSubmitAction={async (data: any) => {
          try {
            setAuthLoading(true);
            try { sessionStorage.setItem('is_fresh_user', '1'); } catch (_) {}

            if (data && data.companyId) {
              try {
                if (data.companyPayload && data.companyPayload.name) sessionStorage.setItem('signup_company_name', String(data.companyPayload.name));
                if (data.companyPayload && data.companyPayload.website) sessionStorage.setItem('signup_company_website', String(data.companyPayload.website));
                if (data.companyPayload && data.companyPayload.logo_url) sessionStorage.setItem('signup_company_logo_url', String(data.companyPayload.logo_url));
              } catch (_) {}

              try {
                const rp: Record<string, any> = { company_id: data.companyId };
                if (data.companyPayload && data.companyPayload.socials) {
                  const socials: string[] = data.companyPayload.socials ?? [];
                  for (const s of socials) {
                    if (!s) continue;
                    const sl = String(s).trim();
                    if (sl.toLowerCase().includes('linkedin.com')) {
                      rp.linkedin_url = sl;
                      break;
                    }
                  }
                }
                await api.createRecruiterProfile(rp);
                setStage('clean');
                router.push('/home');
              } catch (e: any) {
                console.error('Failed to create recruiter profile after signup modal company creation', e);
                alert(e?.message || 'Failed to create recruiter profile. Please retry.');
              }
            } else {
              setStage('clean');
            }
          } finally {
            setAuthLoading(false);
          }
        }}
        onGoogle={handleGoogle}
        onLinkedIn={handleLinkedIn}
      />

      {/* Page content that scrolls over the fixed background */}
      <main className="relative z-10 flex items-center justify-center h-screen sm:h-screen px-4 sm:px-6">
        <div className="w-full max-w-6xl text-start relative">
          <h1 className="font-garet text-4xl sm:text-5xl md:text-8xl font-extrabold text-white leading-tight drop-shadow-md">SmartHire</h1>
          <p className="font-garet-book font-bold text-base sm:text-lg text-white/85 mt-2">Your AI-Powered Hiring Partner.</p>

          <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-start gap-3 sm:gap-6">
            <button onClick={() => { setStage('auth'); setIsLogin(false); }} className="inline-block rounded-full px-5 py-3 text-sm sm:text-base font-medium shadow-md bg-white text-gray-900 transform transition-all duration-200 hover:scale-[1.02]">Get Started</button>
            <button onClick={() => { setStage('auth'); setIsLogin(true); }} className="inline-block border border-white/10 bg-black/10 backdrop-blur-lg text-white rounded-full px-4 py-3 text-sm sm:text-base font-medium inline-flex items-center gap-2 transition-colors duration-200 hover:bg-white/10">Log In</button>
          </div>

          <div className="absolute left-1/2 top-full mt-36 transform -translate-x-1/2">
            <div className="mx-auto max-w-max px-3 py-2 rounded-full bg-white/6 sm:backdrop-blur-sm border border-white/10 text-white/90 text-sm inline-flex items-center gap-2">
              <Link href="#exclusive-offerings" onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('features');
                if (target) {
                  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  const behavior = prefersReducedMotion ? 'auto' : 'smooth';
                  try { (target as HTMLElement).scrollIntoView({ behavior: behavior as ScrollBehavior, block: 'start' }); } catch (err) { (target as HTMLElement).scrollIntoView(); }
                }
              }} className="inline-flex items-center gap-2 hover:underline"><span className="font-garet-book font-bold text-sm">Scroll to Learn More</span></Link>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="relative z-10 bg-transparent px-4 sm:px-6 pt-10 sm:pt-12 pb-20">
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
    </div>
  );
}