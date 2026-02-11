import { ObjectId } from 'mongodb';

export interface Message {
    _id?: ObjectId;
    senderId: string;
    receiverId: string;
    content: string;
    type: 'text' | 'call_invite';
    roomName?: string; // For call invites
    createdAt: Date;
    read: boolean;
}
