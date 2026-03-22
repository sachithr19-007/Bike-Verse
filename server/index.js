import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get('/api/bikes', async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name parameter is required' });

    const apiKey = process.env.VITE_RAPIDAPI_KEY || process.env.VITE_NINJAS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key is missing in backend environment.' });
    }

    try {
        const url = `https://motorcycles-by-api-ninjas.p.rapidapi.com/v1/motorcycles?make=${encodeURIComponent(name)}`;
        console.log('Exact Full URL being called:', url);

        const response = await fetch(url, {
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'motorcycles-by-api-ninjas.p.rapidapi.com'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Full Error Response Body:', errorText);
            return res.status(response.status).json({ error: errorText });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Proxy Error:', err);
        res.status(500).json({ error: 'Failed to fetch from RapidAPI proxy.' });
    }
});

app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});
