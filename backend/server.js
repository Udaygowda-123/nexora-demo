require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

const PORT = process.env.PORT || 5001;

async function startServer() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.warn('MongoDB connection failed — running in-memory mode', err.message);
    }
  } else {
    console.log('No MONGO_URI found — running in-memory mode');
  }

  app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
  });
}

startServer();
