import React from "react";

export default function CartView({ items = [], total = 0, onRemove, onUpdate }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Cart</h3>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Your cart is empty.</p>
      ) : (
        <div>
          <ul className="divide-y">
            {items.map((it) => (
              <li
                key={it._id || it.productId}
                className="flex justify-between items-center py-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{it.name}</p>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <button
                      onClick={() => onUpdate(it._id || it.productId, -1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      –
                    </button>
                    <span>{it.qty}</span>
                    <button
                      onClick={() => onUpdate(it._id || it.productId, 1)}
                      className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    ₹{((it.price * it.qty) / 100).toFixed(2)}
                  </div>
                  <button
                    onClick={() => onRemove(it._id || it.productId)}
                    className="text-red-500 text-xs hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 text-right font-semibold text-lg text-indigo-700">
            Total: ₹{(total / 100).toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
