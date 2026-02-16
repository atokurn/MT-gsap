import html from './index.html';

export default {
	async fetch(request, env, ctx) {
		// 1. Konfigurasi
		const originHostname = "origin-rabastrim.iseries.my.id";
		const originURL = "https://" + originHostname;

		const url = new URL(request.url);
		const targetUrl = new URL(url.pathname + url.search, originURL);

		try {
			// 2. Siapkan Init Request
			const newRequestInit = {
				method: request.method,
				headers: new Headers(request.headers),
				redirect: "manual",
				duplex: 'half', // WAJIB ada untuk Mobile upload/POST body
			};

			// Teruskan body jika ada (POST/PUT)
			if (request.method !== "GET" && request.method !== "HEAD") {
				newRequestInit.body = request.body;
			}

			// --- PERUBAHAN BESAR DI SINI ---

			// A. Host Header: Wajib diganti agar Cloudflare Tunnel mau menerima request
			newRequestInit.headers.set("Host", originHostname);

			// B. X-Forwarded Headers: Ini cara standar memberi tahu Next.js
			// "Hei, aku cuma perantara. Domain aslinya adalah iseries.my.id"
			newRequestInit.headers.set("X-Forwarded-Host", "iseries.my.id");
			newRequestInit.headers.set("X-Forwarded-Proto", "https");
			newRequestInit.headers.set("X-Forwarded-For", request.headers.get("CF-Connecting-IP"));

			// C. JANGAN UBAH ORIGIN & REFERER!
			// Kita biarkan Origin tetap "https://iseries.my.id".
			// Karena Cookie Auth kamu milik "iseries.my.id".
			// Jika kita ubah Origin-nya, Auth akan crash (Error 500) karena mismatch.

			// (Kita hapus blok if-set-origin yang ada di script sebelumnya)

			// 3. Eksekusi Request
			const originRequest = new Request(targetUrl, newRequestInit);
			const response = await fetch(originRequest);

			// 4. Handle Failover (Server Mati)
			if (response.status === 502 || response.status === 503 || response.status === 504) {
				return new Response(html, {
					status: 503,
					headers: { 'content-type': 'text/html;charset=UTF-8', 'Retry-After': '300' },
				});
			}

			// 5. Bersihkan Header Response
			const newResponseHeaders = new Headers(response.headers);

			// Fix Redirect Location: Jika server menyuruh pindah ke origin-rabastrim, belokkan ke iseries
			if (newResponseHeaders.has("Location")) {
				const location = newResponseHeaders.get("Location");
				if (location && location.includes(originHostname)) {
					newResponseHeaders.set("Location", location.replace(originHostname, "iseries.my.id"));
				}
			}

			return new Response(response.body, {
				status: response.status,
				headers: newResponseHeaders,
			});

		} catch (e) {
			return new Response(html, {
				status: 503,
				headers: { 'content-type': 'text/html;charset=UTF-8' },
			});
		}
	},
};