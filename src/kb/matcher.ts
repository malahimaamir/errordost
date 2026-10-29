/**
 * Pure matching engine for the offline knowledge base (no `vscode` import).
 * Kept separate from index.ts so it can be unit-tested with any entry list.
 */
import type { ErrorContext, ExplanationText, KbEntry, UiLanguage } from '../types';

export interface KbMatch {
  entry: KbEntry;
  text: (lang: UiLanguage) => ExplanationText;
}

/** Very long inputs (whole terminal dumps) are trimmed to keep matching fast. */
const MAX_INPUT = 6000;

function normalizeCode(err: ErrorContext): string | undefined {
  const raw = err.code === undefined || err.code === null ? '' : String(err.code).trim();
  if (!raw) return undefined;
  // VS Code reports TypeScript codes as bare numbers (source 'ts'); normalise to "TS2339".
  if (/^\d+$/.test(raw) && (!err.source || /^ts$|typescript/i.test(err.source))) {
    return `TS${raw}`;
  }
  return raw;
}

/** Strip ANSI colour codes that terminals add. */
function stripAnsi(s: string): string {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');
}

interface Hit {
  m: RegExpExecArray;
  /** true when only the "CODE message" candidate matched (e.g. a localized diagnostic). */
  viaCode: boolean;
}

function tryEntry(entry: KbEntry, candidates: string[]): Hit | undefined {
  for (const pattern of entry.patterns) {
    for (let i = 0; i < candidates.length; i++) {
      pattern.lastIndex = 0; // guard against accidental /g or /y flags
      const m = pattern.exec(candidates[i]);
      if (m) return { m, viaCode: i > 0 };
    }
  }
  return undefined;
}

/** Quoted names in a message, e.g. a localized TS message: Die Eigenschaft "age" ... "User". */
function quotedTokens(message: string): string[] {
  const out: string[] = [];
  const re = /['"“„«‘「]([^'"“”„«»‘’「」\n]{1,80})['"”“»’」]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(message)) && out.length < 9) out.push(m[1].trim());
  return out;
}

/**
 * Replace {1}, {2}, ... with capture groups.
 * - `{1|fallback}` uses `fallback` when group 1 is missing (handy inside code samples).
 * - Otherwise a missing placeholder is removed together with a pair of quotes/backticks
 *   wrapping it, empty parentheses are dropped and spacing is tidied.
 */
export function fillPlaceholders(template: string, groups: ReadonlyArray<string | undefined>): string {
  let removed = false;
  const out = template.replace(
    /(['"`‘“]?)\{(\d+)(?:\|([^{}\n]*))?\}(['"`’”]?)/g,
    (_all, open: string, idx: string, fallback: string | undefined, close: string) => {
      const value = groups[Number(idx)];
      if (value !== undefined && value !== '') return `${open}${value}${close}`;
      if (fallback !== undefined) return `${open}${fallback}${close}`;
      removed = true;
      // Only drop the quotes when they form a pair around the placeholder.
      return open && close ? '' : `${open}${close}`;
    },
  );
  if (!removed) return out;
  return out
    .replace(/[ \t]\([ \t]*\)/g, '') // "word ()" left by a removed "({1})" (keeps `fn()` intact)
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/[ \t]+([.,;:!?،۔।])/g, '$1')
    .trim();
}

export function matchEntries(entries: readonly KbEntry[], err: ErrorContext): KbMatch | undefined {
  const message = stripAnsi(String(err?.message ?? '')).slice(0, MAX_INPUT);
  if (!message.trim()) return undefined;

  const code = normalizeCode(err);
  const candidates = code ? [message, `${code} ${message}`] : [message];

  const langId = err.languageId?.toLowerCase();
  // Tier 1: entries for this language; tier 2: language-neutral entries; tier 3: everything else.
  const tier1: KbEntry[] = [];
  const tier2: KbEntry[] = [];
  const tier3: KbEntry[] = [];
  for (const entry of entries) {
    if (!entry.languages || entry.languages.length === 0) tier2.push(entry);
    else if (langId && entry.languages.includes(langId)) tier1.push(entry);
    else tier3.push(entry);
  }

  for (const entry of [...tier1, ...tier2, ...tier3]) {
    const hit = tryEntry(entry, candidates);
    if (hit) {
      let groups: Array<string | undefined> = Array.from(hit.m, (g) => (g === undefined ? undefined : g.trim()));
      if (hit.viaCode && groups.slice(1).every((g) => !g)) {
        // Matched only by diagnostic code: borrow quoted names from the (possibly translated) message.
        groups = [groups[0], ...quotedTokens(message)];
      }
      return {
        entry,
        text: (lang: UiLanguage): ExplanationText => {
          const base = entry.text[lang] ?? entry.text.english;
          return {
            meaning: fillPlaceholders(base.meaning, groups),
            cause: fillPlaceholders(base.cause, groups),
            fix: base.fix.map((step) => fillPlaceholders(step, groups)),
          };
        },
      };
    }
  }
  return undefined;
}
