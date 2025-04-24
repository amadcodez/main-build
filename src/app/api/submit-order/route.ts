import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db('myDBClass');
    const orders = db.collection('orders');

    await orders.insertOne(body); // ✅ cartItems already has storeID

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order Save Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
