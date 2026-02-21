import React from 'react';
import { motion } from 'motion/react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-200">
            Resume Builder
          </span>
        </motion.div>

        <motion.nav 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-8"
        >
          <a href="#features" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors font-bold">Features</a>
          <a 
            href="https://www.linkedin.com/in/harsh-gupta-21b9551b9/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full border border-white/[0.1] text-[10px] uppercase tracking-widest text-zinc-300 hover:bg-white/[0.05] transition-all font-bold"
          >
            Connect
          </a>
        </motion.nav>
      </div>
    </header>
  );
};
