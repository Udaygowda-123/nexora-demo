const express = require('express');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Products');

const router = express.Router();


router.get('/', async (req, res) => {
  try {
  
    const count = await Product.countDocuments().catch(() => 0);
    if (count > 0) {
      const dbProducts = await Product.find().lean();
      return res.json(dbProducts);
    }
 
    const file = path.join(__dirname, '..', 'data', 'mockProducts.json');
    const raw = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(raw);
    return res.json(data);
  } catch (err) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

module.exports = router;
