'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Video, Phone } from 'lucide-react';
import { Message } from '@/models/Message';
import Image from 'next/image';
import useSWR from 'swr';
import { useUser } from '@clerk/nextjs';

interface User {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
    clerkId: string;
}

interface ChatWindowProps {
    otherUser: User;
    onStartCall: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ChatWindow({ otherUser, onStartCall }: ChatWindowProps) {
    const { user } = useUser();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [sending, setSending] = useState(false);

    const { data: messages, mutate } = useSWR<Message[]>(
        `/api/messages?otherUserId=${otherUser.clerkId}`,
        fetcher,
        { refreshInterval: 3000 } // Polling every 3 seconds
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: otherUser.clerkId,
                    content: newMessage,
                    type: 'text',
                }),
            });
            setNewMessage('');
            mutate(); // Refresh messages immediately
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-900/80">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-700">
                        {otherUser.image ? (
                            <Image src={otherUser.image} alt={otherUser.name || ''} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">
                                {(otherUser.name || otherUser.email || '?')[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">{otherUser.name || 'User'}</h3>
                        <p className="text-xs text-slate-400">Offline</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onStartCall}
                        className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                        title="Start Video Call"
                    >
                        <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors">
                        <Phone className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    const isInvite = msg.type === 'call_invite';
                    const isCall = msg.type === 'call_started' || msg.type === 'call_ended';

                    if (isCall) {
                        return (
                            <div key={msg._id?.toString()} className="flex justify-center my-4">
                                <div className="bg-slate-800/50 text-slate-400 text-xs px-4 py-1 rounded-full flex items-center gap-2">
                                    <Video className="w-3 h-3" />
                                    <span>
                                        {msg.type === 'call_started' ? `Video call started` : `Video call ended`} •
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={msg._id?.toString()} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                ? 'bg-amber-600 text-white rounded-tr-none'
                                : 'bg-slate-800 text-slate-200 rounded-tl-none'
                                }`}>
                                {isInvite ? (
                                    <div className="flex flex-col gap-2">
                                        <p className="font-medium">📞 Video Call Invite</p>
                                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors">
                                            Join Call
                                        </button>
                                    </div>
                                ) : (
                                    <p>{msg.content}</p>
                                )}
                                <span className="text-[10px] opacity-70 mt-1 block text-right">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-slate-900/50">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-amber-500/50"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}
