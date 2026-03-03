import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, X, Trash2, Download, FolderOpen } from 'lucide-react';
import { ResumeVersion } from '../types/resume.types';

interface VersionHistoryProps {
    versions: ResumeVersion[];
    isOpen: boolean;
    onClose: () => void;
    onLoad: (version: ResumeVersion) => void;
    onDelete: (id: string) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
    versions, isOpen, onClose, onLoad, onDelete,
}) => {
    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
            ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="drawer"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-bold uppercase tracking-widest text-zinc-200">Resume History</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {versions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 gap-3">
                                    <FolderOpen className="w-10 h-10 text-zinc-700" />
                                    <p className="text-zinc-600 text-xs text-center">No saved resumes yet.<br />Process your first resume to see it here.</p>
                                </div>
                            ) : (
                                versions.map((v) => (
                                    <div
                                        key={v.id}
                                        className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-colors group"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <p className="text-sm font-semibold text-zinc-200 truncate max-w-[180px]">{v.data.name}</p>
                                                <p className="text-[10px] text-zinc-500 truncate max-w-[180px]">{v.filename}</p>
                                            </div>
                                            <button
                                                onClick={() => onDelete(v.id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-900/40 text-zinc-600 hover:text-red-400"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-zinc-600 font-mono mb-3">{formatDate(v.timestamp)}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => { onLoad(v); onClose(); }}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-widest transition-colors"
                                            >
                                                <Download className="w-3 h-3" />
                                                Load
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="px-5 py-3 border-t border-zinc-800">
                            <p className="text-[10px] text-zinc-700 text-center">Stored locally in your browser · Max 10 versions</p>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
