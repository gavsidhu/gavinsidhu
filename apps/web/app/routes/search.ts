import { LoaderFunction, json } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
    try {
        const goChiServerUrl = 'http://localhost:3333/activity/search';

        const requestUrl = new URL(request.url);

        const params = new URLSearchParams(requestUrl.search);

        const q = params.get("q")

        const response = await fetch(goChiServerUrl, {
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

