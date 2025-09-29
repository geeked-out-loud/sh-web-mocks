"use client";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-bg-transparent to-black/85 text-white">
      <div className="max-w-full mx-auto px-6 py-10">
        {/* Top: mobile 2-column layout (left: SmartHire + Contact, right: Company) */}
        <div className="w-full md:hidden">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg font-semibold">SmartHire</h5>
              <p className="mt-3 text-sm text-white/80">AI-first hiring platform that simplifies job posting, candidate matching, and onboarding.</p>
              <div className="mt-4 text-sm text-white/70">© 2025 SmartHire, Inc.</div>

              <div className="mt-4">
                <h6 className="font-semibold">Contact</h6>
                <p className="mt-2 text-sm text-white/80">support@smarthire.example</p>
                <ul className="mt-2 flex items-center gap-3 text-sm">
                  <li><Link href="#" className="text-white/80 hover:text-white">Twitter</Link></li>
                  <li><Link href="#" className="text-white/80 hover:text-white">LinkedIn</Link></li>
                  <li><Link href="#" className="text-white/80 hover:text-white">GitHub</Link></li>
                </ul>
              </div>
            </div>

            <div>
              <h6 className="font-semibold">Company</h6>
              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li><Link href="#" className="hover:underline">About</Link></li>
                <li><Link href="#" className="hover:underline">Features</Link></li>
                <li><Link href="#" className="hover:underline">Pricing</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Top: desktop/tablet 3-column layout (md+) */}
        <div className="hidden md:flex w-full flex-row md:space-x-8">
          <div className="w-1/3">
            <h5 className="text-lg font-semibold">SmartHire</h5>
            <p className="mt-3 text-sm text-white/80 max-w-sm">AI-first hiring platform that simplifies job posting, candidate matching, and onboarding.</p>
            <div className="mt-4 text-sm text-white/70">© 2025 SmartHire, Inc.</div>
          </div>

          <div className="w-1/3">
            <h6 className="font-semibold">Company</h6>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link href="#" className="hover:underline">About</Link></li>
              <li><Link href="#" className="hover:underline">Features</Link></li>
              <li><Link href="#" className="hover:underline">Pricing</Link></li>
            </ul>
          </div>

          <div className="w-1/3">
            <h6 className="font-semibold">Contact</h6>
            <p className="mt-3 text-sm text-white/80">support@smarthire.example</p>
            <ul className="mt-3 flex items-center gap-4 text-sm">
              <li><Link href="#" className="text-white/80 hover:text-white">Twitter</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white">LinkedIn</Link></li>
              <li><Link href="#" className="text-white/80 hover:text-white">GitHub</Link></li>
            </ul>
          </div>
        </div>

        {/* Separator */}
        <div className="mt-8 border-t border-white/6" />

        {/* Bottom: policies (left) and CTAs (right) */}
        <div className="mt-6 flex flex-col md:flex-row items-center md:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-white/70">
            <Link href="#" className="hover:underline">Terms</Link>
            <Link href="#" className="hover:underline">Privacy policy</Link>
            <Link href="#" className="hover:underline">Security</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="#" className="rounded-full px-6 py-3 text-base font-medium bg-white text-gray-900 hover:scale-[1.02] transition-transform">Get Started</Link>

            <Link href="#" className="inline-flex items-center justify-center border border-white/10 bg-black/10 backdrop-blur-lg text-white rounded-full px-5 py-3 text-sm font-medium gap-2 hover:bg-white/10">
              <span>Log In</span>
              <ChevronRight size={18} className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
