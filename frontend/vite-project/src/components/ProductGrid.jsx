import React from "react";

export default function ProductGrid({ products = [], onAdd }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id || p._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {/* ✅ Product Image */}
            <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
              {p.img ? (
                <img
                  src={`${p.img}?auto=format&fit=crop&w=400&q=80`}
                  alt={p.name}
                  className="h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300.png?text=Image+Unavailable";
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>

            {/* ✅ Product Info */}
            <div className="flex flex-col flex-1 p-4">
              <h3 className="font-semibold text-gray-800">{p.name}</h3>
              <p className="text-gray-600 mb-3">
                ₹{(p.price / 100).toFixed(2)}
              </p>

              <button
                onClick={() => onAdd(p)}
                className="mt-auto w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
