import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    phone: string;
    name?: string; // Optional for existing users
    age?: number;  // Optional for existing users
    password?: string; // Hashed password for custom auth
    clerkId?: string;  // Link to Clerk if used
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;
}
