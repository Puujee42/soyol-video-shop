'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutDashboard, Loader2 } from 'lucide-react';
import UserList from '@/components/Chat/UserList';
import ChatWindow from '@/components/Chat/ChatWindow';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';

interface User {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
    userId: string;
    role?: string; // Added role
}

export default function AdminMessagesPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewFilter, setViewFilter] = useState<'all' | 'clients' | 'admins'>('all');

    // LiveKit State
    const [roomToken, setRoomToken] = useState('');
    const [roomName, setRoomName] = useState('');
    const [isCallActive, setIsCallActive] = useState(false);

    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch users', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (viewFilter === 'all') {
            setFilteredUsers(users);
        } else if (viewFilter === 'admins') {
            setFilteredUsers(users.filter(u => u.role === 'admin'));
        } else {
            setFilteredUsers(users.filter(u => u.role !== 'admin'));
        }
    }, [users, viewFilter]);

    const handleStartCall = async () => {
        if (!selectedUser) return;

        const room = `call-${Date.now()}`;
        try {
            // 1. Get Token for Admin
            const resp = await fetch(`/api/livekit?room=${room}&username=Admin`);
            const data = await resp.json();

            // 2. Send Call Invite Message
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: selectedUser.userId,
                    content: `Join video call: ${room}`,
                    type: 'call_invite',
                    roomName: room
                })
            });

            setRoomName(room);
            setRoomToken(data.token);
            setIsCallActive(true);

        } catch (e) {
            console.error(e);
        }
    };

    const onDisconnected = () => {
        setIsCallActive(false);
        setRoomToken('');
    }

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-20 shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
                        <h1 className="text-xl font-bold text-white tracking-tight">Messages</h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {loading ? (
                    <div className="w-full flex justify-center items-center"><Loader2 className="animate-spin text-amber-500" /></div>
                ) : (
                    <>
                        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-80 h-full flex-col border-r border-white/10`}>
                            {/* Filter Tabs */}
                            <div className="flex p-2 gap-1 bg-slate-900/50 border-b border-white/10">
                                <button
                                    onClick={() => setViewFilter('all')}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${viewFilter === 'all' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setViewFilter('clients')}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${viewFilter === 'clients' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                                >
                                    Clients
                                </button>
                                <button
                                    onClick={() => setViewFilter('admins')}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${viewFilter === 'admins' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-white/5'}`}
                                >
                                    Admins
                                </button>
                            </div>

                            <UserList
                                users={filteredUsers}
                                selectedUser={selectedUser}
                                onSelectUser={setSelectedUser}
                            />
                        </div>

                        {isCallActive && roomToken ? (
                            <div className="flex-1 flex flex-col bg-slate-950 relative h-full">
                                <LiveKitRoom
                                    video={true}
                                    audio={true}
                                    token={roomToken}
                                    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                                    data-lk-theme="default"
                                    style={{ height: '100%' }}
                                    onDisconnected={onDisconnected}
                                >
                                    <VideoConference />
                                </LiveKitRoom>
                                <button onClick={onDisconnected} className="absolute top-4 right-4 bg-red-500 px-4 py-2 rounded text-white z-50">
                                    End Call
                                </button>
                            </div>
                        ) : (
                            <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-1 h-full`}>
                                {selectedUser ? (
                                    <ChatWindow
                                        otherUser={selectedUser}
                                        onStartCall={handleStartCall}
                                        onBack={() => setSelectedUser(null)}
                                    />
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-slate-500">
                                        Select a user to start chatting
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
