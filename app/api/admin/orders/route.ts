import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@/lib/auth';

// Get all orders (Admin only)
export async function GET(request: Request) {
    try {
        const { userId: authUserId } = await auth();
        if (!authUserId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const targetUserId = searchParams.get('userId');

        const ordersCollection = await getCollection('orders');

        let query = {};
        if (targetUserId) {
            query = { userId: targetUserId };
        }

        const orders = await ordersCollection.find(query).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Update order (Status, Delivery Estimate)
export async function PUT(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, status, deliveryEstimate } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
        }

        const ordersCollection = await getCollection('orders');

        const updateData: any = {};
        if (status) updateData.status = status;
        if (deliveryEstimate !== undefined) updateData.deliveryEstimate = deliveryEstimate;

        const result = await ordersCollection.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
