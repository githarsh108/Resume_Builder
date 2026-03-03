import React, { useCallback, useState } from 'react';
import { Upload, FileText, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  onJobDescriptionChange: (jd: string) => void;
  isProcessing: boolean;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onFileSelect, onJobDescriptionChange, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showJD, setShowJD] = useState(false);
  const [jdText, setJdText] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleJdChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJdText(e.target.value);
    onJobDescriptionChange(e.target.value);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative group cursor-pointer rounded-3xl border transition-all duration-500 p-12 text-center",
          isDragging ? "border-zinc-400 bg-zinc-900/50" : "border-white/[0.05] hover:border-white/[0.1] bg-zinc-900/20",
          isProcessing && "pointer-events-none opacity-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".pdf,.docx"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-6">
          <div className={cn(
            "w-12 h-12 flex items-center justify-center transition-all duration-500",
            isDragging ? "scale-110 text-white" : "text-zinc-600 group-hover:text-zinc-400"
          )}>
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Upload className="w-6 h-6 stroke-[1.5px]" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium text-zinc-300 uppercase tracking-widest">
              {isProcessing ? "Processing" : "Upload Resume"}
            </h3>
            <p className="text-zinc-600 text-xs">
              PDF or DOCX
            </p>
          </div>
        </div>

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-emerald-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-zinc-200 truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Job Description Accordion */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/[0.05] bg-zinc-900/20 overflow-hidden"
      >
        <button
          onClick={() => setShowJD(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-left"
          disabled={isProcessing}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              Paste Job Description
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">
              Optional
            </span>
          </div>
          {showJD ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>
        <AnimatePresence>
          {showJD && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-5 pb-4 space-y-2">
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                  Paste the job description here and the AI will tailor your resume's language and keywords to match it.
                </p>
                <textarea
                  value={jdText}
                  onChange={handleJdChange}
                  placeholder="e.g. 'We're looking for a software engineer with 3+ years of experience in React, Node.js and cloud infrastructure...'"
                  rows={5}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-300 placeholder:text-zinc-600 resize-none focus:outline-none focus:border-emerald-500/50 transition-colors font-mono leading-relaxed"
                />
                {jdText.trim() && (
                  <p className="text-[10px] text-emerald-500/70 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Job description will be used to tailor your resume
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Privacy notice */}
      <p className="text-center text-[10px] text-zinc-700 leading-relaxed">
        🔒 Your resume is processed and all your data stays only in your browser only
      </p>
    </div>
  );
};
