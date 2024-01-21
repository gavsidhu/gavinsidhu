import { LoaderFunction, json } from '@remix-run/node';
import rateLimiter, { getIpAddress } from '~/lib/rateLimiter';

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const ipAddress = getIpAddress(request)
        if (!await rateLimiter(ipAddress)) {
            throw new Response("Rate limit exceeded", { status: 429 });
        }
        const serverUrl = `${process.env.BACKEND_URL as string}/activity/search`;

        const requestUrl = new URL(request.url);

        const params = new URLSearchParams(requestUrl.search);

        const q = params.get("q")

        const response = await fetch(serverUrl, {
            method: 'POST',
            headers: {
                'Authorization': process.env.AUTH_TOKEN as string
            },

            body: JSON.stringify({ "query": q })
        });

        if (!response.ok) {
            throw new Error(`Error from server: ${response.status}`);
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        return json({ message: 'Failed to fetch data' }, { status: 500 });
    }
};

