import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles, ArrowRight, RefreshCcw, CheckCircle2, AlertCircle,
  FileDown, Zap, Shield, Cpu, Globe, GitCompare, RotateCcw,
  History, Smartphone, Layers,
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { Header } from '../components/Header';
import { CustomCursor } from '../components/CustomCursor';
import { UploadBox } from '../components/UploadBox';
import { ResumePreview } from '../components/ResumePreview';
import { LatexEditor } from '../components/LatexEditor';
import { ComparisonView } from '../components/ComparisonView';
import { AtsScorePanel } from '../components/AtsScorePanel';
import { VersionHistory } from '../components/VersionHistory';
import { Footer } from '../components/Footer';
import { parsePdf } from '../utils/parsePdf';
import { parseDocx } from '../utils/parseDocx';
import { transformResumeWithAI } from '../utils/cleanResume';
import { generateLatex } from '../utils/generateLatex';
import { computeAtsScore } from '../utils/atsScore';
import { exportToDocx } from '../utils/exportDocx';
import { ResumeData, ResumeStatus, AtsReport, ResumeVersion } from '../types/resume.types';
import {
  getSavedResume, getSavedLatex, saveResume, saveLatex,
  saveResumeVersion, getResumeHistory, deleteResumeVersion,
} from '../hooks/useResumeStorage';

type MobileTab = 'preview' | 'latex';

// Step-by-step progress messages
const PROGRESS_STEPS = [
  { status: 'parsing' as ResumeStatus, pct: 35, msg: 'Step 1/3 — Reading and extracting text from your file...' },
  { status: 'transforming' as ResumeStatus, pct: 75, msg: 'Step 2/3 — AI is rewriting and optimizing your resume...' },
];

