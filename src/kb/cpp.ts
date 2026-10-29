import type { KbEntry } from '../types';

/**
 * Offline knowledge base: C / C++ errors (GCC/G++, Clang, MSVC, linker,
 * VS Code C/C++ IntelliSense and runtime crashes).
 * Order matters: the first matching entry wins, so specific entries come first.
 */

/** Standard-library names beginners most often use without the right #include / std::. */
const STD_NAMES = 'cout|cin|cerr|endl|string|vector|getline|map|sort|swap';

export const CPP_ENTRIES: KbEntry[] = [
  {
    id: 'cpp-stack-smashing',
    title: 'stack smashing detected',
    languages: ['c', 'cpp'],
    patterns: [/stack smashing detected/i],
    text: {
      english: {
        meaning: "Your program wrote past the end of a local array, damaging memory next to it, so it was stopped for safety.",
        cause: "A local array or C-string received more data than it can hold, e.g. a loop going one step too far, `strcpy`/`gets`/`scanf(\"%s\")` into a small `char` array, or forgetting room for the `'\\0'` at the end of a string.",
        fix: [
          "Check every loop that writes into an array: use `i < size`, not `i <= size`.",
          "Make `char` arrays one bigger than the longest text (for the `'\\0'`).",
          "Use safer input: `fgets(buf, sizeof buf, stdin)` in C, or `std::string` with `std::getline` in C++.",
        ],
      },
      urdu: {
        meaning: "آپ کے پروگرام نے کسی local array کی حد سے آگے لکھ دیا، جس سے ساتھ والی memory خراب ہوئی، اس لیے حفاظت کے لیے اسے روک دیا گیا۔",
        cause: "کسی local array یا C-string میں اس کی گنجائش سے زیادہ data ڈالا گیا، جیسے loop کا ایک قدم زیادہ چلنا، چھوٹے `char` array میں `strcpy`/`gets`/`scanf(\"%s\")` کرنا، یا string کے آخر میں `'\\0'` کی جگہ نہ رکھنا۔",
        fix: [
          "Array میں لکھنے والا ہر loop چیک کریں: `i <= size` نہیں، `i < size` لکھیں۔",
          "`char` array کو سب سے لمبے text سے ایک خانہ بڑا رکھیں (`'\\0'` کے لیے)۔",
          "محفوظ input استعمال کریں: C میں `fgets(buf, sizeof buf, stdin)`، C++ میں `std::string` کے ساتھ `std::getline`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke program ne kisi local array ki had se aage likh diya, jis se sath wali memory kharab hui, is liye safety ke liye usay rok diya gaya.",
        cause: "Kisi local array ya C-string mein uski capacity se zyada data dala gaya, jaise loop ka aik step zyada chalna, chhote `char` array mein `strcpy`/`gets`/`scanf(\"%s\")` karna, ya string ke end mein `'\\0'` ki jagah na rakhna.",
        fix: [
          "Array mein likhne wala har loop check karen: `i <= size` nahi, `i < size` likhen.",
          "`char` array ko sab se lambe text se aik khana bara rakhen (`'\\0'` ke liye).",
          "Safe input use karen: C mein `fgets(buf, sizeof buf, stdin)`, C++ mein `std::string` ke sath `std::getline`.",
        ],
      },
      hindi: {
        meaning: "आपके प्रोग्राम ने किसी local array की सीमा से आगे लिख दिया, जिससे पास की memory ख़राब हुई, इसलिए सुरक्षा के लिए उसे रोक दिया गया।",
        cause: "किसी local array या C-string में उसकी क्षमता से ज़्यादा data डाला गया, जैसे loop का एक क़दम ज़्यादा चलना, छोटे `char` array में `strcpy`/`gets`/`scanf(\"%s\")` करना, या string के आख़िर में `'\\0'` की जगह न रखना।",
        fix: [
          "Array में लिखने वाला हर loop जाँचें: `i <= size` नहीं, `i < size` लिखें।",
          "`char` array को सबसे लंबे text से एक ख़ाना बड़ा रखें (`'\\0'` के लिए)।",
          "सुरक्षित input इस्तेमाल करें: C में `fgets(buf, sizeof buf, stdin)`, C++ में `std::string` के साथ `std::getline`।",
        ],
      },
      arabic: {
        meaning: "كتب برنامجك بعد نهاية مصفوفة محلية فأفسد الذاكرة المجاورة، لذلك أُوقف حفاظًا على الأمان.",
        cause: "استقبلت مصفوفة محلية أو سلسلة C بيانات أكثر من سعتها، مثل حلقة تتجاوز بخطوة، أو `strcpy`/`gets`/`scanf(\"%s\")` في مصفوفة `char` صغيرة، أو نسيان مكان `'\\0'` في نهاية النص.",
        fix: [
          "افحص كل حلقة تكتب في مصفوفة: استخدم `i < size` لا `i <= size`.",
          "اجعل مصفوفة `char` أكبر بخانة من أطول نص (من أجل `'\\0'`).",
          "استخدم إدخالًا آمنًا: `fgets(buf, sizeof buf, stdin)` في C، أو `std::string` مع `std::getline` في C++.",
        ],
      },
    },
  },
  {
    id: 'cpp-segfault',
    title: 'Segmentation fault (core dumped)',
    languages: ['c', 'cpp'],
    patterns: [
      /Segmentation fault/i,
      /SIGSEGV/,
      /0xC0000005|3221225477|-1073741819/i,
      /exit(?:ed with)? (?:code|status)[ =:]*139\b/i,
    ],
    text: {
      english: {
        meaning: "Your program tried to read or write memory it is not allowed to touch, so the operating system stopped it.",
        cause: "Most common: using an array index outside its size, using a pointer that is `NULL`/`nullptr` or was never set, using memory after `delete`/`free`, or endless recursion. Forgetting `&` in `scanf(\"%d\", x)` also causes it.",
        fix: [
          "Check array loops: indexes go from `0` to `size - 1`.",
          "Give every pointer a valid address before using `*p` or `p->`.",
          "In C, use `scanf(\"%d\", &x)` with `&`.",
          "Find the exact line with a debugger (F5 in VS Code) or compile with `-g -fsanitize=address`.",
        ],
      },
      urdu: {
        meaning: "آپ کے پروگرام نے ایسی memory پڑھنے یا لکھنے کی کوشش کی جس کی اجازت نہیں تھی، اس لیے operating system نے اسے روک دیا۔",
        cause: "سب سے عام: array کا index اس کے size سے باہر استعمال کرنا، `NULL`/`nullptr` یا بغیر value والا pointer استعمال کرنا، `delete`/`free` کے بعد memory استعمال کرنا، یا نہ ختم ہونے والی recursion۔ `scanf(\"%d\", x)` میں `&` بھول جانا بھی یہی کرتا ہے۔",
        fix: [
          "Array والے loops چیک کریں: index `0` سے `size - 1` تک ہوتا ہے۔",
          "`*p` یا `p->` استعمال کرنے سے پہلے ہر pointer کو درست address دیں۔",
          "C میں `scanf(\"%d\", &x)` لکھیں، `&` کے ساتھ۔",
          "Debugger (VS Code میں F5) سے یا `-g -fsanitize=address` کے ساتھ compile کر کے اصل لائن ڈھونڈیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke program ne aisi memory read ya write karne ki koshish ki jis ki ijazat nahi thi, is liye operating system ne usay rok diya.",
        cause: "Sab se common: array ka index uske size se bahar use karna, `NULL`/`nullptr` ya bina value wala pointer use karna, `delete`/`free` ke baad memory use karna, ya na khatam hone wali recursion. `scanf(\"%d\", x)` mein `&` bhool jana bhi yahi karta hai.",
        fix: [
          "Array wale loops check karen: index `0` se `size - 1` tak hota hai.",
          "`*p` ya `p->` use karne se pehle har pointer ko sahi address den.",
          "C mein `scanf(\"%d\", &x)` likhen, `&` ke sath.",
          "Debugger (VS Code mein F5) se ya `-g -fsanitize=address` ke sath compile kar ke asal line dhoonden.",
        ],
      },
      hindi: {
        meaning: "आपके प्रोग्राम ने ऐसी memory पढ़ने या लिखने की कोशिश की जिसकी इजाज़त नहीं थी, इसलिए operating system ने उसे रोक दिया।",
        cause: "सबसे आम: array का index उसके size से बाहर इस्तेमाल करना, `NULL`/`nullptr` या बिना value वाला pointer इस्तेमाल करना, `delete`/`free` के बाद memory इस्तेमाल करना, या कभी न ख़त्म होने वाली recursion। `scanf(\"%d\", x)` में `&` भूल जाना भी यही करता है।",
        fix: [
          "Array वाले loops जाँचें: index `0` से `size - 1` तक होता है।",
          "`*p` या `p->` इस्तेमाल करने से पहले हर pointer को सही address दें।",
          "C में `scanf(\"%d\", &x)` लिखें, `&` के साथ।",
          "Debugger (VS Code में F5) से या `-g -fsanitize=address` के साथ compile करके असली लाइन ढूँढें।",
        ],
      },
      arabic: {
        meaning: "حاول برنامجك قراءة أو كتابة ذاكرة غير مسموح له بها، فأوقفه نظام التشغيل.",
        cause: "الأشهر: استخدام فهرس خارج حجم المصفوفة، أو مؤشر قيمته `NULL`/`nullptr` أو لم يُهيّأ، أو استخدام ذاكرة بعد `delete`/`free`، أو استدعاء ذاتي لا ينتهي. ونسيان `&` في `scanf(\"%d\", x)` يسبب ذلك أيضًا.",
        fix: [
          "افحص حلقات المصفوفات: الفهارس من `0` إلى `size - 1`.",
          "أعطِ كل مؤشر عنوانًا صالحًا قبل استخدام `*p` أو `p->`.",
          "في C اكتب `scanf(\"%d\", &x)` مع `&`.",
          "حدّد السطر بدقة باستخدام المصحّح (F5 في VS Code) أو بالترجمة مع `-g -fsanitize=address`.",
        ],
      },
    },
    example: {
      bad: 'int a[5];\nfor (int i = 0; i <= 5; i++)\n    a[i] = i;',
      good: 'int a[5];\nfor (int i = 0; i < 5; i++)\n    a[i] = i;',
    },
  },
  {
    id: 'cpp-std-not-declared',
    title: "'cout' was not declared in this scope",
    languages: ['c', 'cpp'],
    patterns: [
      new RegExp(`'(${STD_NAMES})' was not declared in this scope`),
      /'(\w+)' is not a member of 'std'/,
      new RegExp(`error C2065: '(${STD_NAMES})': undeclared identifier`),
      new RegExp(`use of undeclared identifier '(${STD_NAMES})'`),
      new RegExp(`identifier "(${STD_NAMES})" is undefined`),
    ],
    text: {
      english: {
        meaning: "The compiler does not know `{1}`. It is part of the C++ standard library (`std`), but it was not made available.",
        cause: "The matching `#include` is missing (e.g. `<iostream>` for `cout`/`cin`, `<string>`, `<vector>`), or you wrote `{1}` without `std::` and without `using namespace std;`.",
        fix: [
          "Add the header at the top, e.g. `#include <iostream>` for `cout`/`cin`/`endl`.",
          "Write `std::{1}`, or add `using namespace std;` after the includes.",
          "Make sure the file is saved as `.cpp` (not `.c`) and compiled with `g++`.",
        ],
      },
      urdu: {
        meaning: "Compiler `{1}` کو نہیں جانتا۔ یہ C++ کی standard library (`std`) کا حصہ ہے، مگر اسے دستیاب نہیں کیا گیا۔",
        cause: "متعلقہ `#include` غائب ہے (جیسے `cout`/`cin` کے لیے `<iostream>`، `<string>`، `<vector>`)، یا آپ نے `{1}` کو `std::` کے بغیر لکھا اور `using namespace std;` بھی نہیں لکھا۔",
        fix: [
          "فائل کے اوپر header لکھیں، جیسے `cout`/`cin`/`endl` کے لیے `#include <iostream>`۔",
          "`std::{1}` لکھیں، یا includes کے بعد `using namespace std;` لکھ دیں۔",
          "یقینی بنائیں کہ فائل `.cpp` کے طور پر save ہو (`.c` نہیں) اور `g++` سے compile ہو۔",
        ],
      },
      'roman-urdu': {
        meaning: "Compiler `{1}` ko nahi janta. Ye C++ ki standard library (`std`) ka hissa hai, lekin isay available nahi kiya gaya.",
        cause: "Related `#include` missing hai (jaise `cout`/`cin` ke liye `<iostream>`, `<string>`, `<vector>`), ya aap ne `{1}` ko `std::` ke baghair likha aur `using namespace std;` bhi nahi likha.",
        fix: [
          "File ke upar header likhen, jaise `cout`/`cin`/`endl` ke liye `#include <iostream>`.",
          "`std::{1}` likhen, ya includes ke baad `using namespace std;` likh den.",
          "Ensure karen ke file `.cpp` ke tor par save ho (`.c` nahi) aur `g++` se compile ho.",
        ],
      },
      hindi: {
        meaning: "Compiler `{1}` को नहीं जानता। यह C++ की standard library (`std`) का हिस्सा है, लेकिन इसे उपलब्ध नहीं कराया गया।",
        cause: "सही `#include` छूट गया है (जैसे `cout`/`cin` के लिए `<iostream>`, `<string>`, `<vector>`), या आपने `{1}` को `std::` के बिना लिखा और `using namespace std;` भी नहीं लिखा।",
        fix: [
          "फ़ाइल के ऊपर header लिखें, जैसे `cout`/`cin`/`endl` के लिए `#include <iostream>`।",
          "`std::{1}` लिखें, या includes के बाद `using namespace std;` लिख दें।",
          "पक्का करें कि फ़ाइल `.cpp` के रूप में save हो (`.c` नहीं) और `g++` से compile हो।",
        ],
      },
      arabic: {
        meaning: "لا يعرف المترجم `{1}`. إنه جزء من مكتبة C++ القياسية (`std`)، لكنه لم يُتَح للكود.",
        cause: "الـ `#include` المناسب مفقود (مثل `<iostream>` لـ `cout`/`cin`، و`<string>` و`<vector>`)، أو أنك كتبت `{1}` دون `std::` ودون `using namespace std;`.",
        fix: [
          "أضف الملف الرأسي في الأعلى، مثل `#include <iostream>` لـ `cout`/`cin`/`endl`.",
          "اكتب `std::{1}`، أو أضف `using namespace std;` بعد أسطر include.",
          "تأكد أن الملف محفوظ بامتداد `.cpp` (لا `.c`) ويُترجم بـ `g++`.",
        ],
      },
    },
    example: {
      bad: 'int main() {\n    cout << "Hello";\n}',
      good: '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello";\n}',
    },
  },
  {
    id: 'cpp-not-declared',
    title: "'x' was not declared in this scope / undeclared identifier",
    languages: ['c', 'cpp'],
    patterns: [
      /'(\w+)' was not declared in this scope/,
      /'(\w+)' undeclared/,
      /error C2065: '(\w+)': undeclared identifier/,
      /use of undeclared identifier '(\w+)'/,
      /identifier "(\w+)" is undefined/,
    ],
    text: {
      english: {
        meaning: "The compiler does not know any variable or function named `{1}` at this point.",
        cause: "Spelling or capital-letter mistake, using `{1}` before declaring it, using it outside the `{ }` block where it was declared, or calling a function that is defined below `main` without a prototype.",
        fix: [
          "Check the spelling and capital letters of `{1}`.",
          "Declare `{1}` before using it, e.g. `int {1} = 0;`.",
          "If it was declared inside a `{ }` block (like a loop), move the declaration outside.",
          "For functions defined after `main`, add a prototype above `main`, e.g. `int {1}(int x);`.",
        ],
      },
      urdu: {
        meaning: "اس جگہ پر compiler کسی `{1}` نام کے variable یا function کو نہیں جانتا۔",
        cause: "Spelling یا بڑے/چھوٹے حروف کی غلطی، `{1}` کو declare کرنے سے پہلے استعمال کرنا، اسے اس `{ }` block سے باہر استعمال کرنا جہاں وہ بنا تھا، یا `main` کے نیچے لکھا function بغیر prototype کے call کرنا۔",
        fix: [
          "`{1}` کی spelling اور بڑے/چھوٹے حروف چیک کریں۔",
          "استعمال سے پہلے `{1}` کو declare کریں، جیسے `int {1} = 0;`۔",
          "اگر یہ کسی `{ }` block (جیسے loop) کے اندر declare ہوا تھا تو declaration باہر لے آئیں۔",
          "`main` کے بعد لکھے functions کے لیے `main` سے اوپر prototype لکھیں، جیسے `int {1}(int x);`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Is jagah par compiler kisi `{1}` naam ke variable ya function ko nahi janta.",
        cause: "Spelling ya capital/small letters ki ghalti, `{1}` ko declare karne se pehle use karna, usay us `{ }` block se bahar use karna jahan wo bana tha, ya `main` ke neeche likha function bina prototype ke call karna.",
        fix: [
          "`{1}` ki spelling aur capital/small letters check karen.",
          "Use se pehle `{1}` ko declare karen, jaise `int {1} = 0;`.",
          "Agar ye kisi `{ }` block (jaise loop) ke andar declare hua tha to declaration bahar le ayen.",
          "`main` ke baad likhe functions ke liye `main` se upar prototype likhen, jaise `int {1}(int x);`.",
        ],
      },
      hindi: {
        meaning: "इस जगह पर compiler किसी `{1}` नाम के variable या function को नहीं जानता।",
        cause: "Spelling या बड़े/छोटे अक्षरों की ग़लती, `{1}` को declare करने से पहले इस्तेमाल करना, उसे उस `{ }` block से बाहर इस्तेमाल करना जहाँ वह बना था, या `main` के नीचे लिखा function बिना prototype के call करना।",
        fix: [
          "`{1}` की spelling और बड़े/छोटे अक्षर जाँचें।",
          "इस्तेमाल से पहले `{1}` को declare करें, जैसे `int {1} = 0;`।",
          "अगर यह किसी `{ }` block (जैसे loop) के अंदर declare हुआ था तो declaration बाहर ले आएँ।",
          "`main` के बाद लिखे functions के लिए `main` से ऊपर prototype लिखें, जैसे `int {1}(int x);`।",
        ],
      },
      arabic: {
        meaning: "لا يعرف المترجم في هذا الموضع أي متغير أو دالة باسم `{1}`.",
        cause: "خطأ في الكتابة أو حالة الأحرف، أو استخدام `{1}` قبل التصريح عنه، أو استخدامه خارج كتلة `{ }` التي صُرّح فيها، أو استدعاء دالة معرّفة بعد `main` دون نموذج أولي (prototype).",
        fix: [
          "تحقق من كتابة `{1}` وحالة أحرفه.",
          "صرّح عن `{1}` قبل استخدامه، مثل `int {1} = 0;`.",
          "إذا صُرّح عنه داخل كتلة `{ }` (مثل حلقة) فانقل التصريح إلى خارجها.",
          "للدوال المعرّفة بعد `main` أضف نموذجًا أوليًا فوق `main`، مثل `int {1}(int x);`.",
        ],
      },
    },
  },
  {
    id: 'cpp-expected-semicolon',
    title: "expected ';' before ...",
    languages: ['c', 'cpp'],
    patterns: [/expected (?:a )?';'/, /error C2143: syntax error: missing ';'/],
    text: {
      english: {
        meaning: "The compiler expected a semicolon `;` to end a statement.",
        cause: "A `;` is missing at the end of the previous line (the compiler often notices only on the next line), or after a `class`/`struct` closing `}`.",
        fix: [
          "Add `;` at the end of the line just before the one in the error.",
          "A `class` or `struct` definition must end with `};`.",
          "Lines like `if (...)`, `for (...)` and `#include` do not take `;`.",
        ],
      },
      urdu: {
        meaning: "Compiler کو statement ختم کرنے کے لیے semicolon `;` کی توقع تھی۔",
        cause: "پچھلی لائن کے آخر میں `;` رہ گیا ہے (compiler اکثر اگلی لائن پر جا کر پکڑتا ہے)، یا `class`/`struct` کے بند ہونے والے `}` کے بعد۔",
        fix: [
          "Error والی لائن سے پہلے والی لائن کے آخر میں `;` لگائیں۔",
          "`class` یا `struct` کی تعریف `};` پر ختم ہونی چاہیے۔",
          "`if (...)`، `for (...)` اور `#include` جیسی لائنوں پر `;` نہیں لگتا۔",
        ],
      },
      'roman-urdu': {
        meaning: "Compiler ko statement khatam karne ke liye semicolon `;` ki tawaqqo thi.",
        cause: "Pichli line ke end mein `;` reh gaya hai (compiler aksar agli line par ja kar pakarta hai), ya `class`/`struct` ke closing `}` ke baad.",
        fix: [
          "Error wali line se pehle wali line ke end mein `;` lagayen.",
          "`class` ya `struct` ki definition `};` par khatam honi chahiye.",
          "`if (...)`, `for (...)` aur `#include` jaisi lines par `;` nahi lagta.",
        ],
      },
      hindi: {
        meaning: "Compiler को statement ख़त्म करने के लिए semicolon `;` की उम्मीद थी।",
        cause: "पिछली लाइन के आख़िर में `;` छूट गया है (compiler अक्सर अगली लाइन पर जाकर पकड़ता है), या `class`/`struct` के बंद होने वाले `}` के बाद।",
        fix: [
          "Error वाली लाइन से पहले वाली लाइन के आख़िर में `;` लगाएँ।",
          "`class` या `struct` की परिभाषा `};` पर ख़त्म होनी चाहिए।",
          "`if (...)`, `for (...)` और `#include` जैसी लाइनों पर `;` नहीं लगता।",
        ],
      },
      arabic: {
        meaning: "كان المترجم يتوقع فاصلة منقوطة `;` لإنهاء الجملة البرمجية.",
        cause: "الـ `;` ناقصة في نهاية السطر السابق (وغالبًا لا يلاحظها المترجم إلا في السطر التالي)، أو بعد `}` الختامي لـ `class`/`struct`.",
        fix: [
          "أضف `;` في نهاية السطر الذي يسبق السطر المذكور في الخطأ.",
          "تعريف `class` أو `struct` يجب أن ينتهي بـ `};`.",
          "أسطر مثل `if (...)` و`for (...)` و`#include` لا تأخذ `;`.",
        ],
      },
    },
    example: {
      bad: 'int x = 5\ncout << x;',
      good: 'int x = 5;\ncout << x;',
    },
  },
  {
    id: 'cpp-no-main',
    title: 'undefined reference to `main` / `WinMain`',
    languages: ['c', 'cpp'],
    patterns: [
      /undefined reference to `(?:main|WinMain)(?:@\d+)?'/,
      /unresolved external symbol _?(?:main|WinMain(?:@\d+)?) referenced/,
    ],
    text: {
      english: {
        meaning: "The linker could not find a `main` function, which is where every C/C++ program starts.",
        cause: "The file was not saved before compiling (very common in VS Code), `main` is misspelled (e.g. `Main`), or you compiled a file that has no `main`.",
        fix: [
          "Save the file (Ctrl+S) and compile again. Turn on `File > Auto Save` to avoid this.",
          "Make sure you have exactly `int main()` (lowercase).",
          "Compile the file that contains `main`, together with your other `.cpp` files.",
        ],
      },
      urdu: {
        meaning: "Linker کو `main` function نہیں ملا، جہاں سے ہر C/C++ پروگرام شروع ہوتا ہے۔",
        cause: "Compile سے پہلے فائل save نہیں ہوئی (VS Code میں بہت عام)، `main` کی spelling غلط ہے (جیسے `Main`)، یا آپ نے ایسی فائل compile کی جس میں `main` ہے ہی نہیں۔",
        fix: [
          "فائل save کریں (Ctrl+S) اور دوبارہ compile کریں۔ اس سے بچنے کے لیے `File > Auto Save` آن کر دیں۔",
          "یقینی بنائیں کہ بالکل `int main()` لکھا ہو (چھوٹے حروف میں)۔",
          "وہ فائل compile کریں جس میں `main` ہے، اپنی باقی `.cpp` فائلوں کے ساتھ۔",
        ],
      },
      'roman-urdu': {
        meaning: "Linker ko `main` function nahi mila, jahan se har C/C++ program shuru hota hai.",
        cause: "Compile se pehle file save nahi hui (VS Code mein bohat common), `main` ki spelling ghalat hai (jaise `Main`), ya aap ne aisi file compile ki jis mein `main` hai hi nahi.",
        fix: [
          "File save karen (Ctrl+S) aur dobara compile karen. Is se bachne ke liye `File > Auto Save` on kar den.",
          "Ensure karen ke bilkul `int main()` likha ho (small letters mein).",
          "Wo file compile karen jis mein `main` hai, apni baaqi `.cpp` files ke sath.",
        ],
      },
      hindi: {
        meaning: "Linker को `main` function नहीं मिला, जहाँ से हर C/C++ प्रोग्राम शुरू होता है।",
        cause: "Compile से पहले फ़ाइल save नहीं हुई (VS Code में बहुत आम), `main` की spelling ग़लत है (जैसे `Main`), या आपने ऐसी फ़ाइल compile की जिसमें `main` है ही नहीं।",
        fix: [
          "फ़ाइल save करें (Ctrl+S) और दोबारा compile करें। इससे बचने के लिए `File > Auto Save` चालू कर दें।",
          "पक्का करें कि बिल्कुल `int main()` लिखा हो (छोटे अक्षरों में)।",
          "वह फ़ाइल compile करें जिसमें `main` है, अपनी बाक़ी `.cpp` फ़ाइलों के साथ।",
        ],
      },
      arabic: {
        meaning: "لم يجد الرابط (linker) الدالة `main`، وهي نقطة بداية كل برنامج C/C++.",
        cause: "لم يُحفظ الملف قبل الترجمة (شائع جدًا في VS Code)، أو أن `main` مكتوبة خطأً (مثل `Main`)، أو أنك ترجمت ملفًا لا يحتوي على `main`.",
        fix: [
          "احفظ الملف (Ctrl+S) وترجم مجددًا، وفعّل `File > Auto Save` لتجنب ذلك.",
          "تأكد أنك كتبت `int main()` بالضبط (بأحرف صغيرة).",
          "ترجم الملف الذي يحتوي `main` مع بقية ملفات `.cpp`.",
        ],
      },
    },
  },
  {
    id: 'cpp-undefined-reference',
    title: 'undefined reference to ... / LNK2019 unresolved external symbol',
    languages: ['c', 'cpp'],
    patterns: [
      /undefined reference to `([^'`\n]+)'/,
      /unresolved external symbol "([^"\n]+)"/,
      /unresolved external symbol (\S+)/,
    ],
    text: {
      english: {
        meaning: "The code compiled, but the linker could not find the body (definition) of `{1}`.",
        cause: "The function is declared but never defined, the `.cpp` file that defines it was not compiled together with `main`, the signature differs between declaration and definition, or a needed library was not linked (e.g. `-lm`).",
        fix: [
          "Make sure `{1}` has a body `{ ... }` somewhere, with exactly the same name and parameter types.",
          "Compile all source files together: `g++ main.cpp other.cpp -o app` (or add them to your `tasks.json`).",
          "For class methods defined outside the class, write `ClassName::method`.",
          "If it is a library function, link the library (e.g. add `-lm` for math in C).",
        ],
      },
      urdu: {
        meaning: "کوڈ compile ہو گیا، مگر linker کو `{1}` کا body (تعریف) نہیں ملا۔",
        cause: "Function کو declare تو کیا گیا مگر define نہیں کیا، جس `.cpp` فائل میں تعریف ہے وہ `main` کے ساتھ compile نہیں ہوئی، declaration اور definition کے parameters مختلف ہیں، یا ضروری library link نہیں ہوئی (جیسے `-lm`)۔",
        fix: [
          "یقینی بنائیں کہ `{1}` کا body `{ ... }` کہیں موجود ہو، بالکل اسی نام اور parameter types کے ساتھ۔",
          "تمام فائلیں ایک ساتھ compile کریں: `g++ main.cpp other.cpp -o app` (یا انہیں `tasks.json` میں شامل کریں)۔",
          "Class سے باہر define کیے گئے methods کے ساتھ `ClassName::method` لکھیں۔",
          "اگر یہ library کا function ہے تو library link کریں (جیسے C میں math کے لیے `-lm`)۔",
        ],
      },
      'roman-urdu': {
        meaning: "Code compile ho gaya, lekin linker ko `{1}` ki body (definition) nahi mili.",
        cause: "Function ko declare to kiya gaya lekin define nahi kiya, jis `.cpp` file mein definition hai wo `main` ke sath compile nahi hui, declaration aur definition ke parameters different hain, ya zaroori library link nahi hui (jaise `-lm`).",
        fix: [
          "Ensure karen ke `{1}` ki body `{ ... }` kahin maujood ho, bilkul usi naam aur parameter types ke sath.",
          "Saari files aik sath compile karen: `g++ main.cpp other.cpp -o app` (ya inhein `tasks.json` mein add karen).",
          "Class se bahar define kiye gaye methods ke sath `ClassName::method` likhen.",
          "Agar ye library ka function hai to library link karen (jaise C mein math ke liye `-lm`).",
        ],
      },
      hindi: {
        meaning: "कोड compile हो गया, लेकिन linker को `{1}` का body (परिभाषा) नहीं मिला।",
        cause: "Function को declare तो किया गया लेकिन define नहीं किया, जिस `.cpp` फ़ाइल में परिभाषा है वह `main` के साथ compile नहीं हुई, declaration और definition के parameters अलग हैं, या ज़रूरी library link नहीं हुई (जैसे `-lm`)।",
        fix: [
          "पक्का करें कि `{1}` का body `{ ... }` कहीं मौजूद हो, बिल्कुल उसी नाम और parameter types के साथ।",
          "सारी फ़ाइलें एक साथ compile करें: `g++ main.cpp other.cpp -o app` (या उन्हें `tasks.json` में जोड़ें)।",
          "Class से बाहर define किए गए methods के साथ `ClassName::method` लिखें।",
          "अगर यह library का function है तो library link करें (जैसे C में math के लिए `-lm`)।",
        ],
      },
      arabic: {
        meaning: "تمت ترجمة الكود، لكن الرابط (linker) لم يجد جسم (تعريف) `{1}`.",
        cause: "صُرّح عن الدالة دون تعريفها، أو أن ملف `.cpp` الذي يعرّفها لم يُترجم مع `main`، أو أن التوقيع يختلف بين التصريح والتعريف، أو أن مكتبة لازمة لم تُربط (مثل `-lm`).",
        fix: [
          "تأكد أن لـ `{1}` جسمًا `{ ... }` في مكان ما، بالاسم وأنواع المعاملات نفسها تمامًا.",
          "ترجم كل الملفات معًا: `g++ main.cpp other.cpp -o app` (أو أضفها إلى `tasks.json`).",
          "للدوال المعرّفة خارج الـ class اكتب `ClassName::method`.",
          "إذا كانت دالة من مكتبة فاربط المكتبة (مثل `-lm` للرياضيات في C).",
        ],
      },
    },
  },
  {
    id: 'cpp-no-matching-function',
    title: 'no matching function for call to',
    languages: ['c', 'cpp'],
    patterns: [
      /no matching function for call to '([^'(\n]+)/,
      /no instance of (?:overloaded )?function "([^"\n]+)" matches the argument list/,
      /error C2660: '([^'\n]+)': function does not take/,
    ],
    text: {
      english: {
        meaning: "You called `{1}`, but no version of it accepts the arguments you passed.",
        cause: "Wrong number of arguments, wrong argument types (e.g. a `string` where an `int` is expected), or a missing constructor for the way you create an object.",
        fix: [
          "Read the `candidate:` / `note:` lines under the error; they show what `{1}` expects.",
          "Pass the same number and types of arguments as the declaration.",
          "For objects, add a constructor that matches, e.g. `Student(string n, int a)`.",
        ],
      },
      urdu: {
        meaning: "آپ نے `{1}` کو call کیا، مگر اس کا کوئی version وہ arguments قبول نہیں کرتا جو آپ نے دیے۔",
        cause: "Arguments کی تعداد غلط ہے، ان کی types غلط ہیں (جیسے `int` کی جگہ `string`)، یا object بنانے کے طریقے کے مطابق constructor موجود نہیں۔",
        fix: [
          "Error کے نیچے `candidate:` / `note:` والی لائنیں پڑھیں؛ وہ بتاتی ہیں کہ `{1}` کیا مانگتا ہے۔",
          "Declaration کے مطابق اتنے ہی اور اسی type کے arguments دیں۔",
          "Objects کے لیے مطابقت رکھنے والا constructor بنائیں، جیسے `Student(string n, int a)`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne `{1}` ko call kiya, lekin iska koi version wo arguments accept nahi karta jo aap ne diye.",
        cause: "Arguments ki ginti ghalat hai, unki types ghalat hain (jaise `int` ki jagah `string`), ya object banane ke tareeqe ke mutabiq constructor maujood nahi.",
        fix: [
          "Error ke neeche `candidate:` / `note:` wali lines parhen; wo batati hain ke `{1}` kya maangta hai.",
          "Declaration ke mutabiq utne hi aur usi type ke arguments den.",
          "Objects ke liye matching constructor banayen, jaise `Student(string n, int a)`.",
        ],
      },
      hindi: {
        meaning: "आपने `{1}` को call किया, लेकिन उसका कोई version वे arguments स्वीकार नहीं करता जो आपने दिए।",
        cause: "Arguments की गिनती ग़लत है, उनकी types ग़लत हैं (जैसे `int` की जगह `string`), या object बनाने के तरीक़े से मेल खाता constructor मौजूद नहीं है।",
        fix: [
          "Error के नीचे `candidate:` / `note:` वाली लाइनें पढ़ें; वे बताती हैं कि `{1}` क्या माँगता है।",
          "Declaration के हिसाब से उतने ही और उसी type के arguments दें।",
          "Objects के लिए मेल खाता constructor बनाएँ, जैसे `Student(string n, int a)`।",
        ],
      },
      arabic: {
        meaning: "استدعيت `{1}`، لكن لا توجد نسخة منها تقبل الوسائط التي مرّرتها.",
        cause: "عدد الوسائط خاطئ، أو أنواعها خاطئة (مثل `string` مكان `int`)، أو لا يوجد constructor يطابق طريقة إنشائك للكائن.",
        fix: [
          "اقرأ أسطر `candidate:` / `note:` أسفل الخطأ، فهي تبيّن ما تتوقعه `{1}`.",
          "مرّر عدد الوسائط وأنواعها كما في التصريح.",
          "للكائنات أضف constructor مطابقًا، مثل `Student(string n, int a)`.",
        ],
      },
    },
  },
  {
    id: 'cpp-invalid-conversion',
    title: 'invalid conversion / cannot convert',
    languages: ['c', 'cpp'],
    patterns: [
      /invalid conversion from '([^'\n]+)' to '([^'\n]+)'/,
      /cannot convert '([^'\n]+)'(?: \{aka [^}\n]*\})? to '([^'\n]+)'/,
      /a value of type "([^"\n]+)" cannot be (?:used to initialize|assigned to) an entity of type "([^"\n]+)"/,
    ],
    text: {
      english: {
        meaning: "You used a `{1}` where a `{2}` is needed, and C++ will not convert it automatically.",
        cause: "Common cases: a `string` given to an `int`, a single value given where a pointer is expected (or the other way round), or a `const char*` text used as a `char`.",
        fix: [
          "Make the variable's type match the value, or convert explicitly: `std::stoi(s)` (text → int), `std::to_string(n)` (int → text).",
          "Use `'a'` (single quotes) for one `char` and `\"abc\"` (double quotes) for text.",
          "For pointers, use `&x` to get an address and `*p` to get the value.",
        ],
      },
      urdu: {
        meaning: "آپ نے وہاں `{1}` استعمال کیا جہاں `{2}` چاہیے، اور C++ اسے خود بخود نہیں بدلے گا۔",
        cause: "عام صورتیں: `int` کو `string` دینا، جہاں pointer چاہیے وہاں سادہ value دینا (یا اس کا الٹ)، یا `const char*` text کو `char` کی طرح استعمال کرنا۔",
        fix: [
          "Variable کی type value کے مطابق کریں، یا خود بدلیں: `std::stoi(s)` (text → int)، `std::to_string(n)` (int → text)۔",
          "ایک `char` کے لیے `'a'` (single quotes) اور text کے لیے `\"abc\"` (double quotes) استعمال کریں۔",
          "Pointers میں address لینے کے لیے `&x` اور value لینے کے لیے `*p` لکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne wahan `{1}` use kiya jahan `{2}` chahiye, aur C++ isay khud ba khud convert nahi karega.",
        cause: "Common cases: `int` ko `string` dena, jahan pointer chahiye wahan simple value dena (ya iska ulta), ya `const char*` text ko `char` ki tarah use karna.",
        fix: [
          "Variable ki type value ke mutabiq karen, ya khud convert karen: `std::stoi(s)` (text → int), `std::to_string(n)` (int → text).",
          "Aik `char` ke liye `'a'` (single quotes) aur text ke liye `\"abc\"` (double quotes) use karen.",
          "Pointers mein address lene ke liye `&x` aur value lene ke liye `*p` likhen.",
        ],
      },
      hindi: {
        meaning: "आपने वहाँ `{1}` इस्तेमाल किया जहाँ `{2}` चाहिए, और C++ उसे अपने-आप नहीं बदलेगा।",
        cause: "आम मामले: `int` को `string` देना, जहाँ pointer चाहिए वहाँ सादा value देना (या इसका उल्टा), या `const char*` text को `char` की तरह इस्तेमाल करना।",
        fix: [
          "Variable की type value के हिसाब से करें, या ख़ुद बदलें: `std::stoi(s)` (text → int), `std::to_string(n)` (int → text)।",
          "एक `char` के लिए `'a'` (single quotes) और text के लिए `\"abc\"` (double quotes) इस्तेमाल करें।",
          "Pointers में address लेने के लिए `&x` और value लेने के लिए `*p` लिखें।",
        ],
      },
      arabic: {
        meaning: "استخدمت قيمة من نوع `{1}` في مكان يحتاج إلى `{2}`، ولن تحوّلها C++ تلقائيًا.",
        cause: "حالات شائعة: إعطاء `string` لمتغير `int`، أو إعطاء قيمة عادية حيث يُتوقع مؤشر (أو العكس)، أو استخدام نص `const char*` كأنه `char`.",
        fix: [
          "اجعل نوع المتغير مطابقًا للقيمة، أو حوّل صراحةً: `std::stoi(s)` (نص ← int)، و`std::to_string(n)` (int ← نص).",
          "استخدم `'a'` (علامة مفردة) لحرف `char` واحد، و`\"abc\"` (علامتان مزدوجتان) للنص.",
          "في المؤشرات استخدم `&x` لأخذ العنوان و`*p` لأخذ القيمة.",
        ],
      },
    },
  },
  {
    id: 'cpp-header-not-found',
    title: 'fatal error: x.h: No such file or directory',
    languages: ['c', 'cpp'],
    patterns: [
      /fatal error: ([\w./\\+-]+): No such file or directory/,
      /fatal error: '([^'\n]+)' file not found/,
      /fatal error C1083: Cannot open include file: '([^'\n]+)'/,
      /cannot open source file "([^"\n]+)"/,
    ],
    text: {
      english: {
        meaning: "The compiler could not find the header file `{1}` named in an `#include`.",
        cause: "The name is misspelled, it is an old/non-standard header (like `conio.h` or `iostream.h`), your own header is in a different folder, or the compiler/IntelliSense include path is not set up.",
        fix: [
          "Check the spelling. Standard C++ headers have no `.h`: use `<iostream>`, not `<iostream.h>`.",
          "Use `\"myfile.h\"` (quotes) for your own headers and keep them next to the `.cpp`, or add `-I folder` when compiling.",
          "Avoid `conio.h`/`graphics.h` (old Turbo C); they are not available in modern compilers.",
          "For the IntelliSense squiggle, set `includePath` via `C/C++: Edit Configurations (UI)`.",
        ],
      },
      urdu: {
        meaning: "Compiler کو `#include` میں لکھی گئی header فائل `{1}` نہیں ملی۔",
        cause: "نام کی spelling غلط ہے، یہ پرانا/غیر معیاری header ہے (جیسے `conio.h` یا `iostream.h`)، آپ کی اپنی header کسی دوسرے folder میں ہے، یا compiler/IntelliSense کا include path سیٹ نہیں۔",
        fix: [
          "Spelling چیک کریں۔ Standard C++ headers میں `.h` نہیں ہوتا: `<iostream.h>` نہیں، `<iostream>` لکھیں۔",
          "اپنی headers کے لیے `\"myfile.h\"` (quotes) استعمال کریں اور انہیں `.cpp` کے ساتھ رکھیں، یا compile کرتے وقت `-I folder` دیں۔",
          "`conio.h`/`graphics.h` (پرانا Turbo C) سے بچیں؛ یہ جدید compilers میں دستیاب نہیں۔",
          "IntelliSense کی لال لکیر کے لیے `C/C++: Edit Configurations (UI)` سے `includePath` سیٹ کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Compiler ko `#include` mein likhi gayi header file `{1}` nahi mili.",
        cause: "Naam ki spelling ghalat hai, ye purana/non-standard header hai (jaise `conio.h` ya `iostream.h`), aap ki apni header kisi doosre folder mein hai, ya compiler/IntelliSense ka include path set nahi.",
        fix: [
          "Spelling check karen. Standard C++ headers mein `.h` nahi hota: `<iostream.h>` nahi, `<iostream>` likhen.",
          "Apni headers ke liye `\"myfile.h\"` (quotes) use karen aur inhein `.cpp` ke sath rakhen, ya compile karte waqt `-I folder` den.",
          "`conio.h`/`graphics.h` (purana Turbo C) se bachen; ye modern compilers mein available nahi.",
          "IntelliSense ki laal line ke liye `C/C++: Edit Configurations (UI)` se `includePath` set karen.",
        ],
      },
      hindi: {
        meaning: "Compiler को `#include` में लिखी header फ़ाइल `{1}` नहीं मिली।",
        cause: "नाम की spelling ग़लत है, यह पुराना/ग़ैर-मानक header है (जैसे `conio.h` या `iostream.h`), आपकी अपनी header किसी दूसरे folder में है, या compiler/IntelliSense का include path सेट नहीं है।",
        fix: [
          "Spelling जाँचें। Standard C++ headers में `.h` नहीं होता: `<iostream.h>` नहीं, `<iostream>` लिखें।",
          "अपनी headers के लिए `\"myfile.h\"` (quotes) इस्तेमाल करें और उन्हें `.cpp` के साथ रखें, या compile करते समय `-I folder` दें।",
          "`conio.h`/`graphics.h` (पुराना Turbo C) से बचें; ये आधुनिक compilers में उपलब्ध नहीं हैं।",
          "IntelliSense की लाल लकीर के लिए `C/C++: Edit Configurations (UI)` से `includePath` सेट करें।",
        ],
      },
      arabic: {
        meaning: "لم يجد المترجم الملف الرأسي `{1}` المذكور في `#include`.",
        cause: "الاسم مكتوب خطأً، أو أنه ملف قديم/غير قياسي (مثل `conio.h` أو `iostream.h`)، أو أن ملفك الرأسي في مجلد آخر، أو أن مسار include غير مضبوط للمترجم أو IntelliSense.",
        fix: [
          "تحقق من الكتابة. ملفات C++ القياسية بلا `.h`: اكتب `<iostream>` لا `<iostream.h>`.",
          "استخدم `\"myfile.h\"` (علامتا اقتباس) لملفاتك وضعها بجانب ملف `.cpp`، أو أضف `-I folder` عند الترجمة.",
          "تجنّب `conio.h`/`graphics.h` (من Turbo C القديم)، فهي غير متوفرة في المترجمات الحديثة.",
          "لخط IntelliSense الأحمر اضبط `includePath` عبر `C/C++: Edit Configurations (UI)`.",
        ],
      },
    },
  },
  {
    id: 'cpp-control-reaches-end',
    title: 'control reaches end of non-void function',
    languages: ['c', 'cpp'],
    patterns: [
      /control reaches end of non-void function/,
      /non-void function does not return a value/,
      /not all control paths return a value/,
    ],
    text: {
      english: {
        meaning: "A function that should return a value can finish without returning one.",
        cause: "The `return` is only inside an `if`/`else if` or a loop, so some paths have none. The result is then garbage, which can cause strange bugs or crashes.",
        fix: [
          "Add a final `return` at the end of the function.",
          "Or make sure every `if`/`else` branch returns a value.",
          "If the function returns nothing, declare it `void`.",
        ],
      },
      urdu: {
        meaning: "جس function کو value واپس کرنی چاہیے، وہ بغیر value واپس کیے ختم ہو سکتا ہے۔",
        cause: "`return` صرف کسی `if`/`else if` یا loop کے اندر ہے، اس لیے کچھ راستوں میں نہیں۔ ایسے میں نتیجہ کچرا (garbage) ہوتا ہے جس سے عجیب bugs یا crash ہو سکتے ہیں۔",
        fix: [
          "Function کے آخر میں ایک آخری `return` لکھیں۔",
          "یا یقینی بنائیں کہ ہر `if`/`else` حصہ value واپس کرے۔",
          "اگر function کچھ واپس نہیں کرتا تو اسے `void` بنائیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Jis function ko value return karni chahiye, wo bina value return kiye khatam ho sakta hai.",
        cause: "`return` sirf kisi `if`/`else if` ya loop ke andar hai, is liye kuch raston mein nahi. Aise mein result garbage hota hai jis se ajeeb bugs ya crash ho sakte hain.",
        fix: [
          "Function ke end mein aik final `return` likhen.",
          "Ya ensure karen ke har `if`/`else` part value return kare.",
          "Agar function kuch return nahi karta to usay `void` banayen.",
        ],
      },
      hindi: {
        meaning: "जिस function को value लौटानी चाहिए, वह बिना value लौटाए ख़त्म हो सकता है।",
        cause: "`return` सिर्फ़ किसी `if`/`else if` या loop के अंदर है, इसलिए कुछ रास्तों में नहीं है। ऐसे में नतीजा कचरा (garbage) होता है जिससे अजीब bugs या crash हो सकते हैं।",
        fix: [
          "Function के आख़िर में एक आख़िरी `return` लिखें।",
          "या पक्का करें कि हर `if`/`else` हिस्सा value लौटाए।",
          "अगर function कुछ नहीं लौटाता तो उसे `void` बनाएँ।",
        ],
      },
      arabic: {
        meaning: "دالة يُفترض أن تُرجع قيمة قد تنتهي دون إرجاع أي قيمة.",
        cause: "الـ `return` موجود داخل `if`/`else if` أو حلقة فقط، فبعض المسارات تخلو منه، وتكون النتيجة قيمة عشوائية قد تسبب أخطاء غريبة أو انهيارًا.",
        fix: [
          "أضف `return` أخيرًا في نهاية الدالة.",
          "أو تأكد أن كل فرع `if`/`else` يُرجع قيمة.",
          "إذا كانت الدالة لا تُرجع شيئًا فاجعلها `void`.",
        ],
      },
    },
    example: {
      bad: 'int maxOf(int a, int b) {\n    if (a > b) return a;\n}',
      good: 'int maxOf(int a, int b) {\n    if (a > b) return a;\n    return b;\n}',
    },
  },
  {
    id: 'cpp-array-bounds',
    title: 'array subscript is out of bounds',
    languages: ['c', 'cpp'],
    patterns: [
      /array subscript [^\n]{0,60}?(?:above|below|outside) (?:the )?array bounds/,
      /array index -?\d+ is past the end of the array/,
      /index -?\d+ is out of bounds for type/,
      /std::out_of_range/,
      /AddressSanitizer: (?:stack|heap|global)-buffer-overflow/,
    ],
    text: {
      english: {
        meaning: "Your code uses an array or vector position outside its valid range.",
        cause: "Positions go from `0` to `size - 1`. Common causes: `i <= size` in a loop, using `arr[size]`, or `vector::at()` with a bad index (this throws `std::out_of_range`).",
        fix: [
          "Use `i < size` in loops, not `i <= size`.",
          "The last element is `arr[size - 1]` (or `v.back()` for a vector).",
          "Check the index before use: `if (i >= 0 && i < (int)v.size())`.",
        ],
      },
      urdu: {
        meaning: "آپ کا کوڈ array یا vector کی ایسی جگہ استعمال کر رہا ہے جو اس کی حد سے باہر ہے۔",
        cause: "جگہیں `0` سے `size - 1` تک ہوتی ہیں۔ عام وجوہات: loop میں `i <= size`، `arr[size]` استعمال کرنا، یا `vector::at()` کو غلط index دینا (جس سے `std::out_of_range` آتا ہے)۔",
        fix: [
          "Loops میں `i <= size` نہیں، `i < size` لکھیں۔",
          "آخری element `arr[size - 1]` ہے (vector کے لیے `v.back()`)۔",
          "استعمال سے پہلے index چیک کریں: `if (i >= 0 && i < (int)v.size())`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ka code array ya vector ki aisi position use kar raha hai jo uski had se bahar hai.",
        cause: "Positions `0` se `size - 1` tak hoti hain. Aam wajah: loop mein `i <= size`, `arr[size]` use karna, ya `vector::at()` ko ghalat index dena (jis se `std::out_of_range` aata hai).",
        fix: [
          "Loops mein `i <= size` nahi, `i < size` likhen.",
          "Aakhri element `arr[size - 1]` hai (vector ke liye `v.back()`).",
          "Use se pehle index check karen: `if (i >= 0 && i < (int)v.size())`.",
        ],
      },
      hindi: {
        meaning: "आपका कोड array या vector की ऐसी जगह इस्तेमाल कर रहा है जो उसकी सीमा से बाहर है।",
        cause: "जगहें `0` से `size - 1` तक होती हैं। आम वजहें: loop में `i <= size`, `arr[size]` इस्तेमाल करना, या `vector::at()` को ग़लत index देना (जिससे `std::out_of_range` आता है)।",
        fix: [
          "Loops में `i <= size` नहीं, `i < size` लिखें।",
          "आख़िरी element `arr[size - 1]` है (vector के लिए `v.back()`)।",
          "इस्तेमाल से पहले index जाँचें: `if (i >= 0 && i < (int)v.size())`।",
        ],
      },
      arabic: {
        meaning: "يستخدم الكود موضعًا في مصفوفة أو vector خارج نطاقه الصحيح.",
        cause: "المواضع من `0` إلى `size - 1`. أسباب شائعة: `i <= size` في الحلقة، أو استخدام `arr[size]`، أو `vector::at()` بفهرس خاطئ (فيُرمى `std::out_of_range`).",
        fix: [
          "استخدم `i < size` في الحلقات لا `i <= size`.",
          "آخر عنصر هو `arr[size - 1]` (أو `v.back()` في vector).",
          "تحقق من الفهرس قبل استخدامه: `if (i >= 0 && i < (int)v.size())`.",
        ],
      },
    },
  },
  {
    id: 'cpp-compiler-not-recognized',
    title: "'g++' / 'gcc' is not recognized",
    languages: ['c', 'cpp'],
    patterns: [
      /'(g\+\+|gcc|clang\+\+|clang|cl)(?:\.exe)?' is not recognized as an internal or external command/i,
      /The term '(g\+\+|gcc|clang\+\+|clang|cl)(?:\.exe)?' is not recognized/i,
      /(g\+\+|gcc|clang\+\+|clang): command not found/i,
    ],
    text: {
      english: {
        meaning: "Your terminal cannot find the `{1}` compiler program.",
        cause: "VS Code is only an editor; the C/C++ compiler is a separate install. On Windows, MinGW-w64 (e.g. via MSYS2) is not installed, or its `bin` folder is not on PATH.",
        fix: [
          "Install MinGW-w64 (for example with MSYS2: `pacman -S mingw-w64-ucrt-x86_64-gcc`).",
          "Add its `bin` folder (e.g. `C:\\msys64\\ucrt64\\bin`) to the Windows `Path` environment variable.",
          "Close and reopen VS Code, then check with `g++ --version`.",
        ],
      },
      urdu: {
        meaning: "آپ کے terminal کو `{1}` compiler پروگرام نہیں مل رہا۔",
        cause: "VS Code صرف ایک editor ہے؛ C/C++ compiler الگ سے انسٹال کرنا پڑتا ہے۔ Windows پر MinGW-w64 (مثلاً MSYS2 کے ذریعے) انسٹال نہیں، یا اس کا `bin` folder PATH میں شامل نہیں۔",
        fix: [
          "MinGW-w64 انسٹال کریں (مثلاً MSYS2 میں: `pacman -S mingw-w64-ucrt-x86_64-gcc`)۔",
          "اس کا `bin` folder (جیسے `C:\\msys64\\ucrt64\\bin`) Windows کے `Path` environment variable میں شامل کریں۔",
          "VS Code بند کر کے دوبارہ کھولیں، پھر `g++ --version` سے چیک کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke terminal ko `{1}` compiler program nahi mil raha.",
        cause: "VS Code sirf aik editor hai; C/C++ compiler alag se install karna parta hai. Windows par MinGW-w64 (maslan MSYS2 ke zariye) install nahi, ya uska `bin` folder PATH mein shamil nahi.",
        fix: [
          "MinGW-w64 install karen (maslan MSYS2 mein: `pacman -S mingw-w64-ucrt-x86_64-gcc`).",
          "Uska `bin` folder (jaise `C:\\msys64\\ucrt64\\bin`) Windows ke `Path` environment variable mein add karen.",
          "VS Code band kar ke dobara kholen, phir `g++ --version` se check karen.",
        ],
      },
      hindi: {
        meaning: "आपके terminal को `{1}` compiler प्रोग्राम नहीं मिल रहा।",
        cause: "VS Code सिर्फ़ एक editor है; C/C++ compiler अलग से install करना पड़ता है। Windows पर MinGW-w64 (जैसे MSYS2 के ज़रिए) install नहीं है, या उसका `bin` folder PATH में शामिल नहीं है।",
        fix: [
          "MinGW-w64 install करें (जैसे MSYS2 में: `pacman -S mingw-w64-ucrt-x86_64-gcc`)।",
          "उसका `bin` folder (जैसे `C:\\msys64\\ucrt64\\bin`) Windows के `Path` environment variable में जोड़ें।",
          "VS Code बंद करके दोबारा खोलें, फिर `g++ --version` से जाँचें।",
        ],
      },
      arabic: {
        meaning: "لا تستطيع الطرفية العثور على برنامج المترجم `{1}`.",
        cause: "VS Code مجرد محرر، ومترجم C/C++ يُثبَّت بشكل منفصل. على Windows لم يُثبَّت MinGW-w64 (مثلًا عبر MSYS2)، أو أن مجلد `bin` الخاص به غير مضاف إلى PATH.",
        fix: [
          "ثبّت MinGW-w64 (مثلًا عبر MSYS2: `pacman -S mingw-w64-ucrt-x86_64-gcc`).",
          "أضف مجلد `bin` الخاص به (مثل `C:\\msys64\\ucrt64\\bin`) إلى متغير البيئة `Path` في Windows.",
          "أغلق VS Code وافتحه مجددًا، ثم تحقق بـ `g++ --version`.",
        ],
      },
    },
  },
];
