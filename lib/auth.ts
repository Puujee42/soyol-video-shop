import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

/**
 * Server-side auth helper.
 * Returns `{ userId }` if authenticated, `{ userId: null }` otherwise.
 */
export async function auth(): Promise<{ userId: string | null }> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        if (!token) return { userId: null };

        const { payload } = await jwtVerify(token, JWT_SECRET);

        // JWT standard uses 'sub' for subject (user id)
        const userId = payload.sub || payload.userId;

        if (!userId) return { userId: null };

        return { userId: userId as string };
    } catch {
        return { userId: null };
    }
}

/**
 * Server-side helper — returns the full user object or null.
 */
export async function currentUser() {
    try {
        const { userId } = await auth();
        if (!userId) return null;

        const usersCollection = await getCollection('users');
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) return null;

        return {
            id: user._id.toString(),
            phone: user.phone,
            role: user.role,
            status: user.status,
            name: user.name,
            fullName: user.name,
            firstName: user.name?.split(' ')[0],
            email: user.email,
            image: user.image,
            primaryEmailAddress: user.email ? { emailAddress: user.email } : null,
            imageUrl: user.image || null,
            publicMetadata: { role: user.role },
        };
    } catch {
        return null;
    }
}
