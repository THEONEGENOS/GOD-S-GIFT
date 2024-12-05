import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const client = createClient();
    await client.connect();

    try {
        // Insert the new user into the "user" table
        await client.sql`
            INSERT INTO users (email, password, role)
            VALUES (${email}, ${password}, ${role})
        `;
        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Error adding user." });
    } finally {
        client.end();
    }
}
