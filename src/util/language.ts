import * as vscode from 'vscode';
import { getConfig } from '../config';
import { UI_LANGUAGES, type UiLanguage } from '../types';

/** Native-script labels shown in pickers. */
export const LANGUAGE_LABELS: Record<UiLanguage, string> = {
  english: 'English',
  urdu: 'اردو (Urdu)',
  'roman-urdu': 'Roman Urdu',
  hindi: 'हिन्दी (Hindi)',
  arabic: 'العربية (Arabic)',
};

const LANGUAGE_DETAILS: Record<UiLanguage, string> = {
  english: 'Explanations in simple English',
  urdu: 'اردو میں آسان وضاحت — Nastaliq, right-to-left',
  'roman-urdu': 'Urdu in English letters — "Yeh error is liye aaya kyun ke..."',
  hindi: 'हिन्दी में आसान व्याख्या — Devanagari',
  arabic: 'شرح مبسّط باللغة العربية — right-to-left',
};

/** Picker order: the regional languages first, English last (as on the welcome screen). */
const PICK_ORDER: readonly UiLanguage[] = ['urdu', 'roman-urdu', 'hindi', 'arabic', 'english'];

interface LanguageItem extends vscode.QuickPickItem {
  id: UiLanguage;
}

/** Shows the language picker and saves the choice globally. Returns undefined if dismissed. */
async function pickLanguage(current?: UiLanguage | ''): Promise<UiLanguage | undefined> {
  const items: LanguageItem[] = PICK_ORDER.filter(id => UI_LANGUAGES.includes(id)).map(id => ({
    id,
    label: LANGUAGE_LABELS[id],
    description: id === current ? 'current' : undefined,
    detail: LANGUAGE_DETAILS[id],
  }));
  const picked = await vscode.window.showQuickPick(items, {
    title: 'ErrorBuddy: In which language should errors be explained?',
    placeHolder: 'Choose your language — you can change it later with "ErrorBuddy: Choose Explanation Language"',
    matchOnDetail: true,
    ignoreFocusOut: true,
  });
  if (!picked) return undefined;
  await vscode.workspace
    .getConfiguration('errorbuddy')
    .update('language', picked.id, vscode.ConfigurationTarget.Global);
  return picked.id;
}

/**
 * Returns the configured explanation language. If none has been chosen yet, asks once with a
 * QuickPick and saves the answer globally; if the picker is dismissed, uses English without saving.
 */
export async function ensureLanguage(): Promise<UiLanguage> {
  const lang = getConfig().language;
  if (lang) return lang;
  return (await pickLanguage('')) ?? 'english';
}

/** `errorbuddy.chooseLanguage` — change the explanation language at any time. */
export function registerChooseLanguageCommand(ctx: vscode.ExtensionContext): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand('errorbuddy.chooseLanguage', async () => {
      const picked = await pickLanguage(getConfig().language);
      if (picked) {
        vscode.window.showInformationMessage(`ErrorBuddy: errors will now be explained in ${LANGUAGE_LABELS[picked]}.`);
      }
    }),
  );
}
