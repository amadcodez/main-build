'use client';

import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your order has been placed successfully.
      </p>

      <div className="bg-white shadow p-6 rounded-md w-full max-w-md text-left">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">What’s Next?</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>You'll receive a confirmation call or message soon.</li>
          <li>If you paid online, your payment will be verified.</li>
          <li>Your order will be dispatched shortly.</li>
        </ul>
      </div>

      <Link
        href="/"
        className="mt-6 inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Go Back to Home
      </Link>
    </div>
  );
}
