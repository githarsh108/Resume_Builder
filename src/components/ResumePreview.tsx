import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { ResumeData } from '../types/resume.types';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-4xl mx-auto bg-white p-8 space-y-6"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
      id="resume-preview-content"
    >
      {/* Header */}
      <div className="space-y-2 border-b border-zinc-200 pb-4">
        <h1 className="text-2xl font-bold text-black tracking-tight">{data.name}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            {data.email}
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            {data.phone}
          </div>
          {data.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3 h-3" />
              {data.linkedin?.split('/').pop()}
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <section className="space-y-3">
        <h2 className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400 border-b border-zinc-100 pb-1">Technical Stack</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {Object.entries(data.skills).map(([category, skills]) => {
            const skillList = skills as string[] | undefined;
            return skillList && skillList.length > 0 && (
              <div key={category} className="flex gap-2 items-baseline">
                <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold min-w-[80px]">{category}:</h3>
                <p className="text-zinc-700 text-[11px] leading-tight">{skillList.join(', ')}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <h2 className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400 border-b border-zinc-100 pb-1">Experience</h2>
        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-zinc-900">{exp.company}</h3>
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 italic font-mono">
                <span>{exp.position}</span>
                <span>{exp.location}</span>
              </div>
              <ul className="space-y-1">
                {exp.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="text-[11px] text-zinc-700 leading-snug flex gap-2">
                    <span className="text-zinc-300">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <h2 className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400 border-b border-zinc-100 pb-1">Projects</h2>
        <div className="space-y-4">
          {data.projects.map((proj, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-zinc-900">{proj.name}</h3>
                <div className="flex gap-2">
                  {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-zinc-600 leading-snug italic">{proj.description}</p>
              <ul className="space-y-1">
                {proj.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="text-[11px] text-zinc-700 leading-snug flex gap-2">
                    <span className="text-zinc-300">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-3">
        <h2 className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400 border-b border-zinc-100 pb-1">Education</h2>
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-zinc-900">{edu.institution}</h3>
                <p className="text-[10px] text-zinc-600 italic font-mono">{edu.degree}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">{edu.graduationDate}</p>
                <p className="text-[10px] text-zinc-400 italic">{edu.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
});
