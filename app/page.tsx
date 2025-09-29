 'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithGoogle, signUpWithGoogle, signInWithLinkedIn, signUpWithLinkedIn } from '../config/auth';
import CompanyOnboardModal from './components/CompanyOnboardModal';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
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
    <main className="min-h-screen">
      <CompanyOnboardModal open={stage === 'company' || showCompanyModal} onCloseAction={() => { setShowCompanyModal(false); setStage('clean'); }} onSavedAction={handleCompanySaved} />
  {/* Mobile layout - Floating Card Design */}
  <div className="md:hidden h-screen overflow-hidden relative bg-[#c2d9ed]">
        {/* Full-height pattern as background - positioned to show only right half */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/pattern.svg" 
            alt="Decorative pattern" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'left center', transform: 'translateX(-35%)'}}
            priority
            className="opacity-75"
          />
        </div>
             
        {/* Content card - floating in the middle */}
        <div className="flex items-center justify-center h-full px-6 py-10">
          <div className="w-full max-w-sm bg-white/55 backdrop-blur-md rounded-xl shadow-lg p-6 z-10 border border-white/20">
            <h1 className="text-3xl font-bold text-[#1c2e4a] mb-1">SmartHire</h1>
            <p className="text-sm text-gray-700 mb-4 font-light">Your AI-Powered Hiring Partner</p>

            {/* If we're at clean stage show primary CTAs; if company stage show company modal trigger; if auth stage show auth card */}
            {stage === 'clean' && (
              <div className="space-y-4">
                <button onClick={() => { setStage('auth'); setIsLogin(false); }} className="w-full px-4 py-3 bg-[#1c2e4a] text-white rounded-lg">Get Started</button>
                <button onClick={() => { setStage('auth'); setIsLogin(true); }} className="w-full px-4 py-3 bg-white text-[#1c2e4a] rounded-lg border">Login to Continue</button>
              </div>
            )}

            {stage === 'auth' && (
              <div className="space-y-4">
                <div className="flex bg-white/30 rounded-lg p-1 mb-2 relative">
                  <div className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-[#1c2e4a] transition-transform duration-300 ease-in-out ${isLogin ? 'translate-x-0' : 'translate-x-full'}`}></div>
                  <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 text-sm font-medium rounded-md relative z-10 transition-colors duration-300 ${isLogin ? 'text-white' : 'text-[#1c2e4a]'}`}>Login</button>
                  <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 text-sm font-medium rounded-md relative z-10 transition-colors duration-300 ${!isLogin ? 'text-white' : 'text-[#1c2e4a]'}`}>Signup</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="mobile-email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
                    <input type="email" id="mobile-email" className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500" placeholder="you@example.com" />
                  </div>

                  {!isLogin && (
                    <div>
                      <label htmlFor="mobile-name" className="block text-sm font-medium text-gray-800 mb-1">Full Name</label>
                      <input type="text" id="mobile-name" className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500" placeholder="John Doe" />
                    </div>
                  )}

                  <div>
                    <label htmlFor="mobile-password" className="block text-sm font-medium text-gray-800 mb-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} id="mobile-password" className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500 pr-10" placeholder="••••••••" />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div>
                      <label htmlFor="mobile-confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
                      <div className="relative">
                        <input type={showConfirmPassword ? 'text' : 'password'} id="mobile-confirmPassword" className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500 pr-10" placeholder="••••••••" />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}

                  <button className="w-full px-4 py-3 bg-[#1c2e4a] text-white rounded-lg">{isLogin ? 'Log in' : 'Sign up'}</button>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-xs font-medium text-gray-800">or continue with</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button onClick={handleGoogle} disabled={authLoading} className="flex items-center justify-center py-2.5 bg-white/90 rounded-md border text-[#1c2e4a] border-gray-300">Google</button>
                  <button className="flex items-center justify-center py-2.5 bg-white/90 rounded-md border text-[#1c2e4a] border-gray-300">Apple</button>
                  <button onClick={handleLinkedIn} disabled={authLoading} className="flex items-center justify-center py-2.5 bg-white/90 rounded-md border text-[#1c2e4a] border-gray-300">LinkedIn</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop layout - Completely refactored with sliding animations */}
      <div className="hidden md:flex h-screen overflow-hidden">
        {/* Left side with pattern */}
        <div className="w-2/5 bg-[#c2d9ed] relative">
          <div className="absolute inset-0">
            <Image 
              src="/pattern.svg" 
              alt="Decorative pattern" 
              fill 
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
              className="opacity-90"
            />
          </div>
        </div>
        
        {/* Right side with content - main container */}
        <div className="w-3/5 bg-[#c2d9ed] flex items-center justify-center">
          {/* Content wrapper with fixed height to prevent scrolling */}
          <div className="w-full max-w-xl px-12 relative h-[600px] max-h-[90vh]">
            {/* Initial content - fades out when auth card appears */}
            <div 
              className={`absolute inset-0 flex items-center transition-all duration-500 ease-in-out ${
                  stage === 'auth' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            >
              <div className="w-full">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#1c2e4a] mb-6 text-left">SmartHire</h1>
                <p className="text-xl text-gray-700 mb-12 font-light text-left">Your AI-Powered Hiring Partner</p>
                
                <div className="flex justify-start">
                  <button
                    onClick={() => { setStage('auth'); setIsLogin(false);} }
                    className="px-10 py-4 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 shadow-lg text-lg font-medium relative z-20"
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => { setStage('auth'); setIsLogin(true); }}
                    className="ml-4 px-6 py-4 bg-white text-[#1c2e4a] rounded-lg border border-[#1c2e4a]/20"
                  >
                    Login to Continue
                  </button>
                </div>
              </div>
            </div>
          
            {/* Auth Card with slide-up animation - centered on page */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                  stage === 'auth' ? 'transform translate-y-0 opacity-100 z-30' : 'transform translate-y-[50%] opacity-0 invisible'
                }`}
            >
              <div className="bg-white/75 backdrop-blur-md rounded-xl shadow-xl border border-white/20 w-full max-w-md overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center px-6 pt-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-[#1c2e4a]">Welcome</h2>
                  <button 
                    onClick={() => setStage('clean')}
                    className="text-[#1c2e4a] hover:text-[#203354] p-2"
                  >
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="px-6 pt-4 pb-6">
                  {/* Login/Signup Toggle with sliding effect */}
                  <div className="flex bg-white/30 rounded-lg p-1 mb-6 relative">
                    {/* Sliding background - absolutely positioned */}
                    <div 
                      className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-[#1c2e4a] transition-transform duration-300 ease-in-out ${
                        isLogin ? 'translate-x-0' : 'translate-x-full'
                      }`}
                    ></div>
                    
                    {/* Login button */}
                    <button 
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md relative z-10 transition-colors duration-300 ${
                        isLogin ? 'text-white' : 'text-[#1c2e4a]'
                      }`}
                    >
                      Login
                    </button>
                    
                    {/* Signup button */}
                    <button 
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-2 text-sm font-medium rounded-md relative z-10 transition-colors duration-300 ${
                        !isLogin ? 'text-white' : 'text-[#1c2e4a]'
                      }`}
                    >
                      Signup
                    </button>
                  </div>
                  
                  {/* Form - Login or Signup - Compact version */}
                  <div className="space-y-3">
                    {/* Common field: Email */}
                    <div>
                      <label htmlFor="desktop-email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="desktop-email" 
                        className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500"
                        placeholder="you@example.com"
                      />
                    </div>
                    
                    {/* Name field - only for signup */}
                    {!isLogin && (
                      <div>
                        <label htmlFor="desktop-name" className="block text-sm font-medium text-gray-800 mb-1">Full Name</label>
                        <input 
                          type="text" 
                          id="desktop-name" 
                          className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500"
                          placeholder="John Doe"
                        />
                      </div>
                    )}
                    
                    {/* Password field */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="desktop-password" className="block text-sm font-medium text-gray-800">Password</label>
                        {isLogin && (
                          <a href="#" className="text-xs font-medium text-[#1c2e4a] hover:underline">Forgot?</a>
                        )}
                      </div>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="desktop-password" 
                          className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500 pr-10"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Confirm Password - only for signup */}
                    {!isLogin && (
                      <div>
                        <label htmlFor="desktop-confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
                        <div className="relative">
                          <input 
                            type={showConfirmPassword ? "text" : "password"} 
                            id="desktop-confirmPassword" 
                            className="w-full px-3 py-2 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500 pr-10"
                            placeholder="••••••••"
                          />
                          <button 
                            type="button" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Submit button */}
                    {/* Navigation must only happen after successful auth or full signup flow.
                        Replace unconditional Link with a button that performs no navigation here.
                        Social/third-party handlers (handleGoogle / handleLinkedIn) will navigate on success.
                        For local form-based login/signup we intentionally do not navigate here. */}
                    <div className="block w-full">
                      <button
                        type="button"
                        onClick={() => {
                          // No-op navigation: actual navigation is handled by provider flows
                          // or by the parent when company+recruiter creation completes.
                          // Keep this button for UX parity; if you want to implement
                          // local form auth, wire it to your auth functions and
                          // navigate on success.
                        }}
                        className="w-full px-4 py-2.5 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 shadow-lg text-sm font-medium mt-2"
                      >
                        {isLogin ? 'Log in' : 'Sign up'}
                      </button>
                    </div>
                    
                    <div className="pt-3 text-center">
                      <span className="text-xs font-medium text-gray-800">or continue with</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={handleGoogle} disabled={authLoading} className="flex items-center justify-center py-2 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                        <span className="text-xs font-medium text-gray-700">Google</span>
                      </button>
                      <button className="flex items-center justify-center py-2 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                        <span className="text-xs font-medium text-gray-700">Apple</span>
                      </button>
                      <button onClick={handleLinkedIn} disabled={authLoading} className="flex items-center justify-center py-2 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                        <span className="text-xs font-medium text-gray-700">LinkedIn</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}