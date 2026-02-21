import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RefreshCcw, CheckCircle2, AlertCircle, FileDown, Zap, Shield, Cpu, Globe } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Header } from '../components/Header';
import { CustomCursor } from '../components/CustomCursor';
import { UploadBox } from '../components/UploadBox';
import { ResumePreview } from '../components/ResumePreview';
import { LatexEditor } from '../components/LatexEditor';
import { Footer } from '../components/Footer';
import { parsePdf } from '../utils/parsePdf';
import { parseDocx } from '../utils/parseDocx';
import { transformResumeWithAI } from '../utils/cleanResume';
import { generateLatex } from '../utils/generateLatex';
import { ResumeData, ResumeStatus } from '../types/resume.types';
import { getSavedResume, getSavedLatex, saveResume, saveLatex } from '../hooks/useResumeStorage';

export const Home: React.FC = () => {
  const [status, setStatus] = useState<ResumeStatus>('idle');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [latex, setLatex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resumeRef = React.useRef<HTMLDivElement>(null);

  const downloadPDF = () => {
    if (!resumeRef.current) return;
    
    const element = resumeRef.current;
    const opt = {
      margin: 0.5,
      filename: `${resumeData?.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'in', format: 'letter' as const, orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    const savedData = getSavedResume();
    const savedLatex = getSavedLatex();
    if (savedData && savedLatex) {
      setResumeData(savedData);
      setLatex(savedLatex);
      setStatus('completed');
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setStatus('parsing');
    setError(null);
    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await parsePdf(file);
      } else if (file.name.endsWith('.docx')) {
        text = await parseDocx(file);
      } else {
        throw new Error('Unsupported file format');
      }

      setStatus('transforming');
      const transformedData = await transformResumeWithAI(text);
      setResumeData(transformedData);
      saveResume(transformedData);

      const generatedLatex = generateLatex(transformedData);
      setLatex(generatedLatex);
      saveLatex(generatedLatex);

      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while processing your resume.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResumeData(null);
    setLatex(null);
    setError(null);
    localStorage.removeItem('ai_resume_data');
    localStorage.removeItem('ai_resume_latex');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-emerald-500/30 cursor-none">
      <CustomCursor />
      <Header />
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold"
          >
            Intelligent Document Processing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-medium tracking-tight text-white"
          >
           (ATS) Resume <span className="text-zinc-500">Builder</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base"
          >
            Convert any resume into an ATS-friendly LaTeX format. Optimized by AI to highlight your impact and achievements.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'parsing' || status === 'transforming' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <UploadBox onFileSelect={handleFileSelect} isProcessing={status !== 'idle'} />
              
              {status !== 'idle' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <RefreshCcw className="w-5 h-5 animate-spin text-emerald-500" />
                    <span className="text-sm font-medium">
                      {status === 'parsing' ? 'Extracting text from file...' : 'AI is restructuring your resume...'}
                    </span>
                  </div>
                  <div className="w-full max-w-md h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{ width: status === 'parsing' ? "40%" : "80%" }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ) : status === 'completed' && resumeData && latex ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Transformation Complete</h2>
                </div>
                <div className="flex items-center gap-6">
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors text-[10px] uppercase tracking-widest font-bold"
                  >
                    <FileDown className="w-3 h-3" />
                    Download PDF
                  </button>
                  <button
                    onClick={reset}
                    className="text-zinc-600 hover:text-zinc-200 transition-colors text-[10px] uppercase tracking-widest font-bold"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    Optimized Content
                  </div>
                  <ResumePreview ref={resumeRef} data={resumeData} />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    LaTeX Source
                  </div>
                  <LatexEditor latex={latex} />
                </div>
              </div>
            </motion.div>
          ) : status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto p-8 rounded-2xl bg-red-500/5 border border-red-500/20 text-center space-y-4"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-xl font-semibold text-red-500">Processing Failed</h3>
              <p className="text-zinc-400 text-sm">{error}</p>
              <button
                onClick={reset}
                className="px-6 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.03]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">Instant Processing</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">Convert your documents in seconds with our high-performance AI engine.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">ATS Optimized</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">Specifically designed to pass through modern Applicant Tracking Systems.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">AI Enhancement</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">Smart restructuring of your content to highlight key achievements.</p>
          </div>
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white">LaTeX Export</h3>
            <p className="text-zinc-500 text-xs leading-relaxed">Get professional-grade LaTeX source code for complete control.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
