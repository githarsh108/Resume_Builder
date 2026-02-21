import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-10 mb-12">
          <a href="https://leetcode.com/u/kr__harsh_108/" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 font-bold">Leetcode</a>
          <a href="https://github.com/githarsh108" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 font-bold">GitHub</a>
          <a href="https://www.linkedin.com/in/harsh-gupta-21b9551b9/" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 font-bold">LinkedIn</a>
          <a href="mailto:harshinternship108@gmail.com" className="text-zinc-600 hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 font-bold">Email</a>
        </div>
        
        <div className="space-y-3 group">
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black transition-colors duration-500 hover:text-zinc-200 cursor-default">
            AI Resume Transformer
          </p>
          <p className="text-zinc-600 text-[10px] font-mono tracking-tighter transition-colors duration-500 hover:text-zinc-300 cursor-default">
            © HARSH GUPTA {new Date().getFullYear()} — Built for the future of work.
          </p>
        </div>
      </div>
    </footer>
  );
};
