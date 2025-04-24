"use client";

import React, { useState, useEffect } from "react";

export default function ViewItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [storeID, setStoreID] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("storeID");
      if (id) {
        setStoreID(id);
      }
    }
  }, []);

  useEffect(() => {
    if (!storeID) return;

    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/view-items?storeID=${storeID}`);
        const data = await response.json();
        if (response.ok) {
          setItems(data.items);
        } else {
          alert(data.message || "Error fetching items");
        }
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    };

    fetchItems();
  }, [storeID]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-[#0F6466] mb-10">
        View All Items
      </h2>

      {items.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No items found in this store.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              {item.itemImages && item.itemImages.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
                  {item.itemImages.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${item.itemName}-${index}`}
                      className="h-32 w-32 object-cover rounded border flex-shrink-0"
                    />
                  ))}
                </div>
              ) : (
                <div className="h-32 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm mb-4">
                  No image available
                </div>
              )}

              <h3 className="text-lg font-semibold text-[#0F6466]">{item.itemName}</h3>
              <p className="text-gray-600 mt-1 line-clamp-2">{item.itemDescription}</p>
              <div className="mt-auto pt-4">
                <p className="text-lg font-bold text-green-600">${item.itemPrice}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
