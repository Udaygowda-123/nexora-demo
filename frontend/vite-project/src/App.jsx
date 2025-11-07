import React, { useEffect, useState } from "react";
import { updateCartQuantity } from "./api/api";

import {
  fetchProducts,
  getCart,
  addToCart,
  removeCartItem,
  checkout,
} from "./api/api";
import ProductGrid from "./components/ProductGrid";
import CartView from "./components/CartView";
import CheckoutModal from "./components/CheckoutModel";
import PaymentSuccess from "./components/PaymentSuccess";


export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);


  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [prods, cartData] = await Promise.all([fetchProducts(), getCart()]);
    setProducts(prods);
    setCart(cartData);
  }

  async function handleAdd(product) {
    await addToCart(product, 1);
    setCart(await getCart());
  }
  const handleUpdateQty = async (id, change) => {
    await updateCartQuantity(id, change);
    setCart(await getCart());
  };
  

  async function handleRemove(id) {
    await removeCartItem(id);
    setCart(await getCart());
  }

  async function handleCheckout(data) {
    const res = await checkout(cart.items, data.name, data.email);
    setReceipt(res.receipt);
    setCart({ items: [], total: 0 });
    setShowCheckout(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          Vibe Commerce 🛍️
        </h1>
        <button
          onClick={() => setShowCheckout(true)}
          className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Checkout ({cart.items.length})
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ProductGrid products={products} onAdd={handleAdd} />
        </div>
        <aside>
        <CartView
  items={cart.items}
  total={cart.total}
  onRemove={handleRemove}
  onUpdate={handleUpdateQty}
/>

        </aside>
      </main>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSubmit={handleCheckout}
        />
      )}

{receipt && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4 z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full">
      <h3 className="text-2xl font-bold text-indigo-700 mb-4">Payment Receipt</h3>

      <div className="space-y-2 mb-4">
        <p className="text-gray-700"><span className="font-semibold">Name:</span> {receipt.name}</p>
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {receipt.email}</p>
        <p className="text-gray-700"><span className="font-semibold">Date:</span> {new Date(receipt.timestamp).toLocaleString()}</p>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <h4 className="font-semibold mb-2 text-gray-800">Items:</h4>
        <ul className="space-y-1 text-sm text-gray-600">
          {receipt.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>{item.name} × {item.qty}</span>
              <span>₹{((item.price * item.qty) / 100).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-lg font-semibold text-indigo-700 text-right mb-4">
        Total: ₹{(receipt.total / 100).toFixed(2)}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => setReceipt(null)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Close
        </button>
        <button
          onClick={() => setShowPaymentSuccess(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  </div>
)}
{showPaymentSuccess && (
  <PaymentSuccess onClose={() => setShowPaymentSuccess(false)} />
)}

    </div>
  );
}
