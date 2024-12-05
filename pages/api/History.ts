import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();

    const { value } = req.query;

    const status = (
        value === "history" ? "paid" :
        value === "orders" ? "pending" :
        "unknown"
    );

    try {
        await client.connect();
        const query = 'SELECT * FROM payment WHERE payment_status = $1'
        const result = await client.query(query, [status]);

      res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.end();
    }
}
