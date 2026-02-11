import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCollection } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const products = await getCollection('products');
    const orders = await getCollection('orders');

    const totalProducts = await products.countDocuments({ vendorId: userId });
    const totalOrders = await orders.countDocuments({ vendorId: userId });

    return NextResponse.json({
      totalRevenue: 0,
      totalOrders,
      totalProducts,
      avgRating: 0,
      pendingOrders: 0,
      lowStockProducts: 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
