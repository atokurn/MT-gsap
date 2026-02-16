import html from './index.html';

export default {
	async fetch(request, env, ctx) {
		const originURL = "https://origin-rabastrim.iseries.my.id";
		const url = new URL(request.url);
		const targetUrl = new URL(url.pathname + url.search, originURL);

		try {
			// 1. Siapkan request baru
			// Kita set redirect: 'manual' agar Worker bisa menangkap jika Origin mencoba redirect
			const originRequest = new Request(targetUrl, {
				method: request.method,
				headers: request.headers,
				redirect: 'manual'
			});

			// --- BAGIAN HEADER PENTING ---
			// Host: Agar Cloudflare Network tahu harus kirim ke Tunnel mana
			originRequest.headers.set("Host", "origin-rabastrim.iseries.my.id");

			// X-Forwarded-Host: Agar Next.js tahu domain asli browser user (iseries.my.id)
			// Ini mencegah Next.js melakukan redirect otomatis ke domain origin.
			originRequest.headers.set("X-Forwarded-Host", "iseries.my.id");

			// X-Forwarded-Proto: Memastikan Next.js tahu ini koneksi HTTPS aman
			originRequest.headers.set("X-Forwarded-Proto", "https");

			const response = await fetch(originRequest);

			// 2. Cek Error Server (502/503/504) -> Tampilkan Maintenance
			if (response.status === 502 || response.status === 503 || response.status === 504) {
				return new Response(html, {
					status: 503,
					headers: { 'content-type': 'text/html;charset=UTF-8', 'Retry-After': '300' },
				});
			}

			// 3. Tangani Redirect dari Origin (301/302/307/308)
			// Jika Next.js masih bandel mencoba redirect ke 'origin-rabastrim', kita paksa rewrite
			if (response.status >= 300 && response.status < 400) {
				const location = response.headers.get('Location');
				if (location) {
					// Ganti 'origin-rabastrim' dengan 'iseries.my.id' di URL redirect
					const newLocation = location.replace('origin-rabastrim.iseries.my.id', 'iseries.my.id');
					const newHeaders = new Headers(response.headers);
					newHeaders.set('Location', newLocation);
					return new Response(response.body, {
						status: response.status,
						headers: newHeaders
					});
				}
			}

			// 4. Jika response HTML, kita perlu memastikan tidak ada base tag yang salah
			// (Optional: Bisa ditambahkan HTMLRewriter jika masih ada masalah link)
			return response;

		} catch (e) {
			// Network Error (Tunnel Mati Total) -> Maintenance
			return new Response(html, {
				status: 503,
				headers: { 'content-type': 'text/html;charset=UTF-8', 'Retry-After': '300' },
			});
		}
	},
};