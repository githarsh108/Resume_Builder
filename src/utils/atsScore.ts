import { ResumeData, AtsReport, AtsCheckItem } from '../types/resume.types';

export function computeAtsScore(data: ResumeData, originalText: string): AtsReport {
    const checks: AtsCheckItem[] = [];

    // 1. GitHub present
    checks.push({
        label: 'GitHub profile linked',
        passed: !!(data.github && data.github.trim().length > 0),
        tip: 'Add your GitHub URL — recruiters and ATS systems look for portfolio links.',
    });

    // 2. LinkedIn present
    checks.push({
        label: 'LinkedIn profile linked',
        passed: !!(data.linkedin && data.linkedin.trim().length > 0),
        tip: 'A LinkedIn URL increases credibility and is parsed by most ATS systems.',
    });

    // 3. Quantified bullet points (contains a digit)
    const allBullets = [
        ...data.experience.flatMap(e => e.highlights),
        ...data.projects.flatMap(p => p.highlights),
    ];
    const quantifiedCount = allBullets.filter(b => /\d/.test(b)).length;
    const quantifiedRatio = allBullets.length > 0 ? quantifiedCount / allBullets.length : 0;
    checks.push({
        label: `Quantified achievements (${quantifiedCount}/${allBullets.length} bullets have numbers)`,
        passed: quantifiedRatio >= 0.5,
        tip: 'At least 50% of your bullet points should contain measurable results (%, $, numbers).',
    });

    // 4. Skills count
    const totalSkills = [
        ...(data.skills.languages || []),
        ...(data.skills.frameworks || []),
        ...(data.skills.tools || []),
        ...(data.skills.libraries || []),
    ].length;
    checks.push({
        label: `Skills section populated (${totalSkills} skills)`,
        passed: totalSkills >= 6,
        tip: 'ATS systems scan for keyword density in skills. Aim for at least 6 skills listed.',
    });

    // 5. Experience section has content
    checks.push({
        label: 'Work experience present',
        passed: data.experience.length > 0,
        tip: 'At least one work experience entry is required for most ATS systems.',
    });

    // 6. Education section present
    checks.push({
        label: 'Education section present',
        passed: data.education.length > 0,
        tip: 'Many ATS systems require an education section with institution and degree.',
    });

    // 7. No tables/columns detected (rough heuristic from original text)
    const hasTabularFormats = (originalText.match(/\|/g) || []).length > 10;
    checks.push({
        label: 'No complex table formatting detected',
        passed: !hasTabularFormats,
        tip: 'Tables and multi-column layouts confuse ATS parsers. Use single-column layouts.',
    });

    // 8. Contact info completeness
    const hasPhone = !!(data.phone && data.phone.trim());
    const hasEmail = !!(data.email && data.email.trim() && data.email.includes('@'));
    checks.push({
        label: 'Contact info complete (phone + email)',
        passed: hasPhone && hasEmail,
        tip: 'Both a phone number and email address are required contact fields in ATS systems.',
    });

    // 9. No very short bullet points (< 30 chars suggests content is thin)
    const shortBullets = allBullets.filter(b => b.trim().length < 30).length;
    checks.push({
        label: `Bullet point quality (${shortBullets} overly short bullets)`,
        passed: shortBullets === 0,
        tip: 'Very short bullet points provide little context. Expand them with action + result format.',
    });

    // 10. Has projects section
    checks.push({
        label: 'Projects section present',
        passed: data.projects.length > 0,
        tip: 'Projects demonstrate hands-on skills and are highly valued by ATS and recruiters.',
    });

    // Score = percentage of passed checks, rounded to nearest 5
    const passedCount = checks.filter(c => c.passed).length;
    const raw = Math.round((passedCount / checks.length) * 100);
    const score = Math.round(raw / 5) * 5;

    return { score, checks };
}
