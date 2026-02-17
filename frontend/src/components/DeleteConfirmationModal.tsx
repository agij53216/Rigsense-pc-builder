'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    buildName: string;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    buildName,
}: DeleteConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="w-full max-w-md bg-[#0d1220] border border-white/10 rounded-2xl p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff006e]/10 border border-[#ff006e]/30">
                                <AlertTriangle className="h-6 w-6 text-[#ff006e]" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1">Delete Build?</h3>
                                <p className="text-sm text-[#b4bcd0]">
                                    Are you sure you want to delete <span className="font-semibold text-white">"{buildName}"</span>?
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="shrink-0 p-1 rounded-lg hover:bg-white/10 text-[#6b7280] hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-3 rounded-lg bg-[#ff006e]/5 border border-[#ff006e]/20 mb-6">
                            <p className="text-xs text-[#ff006e] font-medium">
                                ⚠️ This action cannot be undone
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-lg bg-white/5 text-[#b4bcd0] font-semibold hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                className="flex-1 py-2.5 rounded-lg bg-[#ff006e] text-white font-bold hover:bg-[#ff006e]/90 transition-colors"
                            >
                                Delete Build
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

