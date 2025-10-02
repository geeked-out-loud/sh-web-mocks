 'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, User, Menu, X } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);

  const desktopMenuRef = useRef<HTMLDivElement>(null);
  const desktopBtnRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileBtnRef = useRef<HTMLButtonElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  // Common button style for drawer
  const drawerBtn = "w-full text-[#1c2e4a] text-left font-medium py-2 px-2 hover:bg-gray-100 rounded transition";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Desktop menu
      if (desktopMenuOpen) {
        if (
          desktopMenuRef.current &&
          !desktopMenuRef.current.contains(event.target as Node) &&
          desktopBtnRef.current &&
          !desktopBtnRef.current.contains(event.target as Node)
        ) {
          setDesktopMenuOpen(false);
        }
      }
      // Mobile menu
      if (mobileMenuOpen) {
        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target as Node) &&
          mobileBtnRef.current &&
          !mobileBtnRef.current.contains(event.target as Node)
        ) {
          setMobileMenuOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [desktopMenuOpen, mobileMenuOpen]);

  // Helper to check if current path is a direct or subpage of a nav link
  const isActive = (navPath: string) => {
    if (navPath === "/home") return pathname === "/home";
    return pathname === navPath || pathname.startsWith(navPath + "/");
  };

  return (
    <div className="w-full bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center py-4 justify-between">
          {/* Nav Links - Desktop only */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              href="/home"
              className={`px-2 font-medium transition-all
                text-white
                ${isActive("/home")
                  ? "text-shadow-[0_0_28px_#ffffff]"
                  : "hover:text-shadow-[0_0_6px_#0F387A]"}
              `}
            >
              Home
            </Link>
            <Link
              href="/candidates"
              className={`px-2 font-medium transition-all
                text-white
                ${isActive("/candidates")
                  ? "text-shadow-[0_0_28px_#ffffff]"
                  : "hover:text-shadow-[0_0_6px_#0F387A]"}
              `}
            >
              Candidates
            </Link>
            <Link
              href="/statistics"
              className={`px-2 font-medium transition-all
                text-white
                ${isActive("/statistics")
                  ? "text-shadow-[0_0_28px_#ffffff]"
                  : "hover:text-shadow-[0_0_6px_#0F387A]"}
              `}
            >
              Statistics
            </Link>
            <Link
              href="/openings"
              className={`px-2 font-medium transition-all
                text-white
                ${isActive("/openings")
                  ? "text-shadow-[0_0_28px_#ffffff]"
                  : "hover:text-shadow-[0_0_6px_#0F387A]"}
              `}
            >
              Openings
            </Link>
            <Link
              href="/about"
              className={`px-2 font-medium transition-all
                text-white
                ${isActive("/about")
                  ? "text-shadow-[0_0_6px_#0F387A]"
                  : "hover:text-shadow-[0_0_6px_#0F387A]"}
              `}
            >
              About Us
            </Link>
          </nav>
          {/* Search and Account/Menu */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            {/* Search - always visible */}
            <form onSubmit={handleSearch} className="flex flex-1 w-full">
              <div className="w-full bg-white/80 backdrop-blur-md rounded-full shadow-sm flex items-center px-4 py-2">
                <input
                  type="text"
                  placeholder="Search jobs, candidates, companies..."
                  className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="flex items-center justify-center ml-2">
                  <Search className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>
            {/* Account icon - desktop only */}
            <div className="relative hidden md:inline-flex">
            <button
                ref={desktopBtnRef}
                className="ml-2 p-2 rounded-full bg-white/80 shadow hover:bg-gray-100 transition"
                aria-label="Account menu"
                onClick={() => setDesktopMenuOpen((open) => !open)}
            >
                <User className="h-5 w-5 text-[#1c2e4a]" />
            </button>
            {desktopMenuOpen && (
                <div ref={desktopMenuRef} className="absolute right-0 top-12 z-50 bg-white shadow-lg rounded-xl p-2 w-56 fade-menu fade-in">
                <div className="flex flex-col space-y-1">
                    <button className={drawerBtn} onClick={() => setDesktopMenuOpen(false)}>View Profile</button>
                    <button className={drawerBtn} onClick={() => setDesktopMenuOpen(false)}>My Plans</button>
                    <button className={drawerBtn} onClick={() => setDesktopMenuOpen(false)}>Help Centre</button>
                    <button className={drawerBtn} onClick={() => setDesktopMenuOpen(false)}>Switch Accounts</button>
                    <button
                      className={drawerBtn + " text-red-600 hover:bg-red-50"}
                      onClick={async () => {
                        setDesktopMenuOpen(false);
                        // Clear frontend tokens
                        try {
                          const auth = typeof window !== 'undefined' ? getAuth() : null;
                          if (auth) await signOut(auth);
                        } catch (_err) {
                          // ignore sign out errors but log for debug
                          console.error('Logout error', _err);
                        }
                        router.push('/');
                      }}
                    >
                      Logout
                    </button>
                </div>
                </div>
            )}
            </div>
            {/* Menu button - mobile only, flush right */}
            <button
              ref={mobileBtnRef}
              className="md:hidden ml-2 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-[#1c2e4a]" />
              ) : (
                <Menu className="h-6 w-6 text-[#1c2e4a]" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu Drawer - simple dropdown below nav */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden absolute top-14 left-0 right-0 mt-2 z-50 bg-white shadow-lg rounded-xl p-2 mx-4 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              <Link href="/home" className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link href="/candidates" className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>Candidates</Link>
              <Link href="/statistics" className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>Statistics</Link>
              <Link href="/openings" className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>Openings</Link>
              <Link href="/about" className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <button className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>View Profile</button>
              <button className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>My Plans</button>
              <button className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>Help Centre</button>
              <button className={drawerBtn} onClick={() => setMobileMenuOpen(false)}>Switch Accounts</button>
              <button
                className={drawerBtn + " text-red-600 hover:bg-red-50"}
                onClick={async () => {
                  setMobileMenuOpen(false);
                  try {
                    const auth = typeof window !== 'undefined' ? getAuth() : null;
                    if (auth) await signOut(auth);
                  } catch (_err) {
                    console.error('Logout error', _err);
                  }
                  router.push('/');
                }}
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}