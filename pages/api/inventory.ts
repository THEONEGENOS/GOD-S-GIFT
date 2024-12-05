import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();
  await client.connect();

  try {
    if (req.method === 'GET') {
      const result = await client.query('SELECT id, product_name, stock FROM inventory');
      res.status(200).json(result.rows);
    } else if (req.method === 'PUT') {
      const { id, stock } = req.body;

      // Validate input
      if (typeof id !== 'number' || typeof stock !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
      }

      // Update the database
      const query = 'UPDATE inventory SET stock = $1 WHERE id = $2';
      const result = await client.query(query, [stock, id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Item not found' });
      }

      res.status(200).json({ message: 'Stock updated successfully' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
}
