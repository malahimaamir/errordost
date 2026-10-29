// Pure helpers that make error text safe to send to an AI provider. No vscode imports.

const MAX_LINE = 200;
const MAX_MESSAGE = 4000;
const MASK = '***';

/** Credential-ish key names used for `name = "value"` style redaction. */
const SECRET_NAME = String.raw`[A-Za-z0-9_.-]*(?:password|passwd|pwd|secret|token|api[_-]?key|apikey|access[_-]?key|private[_-]?key|client[_-]?secret|auth[_-]?key)[A-Za-z0-9_.-]*`;

/** Ordered: specific token formats first, generic high-entropy blobs last. */
const SECRET_PATTERNS: Array<[RegExp, string | ((m: string, ...groups: string[]) => string)]> = [
  // Private key blocks.
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g, MASK],
  // Connection strings / URLs with embedded credentials: keep scheme + user, mask the password.
  [/\b([a-z][a-z0-9+.-]*:\/\/)([^:/\s@]+):([^@\s/]+)@/gi, `$1$2:${MASK}@`],
  // Bearer / Basic auth headers.
  [/\b(Bearer|Basic|Token)(\s+)[A-Za-z0-9._~+/=-]{8,}/g, `$1$2${MASK}`],
  // JWTs.
  [/\beyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}/g, MASK],
  // OpenAI / Anthropic style keys (sk-..., sk-ant-..., sk-proj-...).
  [/\bsk-[A-Za-z0-9_-]{16,}/g, MASK],
  // GitHub tokens.
  [/\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/g, MASK],
  // AWS access key ids.
  [/\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, MASK],
  // Google API keys.
  [/\bAIza[0-9A-Za-z_-]{30,}/g, MASK],
  // Slack tokens.
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}/g, MASK],
  // name = "value" / name: 'value' / name: Type = 'value' (quoted, any credential-ish name).
  [new RegExp(`\\b(${SECRET_NAME}["']?(?:\\s*:\\s*[A-Za-z_$][\\w$<>\\[\\]|.]*)?)(\\s*[:=]\\s*)(["'\`])([^"'\`\\r\\n]*)\\3`, 'gi'), (_m, name, sep, q, value) =>
    value ? `${name}${sep}${q}${MASK}${q}` : `${name}${sep}${q}${q}`],
  // NAME=value (unquoted, env-file / CLI style).
  // Code like `token = getToken()` is left alone: only literal-looking values containing a digit are masked.
  [new RegExp(`\\b(${SECRET_NAME})(\\s*=\\s*)([^\\s"'\`,;()]{4,})(?![\\w(.])`, 'gi'), (m, name, sep, value) =>
    /\d/.test(value) && !/^[A-Za-z_$][\w$]*\./.test(value) ? `${name}${sep}${MASK}` : m],
  // password: value (unquoted YAML style) — only for unambiguous names, so "Unexpected token: x" survives.
  [/\b((?:password|passwd|secret|api[_-]?key|apikey|client[_-]?secret)\s*:\s*)([^\s"'`,;=]{4,})(?![\w=]|\s*=)/gi, `$1${MASK}`],
  // Long hex strings (> 32 chars).
  [/\b[0-9a-fA-F]{33,}\b/g, MASK],
  // Long base64-ish blobs (> 32 chars) that mix upper, lower and digits (plain identifiers rarely do).
  [/(?<![A-Za-z0-9+/_-])[A-Za-z0-9+/_-]{33,}={0,2}/g, (m) => (looksRandom(m) ? MASK : m)],
];

function looksRandom(s: string): boolean {
  // File paths ("/Users/Me/Projects/App2024/src") are mostly word-like segments.
  if (s.includes('/') && s.split('/').every((seg) => seg.length < 24)) {
    return false;
  }
  return /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s);
}

/** Masks likely secrets (API keys, tokens, passwords, credentialed URLs, long random blobs) with `***`. */
export function redactSecrets(text: string): string {
  let out = text;
  for (const [pattern, replacement] of SECRET_PATTERNS) {
    out = typeof replacement === 'string' ? out.replace(pattern, replacement) : out.replace(pattern, replacement);
  }
  return out;
}

function truncateLine(line: string): string {
  return line.length > MAX_LINE ? `${line.slice(0, MAX_LINE)}…` : line;
}

/**
 * Up to `radius` lines either side of the error line, error line prefixed '>> ', others '   '.
 * Each line is truncated to 200 chars and the result is secret-redacted.
 */
export function sanitizeSnippet(lines: string[], errorLineIndex: number, radius = 4): string {
  if (!lines.length || errorLineIndex < 0 || errorLineIndex >= lines.length) {
    return '';
  }
  const r = Math.max(0, Math.floor(radius));
  const start = Math.max(0, errorLineIndex - r);
  const end = Math.min(lines.length - 1, errorLineIndex + r);
  const out: string[] = [];
  for (let i = start; i <= end; i++) {
    const prefix = i === errorLineIndex ? '>> ' : '   ';
    out.push(prefix + truncateLine(lines[i].replace(/\s+$/, '')));
  }
  return redactSecrets(out.join('\n'));
}

/**
 * Redacts secrets and caps the message at 4000 chars. Long output keeps its first line plus the
 * END (errors in terminal output are usually at the bottom).
 */
export function sanitizeMessage(msg: string): string {
  const text = redactSecrets(msg.replace(/\r\n?/g, '\n')).trim();
  if (text.length <= MAX_MESSAGE) {
    return text;
  }
  const firstLine = truncateLine(text.split('\n', 1)[0]);
  const marker = '\n… (output truncated) …\n';
  const budget = MAX_MESSAGE - firstLine.length - marker.length;
  let tail = text.slice(text.length - budget);
  // Start the tail on a whole line when that doesn't throw away too much.
  const nl = tail.indexOf('\n');
  if (nl >= 0 && nl < 200) {
    tail = tail.slice(nl + 1);
  }
  return firstLine + marker + tail;
}
