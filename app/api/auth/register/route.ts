import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { phone, password, name, age } = body;

        console.log('[Register API] Received body:', body);

        if (!phone || !password || !name || !age) {
            console.log('[Register API] Missing fields:', { phone: !!phone, password: !!password, name: !!name, age: !!age });
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const users = await getCollection('users');

        // Check if user exists
        const existingUser = await users.findOne({ phone });

        let shouldCreateBytes = true;

        if (existingUser) {
            // If user exists, we check if we should update it or fail
            console.log('[Register API] User exists:', existingUser._id);

            // OPTION: If you want to allow "resetting" or "updating" the user with new info
            // For now, let's just update the user with new password/name/age
            // This effectively allows "claiming" or "resetting" the account with the new credentials

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            await users.updateOne(
                { _id: existingUser._id },
                {
                    $set: {
                        password: hashedPassword,
                        name,
                        age: Number(age),
                        updatedAt: new Date()
                    }
                }
            );

            console.log('[Register API] Updated existing user:', phone);
            return NextResponse.json({ success: true, message: 'Account updated successfully' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            phone,
            password: hashedPassword,
            name,
            age: Number(age),
            role: 'user', // Default role
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await users.insertOne(newUser);

        return NextResponse.json({ success: true, message: 'Account created' });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
