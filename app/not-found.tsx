'use client';

import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#c2d9ed]">
      <div className="bg-white/75 backdrop-blur-md rounded-xl shadow-md p-8 border border-white/20 max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-[#1c2e4a] mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">Sorry, the page you are looking for doesn&apos;t exist or has been moved.</p>
        <Link 
          href="/home" 
          className="px-6 py-3 bg-[#1c2e4a] hover:bg-[#203354] text-white rounded-lg transition duration-300 shadow-md text-sm font-medium inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}