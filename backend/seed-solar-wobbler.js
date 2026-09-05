/**
 * seed-solar-wobbler.js
 * ─────────────────────────────────────────────────────────────────────────────
 * One-shot seed script that creates the Solar Wobbler product in MongoDB.
 * Run ONCE after the DB is live:
 *
 *   cd backend
 *   node seed-solar-wobbler.js
 *
 * Idempotent: if a product with the same name already exists it is skipped.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error('❌  MONGO_URI not set. Add it to backend/.env');
  process.exit(1);
}

// ── Solar Wobbler product payload ─────────────────────────────────────────────
const WOBBLER = {
  productType:      'wobbler',
  name:             'Solar Wobbler',
  slug:             'solar-wobbler',
  category:         'solar-wobbler',
  shortDescription: 'Solar-powered kinetic desk art — no batteries, just light.',
  description:
    'The Solar Wobbler is a mesmerising kinetic sculpture powered entirely by light. ' +
    'Place it in sunlight or under a lamp and watch it sway with hypnotic, ' +
    'endless motion — no batteries, no charging, no noise. ' +
    'The perfect conversation piece for your desk, shelf, or window sill.',
  basePrice:    750,
  originalPrice: 999,
  sizes:        [],         // single-SKU — no size selection
  features: [
    'Powered by sunlight or artificial light — zero batteries needed',
    'Continuous kinetic motion in any lit environment',
    'Lightweight, durable design with premium finish',
    'Silent operation — perfect for study desks and offices',
    'Eco-friendly: 100% renewable energy powered',
  ],
  specifications: [
    { label: 'Power Source',  value: 'Solar (ambient light)' },
    { label: 'Dimensions',    value: '~15 cm × 8 cm × 8 cm' },
    { label: 'Material',      value: 'ABS Plastic + Metal Pivot' },
    { label: 'Weight',        value: '~80 g' },
    { label: 'Colour',        value: 'Black with gold accent' },
    { label: 'Motion Type',   value: 'Pendulum / Kinetic' },
    { label: 'Placement',     value: 'Desk, window sill, shelf' },
  ],
  faq: [
    {
      question: 'Does it work indoors?',
      answer:   'Yes! Any light source — natural sunlight or a desk lamp — will power the wobbler.',
    },
    {
      question: 'How much light does it need?',
      answer:   'It works best in bright ambient light. Direct sunlight gives the fastest wobble; a 60 W desk lamp works too.',
    },
    {
      question: 'Is it noisy?',
      answer:   'Completely silent. The motion is driven by a small solar cell and a precision pivot — no motor or electronics.',
    },
    {
      question: 'Can I gift this?',
      answer:   'Absolutely. It comes gift-ready and makes a unique, eco-friendly present for any occasion.',
    },
  ],
  metadata: {
    seoTitle:       'Solar Wobbler Bangladesh | Buy Kinetic Desk Art | VYBE',
    metaDescription:
      'Buy Solar Wobbler in Bangladesh — a stunning solar-powered kinetic sculpture. No batteries. Endless motion. Fast delivery across BD.',
    seoKeywords:
      'solar wobbler bangladesh, kinetic desk art, solar toy dhaka, solar powered toy bd, buy solar wobbler online',
  },
  tags:         ['solar', 'kinetic', 'wobbler', 'desk-decor', 'eco', 'gift'],
  stock:        100,
  featured:     true,
  newArrival:   true,
  bestSelling:  false,
  customizable: false,
  isActive:     true,
  // images: [] — add via admin UI after creation, or set publicId here
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅  Connected to MongoDB');

  const existing = await Product.findOne({ name: WOBBLER.name });
  if (existing) {
    console.log(`⚠️   Product "${WOBBLER.name}" already exists (id: ${existing._id}). Skipping.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const doc = await Product.create(WOBBLER);
  console.log(`✅  Created Solar Wobbler: ${doc._id}`);
  console.log('    → Open the admin panel → find this product → upload images.');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
