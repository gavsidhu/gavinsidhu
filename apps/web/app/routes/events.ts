import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
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
};

