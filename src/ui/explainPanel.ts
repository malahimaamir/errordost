import * as vscode from 'vscode';
import * as path from 'path';
import { RTL_LANGUAGES, UI_LANGUAGES, type ErrorContext, type Explanation, type Level, type UiLanguage } from '../types';

export interface ExplainPanelData {
  err: ErrorContext;
  explanation: Explanation;
  language: UiLanguage;
  level: Level;
}

export interface ExplainPanelHandlers {
  onReexplain(language: UiLanguage, level: Level): void;
  onAskAI(): void;
}

interface Strings {
  meaning: string;
  why: string;
  fix: string;
  example: string;
  bad: string;
  good: string;
  language: string;
  level: string;
  beginner: string;
  pro: string;
  copy: string;
  askAI: string;
  source: string;
  busy: string;
  showMore: string;
}

const I18N: Record<UiLanguage, Strings> = {
  english: {
    meaning: 'Meaning', why: 'Why it happened', fix: 'How to fix', example: 'Example', bad: 'Wrong', good: 'Right',
    language: 'Language', level: 'Level', beginner: 'Beginner', pro: 'Pro', copy: 'Copy',
    askAI: 'Ask AI for more detail', source: 'Source', busy: 'Explaining…', showMore: 'Show full error',
  },
  urdu: {
    meaning: 'مطلب', why: 'یہ کیوں ہوا', fix: 'اسے کیسے ٹھیک کریں', example: 'مثال', bad: 'غلط', good: 'درست',
    language: 'زبان', level: 'سطح', beginner: 'مبتدی', pro: 'ماہر', copy: 'کاپی کریں',
    askAI: 'AI سے مزید تفصیل پوچھیں', source: 'ذریعہ', busy: 'وضاحت ہو رہی ہے…', showMore: 'پورا error دکھائیں',
  },
  'roman-urdu': {
    meaning: 'Matlab', why: 'Yeh kyun hua', fix: 'Isay kaise theek karein', example: 'Misaal', bad: 'Ghalat', good: 'Sahi',
    language: 'Zubaan', level: 'Level', beginner: 'Beginner', pro: 'Pro', copy: 'Copy karein',
    askAI: 'AI se mazeed tafseel poochein', source: 'Source', busy: 'Samjha raha hai…', showMore: 'Poora error dikhayein',
  },
  hindi: {
    meaning: 'मतलब', why: 'यह क्यों हुआ', fix: 'इसे कैसे ठीक करें', example: 'उदाहरण', bad: 'गलत', good: 'सही',
    language: 'भाषा', level: 'स्तर', beginner: 'शुरुआती', pro: 'प्रो', copy: 'कॉपी करें',
    askAI: 'AI से और विस्तार पूछें', source: 'स्रोत', busy: 'समझा रहा है…', showMore: 'पूरा error दिखाएँ',
  },
  arabic: {
    meaning: 'المعنى', why: 'لماذا حدث هذا', fix: 'كيفية الإصلاح', example: 'مثال', bad: 'خطأ', good: 'صحيح',
    language: 'اللغة', level: 'المستوى', beginner: 'مبتدئ', pro: 'محترف', copy: 'نسخ',
    askAI: 'اطلب من الذكاء الاصطناعي مزيدًا من التفاصيل', source: 'المصدر', busy: 'جارٍ الشرح…', showMore: 'عرض الخطأ كاملًا',
  },
};

const NATIVE_LABELS: Record<UiLanguage, string> = {
  english: 'English',
  urdu: 'اردو',
  'roman-urdu': 'Roman Urdu',
  hindi: 'हिन्दी',
  arabic: 'العربية',
};

const HTML_LANG: Record<UiLanguage, string> = {
  english: 'en',
  urdu: 'ur',
  'roman-urdu': 'ur-Latn',
  hindi: 'hi',
  arabic: 'ar',
};

/** Single-instance webview showing the current explanation. */
export class ExplainPanel {
  private static current: ExplainPanel | undefined;

  private busy = false;
  private readonly disposables: vscode.Disposable[] = [];

  static show(ctx: vscode.ExtensionContext, data: ExplainPanelData, handlers: ExplainPanelHandlers): void {
    const existing = ExplainPanel.current;
    if (existing) {
      existing.data = data;
      existing.handlers = handlers;
      existing.busy = false;
      existing.render();
      existing.panel.reveal(undefined, true);
      return;
    }
    const mediaRoot = vscode.Uri.joinPath(ctx.extensionUri, 'media');
    const panel = vscode.window.createWebviewPanel(
      'errordost.explain',
      'ErrorDost',
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      { enableScripts: true, retainContextWhenHidden: false, localResourceRoots: [mediaRoot] },
    );
    ExplainPanel.current = new ExplainPanel(panel, mediaRoot, data, handlers);
  }

