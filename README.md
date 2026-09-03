# TravelMitra — SIH Tourism Web App (P0 starter)

## What's already built (P0 core loop)
- Next.js project skeleton (JavaScript, pages router)
- MongoDB connection helper (`lib/mongodb.js`)
- Sample seed data for Mysore listings (`data/seed.json`)
- Seed script to load sample data (`scripts/seed.js`)
- Landing page with PIN code search (`pages/index.js`)
- Search results page by PIN code (`pages/search.js`)
- Listing detail page (`pages/listing/[id].js`)
- Booking page with **mock** payment + real generated QR code (`pages/booking/[id].js`)
- API routes: `GET /api/listings`, `GET /api/listings/:id`, `POST /api/book`

## Not built yet (next steps)
- AI Trip Planner (needs an AI API call — itinerary generation)
- AI Heritage Explorer (photo upload + vision AI)
- Reviews, wishlist, Hindi/English toggle (P2)
- Premium UI polish / animations (P2)

## Setup steps

1. Install dependencies:
   ```
   npm install
   ```

2. Create a free MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
   - Create a database user + password
   - Allow network access from anywhere (0.0.0.0/0) for hackathon simplicity
   - Copy your connection string

3. Copy the env template and fill in your connection string:
   ```
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and paste your MongoDB URI.

4. Seed the database with sample Mysore listings:
   ```
   node scripts/seed.js
   ```

5. Run the dev server:
   ```
   npm run dev
   ```

6. Open http://localhost:3000 and search PIN code `570001` to see the seeded listings.

## Notes
- Payment is intentionally mocked (`paymentStatus: "mock_paid"`) — no real Razorpay/UPI charge happens. This is by design for the demo.
- The QR code is real and generated per booking using the `qrcode` npm package — it encodes the booking confirmation ID.
- Add more cities/listings by editing `data/seed.json` and re-running `node scripts/seed.js`.
