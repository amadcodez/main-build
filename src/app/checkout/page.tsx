'use client';

import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: '',
    uid: '',
    proofImage: '',
  });

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, proofImage: url });
    }
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com)$/;
    const phoneRegex = /^\+92\d{10}$/;

    if (!nameRegex.test(formData.firstName)) {
      alert('First name should only contain letters and spaces.');
      return false;
    }

    if (!nameRegex.test(formData.lastName)) {
      alert('Last name should only contain letters and spaces.');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      alert('Only Gmail, Hotmail or Yahoo emails are allowed.');
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      alert('Phone number must start with +92 and contain 13 digits in total.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const order = {
      ...formData,
      cartItems,
      total,
      paymentMethod,
      date: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const data = await res.json();
      if (data.success) {
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = '/thank-you';
      } else {
        alert('Failed to save order.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="email" type="email" placeholder="Email" required className="w-full px-4 py-2 border rounded" onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <input name="firstName" placeholder="First Name" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
            <input name="lastName" placeholder="Last Name" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
          </div>

          <input name="address" placeholder="Address" required className="w-full px-4 py-2 border rounded" onChange={handleChange} />

          <div className="grid grid-cols-2 gap-4">
            <input name="city" placeholder="City" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
            <input name="phone" placeholder="Phone (+92xxxxxxxxxx)" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <label className="font-semibold">Payment Method</label>
            <div className="flex gap-4">
              <label><input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /> Cash on Delivery</label>
              <label><input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} /> Online Payment</label>
            </div>
          </div>

          {paymentMethod === 'online' && (
            <>
              <input name="uid" placeholder="Transaction UID" className="w-full px-4 py-2 border rounded" onChange={handleChange} />
              <input type="file" accept="image/*" onChange={handleProofUpload} className="w-full" />
              {formData.proofImage && (
                <img src={formData.proofImage} alt="Proof" className="mt-2 w-32 h-32 object-cover border rounded" />
              )}
            </>
          )}

          <button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-900">Place Order</button>
        </form>

        <div className="bg-gray-50 p-6 rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Your Order</h2>
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between items-center gap-4 border-b pb-2">
              <img src={item.image} alt={item.title} className="w-16 h-16 rounded object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-gray-600">{item.quantity} × ${item.price}</p>
              </div>
              <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex justify-between font-bold text-lg border-t pt-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 