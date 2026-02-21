import { ResumeData } from '../types/resume.types';

export const saveResume = (data: ResumeData) => {
  localStorage.setItem('ai_resume_data', JSON.stringify(data));
};

export const getSavedResume = (): ResumeData | null => {
  const data = localStorage.getItem('ai_resume_data');
  return data ? JSON.parse(data) : null;
};

export const saveLatex = (latex: string) => {
  localStorage.setItem('ai_resume_latex', latex);
};

export const getSavedLatex = (): string | null => {
  return localStorage.getItem('ai_resume_latex');
};
