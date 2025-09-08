'use client';

import React from 'react';
import Link from 'next/link';

export default function Nav() {
  return (
    <div className="w-full bg-white shadow-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-bold text-[#1c2e4a]">
              SmartHire
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/home" className="text-[#1c2e4a] hover:text-[#203354] font-medium">
              Dashboard
            </Link>
            <Link href="/jobs" className="text-gray-600 hover:text-[#1c2e4a]">
              Jobs
            </Link>
            <Link href="/candidates" className="text-gray-600 hover:text-[#1c2e4a]">
              Candidates
            </Link>
            <Link href="/" className="text-gray-600 hover:text-[#1c2e4a]">
              Sign Out
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 hover:text-[#1c2e4a] focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
