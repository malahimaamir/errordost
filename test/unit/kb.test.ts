import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { ErrorContext, KbEntry, UiLanguage } from '../../src/types';
import { JS_ENTRIES } from '../../src/kb/javascript';
import { HTMLCSS_ENTRIES } from '../../src/kb/htmlcss';
import { matchEntries, fillPlaceholders } from '../../src/kb/matcher';

const LANGS: UiLanguage[] = ['english', 'urdu', 'roman-urdu', 'hindi', 'arabic'];
const MINE: KbEntry[] = [...JS_ENTRIES, ...HTMLCSS_ENTRIES];

/** The full index needs the other language files; load it lazily so these tests run on their own. */
async function loadIndex(): Promise<typeof import('../../src/kb/index') | undefined> {
  try {
    return await import('../../src/kb/index');
  } catch {
    return undefined;
  }
}

const ctx = (message: string, extra: Partial<ErrorContext> = {}): ErrorContext => ({ message, origin: 'paste', ...extra });

function checkEntries(entries: KbEntry[]): void {
  for (const e of entries) {
    assert.ok(e.id && e.title, `entry without id/title: ${JSON.stringify(e.id)}`);
    assert.ok(e.patterns.length > 0, `${e.id}: no patterns`);
    for (const p of e.patterns) {
      assert.ok(p instanceof RegExp, `${e.id}: pattern is not a RegExp`);
      assert.ok(!p.global && !p.sticky, `${e.id}: pattern ${p} must not use /g or /y`);
    }
    for (const lang of LANGS) {
      const t = e.text[lang];
      assert.ok(t, `${e.id}: missing ${lang}`);
      assert.ok(t.meaning.trim().length > 0, `${e.id}/${lang}: empty meaning`);
      assert.ok(t.cause.trim().length > 0, `${e.id}/${lang}: empty cause`);
      assert.ok(t.fix.length >= 1 && t.fix.every((s) => s.trim().length > 0), `${e.id}/${lang}: bad fix list`);
    }
    // Every language should use the same placeholders as English (so no translation loses a name).
    const ph = (lang: UiLanguage): string => {
      const t = e.text[lang];
      const all = [t.meaning, t.cause, ...t.fix].join(' ');
      return [...new Set(all.match(/\{\d+(?:\|[^{}]*)?\}/g) ?? [])].sort().join(',');
    };
    for (const lang of LANGS) assert.equal(ph(lang), ph('english'), `${e.id}/${lang}: placeholders differ from English`);
    if (e.example) {
      assert.ok(e.example.good.trim(), `${e.id}: empty good example`);
      assert.ok(e.example.good.split('\n').length <= 6, `${e.id}: good example too long`);
      if (e.example.bad) assert.ok(e.example.bad.split('\n').length <= 6, `${e.id}: bad example too long`);
    }
  }
}

test('JS and HTML/CSS entries are complete in all 5 languages', () => {
  assert.ok(JS_ENTRIES.length >= 30, `expected ~30 JS entries, got ${JS_ENTRIES.length}`);
  assert.ok(HTMLCSS_ENTRIES.length >= 15, `expected ~15 HTML/CSS entries, got ${HTMLCSS_ENTRIES.length}`);
  checkEntries(MINE);
});

test('ids are unique and prefixed', () => {
  const ids = MINE.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate ids');
  for (const id of ids) assert.match(id, /^(js|ts|node|npm|react|css|html)-[a-z0-9-]+$/, `bad id ${id}`);
});

