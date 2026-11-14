// ── Server-side experience extractor (runs on the FULL description) ──────────
export function extractExperienceFromText(fullText: string): string | null {
    if (!fullText) return null;

    const preferredRe = /preferred|optional|nice[- ]to[- ]have|bonus/i;
    const sentences = fullText.split(/[.!?\n]+/);

    const patterns: { re: RegExp; fmt: (m: RegExpMatchArray) => string }[] = [
        // Range: "2-4 years"  /  "2 to 4 years"
        {
            re: /(\d+)\s*(?:–|-)\s*(\d+)\+?\s*years?(?:\s+of)?(?:\s+(?:relevant\s+|professional\s+|work\s+)?experience)?/i,
            fmt: (m) => `${m[1]}-${m[2]} years`,
        },
        // "X to Y years"
        {
            re: /(\d+)\s+to\s+(\d+)\+?\s*years?(?:\s+of)?(?:\s+(?:relevant\s+|professional\s+|work\s+)?experience)?/i,
            fmt: (m) => `${m[1]}-${m[2]} years`,
        },
        // "minimum X years"  /  "at least X years"
        {
            re: /(?:minimum|at\s+least|min\.?)\s+(\d+)\+?\s*years?(?:\s+of)?(?:\s+(?:relevant\s+|professional\s+|work\s+)?experience)?/i,
            fmt: (m) => `${m[1]}+ years`,
        },
        // "X+ years"
        {
            re: /(\d+)\+\s*years?(?:\s+of)?(?:\s+(?:relevant\s+|professional\s+|work\s+)?experience)?/i,
            fmt: (m) => `${m[1]}+ years`,
        },
        // "X years of experience"
        {
            re: /(\d+)\s*years?\s+of(?:\s+(?:relevant\s+|professional\s+|work\s+))?\s*experience/i,
            fmt: (m) => `${m[1]} year${Number(m[1]) > 1 ? "s" : ""}`,
        },
        // "experience of X years"
        {
            re: /experience\s+of\s+(\d+)\+?\s*years?/i,
            fmt: (m) => `${m[1]}+ years`,
        },
        // "X years experience"
        {
            re: /(\d+)\s*years?\s+(?:relevant\s+|professional\s+|work\s+)?experience/i,
            fmt: (m) => `${m[1]} year${Number(m[1]) > 1 ? "s" : ""}`,
        },
    ];

    // Pass 1: non-preferred sentences only
    for (const pat of patterns) {
        for (const sentence of sentences) {
            const m = sentence.match(pat.re);
            if (m && !preferredRe.test(sentence)) return pat.fmt(m);
        }
    }
    // Pass 2 (fallback): accept preferred mentions if nothing else found
    for (const pat of patterns) {
        for (const sentence of sentences) {
            const m = sentence.match(pat.re);
            if (m) return pat.fmt(m);
        }
    }

    if (/fresh(?:er)?|entry[- ]level|no[\s-]experience\s+required/i.test(fullText)) return "Fresher";
    return null;
}
