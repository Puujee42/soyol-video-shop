import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { auth, currentUser } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');

        // Only allow unauthenticated access for role=admin
        if (role !== 'admin') {
            const { userId } = await auth();
            if (!userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const usersCollection = await getCollection('users');

        let query = {};
        if (role === 'admin') {
            query = { role: 'admin' };
        }

        const users = await usersCollection.find(query, {
            projection: {
                _id: 1,
                name: 1,
                email: 1,
                image: 1,
                role: 1,
                status: 1,
                isOnline: 1,
                isInCall: 1,
                userId: 1
            }
        }).toArray();

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
