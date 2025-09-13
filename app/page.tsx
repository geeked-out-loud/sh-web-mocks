'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [showAuthCard, setShowAuthCard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  return (
    <main className="min-h-screen">
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
            
            {/* Form - Login or Signup */}
            <div className="space-y-4">
              {/* Common field: Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-800 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-3 py-2.5 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500"
                  placeholder="you@example.com"
                />
              </div>
              
              {/* Name field - only for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-800 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-3 py-2.5 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500"
                    placeholder="John Doe"
                  />
                </div>
              )}
              
              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-800">Password</label>
                  {isLogin && <a href="#" className="text-xs font-medium text-[#1c2e4a] hover:underline">Forgot?</a>}
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className="w-full px-3 py-2.5 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500 pr-10"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password - only for signup */}
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-800 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      id="confirmPassword" 
                      className="w-full px-3 py-2.5 bg-white/80 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1c2e4a] shadow-sm placeholder-gray-500 pr-10"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Submit button */}
              <Link href="/home/" className="block w-full">
                <button className="w-full px-4 py-3 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 shadow-lg text-sm font-medium border border-[#1c2e4a]/20">
                  {isLogin ? 'Log in' : 'Sign up'}
                </button>
              </Link>
              
              <div className="pt-4 text-center">
                <span className="text-xs font-medium text-gray-800">or continue with</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <button className="flex items-center justify-center py-2.5 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                  <span className="text-xs font-medium text-gray-700">Google</span>
                </button>
                <button className="flex items-center justify-center py-2.5 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                  <span className="text-xs font-medium text-gray-700">Apple</span>
                </button>
                <button className="flex items-center justify-center py-2.5 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                  <span className="text-xs font-medium text-gray-700">LinkedIn</span>
                </button>
              </div>
            </div>
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
                showAuthCard ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="w-full">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#1c2e4a] mb-6 text-left">SmartHire</h1>
                <p className="text-xl text-gray-700 mb-12 font-light text-left">Your AI-Powered Hiring Partner</p>
                
                <div className="flex justify-start">
                  <button 
                    onClick={() => {setShowAuthCard(true);}}
                    className="px-10 py-4 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 shadow-lg text-lg font-medium relative z-20"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          
            {/* Auth Card with slide-up animation - centered on page */}
            <div 
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${
                showAuthCard ? 'transform translate-y-0 opacity-100 z-30' : 'transform translate-y-[50%] opacity-0 invisible'
              }`}
            >
              <div className="bg-white/75 backdrop-blur-md rounded-xl shadow-xl border border-white/20 w-full max-w-md overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center px-6 pt-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-[#1c2e4a]">Welcome</h2>
                  <button 
                    onClick={() => setShowAuthCard(false)}
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
                    <Link href="/home/" className="block w-full">
                      <button className="w-full px-4 py-2.5 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 shadow-lg text-sm font-medium mt-2">
                        {isLogin ? 'Log in' : 'Sign up'}
                      </button>
                    </Link>
                    
                    <div className="pt-3 text-center">
                      <span className="text-xs font-medium text-gray-800">or continue with</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button className="flex items-center justify-center py-2 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                        <span className="text-xs font-medium text-gray-700">Google</span>
                      </button>
                      <button className="flex items-center justify-center py-2 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
                        <span className="text-xs font-medium text-gray-700">Apple</span>
                      </button>
                      <button className="flex items-center justify-center py-2 bg-white/90 rounded-md border border-gray-300 hover:bg-white shadow-sm">
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
