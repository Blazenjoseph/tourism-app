// lib/mongodb.js
// Reusable MongoDB connection helper for Next.js API routes.
// Uses a cached connection so we don't reconnect on every request in dev mode.

import dns from "dns";
import { MongoClient } from "mongodb";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const uri = process.env.MONGODB_URI; // set this in .env.local
const options = {};

let client;
let clientPromise;

if (!uri) {
  console.warn(
    "MONGODB_URI is not set. Add it to .env.local (see .env.local.example)."
  );
}

if (process.env.NODE_ENV === "development") {
  // In dev, use a global variable so the connection is preserved across
  // hot-reloads caused by Next.js's fast refresh.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect().catch((err) => {
      delete global._mongoClientPromise;
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper to get the app's database (name it "tourismapp" in Atlas,
// or change the string below to match whatever you name it there).
export async function getDb() {
  const client = await clientPromise;
  return client.db("tourismapp");
}
