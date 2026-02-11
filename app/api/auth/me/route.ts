import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function GET(request: Request) {
    try {
        const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { payload } = await jwtVerify(token, JWT_SECRET);

        if (!payload.sub) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const users = await getCollection('users');
        const user = await users.findOne({ _id: new ObjectId(payload.sub as string) });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                phone: user.phone,
                role: user.role,
                name: user.name,
                age: user.age
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
