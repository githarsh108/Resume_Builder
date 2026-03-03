import React from 'react';
import { motion } from 'motion/react';
import { GitCompare, X } from 'lucide-react';

interface ComparisonViewProps {
    originalText: string;
    onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalText, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 bg-zinc-900/80">
                <div className="flex items-center gap-2 text-zinc-300">
                    <GitCompare className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Raw Input vs AI Output</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Split Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left: Original raw text */}
                <div className="border-b md:border-b-0 md:border-r border-zinc-800">
                    <div className="px-4 py-2 border-b border-zinc-800/50 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-400" />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Original</span>
                    </div>
                    <pre className="p-5 text-[11px] font-mono text-zinc-500 leading-relaxed whitespace-pre-wrap overflow-auto max-h-[420px] scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {originalText}
                    </pre>
                </div>

                {/* Right: AI cleaned version (shown as note) */}
                <div>
                    <div className="px-4 py-2 border-b border-zinc-800/50 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">AI Optimized</span>
                    </div>
                    <div className="p-5 max-h-[420px] overflow-auto">
                        <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                            The optimized resume is shown in the preview panel above. Below are the key transformations the AI applied:
                        </p>
                        <ul className="space-y-3">
                            {[
                                { icon: '✦', color: 'text-emerald-400', title: 'Bullet rewriting', desc: 'All experience highlights rewritten to be action-driven and quantified with measurable impact.' },
                                { icon: '✦', color: 'text-emerald-400', title: 'Skills categorized', desc: 'Skills regrouped into Languages, Frameworks, Libraries, and Tools for ATS keyword matching.' },
                                { icon: '✦', color: 'text-emerald-400', title: 'Dates normalized', desc: 'All dates standardized to a consistent format (e.g., Jan 2023).' },
                                { icon: '✦', color: 'text-emerald-400', title: 'Summary removed', desc: 'Generic objective/summary sections removed as they reduce ATS scores.' },
                                { icon: '✦', color: 'text-emerald-400', title: 'Achievements extracted', desc: 'Notable achievements and certifications extracted into separate sections for visibility.' },
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className={`mt-0.5 ${item.color} text-xs`}>{item.icon}</span>
                                    <div>
                                        <p className="text-xs font-semibold text-zinc-300">{item.title}</p>
                                        <p className="text-[11px] text-zinc-500 leading-snug">{item.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