export const Home: React.FC = () => {
  const [status, setStatus] = useState<ResumeStatus>('idle');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [latex, setLatex] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string>('');
  const [originalFilename, setOriginalFilename] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [showComparison, setShowComparison] = useState(false);
  const [atsReport, setAtsReport] = useState<AtsReport | null>(null);
  const [history, setHistory] = useState<ResumeVersion[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('preview');
  const resumeRef = React.useRef<HTMLDivElement>(null);

  // ── Derived progress bar ──────────────────────────────────────────────────────
  const currentStep = PROGRESS_STEPS.find(s => s.status === status);

  // ── Load persisted resume on mount ───────────────────────────────────────────
  useEffect(() => {
    const savedData = getSavedResume();
    const savedLatex = getSavedLatex();
    const hist = getResumeHistory();
    setHistory(hist);
    if (savedData && savedLatex) {
      setResumeData(savedData);
      setLatex(savedLatex);
      setStatus('completed');
      setAtsReport(computeAtsScore(savedData, ''));
    }
  }, []);

  // ── Download PDF ──────────────────────────────────────────────────────────────
  const downloadPDF = () => {
    if (!resumeRef.current) return;
    const opt = {
      margin: 0.5,
      filename: `${resumeData?.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter' as const, orientation: 'portrait' as const },
    };
    setTimeout(() => html2pdf().set(opt).from(resumeRef.current).save(), 500);
  };

  // ── Export Word ───────────────────────────────────────────────────────────────
  const handleExportWord = async () => {
    if (!resumeData) return;
    await exportToDocx(resumeData);
  };

  // ── Core processing pipeline ──────────────────────────────────────────────────
  const processFile = useCallback(async (file: File, jd?: string) => {
    setStatus('parsing');
    setError(null);
    setShowComparison(false);
    setOriginalFilename(file.name);

    try {
      let text = '';
      if (file.type === 'application/pdf') {
        text = await parsePdf(file);
      } else if (file.name.endsWith('.docx')) {
        text = await parseDocx(file);
      } else {
        throw new Error('Unsupported file format');
      }

      setOriginalText(text);
      setStatus('transforming');
      const transformedData = await transformResumeWithAI(text, jd);
      setResumeData(transformedData);
      saveResume(transformedData);

      const generatedLatex = generateLatex(transformedData);
      setLatex(generatedLatex);
      saveLatex(generatedLatex);

      // Save version to history
      saveResumeVersion(transformedData, generatedLatex, file.name);
      setHistory(getResumeHistory());

      // Compute ATS score
      setAtsReport(computeAtsScore(transformedData, text));

      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while processing your resume.');
      setStatus('error');
    }
  }, []);

  const handleFileSelect = (file: File) => processFile(file, jobDescription);

  const handleRegenerate = () => {
    if (!originalText || !originalFilename) return;
    processFile(new File([originalText], originalFilename, { type: 'text/plain' }), jobDescription);
  };

  // ── Resume data inline edit handler ─────────────────────────────────────────
  const handleResumeChange = useCallback((updated: ResumeData) => {
    setResumeData(updated);
    saveResume(updated);
    const newLatex = generateLatex(updated);
    setLatex(newLatex);
    saveLatex(newLatex);
    setAtsReport(computeAtsScore(updated, originalText));
  }, [originalText]);

  // ── LaTeX direct edit handler ─────────────────────────────────────────────────
  const handleLatexChange = useCallback((newLatex: string) => {
    setLatex(newLatex);
    saveLatex(newLatex);
  }, []);

  // ── History: load a version ───────────────────────────────────────────────────
  const handleLoadVersion = (version: ResumeVersion) => {
    setResumeData(version.data);
    setLatex(version.latex);
    saveResume(version.data);
    saveLatex(version.latex);
    setAtsReport(computeAtsScore(version.data, ''));
    setStatus('completed');
  };

  const handleDeleteVersion = (id: string) => {
    deleteResumeVersion(id);
    setHistory(getResumeHistory());
  };

  // ── Full reset ────────────────────────────────────────────────────────────────
  const reset = () => {
    setStatus('idle');
    setResumeData(null);
    setLatex(null);
    setError(null);
    setOriginalText('');
    setOriginalFilename('');
    setShowComparison(false);
    setAtsReport(null);
    localStorage.removeItem('ai_resume_data');
    localStorage.removeItem('ai_resume_latex');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-emerald-500/30 cursor-none">
      <CustomCursor />

      {/* Header with History button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-200">Resume Builder</span>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 sm:gap-8"
          >
            <a href="#features" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors font-bold">Features</a>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors font-bold"
            >
              <History className="w-3 h-3" />
              History
              {history.length > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] flex items-center justify-center font-bold">
                  {history.length}
                </span>
              )}
            </button>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold">
            Intelligent Document Processing
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-6xl font-medium tracking-tight text-white">
            (ATS) Resume <span className="text-zinc-500">Builder</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-zinc-500 max-w-xl mx-auto leading-relaxed text-sm md:text-base">
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
              <UploadBox
                onFileSelect={handleFileSelect}
                onJobDescriptionChange={setJobDescription}
                isProcessing={status !== 'idle'}
              />

              {status !== 'idle' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <RefreshCcw className="w-5 h-5 animate-spin text-emerald-500" />
                    <span className="text-sm font-medium">{currentStep?.msg ?? 'Step 3/3 — Generating LaTeX source...'}</span>
                  </div>
                  <div className="w-full max-w-md h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${currentStep?.pct ?? 95}%` }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ) : status === 'completed' && resumeData && latex ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Transformation Complete</h2>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => setShowComparison(v => !v)}
                    className={`flex items-center gap-1.5 transition-colors text-[10px] uppercase tracking-widest font-bold ${showComparison ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-200'}`}
                  >
                    <GitCompare className="w-3 h-3" />
                    {showComparison ? 'Hide' : 'Compare'}
                  </button>
                  {originalText && (
                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-colors text-[10px] uppercase tracking-widest font-bold"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Regenerate
                    </button>
                  )}
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 text-emerald-500 hover:text-emerald-400 transition-colors text-[10px] uppercase tracking-widest font-bold"
                  >
                    <FileDown className="w-3 h-3" />
                    Download PDF
                  </button>
                  <button onClick={reset} className="text-zinc-600 hover:text-zinc-200 transition-colors text-[10px] uppercase tracking-widest font-bold">
                    Reset
                  </button>
                </div>
              </div>

              {/* Before/After comparison panel */}
              <AnimatePresence>
                {showComparison && originalText && (
                  <ComparisonView originalText={originalText} onClose={() => setShowComparison(false)} />
                )}
              </AnimatePresence>

              {/* ATS Score Panel */}
              {atsReport && <AtsScorePanel report={atsReport} />}

              {/* Mobile tab toggle */}
              <div className="flex lg:hidden border border-zinc-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setMobileTab('preview')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-widest font-bold transition-colors ${mobileTab === 'preview' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Smartphone className="w-3 h-3" />
                  Preview
                </button>
                <button
                  onClick={() => setMobileTab('latex')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-widest font-bold transition-colors ${mobileTab === 'latex' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  <Layers className="w-3 h-3" />
                  LaTeX
                </button>
              </div>

              {/* Main two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Preview panel */}
                <div className={`space-y-6 ${mobileTab === 'latex' ? 'hidden lg:block' : ''}`}>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    Optimized Content
                  </div>
                  <ResumePreview
                    ref={resumeRef}
                    data={resumeData}
                    onChange={handleResumeChange}
                  />
                </div>

                {/* LaTeX panel */}
                <div className={`space-y-6 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                    <ArrowRight className="w-4 h-4 text-emerald-500" />
                    LaTeX Source
                  </div>
                  <LatexEditor
                    latex={latex}
                    onLatexChange={handleLatexChange}
                    onExportWord={handleExportWord}
                  />
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
          {[
            { icon: Zap, title: 'Instant Processing', desc: 'Convert your documents in seconds with our high-performance AI engine.' },
            { icon: Shield, title: 'ATS Optimized', desc: 'Specifically designed to pass through modern Applicant Tracking Systems.' },
            { icon: Cpu, title: 'AI Enhancement', desc: 'Smart restructuring of your content to highlight key achievements.' },
            { icon: Globe, title: 'Multi-Format Export', desc: 'Export as PDF, LaTeX source, or Word document for every use case.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">{title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Version History Drawer */}
      <VersionHistory
        versions={history}
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoad={handleLoadVersion}
        onDelete={handleDeleteVersion}
      />
    </div>
  );
};
