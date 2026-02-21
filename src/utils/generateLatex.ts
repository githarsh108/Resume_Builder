import { ResumeData } from '../types/resume.types';

export function generateLatex(data: ResumeData): string {
  const escapeLatex = (str: string = '') => {
    return str
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  };

  const skillsList = [
    data.skills.languages?.length ? `\\textbf{Languages}{: ${data.skills.languages.join(', ')}}` : '',
    data.skills.frameworks?.length ? `\\textbf{Frameworks}{: ${data.skills.frameworks.join(', ')}}` : '',
    data.skills.libraries?.length ? `\\textbf{Libraries}{: ${data.skills.libraries.join(', ')}}` : '',
    data.skills.tools?.length ? `\\textbf{Tools}{: ${data.skills.tools.join(', ')}}` : '',
  ].filter(Boolean).join(' \\\\ ');

  const experienceItems = data.experience.map(exp => `
\\resumeSubheading
  {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
  {${escapeLatex(exp.position)}}{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}
  \\resumeItemListStart
    ${exp.highlights.map(h => `\\resumeItem{${escapeLatex(h)}}`).join('\n    ')}
  \\resumeItemListEnd`).join('\n');

  const projectItems = data.projects.map(proj => `
\\resumeProjectHeading
  {\\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(proj.technologies.join(', '))}}}{}
  \\resumeItemListStart
    ${proj.highlights.map(h => `\\resumeItem{${escapeLatex(h)}}`).join('\n    ')}
  \\resumeItemListEnd`).join('\n');

  const educationItems = data.education.map(edu => `
\\resumeSubheading
  {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
  {${escapeLatex(edu.degree)}}{${escapeLatex(edu.graduationDate)}}`).join('\n');

  return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(data.name)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(data.phone)} $|$ \\href{mailto:${data.email}}{\\underline{${escapeLatex(data.email)}}} $|$ 
    \\href{${data.linkedin}}{\\underline{linkedin.com/in/${escapeLatex(data.linkedin?.split('/').pop())}}} $|$
    \\href{${data.github}}{\\underline{github.com/${escapeLatex(data.github?.split('/').pop())}}}
\\end{center}

\\section{Education}
  \\resumeSubHeadingListStart
    ${educationItems}
  \\resumeSubHeadingListEnd

\\section{Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     ${skillsList}
    }}
 \\end{itemize}

\\section{Experience}
  \\resumeSubHeadingListStart
    ${experienceItems}
  \\resumeSubHeadingListEnd

\\section{Projects}
    \\resumeSubHeadingListStart
      ${projectItems}
    \\resumeSubHeadingListEnd

\\end{document}
`;
}
