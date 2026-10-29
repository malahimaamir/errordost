import * as vscode from 'vscode';
import { UI_LANGUAGES, type Level, type ProviderId, type UiLanguage } from './types';

export interface ErrorBuddyConfig {
  /** '' = not chosen yet (first-run picker is shown). */
  language: UiLanguage | '';
  level: Level;
  aiProvider: ProviderId;
  model: string;
  ollamaUrl: string;
  claudeCodePath: string;
  knowledgeBaseFirst: boolean;
  terminalEnabled: boolean;
  codeActionsEnabled: boolean;
  hoverEnabled: boolean;
}

const LEVELS: readonly Level[] = ['beginner', 'pro'];
const PROVIDERS: readonly ProviderId[] = ['auto', 'copilot', 'claude-code', 'claude', 'openai', 'gemini', 'ollama', 'none'];

function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value.trim() || fallback : fallback;
}

/** Reads and validates `errorbuddy.*`. Defaults mirror `contributes.configuration` in package.json. */
export function getConfig(): ErrorBuddyConfig {
  const c = vscode.workspace.getConfiguration('errorbuddy');
  return {
    language: oneOf<UiLanguage | ''>(c.get('language'), UI_LANGUAGES, ''),
    level: oneOf(c.get('level'), LEVELS, 'beginner'),
    aiProvider: oneOf(c.get('aiProvider'), PROVIDERS, 'auto'),
    model: str(c.get('model'), ''),
    ollamaUrl: str(c.get('ollamaUrl'), 'http://localhost:11434'),
    claudeCodePath: str(c.get('claudeCodePath'), 'claude'),
    knowledgeBaseFirst: bool(c.get('knowledgeBaseFirst'), true),
    terminalEnabled: bool(c.get('terminal.enabled'), true),
    codeActionsEnabled: bool(c.get('codeActions.enabled'), true),
    hoverEnabled: bool(c.get('hover.enabled'), true),
  };
}
