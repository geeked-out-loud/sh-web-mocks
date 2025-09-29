import client from './api-client';
import { getAccessToken } from '@/config/auth';

export type RecruiterProfile = {
  user_id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
  provider: string | null;
  profile_completed: boolean;
  company_id: string | null;
  profile_photo_url: string | null;
  linkedin_url: string | null;
  associated_jobs: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function getRecruiterProfile(): Promise<{ profile: RecruiterProfile } | null> {
  const body = await client.apiGet('/profiles/recruiter');
  return body as { profile: RecruiterProfile };
}

export async function createRecruiterProfile(payload: Record<string, any>) {
  return client.apiPost('/profiles/recruiter', payload);
}

export async function getJobs(params?: Record<string, string | number>) {
  return client.apiGet('/jobs', { params });
}

export async function createJob(payload: Record<string, any>) {
  return client.apiPost('/jobs', payload);
}

export async function getJobById(id: string | number) {
  return client.apiGet(`/jobs/${id}`);
}

export async function generateJobJD(id: string | number) {
  return client.apiPost(`/jobs/${id}/jd`, {});
}

export async function updateJob(id: string | number, payload: Record<string, any>) {
  // If running in the browser, call the local Next.js proxy route to avoid CORS
  if (typeof window !== 'undefined') {
    // same-origin proxy
    const headers: Record<string,string> = { 'content-type': 'application/json', accept: 'application/json' };
    const token = getAccessToken();
    if (token) headers.authorization = `Bearer ${token}`;

    const res = await fetch(`/api/v1/jobs/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (!res.ok) {
        const err: any = new Error('API PATCH request failed');
        err.status = res.status;
        err.body = json;
        throw err;
      }
      return json;
    } catch (_) {
      if (!res.ok) throw new Error('API PATCH request failed');
      return text;
    }
  }

  // server-side: talk directly to upstream
  return client.apiPatch(`/jobs/${id}`, payload);
}

export async function createCompany(payload: Record<string, any>) {
  const path = client.API_BASE ? '/companies' : '/companies';
  return client.apiPost(path, payload);
}

export default { getRecruiterProfile, createRecruiterProfile, getJobs, createJob, createCompany };
