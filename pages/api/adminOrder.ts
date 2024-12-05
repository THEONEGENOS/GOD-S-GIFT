import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();

    if (req.method === 'PUT') {
        const { orderId } = req.body;

        try {
            await client.connect();
            const query = 'UPDATE payment SET payment_status = $1 WHERE id = $2';
            const values = ['paid', orderId];
            await client.query(query, values);
            res.status(200).json({ message: 'Order status updated successfully.' });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ error: 'Failed to update order status.' });
        }
        client.end()
    } else if (req.method === 'DELETE') {
        const { orderId } = req.body;

        try {
            await client.connect();
            const query = 'DELETE FROM payment WHERE id = $1';
            const values = [orderId];
            await client.query(query, values);
            res.status(200).json({ message: 'Order deleted successfully.' });
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({ error: 'Failed to delete order.' });
        }
        client.end()
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}