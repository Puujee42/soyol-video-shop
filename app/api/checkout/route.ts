import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const CheckoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1)
  })),
  fullName: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(5),
  city: z.string(),
  district: z.string(),
  notes: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 1. Validation
    const validation = CheckoutSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid data', details: validation.error.format() }, { status: 400 });
    }

    const { items, ...userDetails } = validation.data;
    const productsCollection = await getCollection('products');
    const ordersCollection = await getCollection('orders');

    // 2. Fetch products and check stock
    const productIds = items.map(item => new ObjectId(item.id));
    const dbProducts = await productsCollection.find({ _id: { $in: productIds } }).toArray();

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = dbProducts.find(p => p._id.toString() === item.id);
      
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.id}` }, { status: 400 });
      }

      // Inventory Check
      if (product.stockStatus === 'in-stock' && (product.inventory || 0) < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.inventory || 0}` 
        }, { status: 400 });
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({
        id: item.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image || ''
      });
    }

    // 3. Create Order
    const newOrder = {
      ...userDetails,
      items: orderItems,
      totalPrice,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await ordersCollection.insertOne(newOrder);

    // 4. Update Inventory (Optional: Decrement stock)
    // For "in-stock" items, we should technically reserve them. 
    // This simple implementation creates the order first.
    // In a real system, you'd use a transaction.

    for (const item of items) {
       await productsCollection.updateOne(
         { _id: new ObjectId(item.id), stockStatus: 'in-stock' },
         { $inc: { inventory: -item.quantity } }
       );
    }

    return NextResponse.json({ 
      success: true, 
      orderId: result.insertedId.toString(),
      message: 'Order placed successfully' 
    });

  } catch (error) {
    console.error('[Checkout API] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
