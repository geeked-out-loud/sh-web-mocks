'use client';

import React from 'react';
import Image from 'next/image';
import Nav from '../components/Nav';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Full width Nav component */}
      <Nav />
      
      <div className="flex flex-1">
        {/* Left side with pattern - same as the login page */}
        <div className="w-2/7 bg-[#c2d9ed] relative hidden md:block">
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
        
        {/* Right side with content */}
        <div className="w-full md:w-5/7 bg-[#c2d9ed] flex flex-col">
          
          {/* Main content area */}
          <div className="flex-1 overflow-auto p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#1c2e4a] mb-6">Welcome to SmartHire</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/75 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-[#1c2e4a] mb-3">Recent Applications</h3>
                  <p className="text-gray-600 mb-4">You have 5 new applications to review.</p>
                  <button className="px-4 py-2 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 text-sm font-medium">
                    View Applications
                  </button>
                </div>
                
                <div className="bg-white/75 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/20">
                  <h3 className="text-lg font-semibold text-[#1c2e4a] mb-3">Active Jobs</h3>
                  <p className="text-gray-600 mb-4">You have 3 active job postings.</p>
                  <button className="px-4 py-2 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 text-sm font-medium">
                    Manage Jobs
                  </button>
                </div>
              </div>
              
              <div className="bg-white/75 backdrop-blur-md rounded-xl shadow-md p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-[#1c2e4a] mb-4">Upcoming Interviews</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <p className="font-medium text-[#1c2e4a]">Frontend Developer Interview</p>
                    <p className="text-sm text-gray-600">Today, 2:00 PM - 3:00 PM</p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <p className="font-medium text-[#1c2e4a]">UX Designer Interview</p>
                    <p className="text-sm text-gray-600">Tomorrow, 11:00 AM - 12:00 PM</p>
                  </div>
                  <div>
                    <p className="font-medium text-[#1c2e4a]">Product Manager Interview</p>
                    <p className="text-sm text-gray-600">Sep 10, 10:00 AM - 11:30 AM</p>
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
