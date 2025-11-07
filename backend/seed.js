// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Products');
const path = require('path');
const fs = require('fs');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/vibecommerce';

async function seed() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Mongo for seeding.');

    // Read mock data
    const file = path.join(__dirname, 'data', 'mockProducts.json');
    const raw = fs.readFileSync(file, 'utf8');
    const products = JSON.parse(raw);

    // Upsert each product by id (so script can be re-run safely)
    for (const p of products) {
      const filter = { id: p.id };
      const update = {
        id: p.id,
        name: p.name,
        price: p.price,
        img: p.img || ''
      };
      await Product.findOneAndUpdate(filter, update, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log(`Upserted product ${p.id} - ${p.name}`);
    }

    console.log('Seeding complete.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
