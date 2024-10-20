export async function handle({ event, resolve }) {
	const response = await resolve(event);

	// Add the CSP header
	response.headers.set('Content-Security-Policy', "script-src 'self' https://www.vercel-insights.com https://vercel.live");
	response.headers.set('Access-Control-Allow-Origin', '*');

	return response;
}