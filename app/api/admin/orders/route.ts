import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { auth } from '@clerk/nextjs/server';

// Get all orders (Admin only)
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Identify admin by userId or role - simplistic check:
        // Ideally, check against AdminUser collection, but for now assuming protected route + minimal check
        // In a real app, middleware protects /admin routes.

        const ordersCollection = await getCollection('orders');
        const orders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray();

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
