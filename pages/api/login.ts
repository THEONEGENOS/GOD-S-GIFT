import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const client = createClient({
        connectionString: process.env.VERCEL_POSTGRES_URL, // Ensure this is set in your environment variables
    });
    await client.connect();

    try {
        const result = await client.sql`
            SELECT * FROM users WHERE email = ${email} AND password = ${password}
        `;
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.status(200).json({ message: "User logged in successfully.", user });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user." });
    } finally {
        client.end();
    }
}
