import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, BarChart3 } from 'lucide-react';
import { AtsReport } from '../types/resume.types';

interface AtsScorePanelProps {
    report: AtsReport;
}

export const AtsScorePanel: React.FC<AtsScorePanelProps> = ({ report }) => {
    const { score, checks } = report;
    const passed = checks.filter(c => c.passed).length;

    // Circular progress ring calculations
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference - (score / 100) * circumference;

    const scoreColor =
        score >= 80 ? '#10b981' :
            score >= 60 ? '#f59e0b' :
                '#ef4444';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
        >
            {/* Header */}
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">ATS Compatibility Score</span>
            </div>

            <div className="p-5 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/* Score ring */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50" cy="50" r={radius}
                            fill="none" stroke="#27272a" strokeWidth="8"
                        />
                        {/* Progress arc */}
                        <motion.circle
                            cx="50" cy="50" r={radius}
                            fill="none"
                            stroke={scoreColor}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: dashOffset }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            transform="rotate(-90 50 50)"
                        />
                        {/* Score text */}
                        <text x="50" y="47" textAnchor="middle" fill={scoreColor} fontSize="20" fontWeight="bold" fontFamily="monospace">
                            {score}
                        </text>
                        <text x="50" y="62" textAnchor="middle" fill="#71717a" fontSize="9" fontFamily="monospace">
                            / 100
                        </text>
                    </svg>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                        {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
                    </span>
                    <span className="text-[10px] text-zinc-600">{passed}/{checks.length} checks passed</span>
                </div>

                {/* Checks list */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                    {checks.map((check, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors ${check.passed
                                    ? 'border-emerald-900/40 bg-emerald-900/10'
                                    : 'border-amber-900/40 bg-amber-900/10'
                                }`}
                        >
                            {check.passed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            )}
                            <div>
                                <p className={`text-[11px] font-medium leading-snug ${check.passed ? 'text-zinc-300' : 'text-zinc-400'}`}>
                                    {check.label}
                                </p>
                                {!check.passed && (
                                    <p className="text-[10px] text-amber-600/80 leading-snug mt-0.5">{check.tip}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
