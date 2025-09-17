import { NextResponse } from 'next/server';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_API_BASE_URL || process.env.API_BASE_URL;

function sanitizeApiBase(raw?: string) {
  if (!raw) return '';
  let s = raw.trim();
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    s = s.slice(1, -1).trim();
  }
  if (s.endsWith(';')) s = s.slice(0, -1).trim();
  s = s.replace(/\/+$/, '');
  return s;
}

const API_BASE = sanitizeApiBase(RAW_API_BASE);

async function forwardRequest(request: Request, upstreamPath: string) {
  if (!API_BASE) {
    return NextResponse.json({ error: 'API_BASE is not defined in env' }, { status: 500 });
  }

  const incomingUrl = new URL(request.url);
  const search = incomingUrl.search || '';
  const target = `${API_BASE}${upstreamPath}${search}`;

  const headers = new Headers();
  // forward important headers
  const auth = request.headers.get('authorization');
  if (auth) headers.set('authorization', auth);
  const accept = request.headers.get('accept');
  if (accept) headers.set('accept', accept);
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType as string);

  const method = request.method;
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.text();

  try {
    const res = await fetch(target, { method, headers, body });
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      return NextResponse.json(json, { status: res.status });
    } catch (_) {
      const contentType = res.headers.get('content-type') || 'text/plain';
      return new NextResponse(text, { status: res.status, headers: { 'content-type': contentType } });
    }
  } catch (err: any) {
    return NextResponse.json({ error: 'Upstream request failed', details: String(err) }, { status: 502 });
  }
}

export { forwardRequest, API_BASE };
