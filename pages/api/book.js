// pages/api/book.js
// POST /api/book  { listingId, name }
// Creates a mock booking (no real payment charged) and returns a QR code
// (as a data URL) encoding the booking confirmation ID.

import { ObjectId } from "mongodb";
import QRCode from "qrcode";
import { getDb } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { listingId, name } = req.body;
    if (!listingId || !name) {
      return res.status(400).json({ error: "listingId and name are required" });
    }

    const db = await getDb();
    const listing = await db
      .collection("listings")
      .findOne({ _id: new ObjectId(listingId) });

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const booking = {
      listingId: listing._id,
      listingName: listing.name,
      guestName: name,
      amount: listing.price,
      paymentStatus: "mock_paid", // clearly labeled as a mock payment, no real charge
      createdAt: new Date(),
    };

    const result = await db.collection("bookings").insertOne(booking);
    const confirmationId = result.insertedId.toString();

    // Encode a simple confirmation string into the QR code
    const qrDataUrl = await QRCode.toDataURL(
      `TravelMitra Booking Confirmation: ${confirmationId}`
    );

    res.status(200).json({ confirmationId, qrDataUrl, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
}
