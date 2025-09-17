import api from '@/lib/api';

type BackendResponse<T = any> = {
  status: string;
  data?: T;
  [k: string]: any;
};

// Accept a generic payload (company/recruiter profile) to send to the backend.
export async function createRecruiterProfile(payload: Record<string, any>): Promise<BackendResponse> {
  const body = await api.createRecruiterProfile(payload);
  return body as BackendResponse;
}

export default createRecruiterProfile;
