import type * as vscode from 'vscode';
import type { AIProvider, ProviderId } from '../types';
import { getConfig } from '../config';
import { ClaudeProvider } from './claudeProvider';
import { OpenAIProvider } from './openaiProvider';
import { GeminiProvider } from './geminiProvider';
import { OllamaProvider } from './ollamaProvider';
import { CopilotProvider } from './copilotProvider';
import { ClaudeCodeProvider } from './claudeCodeProvider';

/** A concrete provider (not the 'auto' / 'none' pseudo-providers). */
export type ConcreteProviderId = Exclude<ProviderId, 'auto' | 'none'>;

/** Default model per provider, used when `errordost.model` is empty. Copilot: '' = first available model. */
export const DEFAULT_MODELS: Readonly<Record<ConcreteProviderId, string>> = {
  copilot: '',
  'claude-code': 'haiku',
  claude: 'claude-haiku-5-5',
  openai: 'gpt-5-mini',
  gemini: 'gemini-flash-latest',
  ollama: 'llama3.2',
};

/** Order tried when `errordost.aiProvider` is 'auto'. Key providers only count if a key is stored. */
export const AUTO_ORDER: readonly ConcreteProviderId[] = ['copilot', 'claude-code', 'ollama', 'claude', 'openai', 'gemini'];

/** Providers that need an API key stored in SecretStorage. */
export const KEY_PROVIDERS = ['claude', 'openai', 'gemini'] as const;
export type KeyProviderId = (typeof KEY_PROVIDERS)[number];

export function secretKey(id: KeyProviderId | ProviderId): string {
  return `errordost.apiKey.${id}`;
}

/**
 * Creates a concrete provider. Returns undefined for 'none' and 'auto' (use pickProvider for auto).
 * The `errordost.model` override only applies when a specific provider is selected, since a
 * model name rarely makes sense across several providers.
 */
export function createProvider(id: ProviderId, secrets: vscode.SecretStorage): AIProvider | undefined {
  if (id === 'none' || id === 'auto') return undefined;
  const cfg = getConfig();
  const override = cfg.aiProvider === id ? cfg.model.trim() : '';
  const model = override || DEFAULT_MODELS[id];
  switch (id) {
    case 'copilot':
      return new CopilotProvider(model);
    case 'claude-code':
      return new ClaudeCodeProvider(cfg.claudeCodePath, model);
    case 'claude':
      return new ClaudeProvider(secrets, secretKey(id), model);
    case 'openai':
      return new OpenAIProvider(secrets, secretKey(id), model);
    case 'gemini':
      return new GeminiProvider(secrets, secretKey(id), model);
    case 'ollama':
      return new OllamaProvider(cfg.ollamaUrl, model);
    default:
      return undefined;
  }
}

async function usable(provider: AIProvider | undefined): Promise<boolean> {
  if (!provider) return false;
  try {
    return await provider.isAvailable();
  } catch {
    return false;
  }
}

/**
 * Returns an AI provider that is usable right now, or undefined (caller shows the offline KB / a setup hint).
 * - 'none' → undefined
 * - a specific provider → that provider if available
 * - 'auto' → first available of copilot → claude-code → ollama → claude/openai/gemini (if a key is stored)
 */
export async function pickProvider(secrets: vscode.SecretStorage): Promise<AIProvider | undefined> {
  const chosen = getConfig().aiProvider;
  if (chosen === 'none') return undefined;
  if (chosen !== 'auto') {
    const provider = createProvider(chosen, secrets);
    return (await usable(provider)) ? provider : undefined;
  }
  for (const id of AUTO_ORDER) {
    const provider = createProvider(id, secrets);
    if (await usable(provider)) return provider;
  }
  return undefined;
}
