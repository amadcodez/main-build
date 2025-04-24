export const dynamic = 'force-dynamic'; // 🟢 Add this line on top

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('MultiStore');
    const products = await db.collection('item_record').find({}).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to load products' }), {
      status: 500,
    });
  }
}
