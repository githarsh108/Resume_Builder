import React, { forwardRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ResumeData } from '../types/resume.types';
import { Mail, Phone, Linkedin, Github, Globe, Trophy, Award } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, onChange }, ref) => {

  // Generic editable span: fires onChange with the updated deep-cloned data
  const EditableSpan: React.FC<{
    value: string;
    onSave: (newValue: string) => void;
    className?: string;
    tag?: React.ElementType;
    placeholder?: string;
  }> = ({ value, onSave, className = '', tag: Tag = 'span', placeholder = 'Click to edit' }) => {
    const handleBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
      const newVal = e.currentTarget.textContent?.trim() ?? '';
      if (newVal !== value) onSave(newVal);
    }, [value, onSave]);

    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        data-placeholder={placeholder}
        className={`outline-none focus:bg-emerald-50/80 focus:rounded px-0.5 cursor-text transition-colors ${className}`}
      >
        {value}
      </Tag>
    );
  };

  // Helper to deep-clone data and run a mutation
  const update = <T,>(mutate: (d: ResumeData) => void): void => {
    const clone = JSON.parse(JSON.stringify(data)) as ResumeData;
    mutate(clone);
    onChange(clone);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-4xl mx-auto bg-white p-8 space-y-6"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
      id="resume-preview-content"
    >
      {/* Inline edit hint */}
      <div className="text-[9px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-2 py-1 text-center font-medium tracking-wide">
        ✎ Click any text to edit inline — changes sync to LaTeX automatically
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-zinc-200 pb-4">
        <EditableSpan
          tag="h1"
          value={data.name}
          onSave={(v) => update(d => { d.name = v; })}
          className="text-2xl font-bold text-black tracking-tight block"
        />
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            <EditableSpan value={data.email} onSave={(v) => update(d => { d.email = v; })} />
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3" />
            <EditableSpan value={data.phone} onSave={(v) => update(d => { d.phone = v; })} />
          </div>
          {data.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3 h-3" />
              <EditableSpan value={data.linkedin.split('/').pop() ?? ''} onSave={(v) => update(d => { d.linkedin = `https://linkedin.com/in/${v}`; })} />
            </div>
          )}
          {data.github && (
            <div className="flex items-center gap-1.5">
              <Github className="w-3 h-3" />
              <EditableSpan value={data.github.split('/').pop() ?? ''} onSave={(v) => update(d => { d.github = `https://github.com/${v}`; })} />
            </div>
          )}
          {data.portfolio && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <EditableSpan value={data.portfolio} onSave={(v) => update(d => { d.portfolio = v; })} />
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
                <EditableSpan
                  value={skillList.join(', ')}
                  onSave={(v) => update(d => {
                    (d.skills as any)[category] = v.split(',').map((s: string) => s.trim()).filter(Boolean);
                  })}
                  className="text-zinc-700 text-[11px] leading-tight"
                />
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
                <EditableSpan tag="h3" value={exp.company} onSave={(v) => update(d => { d.experience[idx].company = v; })} className="text-sm font-bold text-zinc-900" />
                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">
                  <EditableSpan value={exp.startDate} onSave={(v) => update(d => { d.experience[idx].startDate = v; })} /> — <EditableSpan value={exp.endDate} onSave={(v) => update(d => { d.experience[idx].endDate = v; })} />
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-zinc-600 italic font-mono">
                <EditableSpan value={exp.position} onSave={(v) => update(d => { d.experience[idx].position = v; })} />
                <EditableSpan value={exp.location} onSave={(v) => update(d => { d.experience[idx].location = v; })} />
              </div>
              <ul className="space-y-1">
                {exp.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="text-[11px] text-zinc-700 leading-snug flex gap-2">
                    <span className="text-zinc-300 flex-shrink-0">•</span>
                    <EditableSpan value={h} onSave={(v) => update(d => { d.experience[idx].highlights[hIdx] = v; })} className="flex-1" />
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
                <EditableSpan tag="h3" value={proj.name} onSave={(v) => update(d => { d.projects[idx].name = v; })} className="text-sm font-bold text-zinc-900" />
                <div className="flex gap-2">
                  {proj.technologies.slice(0, 4).map((tech, tIdx) => (
                    <span key={tIdx} className="text-[8px] text-zinc-400 font-mono uppercase tracking-widest">{tech}</span>
                  ))}
                </div>
              </div>
              {proj.description && (
                <EditableSpan value={proj.description} onSave={(v) => update(d => { d.projects[idx].description = v; })} className="text-[11px] text-zinc-600 leading-snug italic block" />
              )}
              <ul className="space-y-1">
                {proj.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="text-[11px] text-zinc-700 leading-snug flex gap-2">
                    <span className="text-zinc-300 flex-shrink-0">•</span>
                    <EditableSpan value={h} onSave={(v) => update(d => { d.projects[idx].highlights[hIdx] = v; })} className="flex-1" />
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
                <EditableSpan tag="h3" value={edu.institution} onSave={(v) => update(d => { d.education[idx].institution = v; })} className="text-sm font-bold text-zinc-900 block" />
                <EditableSpan value={edu.degree} onSave={(v) => update(d => { d.education[idx].degree = v; })} className="text-[10px] text-zinc-600 italic font-mono block" />
              </div>
              <div className="text-right">
                <EditableSpan value={edu.graduationDate} onSave={(v) => update(d => { d.education[idx].graduationDate = v; })} className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest block" />
                <EditableSpan value={edu.location} onSave={(v) => update(d => { d.education[idx].location = v; })} className="text-[10px] text-zinc-400 italic block" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400 border-b border-zinc-100 pb-1 flex items-center gap-1.5">
            <Trophy className="w-3 h-3" /> Achievements
          </h2>
          <ul className="space-y-1">
            {data.achievements.map((a, idx) => (
              <li key={idx} className="text-[11px] text-zinc-700 leading-snug flex gap-2">
                <span className="text-zinc-300 flex-shrink-0">•</span>
                <EditableSpan value={a} onSave={(v) => update(d => { d.achievements[idx] = v; })} className="flex-1" />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[9px] uppercase tracking-[0.2em] font-bold text-zinc-400 border-b border-zinc-100 pb-1 flex items-center gap-1.5">
            <Award className="w-3 h-3" /> Certifications
          </h2>
          <ul className="space-y-1">
            {data.certifications.map((c, idx) => (
              <li key={idx} className="text-[11px] text-zinc-700 leading-snug flex gap-2">
                <span className="text-zinc-300 flex-shrink-0">•</span>
                <EditableSpan value={c} onSave={(v) => update(d => { if (d.certifications) d.certifications[idx] = v; })} className="flex-1" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </motion.div>
  );
});
