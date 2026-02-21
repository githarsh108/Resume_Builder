import React from 'react';
import { Download, Copy, Check, FileCode } from 'lucide-react';
import { motion } from 'motion/react';

interface LatexEditorProps {
  latex: string;
}

export const LatexEditor: React.FC<LatexEditorProps> = ({ latex }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-4"
    >
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <FileCode className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Generated LaTeX</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download .tex
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-900/50 pointer-events-none" />
        <pre className="p-6 overflow-auto max-h-[600px] text-sm font-mono text-zinc-400 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <code>{latex}</code>
        </pre>
      </div>
    </motion.div>
  );
};
