import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const LeetCodeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.774 9.774a1.353 1.353 0 0 0 0 1.913l9.774 9.774a1.357 1.357 0 0 0 1.917 0l9.774-9.774a1.355 1.355 0 0 0 0-1.913L15.353.414A1.371 1.371 0 0 0 13.483 0zm-5.115 10.736l3.64-3.64a1.353 1.353 0 1 1 1.913 1.913l-3.64 3.64a1.353 1.353 0 1 1-1.913-1.913z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="py-20 border-t border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-10 mb-12">
          <a href="https://leetcode.com/u/kr__harsh_108/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group transition-all duration-500">
            <LeetCodeIcon className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" />
            <span className="text-zinc-600 group-hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] font-bold">Leetcode</span>
          </a>
          <a href="https://github.com/githarsh108" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group transition-all duration-500">
            <Github className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" />
            <span className="text-zinc-600 group-hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] font-bold">GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/harsh-gupta-21b9551b9/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group transition-all duration-500">
            <Linkedin className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" />
            <span className="text-zinc-600 group-hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] font-bold">LinkedIn</span>
          </a>
          <a href="mailto:harshinternship108@gmail.com" className="flex flex-col items-center gap-2 group transition-all duration-500">
            <Mail className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500" />
            <span className="text-zinc-600 group-hover:text-zinc-300 text-[10px] uppercase tracking-[0.2em] font-bold">Email</span>
          </a>
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
