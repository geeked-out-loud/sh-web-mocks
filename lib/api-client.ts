const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_API_BASE_URL || process.env.API_BASE_URL || '';

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

function buildUrl(path: string) {
  // If path already looks absolute, return as-is
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE) return path.startsWith('/') ? path : `/${path}`;
  // ensure path starts with /
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

async function parseResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
}

function readAccessTokenFromStorage(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('app_access_token');
  } catch (_) {
    return null;
  }
}

export async function apiGet(path: string, opts: { token?: string; headers?: Record<string,string>; params?: Record<string,string|number> } = {}) {
  const { token: overrideToken, headers = {}, params } = opts;
  const token = overrideToken ?? readAccessTokenFromStorage();
  const h: Record<string,string> = { accept: 'application/json', ...headers };
  if (token) h.authorization = `Bearer ${token}`;

  const qs = params ? `?${new URLSearchParams(Object.entries(params).reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {})).toString()}` : '';
  const target = buildUrl(path) + qs;
  const res = await fetch(target, { method: 'GET', headers: h });
  const body = await parseResponse(res).catch(() => null);
  if (!res.ok) {
    const err: any = new Error('API GET request failed');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export async function apiPost(path: string, payload: any, opts: { token?: string; headers?: Record<string,string> } = {}) {
  const { token: overrideToken, headers = {} } = opts;
  const token = overrideToken ?? readAccessTokenFromStorage();
  const h: Record<string,string> = { 'content-type': 'application/json', accept: 'application/json', ...headers };
  if (token) h.authorization = `Bearer ${token}`;

  const target = buildUrl(path);
  const res = await fetch(target, { method: 'POST', headers: h, body: JSON.stringify(payload) });
  const body = await parseResponse(res).catch(() => null);
  if (!res.ok) {
    const err: any = new Error('API POST request failed');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export async function apiPatch(path: string, payload: any, opts: { token?: string; headers?: Record<string,string> } = {}) {
  const { token: overrideToken, headers = {} } = opts;
  const token = overrideToken ?? readAccessTokenFromStorage();
  const h: Record<string,string> = { 'content-type': 'application/json', accept: 'application/json', ...headers };
  if (token) h.authorization = `Bearer ${token}`;

  const target = buildUrl(path);
  const res = await fetch(target, { method: 'PATCH', headers: h, body: JSON.stringify(payload) });
  const body = await parseResponse(res).catch(() => null);
  if (!res.ok) {
    const err: any = new Error('API PATCH request failed');
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = readAccessTokenFromStorage();
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  return res;
}

export default { apiGet, apiPost, apiPatch, buildUrl, API_BASE, authFetch };