  /** Shows/hides the "explaining…" state. No-op when the panel is not open. */
  static setBusy(busy: boolean): void {
    const current = ExplainPanel.current;
    if (!current || current.busy === busy) return;
    current.busy = busy;
    if (current.panel.visible) {
      void current.panel.webview.postMessage({ type: 'busy', busy });
    } else {
      // Hidden webviews drop messages (retainContextWhenHidden=false); re-render instead.
      current.render();
    }
  }

  private constructor(
    private readonly panel: vscode.WebviewPanel,
    private readonly mediaRoot: vscode.Uri,
    private data: ExplainPanelData,
    private handlers: ExplainPanelHandlers,
  ) {
    panel.onDidDispose(() => this.dispose(), null, this.disposables);
    panel.webview.onDidReceiveMessage((msg: unknown) => void this.handleMessage(msg), null, this.disposables);
    this.render();
  }

  private dispose(): void {
    ExplainPanel.current = undefined;
    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }

  private async handleMessage(msg: unknown): Promise<void> {
    if (!msg || typeof msg !== 'object') return;
    const m = msg as { type?: unknown; language?: unknown; level?: unknown };
    switch (m.type) {
      case 'copy':
        await vscode.env.clipboard.writeText(toPlainText(this.data));
        vscode.window.setStatusBarMessage('$(check) ErrorDost: Copied', 2500);
        break;
      case 'reexplain': {
        const language = UI_LANGUAGES.includes(m.language as UiLanguage) ? (m.language as UiLanguage) : this.data.language;
        const level: Level = m.level === 'pro' || m.level === 'beginner' ? m.level : this.data.level;
        if (language !== this.data.language || level !== this.data.level) {
          this.busy = true;
          this.handlers.onReexplain(language, level);
        }
        break;
      }
      case 'askAI':
        this.busy = true;
        this.handlers.onAskAI();
        break;
      case 'openFile':
        await this.openFile();
        break;
    }
  }

  private async openFile(): Promise<void> {
    const { filePath, line } = this.data.err;
    if (!filePath) return;
    const candidates: vscode.Uri[] = path.isAbsolute(filePath)
      ? [vscode.Uri.file(filePath)]
      : (vscode.workspace.workspaceFolders ?? []).map((f) => vscode.Uri.joinPath(f.uri, filePath));
    for (const uri of candidates) {
      try {
        await vscode.workspace.fs.stat(uri);
      } catch {
        continue;
      }
      const pos = new vscode.Position(Math.max(0, (line ?? 1) - 1), 0);
      await vscode.window.showTextDocument(uri, {
        viewColumn: vscode.ViewColumn.One,
        selection: new vscode.Range(pos, pos),
      });
      return;
    }
  }

  private render(): void {
    this.panel.title = `ErrorDost — ${I18N[this.data.language].meaning}`;
    this.panel.webview.html = this.getHtml();
  }

