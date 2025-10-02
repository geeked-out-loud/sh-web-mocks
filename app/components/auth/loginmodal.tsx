"use client";
import { useEffect, useState } from 'react';
import { X, AtSign, Key, Eye, EyeOff } from 'lucide-react';

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onSubmitAction?: (data: { email: string; password: string }) => void;
  onGoogle?: () => Promise<void> | (() => void);
  onLinkedIn?: () => Promise<void> | (() => void);
};

export default function LoginModal({ open, onCloseAction, onSubmitAction, onGoogle, onLinkedIn }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCloseAction();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCloseAction]);

  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      email: fd.get('email') as string,
      password: fd.get('password') as string,
    };
    onSubmitAction?.(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={onCloseAction} />
      <div className="relative w-full max-w-3xl rounded-2xl p-1" aria-modal="true" role="dialog" aria-label="Sign in">
        <div className="w-full bg-[linear-gradient(rgba(67,101,113,0.08),rgba(54,73,72,0.06))] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white font-garet-book">Sign in</h3>
            <button type="button" onClick={onCloseAction} aria-label="Close" className="text-white/90 hover:text-white">
              <X size={28} className='hover:bg-[#436571]/10 m-1 rounded-md' />
            </button>
          </div>
          <div className="border-t border-white/6" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <label className="block text-sm text-white/90 relative">
              <span className="text-sm">Email</span>
              <div className="mt-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <AtSign size={18} style={{ color: 'rgba(67,101,113)' }} />
                </div>
                <input name="email" type="email" required className="block w-full rounded-md bg-[#436571]/10 border border-white/10 text-white px-3 py-2 pl-10 placeholder:text-white/50 focus:outline-none focus:border-[#436571] focus:border-1" placeholder="you@company.com" />
              </div>
            </label>

            <label className="block text-sm text-white/90 relative">
              <span className="text-sm">Password</span>
              <div className="mt-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Key size={18} style={{ color: 'rgba(67,101,113)' }} />
                </div>
                <input name="password" type={showPassword ? 'text' : 'password'} required className="block w-full rounded-md bg-[#436571]/10 border border-white/10 text-white px-3 py-2 pl-10 pr-10 placeholder:text-white/50 focus:outline-none focus:border-[#436571] focus:border-1" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
                  {showPassword ? <EyeOff size={18} style={{ color: 'rgba(67,101,113)' }} /> : <Eye size={18} style={{ color: 'rgba(67,101,113)' }} />}
                </button>
              </div>
            </label>
            <div className="pt-4">
              <div className="flex items-center gap-2">
                <button type="submit" className="flex-1 rounded-3xl bg-[#436571]/50 text-white text-xl font-garet-book p-4 font-bold hover:brightness-95 transition">Sign in</button>

                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Continue with Google" onClick={() => onGoogle?.()} className="w-14 h-14 rounded-3xl bg-white flex items-center justify-center shadow-sm" title="Continue with Google">
                    <img src="/g.png" alt="Google" className="w-7 h-7" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                    <button type="button" aria-label="Continue with LinkedIn" onClick={() => onLinkedIn?.()} className="w-14 h-14 rounded-3xl bg-[#0A66C2] flex items-center justify-center shadow-sm" title="Continue with LinkedIn">
                      <img src="/in_white.png" alt="LinkedIn" className="w-7 h-7" />
                    </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
