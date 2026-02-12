'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ChatWidget from './ChatWidget';

export default function FloatingChatButton() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    // Hide on messages page itself to avoid redundancy, but keep flexible
    useEffect(() => {
        if (pathname?.startsWith('/admin')) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
    }, [pathname]);

    const toggleChat = () => setIsOpen(!isOpen);

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="fixed z-[60] top-1/2 -translate-y-1/2 right-4 md:right-8"
                    >
                        <motion.button
                            onClick={toggleChat}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-orange-300 ${isOpen ? 'bg-slate-800 text-white' : 'bg-[#FF7900] text-white hover:bg-[#e66d00]'
                                }`}
                            aria-label={isOpen ? "Close chat" : "Chat with support"}
                        >
                            <AnimatePresence mode="wait">
                                {isOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="chat"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <MessageCircle className="w-7 h-7" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Ping animation to draw attention - only when closed */}
                            {!isOpen && (
                                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <ChatWidget isOpen={isOpen && isVisible} onClose={() => setIsOpen(false)} />
        </>
    );
}
