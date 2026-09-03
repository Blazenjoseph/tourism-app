// scripts/seed.js
// Run with: node scripts/seed.js
// Loads the sample listings from data/seed.json into MongoDB Atlas.

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config({ path: ".env.local" });
const { MongoClient } = require("mongodb");
const listings = require("../data/seed.json");

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found. Add it to .env.local first.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("tourismapp");

  await db.collection("listings").deleteMany({}); // clear old data first
  const result = await db.collection("listings").insertMany(listings);

  console.log(`Inserted ${result.insertedCount} listings.`);
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
