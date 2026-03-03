import { ResumeData, ResumeVersion } from '../types/resume.types';

const CURRENT_DATA_KEY = 'ai_resume_data';
const CURRENT_LATEX_KEY = 'ai_resume_latex';
const HISTORY_KEY = 'ai_resume_history';
const MAX_HISTORY = 10;

// ── Current resume (single slot) ──────────────────────────────────────────────
export const saveResume = (data: ResumeData) => {
  localStorage.setItem(CURRENT_DATA_KEY, JSON.stringify(data));
};

export const getSavedResume = (): ResumeData | null => {
  const data = localStorage.getItem(CURRENT_DATA_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveLatex = (latex: string) => {
  localStorage.setItem(CURRENT_LATEX_KEY, latex);
};

export const getSavedLatex = (): string | null => {
  return localStorage.getItem(CURRENT_LATEX_KEY);
};

// ── Version history ────────────────────────────────────────────────────────────
export const getResumeHistory = (): ResumeVersion[] => {
  const raw = localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const saveResumeVersion = (data: ResumeData, latex: string, filename: string): void => {
  const history = getResumeHistory();
  const newVersion: ResumeVersion = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    filename,
    timestamp: new Date().toISOString(),
    data,
    latex,
  };
  // Prepend the new version and cap at MAX_HISTORY
  const updated = [newVersion, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const deleteResumeVersion = (id: string): void => {
  const history = getResumeHistory();
  const updated = history.filter((v) => v.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};
