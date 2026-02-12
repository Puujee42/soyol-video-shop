'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Video, MessageCircle } from 'lucide-react';
import ChatWindow from '@/components/Chat/ChatWindow';
import AdminSelector from '@/components/Chat/AdminSelector';
import VideoCall from '@/components/VideoCall';
import { useUser } from '@/context/AuthContext';

interface ChatWidgetProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AdminUser {
    _id: string;
    name?: string;
    email?: string;
    image?: string;
    userId: string;
}

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
    const { user } = useUser();
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
    const [viewMode, setViewMode] = useState<'menu' | 'chat_selection' | 'video_selection' | 'chat' | 'video_call'>('menu');

    const handleSelectAdmin = (admin: AdminUser) => {
        setSelectedAdmin(admin);
        // If we were in video selection, we should probably start a video call here
        // For now, let's just go to chat, but we need to implement the video logic
        if (viewMode === 'video_selection') {
            setViewMode('video_call');
        } else {
            setViewMode('chat');
        }
    };

    const handleBack = () => {
        if (viewMode === 'chat') {
            setViewMode('chat_selection');
            setSelectedAdmin(null);
        } else if (viewMode === 'video_call') {
            setViewMode('video_selection');
            setSelectedAdmin(null);
        } else if (viewMode === 'chat_selection' || viewMode === 'video_selection') {
            setViewMode('menu');
        }
    };

    // Reset view when closed/opened?
    // useEffect(() => { if(!isOpen) setViewMode('menu'); }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed z-50 top-1/2 -translate-y-1/2 right-20 md:right-28 w-[calc(100vw-100px)] md:w-96 h-[500px] max-h-[80vh] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-800/80 backdrop-blur-md p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            {viewMode !== 'menu' && (
                                <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                    <ArrowLeft className="w-5 h-5 text-slate-300" />
                                </button>
                            )}
                            <h3 className="font-bold text-white text-lg">
                                {viewMode === 'menu' ? 'Танд яаж туслах вэ?' :
                                    viewMode === 'chat' && selectedAdmin ? (selectedAdmin.name || 'Chat') :
                                        viewMode === 'video_selection' ? 'Видео оператор сонгох' : 'Чатлах оператор сонгох'}
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
                                <p className="mb-4">Үйлчилгээ авахын тулд нэвтрэнэ үү.</p>
                                <a href="/sign-in" className="px-4 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors">
                                    Нэвтрэх
                                </a>
                            </div>
                        ) : viewMode === 'menu' ? (
                            <div className="flex flex-col gap-4 p-6 h-full justify-center">
                                <button
                                    onClick={() => setViewMode('chat_selection')}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/5 transition-all group text-left"
                                >
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                                        <MessageCircle className="w-6 h-6 text-blue-500 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Зурвас бичих</h4>
                                        <p className="text-sm text-slate-400">Оператортой чатлах</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setViewMode('video_selection')}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/5 transition-all group text-left"
                                >
                                    <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                                        <Video className="w-6 h-6 text-orange-500 group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg">Видео дуудлага</h4>
                                        <p className="text-sm text-slate-400">Өрөөний кодоор холбогдох</p>
                                    </div>
                                </button>
                            </div>
                        ) : viewMode === 'chat' && selectedAdmin ? (
                            <ChatWindow
                                otherUser={selectedAdmin}
                                onStartCall={() => {
                                    setViewMode('video_call');
                                }}
                                onBack={handleBack}
                            />
                        ) : viewMode === 'video_call' && selectedAdmin ? (
                            <div className="h-full overflow-y-auto bg-white">
                                <VideoCall
                                    prefilledRoom={`call-${user.id}-${selectedAdmin._id}`}
                                    onBack={handleBack}
                                />
                            </div>
                        ) : (
                            // Admin Selection View (Shared for Chat and Video for now)
                            <div className="h-full overflow-y-auto">
                                <div className="p-4">
                                    <p className="text-slate-400 text-sm mb-4">
                                        {viewMode === 'video_selection'
                                            ? 'Видео дуудлага хийх оператор сонгоно уу.'
                                            : 'Чатлах оператор сонгоно уу.'}
                                    </p>
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
