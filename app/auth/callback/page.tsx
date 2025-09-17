"use client";

import { useEffect } from 'react';
import { handleRedirectTokenFromUrl, setAccessToken } from '../../../config/auth';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
	const router = useRouter();

	useEffect(() => {
		// If backend redirected with token in query, capture it and redirect to home
		const token = handleRedirectTokenFromUrl();
		if (token) {
			// token already stored by helper; navigate to home
			router.replace('/home');
			return;
		}
		// If no token in URL, just navigate back to home after a brief pause
		const t = setTimeout(() => router.replace('/home'), 500);
		return () => clearTimeout(t);
	}, [router]);

	return (
		<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
			<div>
				<h2>Completing authentication…</h2>
				<p>If you are not redirected automatically, please return to the app.</p>
			</div>
		</div>
	);
}