const SAMPLES: Array<[string, string, Partial<ErrorContext>?]> = [
  ["TypeError: Cannot read properties of undefined (reading 'name')", 'js-undefined-property'],
  ["Uncaught TypeError: Cannot set properties of null (setting 'innerHTML')", 'js-null-property'],
  ['Uncaught ReferenceError: userName is not defined', 'js-not-defined'],
  ['ReferenceError: require is not defined in ES module scope, you can use import instead', 'js-require-not-defined'],
  ['TypeError: data.map is not a function', 'js-not-a-function'],
  ["ReferenceError: Cannot access 'total' before initialization", 'js-before-initialization'],
  ['TypeError: Assignment to constant variable.', 'js-const-assignment'],
  [`SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`, 'js-json-parse'],
  ['SyntaxError: Unexpected end of JSON input', 'js-json-parse'],
  ['SyntaxError: Unexpected end of input', 'js-unexpected-end'],
  ["SyntaxError: Unexpected token '}'", 'js-syntax-error'],
  ['RangeError: Maximum call stack size exceeded', 'js-max-call-stack'],
  ["Access to fetch at 'http://localhost:3000/api' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.", 'js-cors'],
  ['Uncaught (in promise) TypeError: Failed to fetch', 'js-failed-to-fetch'],
  ['SyntaxError: await is only valid in async functions and the top level bodies of modules', 'js-await-not-async'],
  ['SyntaxError: Cannot use import statement outside a module', 'js-import-outside-module'],
  ["Error: Cannot find module 'express'\nRequire stack:\n- D:\\app\\server.js", 'node-cannot-find-module'],
  ['npm ERR! code ERESOLVE\nnpm ERR! ERESOLVE unable to resolve dependency tree', 'npm-eresolve'],
  ['Error: listen EADDRINUSE: address already in use :::3000', 'node-eaddrinuse'],
  ["Error: ENOENT: no such file or directory, open 'data.json'", 'node-enoent'],
  ["npm ERR! enoent ENOENT: no such file or directory, open 'D:\\work\\package.json'", 'npm-no-package-json'],
  ["'node' is not recognized as an internal or external command,\noperable program or batch file.", 'node-command-not-found'],
  ['npm : File C:\\Program Files\\nodejs\\npm.ps1 cannot be loaded because running scripts is disabled on this system.', 'npm-ps-execution-policy'],
  ["Property 'age' does not exist on type 'User'.", 'ts-property-not-exist', { code: '2339', source: 'ts', languageId: 'typescript' }],
  ["Type 'string' is not assignable to type 'number'.", 'ts-type-not-assignable', { code: '2322', source: 'ts', languageId: 'typescript' }],
  ["Argument of type 'string' is not assignable to parameter of type 'number'.", 'ts-argument-type', { languageId: 'typescript' }],
  ["Cannot find name 'process'. Do you need to install type definitions for node?", 'ts-cannot-find-name'],
  ["Cannot find module './utils' or its corresponding type declarations.", 'ts-cannot-find-module', { code: 'TS2307' }],
  ["Parameter 'e' implicitly has an 'any' type.", 'ts-implicit-any'],
  ["'user' is possibly 'undefined'.", 'ts-possibly-undefined', { code: '18048' }],
  ['Warning: Each child in a list should have a unique "key" prop.', 'react-list-key'],
  ['Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.', 'react-too-many-renders'],
  ['Error: Invalid hook call. Hooks can only be called inside of the body of a function component.', 'react-invalid-hook'],
  ['Error: Objects are not valid as a React child (found: object with keys {id, name}).', 'react-object-child'],
  ['Error: Hydration failed because the initial UI does not match what was rendered on the server.', 'react-hydration'],
  ["Unknown property: 'colr'", 'css-unknown-property', { languageId: 'css', source: 'css' }],
  ['semi-colon expected', 'css-semicolon-expected', { languageId: 'css', code: 'css-semicolonexpected' }],
  ['} expected', 'css-brace-expected', { languageId: 'css' }],
  ['colon expected', 'css-colon-expected', { languageId: 'scss' }],
  ['at-rule or selector expected', 'css-selector-expected', { languageId: 'css' }],
  ['Unknown at rule @tailwind', 'css-unknown-at-rule', { languageId: 'css' }],
  ['Do not use empty rulesets', 'css-empty-ruleset', { languageId: 'css' }],
  ['GET http://127.0.0.1:5500/favicon.ico 404 (Not Found)', 'html-favicon-404'],
  ['GET http://127.0.0.1:5500/img/logo.png 404 (Not Found)', 'html-404'],
  ["Refused to apply style from 'http://127.0.0.1:5500/style.css' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.", 'html-mime-type'],
  ['GET file:///C:/site/images/cat.png net::ERR_FILE_NOT_FOUND', 'html-file-not-found'],
  ["Mixed Content: The page at 'https://my.site/' was loaded over HTTPS, but requested an insecure resource 'http://api.site/data'. This request has been blocked.", 'html-mixed-content'],
  ["Refused to execute inline script because it violates the following Content Security Policy directive: \"script-src 'self'\".", 'html-csp-inline'],
];

test('realistic messages match the expected entry', () => {
  for (const [message, id, extra] of SAMPLES) {
    const m = matchEntries(MINE, ctx(message, extra));
    assert.equal(m?.entry.id, id, `"${message.slice(0, 70)}" matched ${m?.entry.id}`);
  }
});