  private getHtml(): string {
    const webview = this.panel.webview;
    const nonce = makeNonce();
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(this.mediaRoot, 'explain.css'));
    const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(this.mediaRoot, 'explain.js'));
    const { err, explanation: ex, language, level } = this.data;
    const t = I18N[language];
    const rtl = RTL_LANGUAGES.includes(language);

    const longMessage = err.message.length > 300 || err.message.split('\n').length > 6;
    const location = err.filePath ? `${err.filePath}${err.line !== undefined ? `:${err.line}` : ''}` : '';
    const chips: string[] = [];
    if (location) {
      chips.push(`<button class="chip link" id="open-file" title="Open ${escapeHtml(location)}">📄 ${escapeHtml(location)}</button>`);
    }
    if (err.source) chips.push(`<span class="chip">${escapeHtml(truncate(err.source, 60))}</span>`);
    if (err.code) chips.push(`<span class="chip">${escapeHtml(err.code)}</span>`);

    const sections: string[] = [];
    if (ex.meaning) sections.push(section('📖', t.meaning, `<p>${inline(ex.meaning)}</p>`));
    if (ex.cause) sections.push(section('🔍', t.why, paragraphs(ex.cause)));
    if (ex.fix.length) {
      sections.push(section('🛠', t.fix, `<ol>${ex.fix.map((s) => `<li>${inline(s)}</li>`).join('')}</ol>`));
    }
    if (ex.codeExample?.good) {
      const bad = ex.codeExample.bad
        ? `<div class="code bad"><div class="code-label">❌ ${escapeHtml(t.bad)}</div><pre dir="ltr"><code>${escapeHtml(ex.codeExample.bad)}</code></pre></div>`
        : '';
      const good = `<div class="code good"><div class="code-label">✅ ${escapeHtml(t.good)}</div><pre dir="ltr"><code>${escapeHtml(ex.codeExample.good)}</code></pre></div>`;
      sections.push(section('💻', t.example, bad + good));
    }

    const langOptions = UI_LANGUAGES.map(
      (l) => `<option value="${l}"${l === language ? ' selected' : ''}>${escapeHtml(NATIVE_LABELS[l])}</option>`,
    ).join('');
    const levelButton = (l: Level, label: string): string =>
      `<button class="seg${l === level ? ' active' : ''}" data-level="${l}" aria-pressed="${l === level}">${escapeHtml(label)}</button>`;

    return `<!DOCTYPE html>
<html lang="${HTML_LANG[language]}">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; font-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="${cssUri}">
<title>ErrorDost</title>
</head>
<body data-language="${language}" data-level="${level}" data-busy="${this.busy}" data-busy-text="${escapeHtml(t.busy)}">
<header class="header">
  <div class="error-box${longMessage ? ' collapsed' : ''}" id="error-box">
    <pre class="error-message" dir="ltr">${escapeHtml(err.message)}</pre>
  </div>
  ${longMessage ? `<button class="link-button" id="toggle-error">${escapeHtml(t.showMore)}</button>` : ''}
  ${chips.length ? `<div class="chips" dir="ltr">${chips.join('')}</div>` : ''}
</header>
<div id="status" class="status" aria-live="polite"></div>
<main class="content lang-${language}" lang="${HTML_LANG[language]}" dir="${rtl ? 'rtl' : 'ltr'}">
${sections.join('\n') || '<p class="empty">—</p>'}
</main>
<footer class="footer">
  <div class="source">${escapeHtml(t.source)}: <strong>${escapeHtml(ex.providerLabel)}</strong></div>
  <div class="controls">
    <label class="field"><span>${escapeHtml(t.language)}</span>
      <select id="language">${langOptions}</select>
    </label>
    <div class="field"><span>${escapeHtml(t.level)}</span>
      <div class="segmented" role="group">${levelButton('beginner', t.beginner)}${levelButton('pro', t.pro)}</div>
    </div>
    <div class="buttons">
      <button id="copy" class="secondary">📋 ${escapeHtml(t.copy)}</button>
      ${ex.source === 'kb' ? `<button id="ask-ai" class="primary">✨ ${escapeHtml(t.askAI)}</button>` : ''}
    </div>
  </div>
</footer>
<script nonce="${nonce}" src="${jsUri}"></script>
</body>
</html>`;
  }
}

function section(icon: string, title: string, body: string): string {
  return `<section class="section"><h2><span class="icon" aria-hidden="true">${icon}</span> ${escapeHtml(title)}</h2>${body}</section>`;
}

function paragraphs(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${inline(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** Escape first, then allow only `code` and **bold**. Inline code is forced LTR inside RTL text. */
function inline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code dir="ltr">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

/** Plain-text version of all sections for the clipboard. */
export function toPlainText(data: ExplainPanelData): string {
  const { err, explanation: ex, language } = data;
  const t = I18N[language];
  const out: string[] = [`Error: ${err.message}`];
  if (err.filePath) out.push(`File: ${err.filePath}${err.line !== undefined ? `:${err.line}` : ''}`);
  if (ex.meaning) out.push('', `📖 ${t.meaning}`, ex.meaning);
  if (ex.cause) out.push('', `🔍 ${t.why}`, ex.cause);
  if (ex.fix.length) out.push('', `🛠 ${t.fix}`, ...ex.fix.map((s, i) => `${i + 1}. ${s}`));
  if (ex.codeExample?.good) {
    out.push('', `💻 ${t.example}`);
    if (ex.codeExample.bad) out.push(`❌ ${t.bad}:`, ex.codeExample.bad, '');
    out.push(`✅ ${t.good}:`, ex.codeExample.good);
  }
  out.push('', `— ErrorDost (${ex.providerLabel})`);
  return out.join('\n');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function makeNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 32; i++) {
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return s;
}
