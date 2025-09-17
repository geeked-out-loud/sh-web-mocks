import { NextResponse } from 'next/server';

// Simple validation helper
function validateCompany(body: any) {
  if (!body || typeof body !== 'object') return 'Invalid JSON body';
  if (!body.name || typeof body.name !== 'string') return 'Missing or invalid "name"';
  // website optional but if present must be string
  if (body.website && typeof body.website !== 'string') return 'Invalid "website"';
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const err = validateCompany(body);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    // In a real implementation you'd persist to a database here.
    // We'll return a mock created resource with an id and echo back the payload.
    const created = {
      id: Math.floor(Math.random() * 1000000) + 1000,
      ...body,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ status: 'ok', data: created }, { status: 201 });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error('API /api/v1/companies error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
