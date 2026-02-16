import html from './index.html';

export default {
	async fetch(request, env, ctx) {
		return new Response(html, {
			status: 503,
			headers: {
				'content-type': 'text/html;charset=UTF-8',
				'Retry-After': '3600', // Retry after 1 hour
			},
		});
	},
};
