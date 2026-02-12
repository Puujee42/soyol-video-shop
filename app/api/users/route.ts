import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { auth, currentUser } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');

        const usersCollection = await getCollection('users');

        let query = {};
        if (role === 'admin') {
            query = { role: 'admin' };
        }

        const users = await usersCollection.find(query).toArray();

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
