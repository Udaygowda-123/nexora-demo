const express = require('express');
const CartItem = require('../models/CartItem');

const router = express.Router();

let memoryCart = []; 


async function dbAvailable() {
  try {
    await CartItem.countDocuments().exec();
    return true;
  } catch {
    return false;
  }
}


router.get('/', async (req, res) => {
  try {
    if (await dbAvailable()) {
      const items = await CartItem.find().lean();
      const total = items.reduce((s, it) => s + it.price * it.qty, 0);
      return res.json({ items, total });
    } else {
      const total = memoryCart.reduce((s, it) => s + it.price * it.qty, 0);
      return res.json({ items: memoryCart, total });
    }
  } catch (err) {
    console.error('GET /api/cart error:', err);
    res.status(500).json({ error: 'Failed to get cart' });
  }
});


router.post('/', async (req, res) => {
  try {
    const { productId, name, price, qty = 1 } = req.body;
    if (!productId || !name || typeof price !== 'number') {
      return res.status(400).json({ error: 'productId, name and price are required' });
    }
    if (await dbAvailable()) {
      let existing = await CartItem.findOne({ productId });
      if (existing) {
        existing.qty += qty;
        await existing.save();
        return res.json(existing);
      }
      const newItem = await CartItem.create({ productId, name, price, qty });
      return res.json(newItem);
    } else {
      const existing = memoryCart.find(i => i.productId === productId);
      if (existing) {
        existing.qty += qty;
        return res.json(existing);
      } else {
        const item = { _id: 'm_' + Date.now(), productId, name, price, qty };
        memoryCart.push(item);
        return res.json(item);
      }
    }
  } catch (err) {
    console.error('POST /api/cart error:', err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (await dbAvailable()) {
      await CartItem.findByIdAndDelete(id);
      return res.json({ success: true });
    } else {
      memoryCart = memoryCart.filter(i => i._id !== id);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('DELETE /api/cart/:id error:', err);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

router.put('/:id', async (req, res) => {
    try {
      const { qtyChange } = req.body; // expects +1 or -1
      const id = req.params.id;
  
      const isDb = await dbAvailable();
  
      if (isDb) {
        const item = await CartItem.findById(id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
  
        item.qty += qtyChange;
        if (item.qty <= 0) {
          await CartItem.findByIdAndDelete(id);
          return res.json({ success: true, deleted: true });
        }
  
        await item.save();
        return res.json(item);
      } else {
        // In-memory fallback
        const item = memoryCart.find(i => i._id === id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
  
        item.qty += qtyChange;
        if (item.qty <= 0) {
          memoryCart = memoryCart.filter(i => i._id !== id);
          return res.json({ success: true, deleted: true });
        }
  
        return res.json(item);
      }
    } catch (err) {
      console.error('PUT /api/cart/:id error:', err);
      res.status(500).json({ error: 'Failed to update quantity' });
    }
  });
  

router.post('/checkout', async (req, res) => {
  try {
    const { cartItems = [], name, email } = req.body;
    if (!Array.isArray(cartItems)) return res.status(400).json({ error: 'cartItems must be an array' });

    const total = cartItems.reduce((s, it) => s + it.price * it.qty, 0);
    const cleanItems = cartItems.map(({ name, price, qty }) => ({ name, price, qty }));
const receipt = {
  id: 'receipt_' + Date.now(),
  name,
  email,
  items: cleanItems,
  total,
  timestamp: new Date().toISOString()
};


    
    if (await dbAvailable()) {
      await CartItem.deleteMany({});
    } else {
      memoryCart = [];
    }

    return res.json({ receipt });
  } catch (err) {
    console.error('POST /api/cart/checkout error:', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;
