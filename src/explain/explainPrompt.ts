// Prompt construction and tolerant parsing of the model's answer. Pure: no vscode imports.
import type { ErrorContext, ExplanationText, Level, UiLanguage } from '../types';

export type ParsedExplanation = ExplanationText & { codeExample?: { bad?: string; good: string } };

const LANGUAGE_INSTRUCTIONS: Record<UiLanguage, string> = {
  english: 'Write all explanation text in simple, clear English.',
  urdu:
    'Write all explanation text in Urdu using Urdu script (Nastaliq / Perso-Arabic letters, right-to-left). ' +
    'Do NOT use Roman/Latin letters for Urdu words and do NOT switch to Hindi (Devanagari).',
  'roman-urdu':
    'Write all explanation text in Roman Urdu: Urdu language written with Latin (English) letters, ' +
    'the way Pakistani developers chat (e.g. "Yeh error is liye aata hai kyun ke..."). ' +
    'Do NOT use Urdu/Arabic script and do NOT write plain English sentences.',
  hindi:
    'Write all explanation text in Hindi using Devanagari script. ' +
    'Do NOT use Latin letters for Hindi words and do NOT switch to Urdu script.',
  arabic:
    'Write all explanation text in Modern Standard Arabic using Arabic script (right-to-left). ' +
    'Do NOT transliterate Arabic into Latin letters.',
};

const LEVEL_INSTRUCTIONS: Record<Level, string> = {
  beginner:
    'The reader is a BEGINNER. Use very simple, everyday words and short sentences. ' +
    'A small real-life analogy is welcome. Never use jargon without explaining it in a few words. ' +
    'Fix steps must be concrete and easy to follow.',
  pro:
    'The reader is an EXPERIENCED developer. Be concise and precise: no analogies, no filler, ' +
    'focus on the root cause and the exact fix.',
};

const JSON_SHAPE =
  '{"meaning": "...", "cause": "...", "fix": ["step 1", "step 2"], "codeExample": {"bad": "...", "good": "..."}}';

/** Builds the system + user prompt for explaining one error. */
export function buildExplainPrompt(
  err: ErrorContext,
  language: UiLanguage,
  level: Level,
): { system: string; user: string } {
  const system = [
    'You are ErrorDost, a friendly and patient programming teacher who explains error messages.',
    LANGUAGE_INSTRUCTIONS[language],
    'Keep code, identifiers, file names, error names (e.g. TypeError, NullPointerException) and technical keywords ' +
      'in English / their original form — do not translate or transliterate them. Wrap them in `backticks`.',
    LEVEL_INSTRUCTIONS[level],
    'Ground your answer in the given error message and code snippet (the line marked ">>" is where the error was reported). ' +
      'Never invent APIs, functions, options or file contents. If something is uncertain, say what to check instead of guessing.',
    'Respond ONLY with a single JSON object, no markdown fences and no text before or after it, in exactly this shape:',
    JSON_SHAPE,
    '"meaning": what the error means. "cause": why it happened here. "fix": ordered, actionable steps. ' +
      '"codeExample" is optional: include it only when a short code example truly helps; "bad" shows the problem, ' +
      '"good" shows the corrected code. Code inside codeExample stays code (no translation, real newlines as \\n).',
  ].join('\n');

  const parts: string[] = [];
  parts.push(`Error message:\n${err.message}`);
  const meta: string[] = [];
  if (err.origin === 'terminal') {
    meta.push('Origin: output of a failed terminal command');
  } else if (err.origin === 'diagnostic') {
    meta.push('Origin: editor diagnostic');
  }
  if (err.source) meta.push(`${err.origin === 'terminal' ? 'Command' : 'Reported by'}: ${err.source}`);
  if (err.code) meta.push(`Error code: ${err.code}`);
  if (err.languageId) meta.push(`Programming language: ${err.languageId}`);
  if (err.filePath) meta.push(`File: ${err.filePath}${err.line !== undefined ? `:${err.line}` : ''}`);
  if (meta.length) parts.push(meta.join('\n'));
  if (err.snippet) parts.push(`Code around the error:\n${err.snippet}`);
  parts.push(`Explain this error for a ${level} reader. Answer with the JSON object only.`);

  return { system, user: parts.join('\n\n') };
}

// ---------------------------------------------------------------------------------------------
// Parsing

/** Parses the model output into an explanation. Never throws. */
export function parseExplanation(raw: string): ParsedExplanation {
  const text = typeof raw === 'string' ? raw.replace(/\r\n?/g, '\n').trim() : '';
  if (!text) {
    return { meaning: '', cause: '', fix: [] };
  }
  for (const candidate of jsonCandidates(text)) {
    const parsed = tryParseJson(candidate);
    const result = parsed !== undefined ? fromJson(parsed) : undefined;
    if (result) {
      return result;
    }
  }
  return fromPlainText(text);
}

