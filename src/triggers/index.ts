import * as vscode from 'vscode';
import type { ErrorContext } from '../types';
import { getConfig } from '../config';
import type { ExplainService } from '../explain/explainService';
import { sanitizeSnippet } from '../explain/sanitize';

const EXPLAIN_DIAGNOSTIC = 'errordost.explainDiagnostic';
const SELECTORS: vscode.DocumentSelector = [{ scheme: 'file' }, { scheme: 'untitled' }];
const MAX_ACTIONS = 3;
const TERMINAL_OUTPUT_CAP = 20_000;
const TERMINAL_PROMPT_INTERVAL_MS = 10_000;
const MAX_ERROR_LINES = 40;

/** Plain JSON-able shape so hover command links can carry diagnostics. */
interface PlainPosition { line: number; character: number }
interface DiagnosticArg {
  message: string;
  source?: string;
  code?: string | number | { value: string | number; target?: unknown };
  range: { start: PlainPosition; end: PlainPosition } | vscode.Range;
}

export function registerTriggers(ctx: vscode.ExtensionContext, service: ExplainService): void {
  ctx.subscriptions.push(
    vscode.commands.registerCommand(EXPLAIN_DIAGNOSTIC, (uri: vscode.Uri | string, diag: DiagnosticArg) =>
      explainDiagnostic(service, uri, diag),
    ),
    vscode.commands.registerCommand('errordost.explainSelection', () => explainSelection(service)),
    vscode.commands.registerCommand('errordost.explainText', () => explainText(service)),
    vscode.commands.registerCommand('errordost.explainTerminalSelection', () => explainTerminalSelection(service)),
    vscode.languages.registerCodeActionsProvider(SELECTORS, new ExplainCodeActionProvider(), {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
    }),
    vscode.languages.registerHoverProvider(SELECTORS, new ExplainHoverProvider()),
  );
  registerTerminalWatcher(ctx, service);
}

// ---- Diagnostics -------------------------------------------------------------------------------

function codeToString(code: DiagnosticArg['code']): string | undefined {
  if (code === undefined || code === null) return undefined;
  if (typeof code === 'object') return String(code.value);
  return String(code);
}

function toPlainDiagnostic(d: vscode.Diagnostic): DiagnosticArg {
  const code = typeof d.code === 'object' && d.code ? d.code.value : d.code;
  return {
    message: d.message,
    source: d.source,
    code,
    range: {
      start: { line: d.range.start.line, character: d.range.start.character },
      end: { line: d.range.end.line, character: d.range.end.character },
    },
  };
}

async function explainDiagnostic(service: ExplainService, uriArg: vscode.Uri | string, diag: DiagnosticArg): Promise<void> {
  if (!uriArg || !diag || typeof diag.message !== 'string') return;
  const uri = typeof uriArg === 'string' ? vscode.Uri.parse(uriArg) : uriArg;
  const errorLine = Math.max(0, diag.range?.start?.line ?? 0);

  const err: ErrorContext = {
    message: diag.message,
    origin: 'diagnostic',
    source: diag.source,
    code: codeToString(diag.code),
    filePath: uri.scheme === 'file' ? vscode.workspace.asRelativePath(uri, false) : uri.scheme === 'untitled' ? 'Untitled' : uri.path,
    line: errorLine + 1,
  };
  try {
    const doc = await vscode.workspace.openTextDocument(uri);
    err.languageId = doc.languageId;
    if (errorLine < doc.lineCount) {
      // Only read the lines that will actually be sent.
      const radius = 4;
      const start = Math.max(0, errorLine - radius);
      const end = Math.min(doc.lineCount - 1, errorLine + radius);
      const lines: string[] = [];
      for (let i = start; i <= end; i++) lines.push(doc.lineAt(i).text);
      err.snippet = sanitizeSnippet(lines, errorLine - start, radius) || undefined;
    }
  } catch {
    // Document unavailable (deleted / remote) — explain the message alone.
  }
  await service.explain(err);
}

function isExplainable(d: vscode.Diagnostic): boolean {
  return d.severity === vscode.DiagnosticSeverity.Error || d.severity === vscode.DiagnosticSeverity.Warning;
}

class ExplainCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    doc: vscode.TextDocument,
    _range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
  ): vscode.CodeAction[] {
    if (!getConfig().codeActionsEnabled) return [];
    const actions: vscode.CodeAction[] = [];
    for (const d of context.diagnostics) {
      if (!isExplainable(d)) continue;
      const action = new vscode.CodeAction('💡 Explain this error (ErrorDost)', vscode.CodeActionKind.QuickFix);
      action.isPreferred = false;
      action.diagnostics = [d];
      action.command = {
        command: EXPLAIN_DIAGNOSTIC,
        title: 'Explain this error',
        arguments: [doc.uri, toPlainDiagnostic(d)],
      };
      actions.push(action);
      if (actions.length >= MAX_ACTIONS) break;
    }
    return actions;
  }
}

