'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface User {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    clerkId: string;
}

interface UserListProps {
    users: User[];
    selectedUser: User | null;
    onSelectUser: (user: User) => void;
}

export default function UserList({ users, selectedUser, onSelectUser }: UserListProps) {
    const [search, setSearch] = useState('');

    const filteredUsers = users.filter((u) =>
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.phone || '').includes(search)
    );

    return (
        <div className="w-full md:w-80 border-r border-white/10 bg-slate-900/50 flex flex-col h-full">
            <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-800 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredUsers.map((user) => (
                    <button
                        key={user._id}
                        onClick={() => onSelectUser(user)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors text-left ${selectedUser?._id === user._id ? 'bg-white/10' : ''
                            }`}
                    >
                        <div className={`relative w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex-shrink-0`}>
                            {user.image ? (
                                <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                                    {(user.name || user.email || '?')[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user.name || 'User'}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                {user.email || user.phone}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
