'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import ChatWindow from '@/components/Chat/ChatWindow';
import AdminSelector from '@/components/Chat/AdminSelector';
import { useUser } from '@clerk/nextjs';

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AdminUser {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
    clerkId: string;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
    const { user } = useUser();
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

    const handleSelectAdmin = (admin: AdminUser) => {
        setSelectedAdmin(admin);
    };

    const handleBack = () => {
        setSelectedAdmin(null);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed z-50 bottom-24 right-4 md:bottom-28 md:right-8 w-[calc(100vw-32px)] md:w-96 h-[500px] max-h-[70vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-800/80 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            {selectedAdmin && (
                                <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                                </button>
                            )}
                            <h3 className="font-bold text-white text-lg">
                                {selectedAdmin ? (selectedAdmin.name || 'Chat') : 'Support'}
                            </h3>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-slate-400 hover:text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative bg-slate-900">
                        {!user ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400">
                                <p className="mb-4">Please log in to chat with support.</p>
                                <a href="/sign-in" className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
                                    Sign In
                                </a>
                            </div>
                        ) : selectedAdmin ? (
                            <ChatWindow
                                otherUser={selectedAdmin}
                                onStartCall={() => console.log('Call started')}
                            />
                        ) : (
                            <div className="h-full overflow-y-auto">
                                <div className="p-4">
                                    <p className="text-slate-400 text-sm mb-4">Select a support agent to start chatting.</p>
                                    <AdminSelector onSelect={handleSelectAdmin} compact={true} />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
