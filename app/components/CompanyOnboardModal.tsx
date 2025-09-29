"use client";

import React, { useState } from 'react';
import api from '@/lib/api';
import { X, User, AtSign, WholeWord, MapPin, Calendar, Users, Image, Hash, Linkedin } from 'lucide-react';
import Dropdown from './ui/Dropdown';

type Props = {
  open: boolean;
  onCloseAction: () => void;
  onSavedAction: (companyId: string | number | null, payload: any) => void;
};

export default function CompanyOnboardModal({ open, onCloseAction, onSavedAction }: Props) {
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companySize, setCompanySize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyLocationsText, setCompanyLocationsText] = useState('');
  const [companyFoundedYear, setCompanyFoundedYear] = useState('');
  const [companyEmployeeCount, setCompanyEmployeeCount] = useState('');
  const [companySocialsText, setCompanySocialsText] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyGstNumber, setCompanyGstNumber] = useState('');
  const [companyCinNumber, setCompanyCinNumber] = useState('');
  const [companyReferenceLinksText, setCompanyReferenceLinksText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSave() {
    if (!companyName.trim()) {
      alert('Company name is required');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        name: companyName || undefined,
        website: companyWebsite || undefined,
        size: companySize || undefined,
        description: companyDescription || undefined,
        locations: companyLocationsText.split('\n').map((s) => s.trim()).filter(Boolean) || undefined,
        founded_year: companyFoundedYear ? Number(companyFoundedYear) : undefined,
        employee_count: companyEmployeeCount ? Number(companyEmployeeCount) : undefined,
        socials: companySocialsText.split('\n').map((s) => s.trim()).filter(Boolean) || undefined,
        logo_url: companyLogoUrl || undefined,
        gst_number: companyGstNumber || undefined,
        cin_number: companyCinNumber || undefined,
        reference_links: companyReferenceLinksText.split('\n').map((s) => s.trim()).filter(Boolean) || undefined,
      };

    // use centralized API client
    // lib/api.createCompany returns parsed body or throws on non-OK
    // The backend may return either { status: 'ok', data: created } OR the created object directly.
    // Normalize both shapes so callers get a consistent result.
    // @ts-ignore - dynamic payload types from backend
    const body = await api.createCompany(payload);

    // Normalize created object: prefer body.data (wrapped) else use body itself
    const created = body?.data ?? body ?? null;

    // Some backends wrap the created company inside `company` (e.g. { company: { id: 11, ... } }).
    // Support these shapes by selecting the nested company object when present.
    let createdCompany: any = created;
    if (created && typeof created === 'object') {
      if (created.company) createdCompany = created.company;
      else if (created.data && created.data.company) createdCompany = created.data.company;
    }

    // Try common id fields from different backends
    const id = createdCompany?.id ?? createdCompany?.company_id ?? createdCompany?._id ?? null;
    const companyId = id ?? null;

    // Extract LinkedIn url if provided by server response (createdCompany.socials)
    let linkedinUrl: string | null = null;
    try {
      const socials: any[] = createdCompany?.socials ?? [];
      for (const s of socials) {
        if (!s) continue;
        const sl = String(s).trim();
        if (sl.toLowerCase().includes('linkedin.com')) {
          linkedinUrl = sl;
          break;
        }
      }
    } catch (_) {}

    // persist minimal prefill
    try { sessionStorage.setItem('signup_company_name', companyName); } catch (_) {}
    if (companyId !== null && companyId !== undefined) {
      try { sessionStorage.setItem('signup_company_id', String(companyId)); } catch (_) {}
    }
    if (linkedinUrl) {
      try { sessionStorage.setItem('signup_company_linkedin', String(linkedinUrl)); } catch (_) {}
    }

    // After company creation, notify parent with created company id and linkedin url
    onSavedAction(companyId, { linkedin_url: linkedinUrl });
    } catch (err: any) {
      console.error('Failed to create company', err);
      alert(err?.message || 'Failed to create company');
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" onClick={onCloseAction} />
      <div className="relative w-full max-w-3xl rounded-2xl p-1" aria-modal="true" role="dialog" aria-label="Company Registration">
        <div className="w-full bg-[linear-gradient(rgba(67,101,113,0.08),rgba(54,73,72,0.06))] backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between scrollbar-hide">
            <h3 className="text-xl font-semibold text-white font-garet-book">Company Registration</h3>
            <button type="button" onClick={onCloseAction} aria-label="Close" className="text-white/90 hover:text-white">
              <X size={28} className='hover:bg-[#436571]/10 m-1 rounded-md' />
            </button>
          </div>
          <div className="border-t border-white/6" />

          <form className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <p className="text-sm text-white/70 mb-2">Register your company so your recruiter account can be linked to it.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-white/90 relative">
                  <span className="text-sm">Name</span>
                  <div className="mt-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <User size={18} style={{ color: 'rgba(67,101,113)' }} />
                    </div>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="block w-full rounded-md bg-[#436571]/10 border border-white/10 text-white px-3 py-2 pl-10 h-12 placeholder:text-white/50 focus:outline-none focus:border-[#436571] focus:border-1"
                      placeholder="TechCorp Solutions"
                    />
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm text-white/90 relative">
                  <span className="text-sm">Website</span>
                  <div className="mt-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <AtSign size={18} style={{ color: 'rgba(67,101,113)' }} />
                    </div>
                    <input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className="block w-full rounded-md bg-[#436571]/10 border border-white/10 text-white px-3 py-2 pl-10 h-12 placeholder:text-white/50 focus:outline-none focus:border-[#436571] focus:border-1"
                      placeholder="https://techcorp.com"
                    />
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm text-white/90 mb-1">Size</label>
                <Dropdown
                  value={companySize}
                  options={[{ value: 'SMALL', label: 'SMALL' }, { value: 'MEDIUM', label: 'MEDIUM' }, { value: 'LARGE', label: 'LARGE' }]}
                  onChangeAction={(v) => setCompanySize(v as any)}
                />
              </div>

              <div>
                <label className="block text-sm text-white/90 relative">
                  <span className="text-sm">Short description</span>
                  <div className="mt-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <WholeWord size={18} style={{ color: 'rgba(67,101,113)' }} />
                    </div>
                    <input
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      className="block w-full rounded-md bg-[#436571]/10 border border-white/10 text-white px-3 py-2 pl-10 h-12 placeholder:text-white/50 focus:outline-none focus:border-[#436571] focus:border-1"
                      placeholder="A leading technology company..."
                    />
                  </div>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white/90 mb-2">Locations (one per line)</label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-3 pointer-events-none">
                    <MapPin size={18} style={{ color: 'rgba(67,101,113)' }} />
                  </div>
                  <textarea
                    value={companyLocationsText}
                    onChange={(e) => setCompanyLocationsText(e.target.value)}
                    className="w-full px-3 py-2 pl-10 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1 h-24"
                    placeholder="San Francisco, CA\nNew York, NY"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/90 mb-2">Founded year</label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Calendar size={18} style={{ color: 'rgba(67,101,113)' }} />
                  </div>
                  <input
                    value={companyFoundedYear}
                    onChange={(e) => setCompanyFoundedYear(e.target.value)}
                    className="w-full px-3 py-2 h-12 pl-10 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1"
                    placeholder="2018"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/90 mb-2">Employee count</label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Users size={18} style={{ color: 'rgba(67,101,113)' }} />
                  </div>
                  <input
                    value={companyEmployeeCount}
                    onChange={(e) => setCompanyEmployeeCount(e.target.value)}
                    className="w-full px-3 py-2 h-12 pl-10 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1"
                    placeholder="250"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white/90 mb-2">LinkedIn</label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-3 pointer-events-none">
                    <Linkedin size={18} style={{ color: 'rgba(67,101,113)' }} />
                  </div>
                  <textarea
                    value={companySocialsText}
                    onChange={(e) => setCompanySocialsText(e.target.value)}
                    className="w-full px-3 py-2 pl-10 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1 h-24"
                    placeholder="https://linkedin.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/90 mb-2">Logo URL</label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Image size={18} style={{ color: 'rgba(67,101,113)' }} />
                  </div>
                  <input
                    value={companyLogoUrl}
                    onChange={(e) => setCompanyLogoUrl(e.target.value)}
                    className="w-full px-3 py-2 h-12 pl-10 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1"
                    placeholder="https://techcorp.com/assets/logo.png"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-white/90 mb-2">GST number</label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Hash size={18} style={{ color: 'rgba(67,101,113)' }} />
                  </div>
                  <input
                    value={companyGstNumber}
                    onChange={(e) => setCompanyGstNumber(e.target.value)}
                    className="w-full px-3 py-2 h-12 pl-10 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1"
                    placeholder="29ABCDE1234F1Z5"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white/90 mb-2">CIN number</label>
                <div className="mt-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Hash size={18} style={{ color: 'rgba(67,101,113)' }} />
                  </div>
                  <input
                    value={companyCinNumber}
                    onChange={(e) => setCompanyCinNumber(e.target.value)}
                    className="w-full px-3 py-2 h-12 pl-10 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1"
                    placeholder="U72900MH2018PTC123456"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white/90 mb-2">Reference links (one per line)</label>
                <textarea
                  value={companyReferenceLinksText}
                  onChange={(e) => setCompanyReferenceLinksText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#436571]/10 border border-white/10 rounded-md text-white focus:outline-none focus:border-[#436571] focus:border-1 h-24"
                  placeholder="https://techcorp.com/about\nhttps://techcorp.com/careers"
                />
              </div>
            </div>

            {/* Footer inside form so Save works with Enter */}
            <div className="pt-4">
              <div className="flex justify-end items-center gap-3">
                <button
                  onClick={onCloseAction}
                  disabled={submitting}
                  type="button"
                  className="px-4 py-2 rounded-full border border-white/12 text-white hover:bg-white/5 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-full bg-[#436571] text-white shadow-md hover:opacity-95 transition"
                >
                  {submitting ? 'Saving...' : 'Save & Continue to Signup'}
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
