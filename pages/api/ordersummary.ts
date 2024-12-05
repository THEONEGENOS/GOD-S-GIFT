import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email } = req.body; // Assuming email is passed in the request body

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    const client = createClient();
    await client.connect();

    try {
        // Query the orders table to fetch orders by email
        const result = await client.sql`
            SELECT * FROM orders WHERE email = ${email}
        `;

        // Check if there are orders
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No orders found for this email." });
        }

        // Respond with the orders
        res.status(200).json({ orders: result.rows });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error fetching orders." });
    } finally {
        await client.end();
    }
}
