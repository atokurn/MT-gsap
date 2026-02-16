import html from './index.html';

export default {
	async fetch(request, env, ctx) {
		const originURL = "https://origin-rabastrim.iseries.my.id";
		const url = new URL(request.url);

		// Construct the target URL (origin + path)
		const targetUrl = new URL(url.pathname + url.search, originURL);

		try {
			// Create a new request to the origin
			// We clone the original request but point it to the new URL
			const originRequest = new Request(targetUrl, request);

			const response = await fetch(originRequest);

			// Check for bad gateway / service unavailable / gateway timeout
			if (response.status === 502 || response.status === 503 || response.status === 504) {
				// Return the maintenance page
				return new Response(html, {
					status: 503, // Service Unavailable
					headers: {
						'content-type': 'text/html;charset=UTF-8',
						'Retry-After': '300', // Retry after 5 minutes
					},
				});
			}

			return response;

		} catch (e) {
			// Network error or other fetch failure -> Maintenance page
			return new Response(html, {
				status: 503,
				headers: {
					'content-type': 'text/html;charset=UTF-8',
					'Retry-After': '300',
				},
			});
		}
	},
};
