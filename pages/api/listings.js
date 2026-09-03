// pages/api/listings.js
// GET /api/listings?pincode=570001
// Returns listings matching a pincode. If no pincode given, returns all.

import { getDb } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await getDb();
    const { pincode } = req.query;

    const filter = pincode ? { pincode: String(pincode) } : {};
    const listings = await db.collection("listings").find(filter).toArray();

    res.status(200).json({ listings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
}
