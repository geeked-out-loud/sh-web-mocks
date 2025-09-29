import { forwardRequest } from '@/lib/server-proxy';

export async function GET(request: Request, context: any) {
  const id = context?.params?.id;
  return forwardRequest(request, `/jobs/${id}`);
}

export async function PATCH(request: Request, context: any) {
  const id = context?.params?.id;
  return forwardRequest(request, `/jobs/${id}`);
}

export async function DELETE(request: Request, context: any) {
  const id = context?.params?.id;
  return forwardRequest(request, `/jobs/${id}`);
}
