import { LoaderFunction, json } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    try {
        const url = `${process.env.BACKEND_URL as string}/activity/sse`;
        const response = await fetch(url, {
            headers: {
                'Authorization': process.env.AUTH_TOKEN as string
            }
        });

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            }
        });
    } catch (error) {
        console.error('Failed to fetch data from server:', error);
        return json({ message: 'Failed to fetch data' }, { status: 500 });
    }
};

