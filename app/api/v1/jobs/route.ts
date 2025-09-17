import { forwardRequest } from '@/lib/server-proxy';

export async function GET(request: Request) {
  return forwardRequest(request, '/jobs');
}

export async function POST(request: Request) {
  return forwardRequest(request, '/jobs');
}
