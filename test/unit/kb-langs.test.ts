import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { KbEntry, UiLanguage } from '../../src/types';
import { PYTHON_ENTRIES } from '../../src/kb/python';
import { JAVA_ENTRIES } from '../../src/kb/java';
import { CPP_ENTRIES } from '../../src/kb/cpp';
import { PHP_ENTRIES } from '../../src/kb/php';

const LANGS: UiLanguage[] = ['english', 'urdu', 'roman-urdu', 'hindi', 'arabic'];
const ALL: KbEntry[] = [...PYTHON_ENTRIES, ...JAVA_ENTRIES, ...CPP_ENTRIES, ...PHP_ENTRIES];

/** Number of capture groups in a regex. */
function groupCount(re: RegExp): number {
  return new RegExp(`${re.source}|`, re.flags.replace(/[gy]/g, '')).exec('')!.length - 1;
}

/** First entry (in array order) whose patterns match the message. */
function firstMatch(entries: KbEntry[], message: string): { id: string; groups: string[] } | undefined {
  for (const e of entries) {
    for (const p of e.patterns) {
      const m = p.exec(message);
      if (m) return { id: e.id, groups: [...m] };
    }
  }
  return undefined;
}

test('each language file has a reasonable number of entries', () => {
  assert.ok(PYTHON_ENTRIES.length >= 20, `python: ${PYTHON_ENTRIES.length}`);
  assert.ok(JAVA_ENTRIES.length >= 12, `java: ${JAVA_ENTRIES.length}`);
  assert.ok(CPP_ENTRIES.length >= 12, `cpp: ${CPP_ENTRIES.length}`);
  assert.ok(PHP_ENTRIES.length >= 10, `php: ${PHP_ENTRIES.length}`);
});

test('ids are unique and correctly prefixed', () => {
  const ids = ALL.map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate ids');
  for (const e of PYTHON_ENTRIES) assert.match(e.id, /^py-/);
  for (const e of JAVA_ENTRIES) assert.match(e.id, /^java-/);
  for (const e of CPP_ENTRIES) assert.match(e.id, /^cpp-/);
  for (const e of PHP_ENTRIES) assert.match(e.id, /^php-/);
});

test('every entry has all 5 languages with meaning, cause and at least one fix', () => {
  for (const e of ALL) {
    assert.ok(e.title.trim(), `${e.id}: title`);
    assert.ok(e.patterns.length > 0, `${e.id}: patterns`);
    assert.ok(e.languages && e.languages.length > 0, `${e.id}: languages`);
    for (const lang of LANGS) {
      const t = e.text[lang];
      assert.ok(t, `${e.id}: missing ${lang}`);
      assert.ok(t.meaning.trim(), `${e.id}/${lang}: meaning`);
      assert.ok(t.cause.trim(), `${e.id}/${lang}: cause`);
      assert.ok(t.fix.length >= 1 && t.fix.every((f) => f.trim()), `${e.id}/${lang}: fix`);
      assert.equal(t.fix.length, e.text.english.fix.length, `${e.id}/${lang}: fix count differs from english`);
    }
  }
});

test('scripts are correct: urdu/arabic use Arabic script, hindi uses Devanagari', () => {
  for (const e of ALL) {
    assert.match(e.text.urdu.meaning, /[\u0600-\u06FF]/, `${e.id}: urdu`);
    assert.match(e.text.arabic.meaning, /[\u0600-\u06FF]/, `${e.id}: arabic`);
    assert.match(e.text.hindi.meaning, /[\u0900-\u097F]/, `${e.id}: hindi`);
    assert.doesNotMatch(e.text['roman-urdu'].meaning, /[\u0600-\u06FF\u0900-\u097F]/, `${e.id}: roman-urdu`);
  }
});

test('patterns are safe: no g/y flags and no match on empty input', () => {
  for (const e of ALL) {
    for (const p of e.patterns) {
      assert.doesNotMatch(p.flags, /[gy]/, `${e.id}: ${p}`);
      assert.equal(p.test(''), false, `${e.id}: ${p} matches empty string`);
    }
  }
});

test('placeholders only reference capture groups present in every pattern', () => {
  for (const e of ALL) {
    const minGroups = Math.min(...e.patterns.map(groupCount));
    for (const lang of LANGS) {
      const t = e.text[lang];
      for (const s of [t.meaning, t.cause, ...t.fix]) {
        for (const m of s.matchAll(/\{(\d+)\}/g)) {
          const idx = Number(m[1]);
          assert.ok(idx >= 1 && idx <= minGroups, `${e.id}/${lang}: {${idx}} but only ${minGroups} group(s)`);
        }
      }
    }
  }
});

