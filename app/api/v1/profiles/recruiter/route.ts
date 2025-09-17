import { NextResponse } from 'next/server';
import { API_BASE, forwardRequest } from '@/lib/server-proxy';

export async function GET(request: Request) {
  // If no upstream configured, return the same mock payload this route previously returned
  if (!API_BASE) {
    const mock = {
      profile: {
        user_id: '174fc941-0157-4621-905c-0e00b10d7740',
        email: 'recruiter@example.com',
        full_name: 'Recruiter',
        phone: '',
        role: 'RECRUITER',
        provider: 'GOOGLE',
        profile_completed: false,
        company_id: null,
        profile_photo_url: null,
        linkedin_url: null,
        associated_jobs: [],
        is_active: false,
        created_at: '0001-01-01T00:00:00Z',
        updated_at: '0001-01-01T00:00:00Z'
      }
    };
    return NextResponse.json(mock, { status: 200 });
  }

  return forwardRequest(request, '/profiles/recruiter');
}