class ExplainHoverProvider implements vscode.HoverProvider {
  provideHover(doc: vscode.TextDocument, pos: vscode.Position): vscode.Hover | undefined {
    if (!getConfig().hoverEnabled) return undefined;
    const diags = vscode.languages
      .getDiagnostics(doc.uri)
      .filter((d) => d.severity === vscode.DiagnosticSeverity.Error && d.range.contains(pos))
      .slice(0, MAX_ACTIONS);
    if (!diags.length) return undefined;

    const md = new vscode.MarkdownString(undefined, true);
    md.isTrusted = { enabledCommands: [EXPLAIN_DIAGNOSTIC] };
    diags.forEach((d, i) => {
      const args = encodeURIComponent(JSON.stringify([doc.uri.toString(), toPlainDiagnostic(d)]));
      const label = diags.length > 1 ? `💡 Explain with ErrorDost (${i + 1})` : '💡 Explain with ErrorDost';
      md.appendMarkdown(`${i ? '  \n' : ''}[${label}](command:${EXPLAIN_DIAGNOSTIC}?${args} "Explain this error in your language")`);
    });
    return new vscode.Hover(md, diags[0].range);
  }
}

// ---- Selection / pasted text ---------------------------------------------------------------------

async function explainSelection(service: ExplainService): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  const text = editor ? editor.document.getText(editor.selection).trim() : '';
  if (!editor || !text) {
    await explainText(service);
    return;
  }
  const doc = editor.document;
  await service.explain({
    message: text,
    origin: 'selection',
    languageId: doc.languageId,
    filePath: doc.uri.scheme === 'file' ? vscode.workspace.asRelativePath(doc.uri, false) : undefined,
    line: editor.selection.start.line + 1,
  });
}

const ERROR_HINT = /error|exception|traceback|failed|cannot|can't|undefined|not found|ERR!|warning|fatal|panic|invalid|unexpected|denied|refused|expected/i;

async function explainText(service: ExplainService): Promise<void> {
  let clipboard = '';
  try {
    clipboard = (await vscode.env.clipboard.readText()).trim();
  } catch {
    // Clipboard unavailable — no prefill.
  }
  // InputBox is single-line: prefill a flattened preview; if accepted unchanged, use the full clipboard text.
  const prefill = clipboard && ERROR_HINT.test(clipboard) ? clipboard.replace(/\s*\n\s*/g, ' ').slice(0, 500) : '';
  const value = await vscode.window.showInputBox({
    title: 'ErrorDost: Explain an error',
    placeHolder: 'Paste an error message…',
    prompt: 'Paste the error text (from a terminal, browser console, compiler…). Tip: select error text in an editor and use "Explain Selected Error" for long traces.',
    value: prefill,
    ignoreFocusOut: true,
  });
  if (value === undefined || !value.trim()) return;
  const message = prefill && value === prefill ? clipboard : value.trim();
  await service.explain({ message, origin: 'paste' });
}

// ---- Terminal ------------------------------------------------------------------------------------

/** Terminal context menu: the extension API can't read the terminal selection, so copy it first. */
async function explainTerminalSelection(service: ExplainService): Promise<void> {
  let text = '';
  try {
    await vscode.commands.executeCommand('workbench.action.terminal.copySelection');
    text = stripAnsi(await vscode.env.clipboard.readText()).trim();
  } catch {
    // Fall back to the paste box.
  }
  if (!text) {
    await explainText(service);
    return;
  }
  await service.explain({ message: text, origin: 'terminal' });
}

/** Strips ANSI/VT escape sequences (CSI, OSC incl. shell-integration 633, single-char escapes). */
export function stripAnsi(s: string): string {
  return s
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b\[[0-9;?<>=]*[ -/]*[@-~]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/\x1b[@-Z\\-_]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '');
}

