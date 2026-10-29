export type UiLanguage = 'english' | 'urdu' | 'roman-urdu' | 'hindi' | 'arabic';
export type Level = 'beginner' | 'pro';
export type ProviderId = 'auto' | 'copilot' | 'claude-code' | 'claude' | 'openai' | 'gemini' | 'ollama' | 'none';

export const UI_LANGUAGES: readonly UiLanguage[] = ['english', 'urdu', 'roman-urdu', 'hindi', 'arabic'];
export const RTL_LANGUAGES: readonly UiLanguage[] = ['urdu', 'arabic'];

export type ErrorOrigin = 'diagnostic' | 'terminal' | 'selection' | 'paste';

export interface ErrorContext {
  message: string;              // the error text (may be multi-line for terminal/stack traces)
  origin: ErrorOrigin;
  source?: string;              // diagnostic source e.g. 'ts', 'eslint', 'Pylance', 'css', or terminal command line
  code?: string;                // diagnostic code as string, e.g. 'TS2339'
  languageId?: string;          // VS Code languageId of the file, e.g. 'typescript', 'python', 'css'
  filePath?: string;            // workspace-relative path
  line?: number;                // 1-based
  snippet?: string;             // ALREADY SANITIZED surrounding code lines, error line prefixed with '>> '
}

export interface ExplanationText { meaning: string; cause: string; fix: string[] }

export interface Explanation extends ExplanationText {
  codeExample?: { bad?: string; good: string };
  source: 'kb' | 'ai';
  providerLabel: string;        // e.g. 'Offline knowledge base', 'GitHub Copilot', 'Claude Code'
  kbId?: string;
}

export interface KbEntry {
  id: string;                   // e.g. 'js-undefined-property'
  title: string;                // short English title
  languages?: string[];         // VS Code languageIds this applies to; omit = any
  patterns: RegExp[];           // tested against ErrorContext.message; first match wins; capture groups usable as {1},{2} in texts
  text: Record<UiLanguage, ExplanationText>;
  example?: { bad?: string; good: string };
}

export interface AIProvider {
  readonly id: ProviderId;
  readonly label: string;
  isAvailable(): Promise<boolean>;
  generate(system: string, user: string, signal?: AbortSignal): Promise<string>;
}
