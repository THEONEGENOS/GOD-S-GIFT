import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();

  try {
    await client.connect();

    if (req.method === "POST") {
      const {
        water_type,
        gallon_count,
        total_price,
        address,
        email,
        payment_method,
        payment_status,
      } = req.body;

      // Validate input
      if (
        !water_type ||
        !gallon_count ||
        !total_price ||
        !email ||
        !payment_method ||
        !payment_status
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Start transaction
      await client.query("BEGIN");

      // Check stock availability
      const stockQuery = `
        SELECT stock FROM inventory WHERE product_name = $1 FOR UPDATE;
      `;
      const stockResult = await client.query(stockQuery, [water_type]);

      if (stockResult.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Product not found in inventory" });
      }

      const currentStock = stockResult.rows[0].stock;

      if (currentStock < gallon_count) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "Insufficient stock for the requested water type" });
      }

      // Subtract stock
      const updateStockQuery = `
        UPDATE inventory SET stock = stock - $1 WHERE product_name = $2;
      `;
      await client.query(updateStockQuery, [gallon_count, water_type]);

      // Insert data into the payment table
      const paymentQuery = `
        INSERT INTO payment (water_type, gallon_count, total_price, address, email, payment_type, payment_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const paymentValues = [
        water_type,
        gallon_count,
        total_price,
        address || null, // Handle optional address
        email,
        payment_method,
        payment_status,
      ];
      const paymentResult = await client.query(paymentQuery, paymentValues);

      // Commit transaction
      await client.query("COMMIT");

      res.status(201).json({
        message: "Payment recorded successfully",
        payment: paymentResult.rows[0],
      });
    } else if (req.method === "GET") {
      // Fetch all records from the payment table
      const query = `
        SELECT order_id, customer, email, total
        FROM payment;
      `;
      const result = await client.query(query);

      res.status(200).json(result.rows);
    } else {
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Database error:", error);
    if (client) await client.query("ROLLBACK"); // Rollback transaction on error
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.end();
  }
}
