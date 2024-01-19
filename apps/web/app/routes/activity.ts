import { LoaderFunction, json } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
    try {
        const goChiServerUrl = 'http://localhost:3333/activity';

        const response = await fetch(goChiServerUrl, {
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

