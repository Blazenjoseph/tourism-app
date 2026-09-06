import { ObjectId } from "mongodb";
import { getDb } from "../../lib/mongodb";

export default async function handler(req, res) {
  const db = await getDb();

  if (req.method === "GET") {
    const { listingId } = req.query;
    if (!listingId) {
      return res.status(400).json({ error: "listingId is required" });
    }
    try {
      const reviews = await db
        .collection("reviews")
        .find({ listingId: new ObjectId(listingId) })
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json({ reviews });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch reviews" });
    }
  }

  if (req.method === "POST") {
    try {
      const { listingId, name, rating, comment } = req.body;
      if (!listingId || !name || !rating) {
        return res
          .status(400)
          .json({ error: "listingId, name, and rating are required" });
      }

      const review = {
        listingId: new ObjectId(listingId),
        name,
        rating: Number(rating),
        comment: comment || "",
        createdAt: new Date(),
      };

      await db.collection("reviews").insertOne(review);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to submit review" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
