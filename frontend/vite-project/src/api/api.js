import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const fetchProducts = async () => {
  const res = await axios.get(`${BASE}/api/products`);
  return res.data;
};

export const getCart = async () => {
  const res = await axios.get(`${BASE}/api/cart`);
  return res.data;
};

export const addToCart = async (product, qty = 1) => {
  const payload = {
    productId: product.id || product._id || product.productId,
    name: product.name,
    price: product.price,
    qty
  };
  const res = await axios.post(`${BASE}/api/cart`, payload);
  return res.data;
};
export const updateCartQuantity = async (id, qtyChange) => {
    const res = await axios.put(`${BASE}/api/cart/${id}`, { qtyChange });
    return res.data;
  };
  
export const removeCartItem = async (id) => {
  const res = await axios.delete(`${BASE}/api/cart/${id}`);
  return res.data;
};

export const checkout = async (cartItems, name, email) => {
  const res = await axios.post(`${BASE}/api/cart/checkout`, { cartItems, name, email });
  return res.data;
};