test('patterns do not backtrack badly on long hostile input', () => {
  const hostile = [
    'a'.repeat(5000),
    "'".repeat(3000),
    `cannot find symbol ${' '.repeat(3000)}`,
    `incompatible types: ${'x '.repeat(2000)}`,
    `Type mismatch: cannot convert from ${'a to '.repeat(1000)}`,
    `syntax error, unexpected ${','.repeat(3000)}`,
  ];
  for (const e of ALL) {
    for (const p of e.patterns) {
      for (const h of hostile) {
        const start = Date.now();
        p.test(h);
        assert.ok(Date.now() - start < 200, `${e.id}: ${p} slow`);
      }
    }
  }
});

const SAMPLES: Array<{ msg: string; id: string; groups?: Record<number, string> }> = [
  // ── Python ──
  {
    msg: 'Traceback (most recent call last):\n  File "C:\\Users\\ali\\main.py", line 1, in <module>\n    import numpy as np\nModuleNotFoundError: No module named \'numpy\'',
    id: 'py-module-not-found',
    groups: { 1: 'numpy' },
  },
  {
    msg: '  File "main.py", line 3\n    print(x)\nIndentationError: unexpected indent',
    id: 'py-indent-unexpected',
  },
  {
    msg: '  File "main.py", line 2\n    print("hi")\n    ^\nIndentationError: expected an indented block after \'if\' statement on line 1',
    id: 'py-indent-expected',
  },
  {
    msg: 'Traceback (most recent call last):\n  File "app.py", line 4, in <module>\n    print(total)\nNameError: name \'total\' is not defined',
    id: 'py-name-error',
    groups: { 1: 'total' },
  },
  {
    msg: 'TypeError: unsupported operand type(s) for +: \'int\' and \'str\'',
    id: 'py-type-unsupported-operand',
    groups: { 1: '+', 2: 'int', 3: 'str' },
  },
  { msg: 'TypeError: can only concatenate str (not "int") to str', id: 'py-type-concat-str', groups: { 1: 'str', 2: 'int' } },
  { msg: "TypeError: 'NoneType' object is not subscriptable", id: 'py-type-nonetype' },
  {
    msg: 'TypeError: Dog.bark() takes 0 positional arguments but 1 was given',
    id: 'py-type-args-count',
    groups: { 1: 'bark', 2: '0', 3: '1' },
  },
  { msg: "AttributeError: 'NoneType' object has no attribute 'group'", id: 'py-attribute-none', groups: { 1: 'group' } },
  { msg: "AttributeError: 'str' object has no attribute 'append'", id: 'py-attribute-error', groups: { 1: 'str', 2: 'append' } },
  { msg: 'IndexError: list index out of range', id: 'py-index-error', groups: { 1: 'list' } },
  { msg: "KeyError: 'age'", id: 'py-key-error', groups: { 1: "'age'" } },
  { msg: "ValueError: invalid literal for int() with base 10: 'abc'", id: 'py-value-convert', groups: { 1: 'int', 2: "'abc'" } },
  { msg: 'ZeroDivisionError: division by zero', id: 'py-zero-division' },
  {
    msg: "FileNotFoundError: [Errno 2] No such file or directory: 'data.csv'",
    id: 'py-file-not-found',
    groups: { 1: 'data.csv' },
  },
  {
    msg: "UnboundLocalError: cannot access local variable 'count' where it is not associated with a value",
    id: 'py-unbound-local',
    groups: { 1: 'count' },
  },
  {
    msg: "ImportError: cannot import name 'b' from partially initialized module 'a' (most likely due to a circular import)",
    id: 'py-import-name',
    groups: { 1: 'b' },
  },
  { msg: 'RecursionError: maximum recursion depth exceeded in comparison', id: 'py-recursion-error' },
  {
    msg: "python : The term 'python' is not recognized as the name of a cmdlet, function, script file, or operable program.",
    id: 'py-python-not-recognized',
  },
  { msg: "'pip' is not recognized as an internal or external command,\noperable program or batch file.", id: 'py-pip-not-recognized' },
  { msg: 'Import "requests" could not be resolved', id: 'py-pylance-unresolved-import', groups: { 1: 'requests' } },
  { msg: "SyntaxError: expected ':'", id: 'py-syntax-expected-colon' },
  { msg: 'SyntaxError: unterminated string literal (detected at line 1)', id: 'py-syntax-unterminated-string' },
  { msg: "SyntaxError: '(' was never closed", id: 'py-syntax-never-closed' },
  { msg: 'TabError: inconsistent use of tabs and spaces in indentation', id: 'py-tab-error' },
  // ── Java ──
  {
    msg: 'Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "name" is null\n\tat Main.main(Main.java:5)',
    id: 'java-npe-helpful',
    groups: { 1: 'name' },
  },
  { msg: 'Exception in thread "main" java.lang.NullPointerException\n\tat Main.main(Main.java:5)', id: 'java-npe' },
  {
    msg: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5\n\tat Main.main(Main.java:7)',
    id: 'java-array-index',
    groups: { 1: '5' },
  },
  {
    msg: 'Main.java:4: error: cannot find symbol\n        System.out.println(count);\n                           ^\n  symbol:   variable count\n  location: class Main',
    id: 'java-cannot-find-symbol',
  },
  {
    msg: 'Main.java:3: error: incompatible types: String cannot be converted to int\n        int x = "5";',
    id: 'java-incompatible-types',
    groups: { 1: 'String' },
  },
  {
    msg: 'Main.java:1: error: class Hello is public, should be declared in a file named Hello.java',
    id: 'java-public-class-filename',
    groups: { 1: 'Hello' },
  },
  {
    msg: 'Main.java:8: error: unreported exception FileNotFoundException; must be caught or declared to be thrown',
    id: 'java-unreported-exception',
    groups: { 1: 'FileNotFoundException' },
  },
  { msg: 'Error: Could not find or load main class Main\nCaused by: java.lang.ClassNotFoundException: Main', id: 'java-main-class-not-found', groups: { 1: 'Main' } },
  {
    msg: 'Main.java:6: error: non-static method greet() cannot be referenced from a static context',
    id: 'java-static-context',
    groups: { 1: 'greet' },
  },
  { msg: 'Exception in thread "main" java.lang.NumberFormatException: For input string: "abc"', id: 'java-number-format', groups: { 1: 'abc' } },
  { msg: "Main.java:5: error: ';' expected", id: 'java-semicolon-expected' },
  { msg: 'Exception in thread "main" java.lang.ArithmeticException: / by zero', id: 'java-arithmetic-zero' },
  { msg: 'Exception in thread "main" java.util.InputMismatchException\n\tat java.base/java.util.Scanner.throwFor', id: 'java-input-mismatch' },
  // ── C / C++ ──
  { msg: 'Segmentation fault (core dumped)', id: 'cpp-segfault' },
  {
    msg: "main.cpp: In function 'int main()':\nmain.cpp:4:5: error: 'cout' was not declared in this scope; did you mean 'std::cout'?",
    id: 'cpp-std-not-declared',
    groups: { 1: 'cout' },
  },
  { msg: "main.cpp:6:5: error: 'total' was not declared in this scope", id: 'cpp-not-declared', groups: { 1: 'total' } },
  { msg: "main.cpp(6): error C2065: 'total': undeclared identifier", id: 'cpp-not-declared', groups: { 1: 'total' } },
  { msg: "main.cpp:5:14: error: expected ';' before 'return'", id: 'cpp-expected-semicolon' },
  {
    msg: "C:/msys64/ucrt64/bin/../lib/gcc/x86_64-w64-mingw32/13.2.0/../../../../x86_64-w64-mingw32/bin/ld.exe: C:/msys64/.../crt0_c.c:18:(.text.startup+0x2e): undefined reference to `WinMain'\ncollect2.exe: error: ld returned 1 exit status",
    id: 'cpp-no-main',
  },
  {
    msg: "/usr/bin/ld: /tmp/ccX.o: in function `main':\nmain.cpp:(.text+0x13): undefined reference to `add(int, int)'\ncollect2: error: ld returned 1 exit status",
    id: 'cpp-undefined-reference',
    groups: { 1: 'add(int, int)' },
  },
  {
    msg: 'main.obj : error LNK2019: unresolved external symbol "int __cdecl add(int,int)" (?add@@YAHHH@Z) referenced in function main',
    id: 'cpp-undefined-reference',
    groups: { 1: 'int __cdecl add(int,int)' },
  },
  { msg: "main.cpp:9:8: error: no matching function for call to 'Student::Student(int)'", id: 'cpp-no-matching-function', groups: { 1: 'Student::Student' } },
  { msg: "main.cpp:3:13: error: invalid conversion from 'const char*' to 'int' [-fpermissive]", id: 'cpp-invalid-conversion', groups: { 1: 'const char*', 2: 'int' } },
  { msg: 'main.cpp:1:10: fatal error: conio.h: No such file or directory', id: 'cpp-header-not-found', groups: { 1: 'conio.h' } },
  { msg: "main.cpp:7:1: warning: control reaches end of non-void function [-Wreturn-type]", id: 'cpp-control-reaches-end' },
  { msg: "main.cpp:5:10: warning: array subscript 5 is above array bounds of 'int [5]' [-Warray-bounds]", id: 'cpp-array-bounds' },
  { msg: "g++ : The term 'g++' is not recognized as the name of a cmdlet, function, script file, or operable program.", id: 'cpp-compiler-not-recognized', groups: { 1: 'g++' } },
  { msg: '*** stack smashing detected ***: terminated\nAborted (core dumped)', id: 'cpp-stack-smashing' },
  // ── PHP ──
  {
    msg: 'PHP Parse error:  syntax error, unexpected token "}", expecting ";" in C:\\xampp\\htdocs\\app\\index.php on line 5',
    id: 'php-parse-error',
    groups: { 1: 'token "}"' },
  },
  { msg: 'Warning: Undefined variable $username in C:\\xampp\\htdocs\\login.php on line 12', id: 'php-undefined-variable', groups: { 1: 'username' } },
  { msg: 'Warning: Undefined array key "email" in /var/www/html/form.php on line 3', id: 'php-undefined-index', groups: { 1: 'email' } },
  { msg: 'Notice: Undefined index: email in /var/www/html/form.php on line 3', id: 'php-undefined-index', groups: { 1: 'email' } },
  { msg: 'Fatal error: Uncaught Error: Call to undefined function mysql_connect() in /var/www/db.php:4', id: 'php-undefined-function', groups: { 1: 'mysql_connect' } },
  { msg: 'Fatal error: Uncaught Error: Call to a member function fetch_assoc() on bool in /var/www/list.php:9', id: 'php-member-function-on-null', groups: { 1: 'fetch_assoc', 2: 'bool' } },
  { msg: 'Fatal error: Uncaught Error: Call to undefined method App\\User::getNmae() in /app/index.php:7', id: 'php-undefined-method', groups: { 1: 'App\\User', 2: 'getNmae' } },
  {
    msg: 'Warning: Cannot modify header information - headers already sent by (output started at /var/www/header.php:1) in /var/www/login.php on line 20',
    id: 'php-headers-already-sent',
  },
  { msg: 'Fatal error: Maximum execution time of 30 seconds exceeded in /var/www/loop.php on line 4', id: 'php-max-execution-time', groups: { 1: '30' } },
  {
    msg: 'PHP Fatal error:  Allowed memory size of 134217728 bytes exhausted (tried to allocate 20480 bytes) in /app/x.php on line 9',
    id: 'php-memory-exhausted',
    groups: { 1: '134217728' },
  },
  { msg: 'Fatal error: Uncaught Error: Class "App\\Models\\User" not found in /app/index.php:5', id: 'php-class-not-found', groups: { 1: 'App\\Models\\User' } },
  {
    msg: "Fatal error: Uncaught PDOException: SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost' (using password: YES)",
    id: 'php-db-access-denied',
    groups: { 1: 'root' },
  },
  { msg: 'Fatal error: Uncaught PDOException: SQLSTATE[HY000] [2002] Connection refused in /app/db.php:3', id: 'php-db-connection-refused' },
  { msg: "Fatal error: Uncaught mysqli_sql_exception: Unknown database 'school' in /app/db.php:3", id: 'php-db-unknown-database', groups: { 1: 'school' } },
  // ── less common variants ──
  { msg: "TypeError: 'int' object is not iterable", id: 'py-type-not-iterable', groups: { 1: 'int' } },
  { msg: "TypeError: greet() missing 1 required positional argument: 'name'", id: 'py-type-missing-arg', groups: { 1: 'greet' } },
  { msg: '    if x = 5:\n         ^\nSyntaxError: invalid syntax', id: 'py-syntax-invalid' },
  { msg: 'IndentationError: unindent does not match any outer indentation level', id: 'py-indent-unindent' },
  { msg: 'java.lang.StringIndexOutOfBoundsException: index 5, length 3', id: 'java-string-index' },
  {
    msg: 'java.lang.ClassCastException: class java.lang.String cannot be cast to class java.lang.Integer',
    id: 'java-class-cast',
    groups: { 1: 'java.lang.String', 2: 'java.lang.Integer' },
  },
  { msg: 'Main.java:9: error: missing return statement', id: 'java-missing-return' },
];

test('realistic error messages match the expected entry (first match wins)', () => {
  for (const s of SAMPLES) {
    const got = firstMatch(ALL, s.msg);
    assert.ok(got, `no match for: ${s.msg}`);
    assert.equal(got.id, s.id, `wrong entry for: ${s.msg}`);
    for (const [idx, val] of Object.entries(s.groups ?? {})) {
      assert.equal(got.groups[Number(idx)], val, `${s.id}: group ${idx}`);
    }
  }
});

test('every entry is covered by at least one sample', () => {
  const hit = new Set(SAMPLES.map((s) => s.id));
  assert.deepEqual(ALL.map((e) => e.id).filter((id) => !hit.has(id)), []);
});
