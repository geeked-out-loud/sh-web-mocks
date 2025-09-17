"use client";

import React, { useState } from 'react';
import api from '@/lib/api';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto px-4 py-6 sm:py-0">
      <div className="fixed inset-0 bg-black/40" onClick={onCloseAction} />

      <div className="relative w-full max-w-2xl mx-auto transform transition-all duration-300 ease-out opacity-100 z-30">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center px-6 pt-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-[#0F387A]">Company Registration</h2>
            <button onClick={onCloseAction} className="text-[#0F387A] hover:text-[#0b2b55] p-2">
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 overflow-auto flex-1">
            <p className="text-sm text-gray-600 mb-4">Register your company so your recruiter account can be linked to it.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Name</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="TechCorp Solutions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Website</label>
                <input
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="https://techcorp.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Size</label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                >
                  <option value="SMALL">SMALL</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LARGE">LARGE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Short description</label>
                <input
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="A leading technology company..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Locations (one per line)</label>
                <textarea
                  value={companyLocationsText}
                  onChange={(e) => setCompanyLocationsText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A] h-24"
                  placeholder="San Francisco, CA\nNew York, NY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Founded year</label>
                <input
                  value={companyFoundedYear}
                  onChange={(e) => setCompanyFoundedYear(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="2018"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Employee count</label>
                <input
                  value={companyEmployeeCount}
                  onChange={(e) => setCompanyEmployeeCount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="250"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">LinkedIn</label>
                <textarea
                  value={companySocialsText}
                  onChange={(e) => setCompanySocialsText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A] h-24"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Logo URL</label>
                <input
                  value={companyLogoUrl}
                  onChange={(e) => setCompanyLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="https://techcorp.com/assets/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">GST number</label>
                <input
                  value={companyGstNumber}
                  onChange={(e) => setCompanyGstNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="29ABCDE1234F1Z5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">CIN number</label>
                <input
                  value={companyCinNumber}
                  onChange={(e) => setCompanyCinNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A]"
                  placeholder="U72900MH2018PTC123456"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1c2e4a] mb-2">Reference links (one per line)</label>
                <textarea
                  value={companyReferenceLinksText}
                  onChange={(e) => setCompanyReferenceLinksText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F387A]/5 border border-[#0F387A]/20 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#0F387A] h-24"
                  placeholder="https://techcorp.com/about\nhttps://techcorp.com/careers"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t bg-white flex justify-end space-x-3">
            <button
              onClick={onCloseAction}
              disabled={submitting}
              className="px-4 py-2 rounded-full border border-[#0F387A]/20 text-[#0F387A] hover:bg-[#0F387A]/5 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full bg-gradient-to-br from-[#0F387A] to-[#126F7D] text-white shadow-md hover:opacity-95 transition"
            >
              {submitting ? 'Saving...' : 'Save & Continue to Signup'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
