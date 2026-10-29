import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildExplainPrompt, parseExplanation } from '../../src/explain/explainPrompt';
import type { ErrorContext } from '../../src/types';

const err: ErrorContext = {
  message: "TypeError: Cannot read properties of undefined (reading 'map')",
  origin: 'diagnostic',
  source: 'ts',
  code: 'TS2532',
  languageId: 'typescript',
  filePath: 'src/app.ts',
  line: 12,
  snippet: '   const items = data.items;\n>> items.map(x => x);',
};

test('prompt contains a script-specific instruction per language', () => {
  assert.match(buildExplainPrompt(err, 'english', 'beginner').system, /English/);
  assert.match(buildExplainPrompt(err, 'urdu', 'beginner').system, /Urdu script/);
  assert.match(buildExplainPrompt(err, 'urdu', 'beginner').system, /Nastaliq/);
  assert.match(buildExplainPrompt(err, 'roman-urdu', 'beginner').system, /Roman Urdu/);
  assert.match(buildExplainPrompt(err, 'roman-urdu', 'beginner').system, /Latin/);
  assert.match(buildExplainPrompt(err, 'hindi', 'beginner').system, /Devanagari/);
  assert.match(buildExplainPrompt(err, 'arabic', 'beginner').system, /Arabic script/);
});

test('prompt keeps technical terms in English and asks for JSON only', () => {
  const { system } = buildExplainPrompt(err, 'hindi', 'pro');
  assert.match(system, /error names/i);
  assert.match(system, /ONLY with a single JSON object/);
  assert.match(system, /"meaning"/);
  assert.match(system, /Never invent APIs/);
});

test('prompt varies with level', () => {
  const beginner = buildExplainPrompt(err, 'english', 'beginner').system;
  const pro = buildExplainPrompt(err, 'english', 'pro').system;
  assert.match(beginner, /BEGINNER/);
  assert.match(beginner, /analogy/);
  assert.match(pro, /EXPERIENCED/);
  assert.match(pro, /concise/);
  assert.notEqual(beginner, pro);
});

test('user prompt includes message, context and snippet', () => {
  const { user } = buildExplainPrompt(err, 'english', 'beginner');
  assert.ok(user.includes(err.message));
  assert.ok(user.includes('src/app.ts:12'));
  assert.ok(user.includes('TS2532'));
  assert.ok(user.includes('>> items.map'));
});

test('parses a plain JSON answer', () => {
  const r = parseExplanation(
    JSON.stringify({ meaning: 'm', cause: 'c', fix: ['a', 'b'], codeExample: { bad: 'x()', good: 'y()' } }),
  );
  assert.deepEqual(r, { meaning: 'm', cause: 'c', fix: ['a', 'b'], codeExample: { bad: 'x()', good: 'y()' } });
});

test('parses fenced JSON surrounded by chatter', () => {
  const raw = 'Sure! Here you go:\n```json\n{"meaning": "مطلب", "cause": "وجہ {curly}", "fix": ["1. Do `x`"]}\n```\nHope it helps.';
  const r = parseExplanation(raw);
  assert.equal(r.meaning, 'مطلب');
  assert.equal(r.cause, 'وجہ {curly}');
  assert.deepEqual(r.fix, ['Do `x`']);
  assert.equal(r.codeExample, undefined);
});

test('tolerates trailing commas, string fix and missing good code', () => {
  const r = parseExplanation('{"meaning": "m", "cause": "c", "fix": "- one\\n- two", "codeExample": {"bad": "b"},}');
  assert.equal(r.meaning, 'm');
  assert.deepEqual(r.fix, ['one', 'two']);
  assert.equal(r.codeExample, undefined);
});

test('falls back to heuristics for non-JSON text', () => {
  const raw = 'This error means x is undefined.\n\nIt happened because y.\n\n- Check x\n- Initialise y\n\n```js\nlet x = 1;\n```';
  const r = parseExplanation(raw);
  assert.equal(r.meaning, 'This error means x is undefined.');
  assert.equal(r.cause, 'It happened because y.');
  assert.deepEqual(r.fix, ['Check x', 'Initialise y']);
  assert.deepEqual(r.codeExample, { good: 'let x = 1;' });
});

test('never throws on garbage', () => {
  const inputs = ['', '{', '}{', '{"meaning":', 'null', '[1,2,3]', '```', '{{{{', '\u0000\u0001', 'x'.repeat(10000)];
  for (const input of inputs) {
    assert.doesNotThrow(() => parseExplanation(input));
    const r = parseExplanation(input);
    assert.equal(typeof r.meaning, 'string');
    assert.equal(typeof r.cause, 'string');
    assert.ok(Array.isArray(r.fix));
  }
  // Non-string input from a misbehaving provider.
  assert.doesNotThrow(() => parseExplanation(undefined as unknown as string));
});
