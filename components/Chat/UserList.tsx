'use client';

import { useState } from 'react';
import { Search, User as UserIcon, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface User {
    _id: string;
    name?: string;
    email?: string;
    phone?: string;
    image?: string;
    userId: string;
    role?: string;
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
        <div className="flex flex-col h-full bg-slate-900/50">
            <div className="p-6 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-orange-500" />
                        Зурвас
                    </h2>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-2 py-1 rounded-md">
                        {users.length} хэрэглэгч
                    </span>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Хайх..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-600 opacity-50">
                        <Search className="w-10 h-10 mb-2 stroke-[1px]" />
                        <p className="text-xs font-bold uppercase tracking-widest">Илэрц олдсонгүй</p>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <button
                            key={user._id}
                            onClick={() => onSelectUser(user)}
                            className={`w-full px-4 py-3 flex items-center gap-4 transition-all duration-300 relative group
                                ${selectedUser?._id === user._id 
                                    ? 'bg-orange-500/10' 
                                    : 'hover:bg-white/5'
                                }`}
                        >
                            {selectedUser?._id === user._id && (
                                <motion.div 
                                    layoutId="active-indicator"
                                    className="absolute left-0 top-2 bottom-2 w-1 bg-orange-500 rounded-r-full shadow-[0_0_10px_rgba(245,126,32,0.5)]" 
                                />
                            )}
                            
                            <div className="relative shrink-0">
                                <div className={`w-12 h-12 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-white/5 group-hover:ring-orange-500/30 transition-all`}>
                                    {user.image ? (
                                        <Image src={user.image} alt={user.name || ''} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-black bg-gradient-to-br from-slate-700 to-slate-800 uppercase">
                                            {(user.name || user.email || '?')[0]}
                                        </div>
                                    )}
                                </div>
                                {user.role === 'admin' && (
                                    <div className="absolute -bottom-1 -right-1 bg-indigo-500 text-white p-1 rounded-lg shadow-lg">
                                        <ShieldCheck className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className={`text-sm font-bold truncate transition-colors ${
                                        selectedUser?._id === user._id ? 'text-orange-500' : 'text-slate-200'
                                    }`}>
                                        {user.name || 'User'}
                                    </p>
                                    {user.role === 'admin' && (
                                        <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 truncate font-medium">
                                    {user.email || user.phone}
                                </p>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