test('capture groups are inserted into every language', () => {
  const m = matchEntries(MINE, ctx("TypeError: Cannot read properties of undefined (reading 'name')"));
  assert.ok(m);
  assert.equal(m.entry.id, 'js-undefined-property');
  for (const lang of LANGS) {
    const t = m.text(lang);
    assert.ok(t.meaning.includes("'name'"), `${lang}: ${t.meaning}`);
    assert.ok(!/\{\d/.test([t.meaning, t.cause, ...t.fix].join(' ')), `${lang}: placeholder left`);
  }
  assert.ok(m.text('roman-urdu').meaning.includes('name'));

  const ts = matchEntries(MINE, ctx("Property 'age' does not exist on type 'User'.", { code: '2339', source: 'ts' }));
  assert.ok(ts?.text('english').meaning.includes("'User'"));
  assert.ok(ts?.text('urdu').meaning.includes("'age'"));

  const port = matchEntries(MINE, ctx('Error: listen EADDRINUSE: address already in use :::3000'));
  assert.ok(port?.text('hindi').meaning.includes('3000'));
});

test('missing groups are removed cleanly or use their fallback', () => {
  // Matched only through the diagnostic code (e.g. a localized message): no capture groups.
  const m = matchEntries(MINE, ctx('Die Eigenschaft ist nicht vorhanden', { code: '2339', source: 'ts' }));
  assert.equal(m?.entry.id, 'ts-property-not-exist');
  for (const lang of LANGS) {
    const all = [m!.text(lang).meaning, m!.text(lang).cause, ...m!.text(lang).fix].join('\n');
    assert.ok(!/\{\d/.test(all), `${lang}: placeholder left`);
    assert.ok(!/''|``|\(\s*\)|  /.test(all.replace(/`\(\)`|\w\(\)/g, '')), `${lang}: messy leftovers in: ${all}`);
  }
  assert.ok(m!.text('english').fix.some((s) => s.includes('`propertyName: string;`')));

  // Localized message matched by code: quoted names are borrowed from the message.
  const de = matchEntries(MINE, ctx('Die Eigenschaft "age" ist für den Typ "User" nicht vorhanden.', { code: '2339', source: 'ts' }));
  assert.equal(de?.entry.id, 'ts-property-not-exist');
  assert.ok(de?.text('urdu').meaning.includes("'age'") && de.text('english').meaning.includes("'User'"));

  assert.equal(fillPlaceholders("Read '{1}' now.", []), 'Read now.');
  assert.equal(fillPlaceholders('Port {1} is busy ({2}).', [undefined, '3000']), 'Port 3000 is busy.');
  assert.equal(fillPlaceholders('`{1|npm}.ps1`', []), '`npm.ps1`');
  assert.equal(fillPlaceholders('`{1|npm}.ps1`', [undefined, 'yarn']), '`yarn.ps1`');
  assert.equal(fillPlaceholders('Call `fn()` with {1}.', []), 'Call `fn()` with.');
  assert.equal(fillPlaceholders('No placeholders here.', []), 'No placeholders here.');
});

test('language preference: entries for the file language are tried first', () => {
  // "colon expected" in a CSS file goes to the CSS entry; the pasted generic TS1005 form goes to JS.
  assert.equal(matchEntries(MINE, ctx("';' expected.", { languageId: 'typescript', code: '1005', source: 'ts' }))?.entry.id, 'js-syntax-error');
  assert.equal(matchEntries(MINE, ctx('semi-colon expected', { languageId: 'css' }))?.entry.id, 'css-semicolon-expected');
});

test('nonsense and empty input match nothing', () => {
  assert.equal(matchEntries(MINE, ctx('the quick brown fox jumps over the lazy dog')), undefined);
  assert.equal(matchEntries(MINE, ctx('')), undefined);
  assert.equal(matchEntries(MINE, ctx('   \n  ')), undefined);
});

test('patterns stay fast on long, adversarial input', () => {
  const big = ("Type '" + 'a'.repeat(3000) + "' is not ").repeat(3) + 'x'.repeat(5000);
  const start = Date.now();
  matchEntries(MINE, ctx(big));
  matchEntries(MINE, ctx('Cannot read properties of ' + '('.repeat(5000)));
  assert.ok(Date.now() - start < 500, `matching took ${Date.now() - start}ms`);
});

test('full index (when all language files exist) is consistent', async (t) => {
  const index = await loadIndex();
  if (!index) {
    t.skip('other KB files not available yet');
    return;
  }
  assert.equal(index.KB_SIZE, index.KB_ENTRIES.length);
  const ids = index.KB_ENTRIES.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids.filter((x, i) => ids.indexOf(x) !== i).join(', ')}`);
  checkEntries(index.KB_ENTRIES.filter((e) => !MINE.includes(e)));
  const m = index.matchKnowledgeBase(ctx("TypeError: Cannot read properties of undefined (reading 'name')"));
  assert.equal(m?.entry.id, 'js-undefined-property');
  assert.ok(m?.text('roman-urdu').meaning.includes('name'));
  // My JS/CSS samples should still win when the whole KB is loaded.
  for (const [message, id, extra] of SAMPLES) {
    assert.equal(index.matchKnowledgeBase(ctx(message, extra))?.entry.id, id, `full KB: "${message.slice(0, 60)}"`);
  }
  assert.equal(index.matchKnowledgeBase(ctx('the quick brown fox jumps over the lazy dog')), undefined);
});
