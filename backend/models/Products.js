const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, default: '' }
});

module.exports = mongoose.model('Product', productSchema);
