import * as vscode from 'vscode';
import { createHash } from 'crypto';
import type { ErrorContext, Explanation, ExplanationText, Level, UiLanguage } from '../types';
import { getConfig } from '../config';
import { ensureLanguage } from '../util/language';
import { pickProvider } from '../ai/providers';
import { matchKnowledgeBase } from '../kb';
import { ExplainPanel } from '../ui/explainPanel';
import { redactSecrets, sanitizeMessage } from './sanitize';
import { buildExplainPrompt, parseExplanation } from './explainPrompt';

const CACHE_KEY = 'errordost.cache';
const CACHE_MAX = 200;
const KB_LABEL = 'Offline knowledge base';

export interface ExplainOptions {
  language?: UiLanguage;
  level?: Level;
  forceAI?: boolean;
}

/** Cache entries in LRU order (oldest first). */
type CacheStore = Array<[string, Explanation]>;

/** Orchestrates KB lookup → cache → AI provider → panel. */
export class ExplainService implements vscode.Disposable {
  private inFlight: AbortController | undefined;
  private runSeq = 0;
  private disposed = false;

  constructor(private readonly ctx: vscode.ExtensionContext) {}

  async explain(err: ErrorContext, opts: ExplainOptions = {}): Promise<void> {
    // A new request supersedes any in-flight one.
    const runId = ++this.runSeq;
    this.inFlight?.abort();
    this.inFlight = undefined;

    const config = getConfig();
    const language = opts.language ?? (await ensureLanguage());
    const level = opts.level ?? config.level;
    if (runId !== this.runSeq || this.disposed) return;

    const clean: ErrorContext = {
      ...err,
      message: sanitizeMessage(err.message ?? ''),
      // `source` is the full command line for terminal errors (may carry tokens/passwords) and is sent to AI.
      source: err.source ? redactSecrets(err.source) : undefined,
      snippet: err.snippet ? redactSecrets(err.snippet) : undefined,
    };
    if (!clean.message) {
      void vscode.window.showInformationMessage('ErrorDost: there is no error text to explain.');
      return;
    }

    const kb = matchKnowledgeBase(clean);
    const kbExplanation = (): Explanation | undefined =>
      kb ? { ...kb.text(language), codeExample: kb.entry.example, source: 'kb', providerLabel: KB_LABEL, kbId: kb.entry.id } : undefined;

    if (!opts.forceAI && config.knowledgeBaseFirst && kb) {
      this.show(clean, kbExplanation()!, language, level);
      return;
    }

    const key = cacheKey(clean, language, level);
    const cached = this.cacheGet(key);
    if (cached) {
      this.show(clean, cached, language, level);
      return;
    }

    ExplainPanel.setBusy(true);
    const provider = await pickProvider(this.ctx.secrets);
    if (runId !== this.runSeq || this.disposed) return;
    if (!provider) {
      ExplainPanel.setBusy(false);
      const fallback = kbExplanation();
      this.show(clean, fallback ?? basicHelp(language), language, level);
      void this.offerAiSetup(fallback ? 'No AI provider is available — showing the offline explanation.' : 'No AI available — showing basic help.');
      return;
    }

    const controller = new AbortController();
    this.inFlight = controller;
    try {
      const raw = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `ErrorDost is explaining… (${provider.label})`,
          cancellable: true,
        },
        async (_progress, token) => {
          const sub = token.onCancellationRequested(() => controller.abort());
          try {
            const { system, user } = buildExplainPrompt(clean, language, level);
            return await provider.generate(system, user, controller.signal);
          } finally {
            sub.dispose();
          }
        },
      );
      if (controller.signal.aborted || runId !== this.runSeq || this.disposed) {
        if (runId === this.runSeq) ExplainPanel.setBusy(false);
        return;
      }
      const parsed = parseExplanation(raw);
      if (!parsed.meaning && !parsed.cause && !parsed.fix.length) {
        throw new Error('the AI returned an empty answer');
      }
      const explanation: Explanation = { ...parsed, source: 'ai', providerLabel: provider.label };
      await this.cachePut(key, explanation);
      if (runId !== this.runSeq || this.disposed) return;
      this.show(clean, explanation, language, level);
    } catch (e) {
      if (runId !== this.runSeq || this.disposed) return;
      ExplainPanel.setBusy(false);
      if (controller.signal.aborted) return; // cancelled by the user
      const reason = e instanceof Error ? e.message : String(e);
      const fallback = kbExplanation();
      if (fallback) {
        this.show(clean, fallback, language, level);
        void vscode.window.showWarningMessage(`ErrorDost: ${provider.label} failed (${reason}). Showing the offline explanation.`);
      } else {
        void vscode.window.showErrorMessage(`ErrorDost: could not explain this error with ${provider.label} (${reason}).`);
      }
    } finally {
      if (this.inFlight === controller) this.inFlight = undefined;
    }
  }

  async clearCache(): Promise<void> {
    await this.ctx.globalState.update(CACHE_KEY, undefined);
  }

  dispose(): void {
    this.disposed = true;
    this.inFlight?.abort();
    this.inFlight = undefined;
  }

  private show(err: ErrorContext, explanation: Explanation, language: UiLanguage, level: Level): void {
    ExplainPanel.show(this.ctx, { err, explanation, language, level }, {
      // Keep AI explanations AI when switching language/level; KB entries re-render offline.
      onReexplain: (lang, lvl) => void this.explain(err, { language: lang, level: lvl, forceAI: explanation.source === 'ai' }),
      onAskAI: () => void this.explain(err, { language, level, forceAI: true }),
    });
  }

  private async offerAiSetup(message: string): Promise<void> {
    const setKey = 'Set API Key';
    const choose = 'Choose AI provider';
    const pick = await vscode.window.showInformationMessage(`ErrorDost: ${message}`, setKey, choose);
    if (pick === setKey) {
      await vscode.commands.executeCommand('errordost.setApiKey');
    } else if (pick === choose) {
      await vscode.commands.executeCommand('workbench.action.openSettings', 'errordost.aiProvider');
    }
  }

  // --- LRU cache in globalState ---------------------------------------------------------------

  private readStore(): CacheStore {
    const store = this.ctx.globalState.get<unknown>(CACHE_KEY);
    return Array.isArray(store) ? (store as CacheStore) : [];
  }

  private cacheGet(key: string): Explanation | undefined {
    const store = this.readStore();
    const idx = store.findIndex(([k]) => k === key);
    if (idx < 0) return undefined;
    const [entry] = store.splice(idx, 1);
    store.push(entry); // mark as most recently used
    void this.ctx.globalState.update(CACHE_KEY, store);
    return entry[1];
  }

  private async cachePut(key: string, value: Explanation): Promise<void> {
    const store = this.readStore().filter(([k]) => k !== key);
    store.push([key, value]);
    while (store.length > CACHE_MAX) store.shift();
    await this.ctx.globalState.update(CACHE_KEY, store);
  }
}

