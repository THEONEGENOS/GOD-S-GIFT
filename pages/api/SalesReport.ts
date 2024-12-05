import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();

    try {
        await client.connect();
        const query = `
            SELECT id, product_name, quantity, revenue
            FROM payment;
        `;
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching sales report:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
}
