/**
 * ErrorBuddy offline knowledge base.
 * Pure module: no `vscode` import, so it can be unit-tested with plain Node.
 */
import type { ErrorContext, KbEntry } from '../types';
import { matchEntries, type KbMatch } from './matcher';
import { JS_ENTRIES } from './javascript';
import { HTMLCSS_ENTRIES } from './htmlcss';
import { PYTHON_ENTRIES } from './python';
import { JAVA_ENTRIES } from './java';
import { CPP_ENTRIES } from './cpp';
import { PHP_ENTRIES } from './php';

export const KB_ENTRIES: KbEntry[] = [
  ...JS_ENTRIES,
  ...HTMLCSS_ENTRIES,
  ...PYTHON_ENTRIES,
  ...JAVA_ENTRIES,
  ...CPP_ENTRIES,
  ...PHP_ENTRIES,
];

export const KB_SIZE: number = KB_ENTRIES.length;

export type { KbMatch } from './matcher';
export { fillPlaceholders } from './matcher';

export function matchKnowledgeBase(err: ErrorContext): KbMatch | undefined {
  return matchEntries(KB_ENTRIES, err);
}