/** Picks the most relevant error block (≤ 40 lines) from command output. */
export function extractErrorBlock(output: string): string {
  const lines = output
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''));
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  const nonEmpty = (ls: string[]): string[] => ls.filter((l) => l.trim());
  const cap = (ls: string[]): string => {
    const kept = ls.length > MAX_ERROR_LINES ? [ls[0], ...ls.slice(ls.length - (MAX_ERROR_LINES - 1))] : ls;
    return kept.join('\n').trim();
  };

  // Python: last traceback to the end.
  const tb = findLastIndex(lines, (l) => /Traceback \(most recent call last\)/.test(l));
  if (tb >= 0) return cap(lines.slice(tb));

  // npm / yarn / pnpm.
  const npm = lines.filter((l) => /^(?:npm (?:ERR!|error)|yarn error|ERR_PNPM|\s*ERR_PNPM)/.test(l));
  if (npm.length) return cap(npm);

  // Compilers (gcc/clang/tsc/rustc/javac/go): "error:" lines plus a little context after each.
  const compilerIdx = lines
    .map((l, i) => (/\berror(?:\[\w+\])?:|\berror TS\d+|\berror CS\d+|: error\b/i.test(l) ? i : -1))
    .filter((i) => i >= 0);
  if (compilerIdx.length) {
    const keep = new Set<number>();
    for (const i of compilerIdx) for (let j = i; j <= Math.min(lines.length - 1, i + 3); j++) keep.add(j);
    return cap(nonEmpty([...keep].sort((a, b) => a - b).map((i) => lines[i])).slice(0, MAX_ERROR_LINES));
  }

  // Node / JS / Java: around the first "...Error"/"Exception".
  const errIdx = lines.findIndex((l) => /\b\w*(?:Error|Exception)\b|\berror\b/.test(l));
  if (errIdx >= 0) {
    return cap(nonEmpty(lines.slice(Math.max(0, errIdx - 3), errIdx + 20)));
  }

  return cap(nonEmpty(lines).slice(-MAX_ERROR_LINES));
}

function findLastIndex<T>(arr: T[], pred: (v: T) => boolean): number {
  for (let i = arr.length - 1; i >= 0; i--) if (pred(arr[i])) return i;
  return -1;
}

interface Capture {
  chunks: string[];
  size: number;
  done: Promise<void>;
}

function registerTerminalWatcher(ctx: vscode.ExtensionContext, service: ExplainService): void {
  // Shell-integration events exist from VS Code 1.93; guard anyway for forks with older APIs.
  if (typeof vscode.window.onDidStartTerminalShellExecution !== 'function') return;

  const captures = new WeakMap<vscode.TerminalShellExecution, Capture>();
  let lastPrompt = 0;

  ctx.subscriptions.push(
    vscode.window.onDidStartTerminalShellExecution((e) => {
      if (!getConfig().terminalEnabled) return;
      const capture: Capture = { chunks: [], size: 0, done: Promise.resolve() };
      // read() must start right away or early output is missed.
      const stream = e.execution.read();
      capture.done = (async () => {
        try {
          for await (const data of stream) {
            capture.chunks.push(data);
            capture.size += data.length;
            // Keep only the most recent output (errors are at the bottom).
            while (capture.size > TERMINAL_OUTPUT_CAP && capture.chunks.length > 1) {
              capture.size -= capture.chunks.shift()!.length;
            }
          }
        } catch {
          // Stream ended abnormally; use what we have.
        }
      })();
      captures.set(e.execution, capture);
    }),

    vscode.window.onDidEndTerminalShellExecution((e) => {
      onEnd(e).catch(() => undefined); // never leave a rejected promise in the event loop
    }),
  );

  async function onEnd(e: vscode.TerminalShellExecutionEndEvent): Promise<void> {
    const capture = captures.get(e.execution);
    captures.delete(e.execution);
    if (!capture || !getConfig().terminalEnabled) return;
    // 130 = Ctrl+C (SIGINT), 143 = SIGTERM: user-initiated, not an error worth explaining.
    if (e.exitCode === undefined || e.exitCode === 0 || e.exitCode === 130 || e.exitCode === 143) return;

    // The stream normally finishes with the execution; don't wait forever if it doesn't.
    await Promise.race([capture.done, new Promise((r) => setTimeout(r, 1000))]);
    let output = stripAnsi(capture.chunks.join(''));
    if (output.length > TERMINAL_OUTPUT_CAP) output = output.slice(-TERMINAL_OUTPUT_CAP);
    if (!output.trim()) return;
    const block = extractErrorBlock(output);
    if (!block) return;

    const now = Date.now();
    if (now - lastPrompt < TERMINAL_PROMPT_INTERVAL_MS) return;
    lastPrompt = now;

    const commandLine = e.execution.commandLine.value.trim();
    const shown = commandLine.length > 60 ? `${commandLine.slice(0, 59)}…` : commandLine || 'last command';
    const explain = 'Explain';
    const never = "Don't ask again";
    const pick = await vscode.window.showInformationMessage(
      `ErrorDost: The command \`${shown}\` failed. Explain the error?`,
      explain,
      never,
    );
    if (pick === explain) {
      await service.explain({ message: block, origin: 'terminal', source: commandLine || undefined });
    } else if (pick === never) {
      await vscode.workspace
        .getConfiguration('errordost')
        .update('terminal.enabled', false, vscode.ConfigurationTarget.Global);
      void vscode.window.showInformationMessage(
        'ErrorDost will no longer watch the terminal. Re-enable it with the "errordost.terminal.enabled" setting.',
      );
    }
  }
}
