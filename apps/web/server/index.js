import express from 'express';
import { createRequestHandler } from '@remix-run/express';

const app = express();

app.use(express.static('./public'));

app.all(
    '*',
    createRequestHandler({
        build: "./build",
        getLoadContext() {
            // Context for your loaders (if any)
            return {}
        },
    })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

