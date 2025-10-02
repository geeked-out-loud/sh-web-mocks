'use client';

import Link from 'next/link';
import Aurora from './components/backgrounds/Aurora';

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden">
      {/* Aurora animated background */}
      <div className="fixed inset-0 -z-10 w-full h-full pointer-events-none">
        <Aurora
          colorStops={["#275E5A", "#364948", "#031348"]}
          blend={1.0}
          amplitude={2.2}
          speed={0.6}
        />
      </div>
      <div className="bg-[linear-gradient(rgba(67,101,113,0.13),rgba(54,73,72,0.09))] backdrop-blur-2xl rounded-2xl shadow-2xl p-10 border border-white/10 max-w-lg mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4 drop-shadow">Page in Development</h2>
        <p className="text-white/80 mb-4 text-base">being developed as you read this...</p>
        <Link 
          href="/home" 
          className="inline-block px-6 py-3 rounded-full bg-[#0B283E] text-white font-semibold border border-[#0F387A] hover:bg-[#232b3a] transition-all text-base shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}