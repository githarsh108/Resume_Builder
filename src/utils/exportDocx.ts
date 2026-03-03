import {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    AlignmentType, BorderStyle, TabStopType, LeaderType,
} from 'docx';
import { ResumeData } from '../types/resume.types';

function sectionHeading(title: string): Paragraph {
    return new Paragraph({
        text: title.toUpperCase(),
        heading: HeadingLevel.HEADING_2,
        border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
        },
        spacing: { before: 240, after: 80 },
    });
}

function bulletPoint(text: string): Paragraph {
    return new Paragraph({
        children: [new TextRun({ text, size: 20 })],
        bullet: { level: 0 },
        spacing: { after: 40 },
    });
}

export async function exportToDocx(data: ResumeData): Promise<void> {
    const children: Paragraph[] = [];

    // ── Header ──────────────────────────────────────────────────────────────────
    children.push(
        new Paragraph({
            children: [new TextRun({ text: data.name, bold: true, size: 36, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
        })
    );

    const contactParts: string[] = [];
    if (data.phone) contactParts.push(data.phone);
    if (data.email) contactParts.push(data.email);
    if (data.linkedin) contactParts.push(`linkedin.com/in/${data.linkedin.split('/').pop()}`);
    if (data.github) contactParts.push(`github.com/${data.github.split('/').pop()}`);
    if (data.portfolio) contactParts.push(data.portfolio);

    children.push(
        new Paragraph({
            children: [new TextRun({ text: contactParts.join('  |  '), size: 18, color: '555555' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        })
    );

    // ── Education ────────────────────────────────────────────────────────────────
    if (data.education?.length) {
        children.push(sectionHeading('Education'));
        data.education.forEach(edu => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.institution, bold: true, size: 22 }),
                        new TextRun({ text: `\t${edu.graduationDate}`, size: 20 }),
                    ],
                    tabStops: [{ type: TabStopType.RIGHT, position: 9360, leader: LeaderType.NONE }],
                    spacing: { after: 40 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: edu.degree + (edu.gpa ? `, GPA: ${edu.gpa}` : ''), italics: true, size: 20 }),
                        new TextRun({ text: `\t${edu.location}`, size: 20 }),
                    ],
                    tabStops: [{ type: TabStopType.RIGHT, position: 9360, leader: LeaderType.NONE }],
                    spacing: { after: 80 },
                })
            );
        });
    }

    // ── Skills ────────────────────────────────────────────────────────────────────
    const skillParts: string[] = [];
    if (data.skills.languages?.length) skillParts.push(`Languages: ${data.skills.languages.join(', ')}`);
    if (data.skills.frameworks?.length) skillParts.push(`Frameworks: ${data.skills.frameworks.join(', ')}`);
    if (data.skills.libraries?.length) skillParts.push(`Libraries: ${data.skills.libraries.join(', ')}`);
    if (data.skills.tools?.length) skillParts.push(`Tools: ${data.skills.tools.join(', ')}`);

    if (skillParts.length) {
        children.push(sectionHeading('Technical Skills'));
        skillParts.forEach(part => {
            const [label, ...rest] = part.split(': ');
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: `${label}: `, bold: true, size: 20 }),
                        new TextRun({ text: rest.join(': '), size: 20 }),
                    ],
                    spacing: { after: 40 },
                })
            );
        });
    }

    // ── Experience ────────────────────────────────────────────────────────────────
    if (data.experience?.length) {
        children.push(sectionHeading('Experience'));
        data.experience.forEach(exp => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.company, bold: true, size: 22 }),
                        new TextRun({ text: `\t${exp.startDate} – ${exp.endDate}`, size: 20 }),
                    ],
                    tabStops: [{ type: TabStopType.RIGHT, position: 9360, leader: LeaderType.NONE }],
                    spacing: { after: 40 },
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.position, italics: true, size: 20 }),
                        new TextRun({ text: `\t${exp.location}`, size: 20 }),
                    ],
                    tabStops: [{ type: TabStopType.RIGHT, position: 9360, leader: LeaderType.NONE }],
                    spacing: { after: 40 },
                })
            );
            exp.highlights.forEach(h => children.push(bulletPoint(h)));
            children.push(new Paragraph({ spacing: { after: 80 } }));
        });
    }

    // ── Projects ─────────────────────────────────────────────────────────────────
    if (data.projects?.length) {
        children.push(sectionHeading('Projects'));
        data.projects.forEach(proj => {
            children.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: proj.name, bold: true, size: 22 }),
                        new TextRun({ text: `  |  ${proj.technologies.join(', ')}`, size: 18, color: '555555' }),
                    ],
                    spacing: { after: 40 },
                })
            );
            if (proj.description) {
                children.push(new Paragraph({ children: [new TextRun({ text: proj.description, italics: true, size: 20 })], spacing: { after: 40 } }));
            }
            proj.highlights.forEach(h => children.push(bulletPoint(h)));
            children.push(new Paragraph({ spacing: { after: 80 } }));
        });
    }

    // ── Achievements ──────────────────────────────────────────────────────────────
    if (data.achievements?.length) {
        children.push(sectionHeading('Achievements'));
        data.achievements.forEach(a => children.push(bulletPoint(a)));
        children.push(new Paragraph({ spacing: { after: 80 } }));
    }

    // ── Certifications ────────────────────────────────────────────────────────────
    if (data.certifications?.length) {
        children.push(sectionHeading('Certifications'));
        data.certifications.forEach(c => children.push(bulletPoint(c)));
    }

    // ── Build & download ──────────────────────────────────────────────────────────
    const doc = new Document({
        sections: [{
            properties: {
                page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } },
            },
            children,
        }],
        styles: {
            default: {
                document: { run: { font: 'Calibri', size: 20 } },
                heading2: {
                    run: { bold: true, size: 22, font: 'Calibri', color: '000000' },
                    paragraph: {},
                },
            },
        },
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s+/g, '_')}_Resume.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
