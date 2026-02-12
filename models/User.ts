import { ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    phone: string;
    role: 'admin' | 'user';
    status: 'available' | 'in-call';
    name?: string;
    email?: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}
