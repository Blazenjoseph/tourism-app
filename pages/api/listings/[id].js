// pages/api/listings/[id].js
// GET /api/listings/:id - returns one listing by its MongoDB _id

import { ObjectId } from "mongodb";
import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await getDb();
    const { id } = req.query;

    const listing = await db
      .collection("listings")
      .findOne({ _id: new ObjectId(id) });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json({ listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listing" });
  }
}
