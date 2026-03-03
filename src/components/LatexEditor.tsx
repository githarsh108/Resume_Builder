import React from 'react';
import { Download, Copy, Check, FileCode, FileType } from 'lucide-react';
import { motion } from 'motion/react';

interface LatexEditorProps {
  latex: string;
  onLatexChange: (newLatex: string) => void;
  onExportWord: () => void;
}

export const LatexEditor: React.FC<LatexEditorProps> = ({ latex, onLatexChange, onExportWord }) => {
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
      <div className="flex items-center justify-between px-4 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-zinc-400">
          <FileCode className="w-4 h-4" />
          <span className="text-xs font-mono uppercase tracking-widest">Generated LaTeX</span>
          <span className="text-[9px] text-zinc-600 font-mono">(editable)</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onExportWord}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600/20 border border-blue-600/30 hover:bg-blue-600/30 text-blue-400 text-sm transition-colors"
            title="Export as Word document (.docx)"
          >
            <FileType className="w-4 h-4" />
            Export Word
          </button>
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
        <textarea
          value={latex}
          onChange={(e) => onLatexChange(e.target.value)}
          spellCheck={false}
          className="w-full h-[600px] p-6 text-sm font-mono text-zinc-400 leading-relaxed bg-transparent resize-none focus:outline-none scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
          aria-label="LaTeX source code editor"
        />
      </div>
    </motion.div>
  );
};