/** Normalizes away volatile bits (paths, line:col, numbers in positions) so equivalent errors share a key. */
function normalizeMessage(message: string): string {
  return message
    .toLowerCase()
    // Only absolute-looking paths: module specifiers like 'react-dom/client' or './utils' must keep their key.
    .replace(/(^|[\s'"(])(?:[a-z]:)?(?:[\\/][\w.@~-]+){2,}[\\/]?/g, '$1<path>')
    .replace(/:\d+(?::\d+)?/g, '')
    .replace(/\bline \d+/g, 'line n')
    .replace(/\s+/g, ' ')
    .trim();
}

function cacheKey(err: ErrorContext, language: UiLanguage, level: Level): string {
  return createHash('sha256')
    .update([normalizeMessage(err.message), err.snippet ?? '', language, level].join('\u0000'))
    .digest('hex');
}

const BASIC_HELP: Record<UiLanguage, ExplanationText> = {
  english: {
    meaning: 'ErrorDost has no offline explanation for this error, and no AI provider is set up yet.',
    cause: 'Most errors come from a typo, a missing import or package, a wrong type/value, or code running in the wrong order.',
    fix: [
      'Read the first line of the error carefully — it usually names the problem.',
      'Open the file and line number mentioned in the error and check that exact spot.',
      'Check spelling of names, brackets `()`, `{}` and quotes.',
      'Search the exact error message online (remove your own file names).',
      'Set up an AI provider (Copilot, Claude, OpenAI, Gemini or Ollama) for a full explanation.',
    ],
  },
  urdu: {
    meaning: 'اس error کی آف لائن وضاحت موجود نہیں، اور ابھی کوئی AI provider سیٹ نہیں ہے۔',
    cause: 'زیادہ تر errors کسی ٹائپو، missing import یا package، غلط type یا value، یا کوڈ کے غلط ترتیب میں چلنے کی وجہ سے آتے ہیں۔',
    fix: [
      'Error کی پہلی لائن غور سے پڑھیں — عام طور پر وہی مسئلہ بتاتی ہے۔',
      'Error میں بتائی گئی فائل اور لائن نمبر کھول کر وہی جگہ چیک کریں۔',
      'ناموں کی spelling، brackets `()` ، `{}` اور quotes چیک کریں۔',
      'Error کا اصل پیغام انٹرنیٹ پر سرچ کریں (اپنی فائلوں کے نام نکال کر)۔',
      'مکمل وضاحت کے لیے کوئی AI provider سیٹ کریں (Copilot، Claude، OpenAI، Gemini یا Ollama)۔',
    ],
  },
  'roman-urdu': {
    meaning: 'Is error ki offline wazahat mojood nahi, aur abhi koi AI provider set nahi hai.',
    cause: 'Zyada tar errors kisi typo, missing import ya package, ghalat type ya value, ya code ke ghalat tarteeb mein chalne ki wajah se aate hain.',
    fix: [
      'Error ki pehli line ghaur se parhein — aksar wohi masla batati hai.',
      'Error mein di gayi file aur line number khol kar wohi jagah check karein.',
      'Names ki spelling, brackets `()`, `{}` aur quotes check karein.',
      'Error ka asal message online search karein (apni files ke naam hata kar).',
      'Poori wazahat ke liye koi AI provider set karein (Copilot, Claude, OpenAI, Gemini ya Ollama).',
    ],
  },
  hindi: {
    meaning: 'इस error की ऑफ़लाइन व्याख्या उपलब्ध नहीं है, और अभी कोई AI provider सेट नहीं है।',
    cause: 'ज़्यादातर errors किसी टाइपो, missing import या package, गलत type या value, या कोड के गलत क्रम में चलने से आते हैं।',
    fix: [
      'Error की पहली लाइन ध्यान से पढ़ें — अक्सर वही समस्या बताती है।',
      'Error में बताई गई फ़ाइल और लाइन नंबर खोलकर वही जगह जाँचें।',
      'नामों की spelling, brackets `()`, `{}` और quotes जाँचें।',
      'Error का असली संदेश ऑनलाइन खोजें (अपनी फ़ाइलों के नाम हटाकर)।',
      'पूरी व्याख्या के लिए कोई AI provider सेट करें (Copilot, Claude, OpenAI, Gemini या Ollama)।',
    ],
  },
  arabic: {
    meaning: 'لا يوجد شرح دون اتصال لهذا الخطأ، ولم يتم إعداد أي مزوّد AI بعد.',
    cause: 'معظم الأخطاء سببها خطأ إملائي، أو import أو package مفقود، أو type أو قيمة خاطئة، أو تنفيذ الكود بترتيب خاطئ.',
    fix: [
      'اقرأ السطر الأول من الخطأ بعناية — غالبًا ما يذكر المشكلة.',
      'افتح الملف ورقم السطر المذكورين في الخطأ وافحص ذلك الموضع.',
      'تحقق من تهجئة الأسماء والأقواس `()` و `{}` وعلامات الاقتباس.',
      'ابحث عن نص الخطأ على الإنترنت (بعد حذف أسماء ملفاتك).',
      'أعِدّ مزوّد AI (Copilot أو Claude أو OpenAI أو Gemini أو Ollama) للحصول على شرح كامل.',
    ],
  },
};

function basicHelp(language: UiLanguage): Explanation {
  return { ...BASIC_HELP[language], source: 'kb', providerLabel: 'Basic tips (no AI available)' };
}
