import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redactSecrets, sanitizeMessage, sanitizeSnippet } from '../../src/explain/sanitize';

// Fake key-shaped strings, split so secret scanners don't flag them as real credentials.
test('redacts provider API keys and tokens', () => {
  const cases = [
    'OPENAI key sk-' + 'proj-abcdefghijklmnopqrstuvwx1234',
    'anthropic sk-' + 'ant-api03-ABCDEFGHIJKLMNOPQRSTUV',
    'github ghp' + '_abcdefghijklmnopqrstuvwxyz0123456789',
    'aws AKIA' + 'IOSFODNN7EXAMPLE',
    'google AIza' + 'SyA1234567890abcdefghijklmnopqrstuv',
    'jwt eyJhbGciOiJIUzI1NiJ9' + '.eyJzdWIiOiIxMjM0NTY3ODkwIn0' + '.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
  ];
  for (const c of cases) {
    const out = redactSecrets(c);
    assert.match(out, /\*\*\*/, c);
    assert.doesNotMatch(out, /sk-proj-abc|sk-ant-api03|ghp_abc|AKIAIOSF|AIzaSy|eyJhbGci/, c);
  }
});

test('redacts bearer tokens, keeping the scheme', () => {
  assert.equal(redactSecrets('Authorization: Bearer abc.def-ghi_12345678'), 'Authorization: Bearer ***');
});

test('redacts password/secret/token/api_key assignments', () => {
  assert.equal(redactSecrets('password = "hunter2"'), 'password = "***"');
  assert.equal(redactSecrets("const apiKey: string = 'abcd1234'"), "const apiKey: string = '***'");
  assert.equal(redactSecrets('DB_PASSWORD=s3cr3tvalue'), 'DB_PASSWORD=***');
  assert.equal(redactSecrets('{"api_key": "zzz-123"}'), '{"api_key": "***"}');
  assert.equal(redactSecrets('secret: topsecret99'), 'secret: ***');
});

test('leaves ordinary code and error text alone', () => {
  const samples = [
    'const token = getToken();',
    "TypeError: Cannot read properties of undefined (reading 'map')",
    'SyntaxError: Unexpected token }',
    'at Object.<anonymous> (/Users/Malahima/Projects/MyApp2024/src/index.js:10:5)',
    'const veryLongVariableNameForTestingPurposesOnly = 1;',
  ];
  for (const s of samples) assert.equal(redactSecrets(s), s);
});

test('redacts credentials in connection strings', () => {
  assert.equal(
    redactSecrets('connect to postgres://admin:p4ssw0rd@db.example.com:5432/app failed'),
    'connect to postgres://admin:***@db.example.com:5432/app failed',
  );
  assert.equal(redactSecrets('mongodb+srv://user:pw@cluster0.x.net'), 'mongodb+srv://user:***@cluster0.x.net');
});

test('redacts long hex and base64 blobs', () => {
  assert.equal(redactSecrets('hash 0123456789abcdef0123456789abcdef01'), 'hash ***');
  assert.equal(redactSecrets('blob QWxhZGRpbjpvcGVuIHNlc2FtZQ1234567890XyZ=='), 'blob ***');
});

test('sanitizeSnippet returns a window around the error line', () => {
  const lines = Array.from({ length: 20 }, (_, i) => `line${i}`);
  const out = sanitizeSnippet(lines, 10).split('\n');
  assert.equal(out.length, 9);
  assert.equal(out[0], '   line6');
  assert.equal(out[4], '>> line10');
  assert.equal(out[8], '   line14');
});

test('sanitizeSnippet clamps at file edges and honours radius', () => {
  const lines = ['a', 'b', 'c', 'd'];
  assert.equal(sanitizeSnippet(lines, 0, 1), '>> a\n   b');
  assert.equal(sanitizeSnippet(lines, 3, 2), '   b\n   c\n>> d');
  assert.equal(sanitizeSnippet(lines, 9), '');
  assert.equal(sanitizeSnippet([], 0), '');
});

test('sanitizeSnippet truncates long lines and redacts secrets', () => {
  const long = 'x'.repeat(500);
  const out = sanitizeSnippet([long, 'const password = "hunter2";'], 0);
  const [first, second] = out.split('\n');
  assert.ok(first.length <= 3 + 200 + 1, `line too long: ${first.length}`);
  assert.equal(second, '   const password = "***";');
});

test('sanitizeMessage keeps short messages intact (trimmed)', () => {
  assert.equal(sanitizeMessage('  ReferenceError: x is not defined \n'), 'ReferenceError: x is not defined');
});

test('sanitizeMessage keeps the first line and the tail of long output', () => {
  const lines = ['$ npm run build'];
  for (let i = 0; i < 500; i++) lines.push(`progress line ${i} ........................`);
  lines.push('Error: Cannot find module "left-pad"');
  const out = sanitizeMessage(lines.join('\n'));
  assert.ok(out.length <= 4000, `too long: ${out.length}`);
  assert.ok(out.startsWith('$ npm run build'));
  assert.ok(out.endsWith('Error: Cannot find module "left-pad"'));
  assert.match(out, /truncated/);
});
