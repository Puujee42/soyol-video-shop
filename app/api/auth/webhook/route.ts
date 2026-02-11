import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// Clerk webhook to sync users to MongoDB
// Configure in Clerk Dashboard: https://dashboard.clerk.com -> Webhooks
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { type, data } = payload;

    const users = await getCollection('users');

    switch (type) {
      case 'user.created': {
        await users.updateOne(
          { clerkId: data.id },
          {
            $set: {
              clerkId: data.id,
              email: data.email_addresses?.[0]?.email_address || null,
              name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
              image: data.image_url || null,
              role: 'user',
              updatedAt: new Date(),
            },
            $setOnInsert: {
              createdAt: new Date(),
            },
          },
          { upsert: true }
        );
        break;
      }
      case 'user.updated': {
        await users.updateOne(
          { clerkId: data.id },
          {
            $set: {
              email: data.email_addresses?.[0]?.email_address || null,
              name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || null,
              image: data.image_url || null,
              updatedAt: new Date(),
            },
          }
        );
        break;
      }
      case 'user.deleted': {
        await users.deleteOne({ clerkId: data.id });
        break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Clerk Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}