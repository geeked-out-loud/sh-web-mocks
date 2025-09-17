import { firebaseAuth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import client from '@/lib/api-client';

const provider = new GoogleAuthProvider();

// Prefer client-exposed env var for browser flows. Fall back to other names if present.
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_API_BASE_URL || process.env.API_BASE_URL;

function sanitizeApiBase(raw?: string) {
  if (!raw) return '';
  let s = raw.trim();
  // Remove surrounding single or double quotes
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    s = s.slice(1, -1).trim();
  }
  // Remove trailing semicolons
  if (s.endsWith(';')) s = s.slice(0, -1).trim();
  // Remove any accidental leading/trailing slashes at the end
  s = s.replace(/\/+$/, '');
  return s;
}

const API_BASE = sanitizeApiBase(RAW_API_BASE);

type BackendResponse<T = any> = {
  status: string;
  data?: T;
  [k: string]: any;
};

async function postIdToken(path: string, idToken: string, body: any = {}) {
  // use centralized api-client which handles API_BASE and headers
  try {
    const resp = await client.apiPost(path, body, { token: idToken });
    return resp as BackendResponse;
  } catch (err) {
    throw err;
  }
}

async function googlePopupFlow(path: string, requestBody: any = {}) {
  if (!firebaseAuth) throw new Error('Firebase Auth is not initialized');

  const result = await signInWithPopup(firebaseAuth, provider);
  const user: User = result.user;
  const idToken = await user.getIdToken();

  const response = await postIdToken(path, idToken, requestBody);
  return { user, response };
}

export async function signInWithGoogle(requestBody: any = {}) {
  return googlePopupFlow('/auth/google', requestBody);
}

export async function signUpWithGoogle(requestBody: any = {}) {
  return googlePopupFlow('/auth/google', requestBody);
}

export { provider as googleProvider };

// -----------------------------
// LinkedIn OAuth start flow (popup + postMessage)
// -----------------------------

// Opens a popup and waits for a postMessage payload with source === 'smarthire-linkedin'
function openPopupAndWait(authUrl: string, opts: { windowName?: string; width?: number; height?: number; timeoutMs?: number } = {}) {
  const { windowName = 'linkedin_oauth', width = 600, height = 700, timeoutMs = 120_000 } = opts;
  return new Promise<any>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Popup not available in this environment'));

    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      windowName,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes`
    );

    if (!popup) return reject(new Error('Popup blocked'));

    let timeoutId: any = null;
    const messageHandler = (event: MessageEvent) => {
      const payload = event && event.data;
      if (!payload || payload.source !== 'smarthire-linkedin') return;
      window.removeEventListener('message', messageHandler);
      if (timeoutId) clearTimeout(timeoutId);
      try { if (!popup.closed) popup.close(); } catch (_) {}
      resolve(payload);
    };

    window.addEventListener('message', messageHandler);

    // detect popup closed by user
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        if (timeoutId) clearTimeout(timeoutId);
        reject(new Error('Popup closed before authentication completed'));
      }
    }, 500);

    // safety timeout
    timeoutId = setTimeout(() => {
      clearInterval(checkClosed);
      window.removeEventListener('message', messageHandler);
      try { if (!popup.closed) popup.close(); } catch (_) {}
      reject(new Error('Authentication timed out'));
    }, timeoutMs);
  });
}

async function startLinkedInFlow(path: string) {
  if (!API_BASE) throw new Error('API_BASE is not defined in env');

  let res: Response;
  let body: any = null;
  try {
    body = await client.apiPost(path, {});
  } catch (networkErr: any) {
    const nerr: any = new Error('Network error when starting LinkedIn flow');
    nerr.cause = networkErr;
    // eslint-disable-next-line no-console
    console.error('startLinkedInFlow network error', networkErr);
    throw nerr;
  }

  // eslint-disable-next-line no-console
  console.debug('startLinkedInFlow response', { body });

  if (!body || !body.auth_url) {
    const err: any = new Error('Failed to start LinkedIn flow');
    err.body = body;
    // eslint-disable-next-line no-console
    console.error('startLinkedInFlow error', err);
    throw err;
  }

  const authUrl: string = body.auth_url;
  const payload = await openPopupAndWait(authUrl).catch((e) => {
    const err: any = new Error('LinkedIn popup flow failed');
    err.cause = e;
    // eslint-disable-next-line no-console
    console.error('openPopupAndWait error', e);
    throw err;
  });

  // payload expected shape: { source: 'smarthire-linkedin', data: { access_token: '...', ... } }
  if (payload && payload.data && payload.data.access_token) {
    setAccessToken(payload.data.access_token);
  }

  return payload;
}

export async function signInWithLinkedIn() {
  return startLinkedInFlow('/auth/linkedin');
}

export async function signUpWithLinkedIn() {
  return startLinkedInFlow('/auth/linkedin');
}

// -----------------------------
// Frontend token helpers (for flows where backend returns access token to client)
// -----------------------------

const ACCESS_TOKEN_KEY = 'app_access_token';

export function setAccessToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  else sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  // delegate to centralized api client
  return client.authFetch(input, init);
}

// Call this in a redirect landing page to read ?token=... from URL and store it
export function handleRedirectTokenFromUrl() {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token') || params.get('access_token');
  if (token) {
    setAccessToken(token);
    // Clean URL (remove token params)
    params.delete('token');
    params.delete('access_token');
    const base = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState({}, '', base);
    return token;
  }
  return null;
}