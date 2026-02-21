/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ResumeExperience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  highlights: string[];
}

export interface ResumeEducation {
  institution: string;
  degree: string;
  location: string;
  graduationDate: string;
  gpa?: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills: {
    languages?: string[];
    frameworks?: string[];
    tools?: string[];
    libraries?: string[];
  };
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  achievements: string[];
}

export type ResumeStatus = 'idle' | 'parsing' | 'transforming' | 'completed' | 'error';
