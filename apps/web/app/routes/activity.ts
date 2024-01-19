import { LoaderFunction, json } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        const serverUrl = `${process.env.BACKEND_URL as string}/activity`;

        const response = await fetch(serverUrl, {
            method: 'GET',
            headers: {
                'Authorization': process.env.AUTH_TOKEN as string
            },
        });

        if (!response.ok) {
            throw new Error(`Error from server: ${response.status}`);
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        console.error('Failed to fetch data from Go Chi server:', error);
        return json({ message: 'Failed to fetch data' }, { status: 500 });
    }
};

