import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle POST request to create an order
    if (req.method === 'POST') {
        const { date, time, gallonCount, deliveryType, waterType, email } = req.body;
    
        if (!date || !time || !gallonCount || !deliveryType || !waterType || !email) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
    
        const pricePerGallon = 15;
        const totalPrice = gallonCount * pricePerGallon;
    
        try {
            const client = createClient();
            await client.connect();
    
            // Check if stock is available
            const stockCheckQuery = `
                SELECT stock 
                FROM inventory 
                WHERE product_name = $1;
            `;
            const stockResult = await client.query(stockCheckQuery, [waterType]);
    
            if (stockResult.rowCount === 0) {
                return res.status(404).json({ message: 'Water type not found in inventory.' });
            }
    
            const currentStock = stockResult.rows[0].stock;
    
            if (currentStock < gallonCount) {
                return res.status(400).json({ message: 'Insufficient stock for the requested water type.' });
            }
    
            // Insert the order
            const orderQuery = `
                INSERT INTO orders (date, time, gallon_count, delivery_type, water_type, total_price, email)
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;
            `;
            const orderValues = [date, time, gallonCount, deliveryType, waterType, totalPrice, email];
            const result = await client.query(orderQuery, orderValues);
    
            const orderId = result.rows[0]?.id;
    
            res.status(201).json({ message: 'Order created successfully.', orderId });
        } catch (error) {
            console.error('Error processing order:', error instanceof Error ? error.message : error);
            res.status(500).json({ message: 'An error occurred while processing your order.' });
        }
    }
    

    // Handle GET request to fetch orders by email
    else if (req.method === 'GET') {
        const { email } = req.query;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ message: 'Email is required.' });
        }

        try {
            const client = createClient();
            await client.connect();

            const query = `
            SELECT id, date, time, gallon_count, delivery_type, water_type, total_price
            FROM orders
            WHERE email = $1
            ORDER BY date DESC, time DESC
            LIMIT 1;
        `;
            const values = [email];

            const result = await client.query(query, values);

            if (result.rows.length > 0) {
                res.status(200).json({ orders: result.rows });
            } else {
                res.status(404).json({ message: 'No orders found for this email.' });
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'An error occurred while fetching orders.' });
        }
    }

    // Handle DELETE request to delete an order
    else if (req.method === 'DELETE') {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Order ID is required.' });
        }

        try {
            const client = createClient();
            await client.connect();

            // Delete the order from the database
            const query = 'DELETE FROM orders WHERE id = $1';
            const values = [id];

            const result = await client.query(query, values);

            if (result.rowCount === 0) {
                return res.status(404).json({ message: 'Order not found.' });
            }

            res.status(200).json({ message: 'Order deleted successfully.' });
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).json({ message: 'An error occurred while deleting the order.' });
        }
    }

    // Handle invalid HTTP methods
    else {
        res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
        res.status(405).json({ message: `Method ${req.method} not allowed.` });
    }
}
