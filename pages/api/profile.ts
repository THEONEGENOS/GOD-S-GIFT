import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient({ connectionString: process.env.VERCEL_POSTGRES_URL });

  if (req.method === "GET") {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      await client.connect();
      const result = await client.sql`
        SELECT email, name, address, contact
        FROM users
        WHERE email = ${email}
      `;

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ user: result.rows[0] });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    } finally {
      client.end();
    }
  } else if (req.method === "POST") {
    const { email, name, address, contact } = req.body;

    try {
      await client.connect();
      const result = await client.sql`
        UPDATE users
        SET name = ${name}, address = ${address}, contact = ${contact}
        WHERE email = ${email}
      `;

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    } finally {
      client.end();
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
