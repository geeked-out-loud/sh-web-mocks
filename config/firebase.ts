// Safe Firebase initializer for Next.js
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Build config from NEXT_PUBLIC_* env vars (available client-side in Next.js)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;

// Initialize only in the browser to avoid SSR issues, and avoid double initialization
if (typeof window !== 'undefined') {
  try {
    firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig as any);
    firebaseAuth = getAuth(firebaseApp);
  } catch (err) {
    // If initialization fails, keep values null and allow the app to handle the error where used
    // eslint-disable-next-line no-console
    console.warn('Firebase initialization warning:', err);
    firebaseApp = null;
    firebaseAuth = null;
  }
}

export { firebaseApp, firebaseAuth };

export default firebaseApp;
