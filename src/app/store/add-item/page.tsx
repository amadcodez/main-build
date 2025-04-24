"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AddItemPage() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState(0);
  const [costPerItem, setCostPerItem] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [itemImages, setItemImages] = useState<File[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [storeID, setStoreID] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedID = localStorage.getItem("storeID");
    if (storedID) setStoreID(storedID);
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeID) return alert("Store ID not found.");

    const imageBase64Array: string[] = [];

    for (const image of itemImages) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          imageBase64Array.push(reader.result as string);
          resolve();
        };
        reader.readAsDataURL(image);
      });
    }

    const formData = {
      storeID,
      itemName,
      itemDescription,
      itemPrice,
      compareAtPrice,
      costPerItem,
      quantity,
      itemImages: imageBase64Array,
    };

    try {
      const res = await fetch("/api/add-item", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error adding item.");

      setSuccessMessage("Product Added Successfully!");
      setItemName(""); setItemDescription(""); setItemPrice(0);
      setCompareAtPrice(0); setCostPerItem(0); setQuantity(0); setItemImages([]);

      setTimeout(() => {
        setSuccessMessage("");
        router.push("/store");
      }, 2000);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#0F6466]">Add Product</h1>

        {successMessage && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAddItem} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block font-medium text-gray-700 mb-1">Product Title</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
                placeholder="Enter product title"
                className="w-full border px-4 py-2 rounded-md text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                required
                rows={5}
                placeholder="Write a detailed description"
                className="w-full border px-4 py-2 rounded-md resize-none text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Media Upload */}
            <div className="bg-white p-4 rounded shadow">
              <label className="block font-medium text-gray-700 mb-1">Upload Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  setItemImages(e.target.files ? Array.from(e.target.files) : [])
                }
                className="w-full"
              />
              {itemImages.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {itemImages.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="h-20 w-20 object-cover rounded-md border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            {/* Pricing */}
            <div className="bg-white p-4 rounded shadow space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">Pricing</h2>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Price</label>
                <input
                  type="number"
                  value={itemPrice}
                  min={0}
                  onChange={(e) => setItemPrice(Number(e.target.value))}
                  required
                  className="w-full border px-3 py-2 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Compare at Price</label>
                <input
                  type="number"
                  value={compareAtPrice}
                  min={0}
                  onChange={(e) => setCompareAtPrice(Number(e.target.value))}
                  className="w-full border px-3 py-2 rounded-md text-gray-900"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Cost per Item</label>
                <input
                  type="number"
                  value={costPerItem}
                  min={0}
                  onChange={(e) => setCostPerItem(Number(e.target.value))}
                  className="w-full border px-3 py-2 rounded-md text-gray-900"
                />
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white p-4 rounded shadow space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">Inventory</h2>
              <div>
                <label className="block mb-1 text-sm text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  min={0}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border px-3 py-2 rounded-md text-gray-900"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white p-4 rounded shadow text-right">
              <button
                type="submit"
                className="bg-[#0F6466] hover:bg-[#0e4f50] text-white px-6 py-2 rounded-md font-medium"
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