/** Fenced block contents first, then the first balanced {...} in the whole text. */
function jsonCandidates(text: string): string[] {
  const out: string[] = [];
  const fence = /```[a-zA-Z0-9_-]*\s*\n?([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = fence.exec(text))) {
    const obj = firstJsonObject(m[1]);
    if (obj) out.push(obj);
  }
  const obj = firstJsonObject(text);
  if (obj) out.push(obj);
  return out;
}

/** Finds the first balanced `{...}` (string-aware). Returns the unterminated rest if never closed. */
function firstJsonObject(text: string): string | undefined {
  const start = text.indexOf('{');
  if (start < 0) {
    return undefined;
  }
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return text.slice(start);
}

function tryParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    // Common model slips: trailing commas, raw newlines inside strings.
    try {
      const repaired = s.replace(/,\s*([}\]])/g, '$1').replace(/"((?:[^"\\]|\\.)*)"/g, (_m, body: string) =>
        `"${body.replace(/\n/g, '\\n').replace(/\t/g, '\\t')}"`,
      );
      return JSON.parse(repaired);
    } catch {
      return undefined;
    }
  }
}

function str(v: unknown): string {
  return typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '';
}

function toSteps(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v
      .map((s) => (typeof s === 'string' ? s : s && typeof s === 'object' ? str((s as Record<string, unknown>).step ?? (s as Record<string, unknown>).text) : str(s)))
      .map((s) => stripBullet(s))
      .filter(Boolean);
  }
  const s = str(v);
  return s ? s.split('\n').map(stripBullet).filter(Boolean) : [];
}

function stripBullet(s: string): string {
  return s.trim().replace(/^(?:[-*•]|\d+[.)])\s+/, '').trim();
}

function fromJson(value: unknown): ParsedExplanation | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const o = value as Record<string, unknown>;
  const meaning = str(o.meaning ?? o.explanation ?? o.what);
  const cause = str(o.cause ?? o.why ?? o.reason);
  const fix = toSteps(o.fix ?? o.fixes ?? o.steps ?? o.solution);
  if (!meaning && !cause && !fix.length) {
    return undefined;
  }
  const result: ParsedExplanation = { meaning, cause, fix };
  const ex = o.codeExample ?? o.code_example ?? o.example;
  if (typeof ex === 'string' && ex.trim()) {
    result.codeExample = { good: stripFences(ex) };
  } else if (ex && typeof ex === 'object' && !Array.isArray(ex)) {
    const e = ex as Record<string, unknown>;
    const good = typeof e.good === 'string' ? stripFences(e.good) : '';
    const bad = typeof e.bad === 'string' ? stripFences(e.bad) : '';
    if (good) {
      result.codeExample = bad ? { bad, good } : { good };
    }
  }
  return result;
}

function stripFences(code: string): string {
  return code.replace(/^\s*```[a-zA-Z0-9_-]*\s*\n?/, '').replace(/\n?```\s*$/, '').replace(/\s+$/, '');
}

/** Heuristic fallback: first paragraph = meaning, next = cause, bullet lines = fix, last code block = example. */
function fromPlainText(text: string): ParsedExplanation {
  const codeBlocks: string[] = [];
  const prose = text.replace(/```[a-zA-Z0-9_-]*\s*\n?([\s\S]*?)(?:```|$)/g, (_m, code: string) => {
    if (code.trim()) codeBlocks.push(code.replace(/\s+$/, ''));
    return '\n\n';
  });

  const paragraphs: string[] = [];
  const fix: string[] = [];
  let current: string[] = [];
  const flush = (): void => {
    if (current.length) {
      paragraphs.push(current.join(' ').trim());
      current = [];
    }
  };
  for (const rawLine of prose.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    if (/^(?:[-*•]|\d+[.)])\s+/.test(line)) {
      flush();
      const step = stripBullet(line);
      if (step) fix.push(step);
      continue;
    }
    // Headings like "## Meaning" or "Why:" are labels, not content.
    const label = line.replace(/^#+\s*/, '').replace(/\*\*/g, '');
    if (/^#+\s/.test(line) || (/[:：]$/.test(label) && label.length <= 40)) {
      flush();
      continue;
    }
    current.push(label.replace(/^(?:meaning|cause|why|fix)\s*[:：]\s*/i, ''));
  }
  flush();

  const filtered = paragraphs.filter(Boolean);
  const result: ParsedExplanation = {
    meaning: filtered[0] ?? (fix.length ? '' : text.slice(0, 2000)),
    cause: filtered.slice(1).join('\n\n'),
    fix,
  };
  if (codeBlocks.length) {
    const good = codeBlocks[codeBlocks.length - 1];
    result.codeExample = codeBlocks.length > 1 ? { bad: codeBlocks[0], good } : { good };
  }
  return result;
}
