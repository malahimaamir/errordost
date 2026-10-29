import type { KbEntry } from '../types';

/**
 * Offline knowledge base: Java errors (javac compiler output, runtime
 * exceptions and Eclipse JDT / VS Code Java diagnostics).
 * Order matters: the first matching entry wins.
 */
export const JAVA_ENTRIES: KbEntry[] = [
  {
    id: 'java-npe-helpful',
    title: 'NullPointerException: Cannot invoke ... because ... is null',
    languages: ['java'],
    patterns: [/because "([^"\n]+)" is null/, /because the return value of "([^"\n]+)" is null/],
    text: {
      english: {
        meaning: "Java tried to use `{1}`, but it is `null` (it points to no object).",
        cause: "`{1}` was declared but never given an object with `new`, a method returned `null`, or an array/list element was never filled.",
        fix: [
          "Find where `{1}` gets its value and make sure it is created, e.g. `= new ...` or assigned before use.",
          "If `null` is possible, check first: `if ({1} != null) { ... }`.",
          "For a field, initialise it in the constructor or where it is declared.",
        ],
      },
      urdu: {
        meaning: "Java نے `{1}` کو استعمال کرنے کی کوشش کی، مگر وہ `null` ہے (یعنی کسی object کی طرف اشارہ نہیں کرتا)۔",
        cause: "`{1}` کو declare تو کیا گیا مگر `new` سے object نہیں دیا گیا، کسی method نے `null` واپس کیا، یا array/list کا وہ خانہ کبھی بھرا ہی نہیں گیا۔",
        fix: [
          "دیکھیں `{1}` کو value کہاں ملتی ہے اور یقینی بنائیں کہ استعمال سے پہلے وہ بن جائے، جیسے `= new ...`۔",
          "اگر `null` ہونا ممکن ہو تو پہلے چیک کریں: `if ({1} != null) { ... }`۔",
          "اگر یہ field ہے تو اسے constructor میں یا declare کرتے وقت ہی value دیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Java ne `{1}` ko use karne ki koshish ki, lekin wo `null` hai (yani kisi object ki taraf point nahi karta).",
        cause: "`{1}` ko declare to kiya gaya lekin `new` se object nahi diya gaya, kisi method ne `null` return kiya, ya array/list ka wo khana kabhi bhara hi nahi gaya.",
        fix: [
          "Dekhen `{1}` ko value kahan milti hai aur ensure karen ke use se pehle wo ban jaye, jaise `= new ...`.",
          "Agar `null` hona mumkin ho to pehle check karen: `if ({1} != null) { ... }`.",
          "Agar ye field hai to usay constructor mein ya declare karte waqt hi value den.",
        ],
      },
      hindi: {
        meaning: "Java ने `{1}` को इस्तेमाल करने की कोशिश की, लेकिन वह `null` है (यानी किसी object की तरफ़ इशारा नहीं करता)।",
        cause: "`{1}` को declare तो किया गया लेकिन `new` से object नहीं दिया गया, किसी method ने `null` लौटाया, या array/list का वह ख़ाना कभी भरा ही नहीं गया।",
        fix: [
          "देखें `{1}` को value कहाँ मिलती है और पक्का करें कि इस्तेमाल से पहले वह बन जाए, जैसे `= new ...`।",
          "अगर `null` होना मुमकिन हो तो पहले जाँचें: `if ({1} != null) { ... }`।",
          "अगर यह field है तो उसे constructor में या declare करते समय ही value दें।",
        ],
      },
      arabic: {
        meaning: "حاولت Java استخدام `{1}`، لكن قيمته `null` (لا يشير إلى أي كائن).",
        cause: "تم تعريف `{1}` لكن لم يُعطَ كائنًا بـ `new`، أو أن دالة أرجعت `null`، أو أن عنصر المصفوفة/القائمة لم يُملأ أبدًا.",
        fix: [
          "ابحث عن المكان الذي يأخذ فيه `{1}` قيمته وتأكد من إنشائه قبل استخدامه، مثل `= new ...`.",
          "إذا كانت القيمة `null` ممكنة فتحقق أولًا: `if ({1} != null) { ... }`.",
          "إذا كان حقلًا (field) فأعطه قيمة في الـ constructor أو عند تعريفه.",
        ],
      },
    },
    example: {
      bad: 'String name = null;\nSystem.out.println(name.length());',
      good: 'String name = "Ali";\nif (name != null) {\n    System.out.println(name.length());\n}',
    },
  },
  {
    id: 'java-npe',
    title: 'NullPointerException',
    languages: ['java'],
    patterns: [/NullPointerException/],
    text: {
      english: {
        meaning: "Your program used a variable that is `null` (it points to no object) as if it were a real object.",
        cause: "An object was declared but never created with `new`, a method returned `null`, or an array of objects was created but its elements were never filled.",
        fix: [
          "Look at the first `at ...` line of the stack trace: it shows the exact file and line.",
          "On that line, find the variable before the `.` and check where it gets its value.",
          "Create the object with `new` before using it, or add a check: `if (x != null)`.",
        ],
      },
      urdu: {
        meaning: "آپ کے پروگرام نے ایک ایسے variable کو اصل object کی طرح استعمال کیا جو `null` ہے (کسی object کی طرف اشارہ نہیں کرتا)۔",
        cause: "Object declare کیا گیا مگر `new` سے بنایا نہیں گیا، کسی method نے `null` واپس کیا، یا objects کا array بنا مگر اس کے خانے نہیں بھرے گئے۔",
        fix: [
          "Stack trace کی پہلی `at ...` والی لائن دیکھیں: وہ بالکل درست فائل اور لائن بتاتی ہے۔",
          "اس لائن پر `.` سے پہلے والا variable دیکھیں اور چیک کریں کہ اسے value کہاں سے ملتی ہے۔",
          "استعمال سے پہلے `new` سے object بنائیں، یا چیک لگائیں: `if (x != null)`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke program ne aik aise variable ko asal object ki tarah use kiya jo `null` hai (kisi object ki taraf point nahi karta).",
        cause: "Object declare kiya gaya lekin `new` se banaya nahi gaya, kisi method ne `null` return kiya, ya objects ka array bana lekin uske khane nahi bhare gaye.",
        fix: [
          "Stack trace ki pehli `at ...` wali line dekhen: wo bilkul sahi file aur line batati hai.",
          "Us line par `.` se pehle wala variable dekhen aur check karen ke usay value kahan se milti hai.",
          "Use se pehle `new` se object banayen, ya check lagayen: `if (x != null)`.",
        ],
      },
      hindi: {
        meaning: "आपके प्रोग्राम ने एक ऐसे variable को असली object की तरह इस्तेमाल किया जो `null` है (किसी object की तरफ़ इशारा नहीं करता)।",
        cause: "Object declare किया गया लेकिन `new` से बनाया नहीं गया, किसी method ने `null` लौटाया, या objects का array बना लेकिन उसके ख़ाने नहीं भरे गए।",
        fix: [
          "Stack trace की पहली `at ...` वाली लाइन देखें: वह बिल्कुल सही फ़ाइल और लाइन बताती है।",
          "उस लाइन पर `.` से पहले वाला variable देखें और जाँचें कि उसे value कहाँ से मिलती है।",
          "इस्तेमाल से पहले `new` से object बनाएँ, या जाँच लगाएँ: `if (x != null)`।",
        ],
      },
      arabic: {
        meaning: "استخدم برنامجك متغيرًا قيمته `null` (لا يشير إلى أي كائن) كأنه كائن حقيقي.",
        cause: "تم تعريف كائن دون إنشائه بـ `new`، أو أرجعت دالةٌ `null`، أو أُنشئت مصفوفة كائنات دون ملء عناصرها.",
        fix: [
          "انظر إلى أول سطر `at ...` في الـ stack trace، فهو يحدد الملف والسطر بدقة.",
          "في ذلك السطر حدّد المتغير الذي يسبق `.` وتحقق من مصدر قيمته.",
          "أنشئ الكائن بـ `new` قبل استخدامه، أو أضف شرطًا: `if (x != null)`.",
        ],
      },
    },
    example: {
      bad: 'Student s = null;\ns.getName();',
      good: 'Student s = new Student("Sara");\ns.getName();',
    },
  },
  {
    id: 'java-array-index',
    title: 'ArrayIndexOutOfBoundsException',
    languages: ['java'],
    patterns: [/ArrayIndexOutOfBoundsException:\s*(?:Index\s+)?(-?\d+)/],
    text: {
      english: {
        meaning: "Your code tried to use position `{1}` of an array, but that position does not exist.",
        cause: "Array positions go from `0` to `length - 1`. Usually a loop uses `<=` instead of `<`, or the index is negative or calculated wrongly.",
        fix: [
          "Loop with `for (int i = 0; i < arr.length; i++)` (use `<`, not `<=`).",
          "The last element is `arr[arr.length - 1]`.",
          "Print the index and `arr.length` just before this line to see the values.",
        ],
      },
      urdu: {
        meaning: "آپ کے کوڈ نے array کی جگہ `{1}` استعمال کرنے کی کوشش کی، مگر یہ جگہ موجود نہیں۔",
        cause: "Array کی جگہیں `0` سے `length - 1` تک ہوتی ہیں۔ عموماً loop میں `<` کی بجائے `<=` لکھا ہوتا ہے، یا index منفی ہے یا غلط حساب ہوا ہے۔",
        fix: [
          "Loop ایسے لکھیں: `for (int i = 0; i < arr.length; i++)` (`<=` نہیں، `<`)۔",
          "آخری element `arr[arr.length - 1]` ہوتا ہے۔",
          "اس لائن سے پہلے index اور `arr.length` print کر کے دیکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke code ne array ki position `{1}` use karne ki koshish ki, lekin ye position maujood nahi.",
        cause: "Array ki positions `0` se `length - 1` tak hoti hain. Aam tor par loop mein `<` ki bajaye `<=` likha hota hai, ya index negative hai ya ghalat calculate hua hai.",
        fix: [
          "Loop aise likhen: `for (int i = 0; i < arr.length; i++)` (`<=` nahi, `<`).",
          "Aakhri element `arr[arr.length - 1]` hota hai.",
          "Is line se pehle index aur `arr.length` print kar ke dekhen.",
        ],
      },
      hindi: {
        meaning: "आपके कोड ने array की जगह `{1}` इस्तेमाल करने की कोशिश की, लेकिन यह जगह मौजूद नहीं है।",
        cause: "Array की जगहें `0` से `length - 1` तक होती हैं। आमतौर पर loop में `<` की जगह `<=` लिखा होता है, या index negative है या ग़लत हिसाब हुआ है।",
        fix: [
          "Loop ऐसे लिखें: `for (int i = 0; i < arr.length; i++)` (`<=` नहीं, `<`)।",
          "आख़िरी element `arr[arr.length - 1]` होता है।",
          "इस लाइन से पहले index और `arr.length` print करके देखें।",
        ],
      },
      arabic: {
        meaning: "حاول الكود استخدام الموضع `{1}` في مصفوفة، لكن هذا الموضع غير موجود.",
        cause: "مواضع المصفوفة من `0` إلى `length - 1`. غالبًا تستخدم الحلقة `<=` بدل `<`، أو أن الفهرس سالب أو محسوب بشكل خاطئ.",
        fix: [
          "اكتب الحلقة هكذا: `for (int i = 0; i < arr.length; i++)` (استخدم `<` لا `<=`).",
          "آخر عنصر هو `arr[arr.length - 1]`.",
          "اطبع الفهرس و`arr.length` قبل هذا السطر لترى القيم.",
        ],
      },
    },
    example: {
      bad: 'int[] a = {1, 2, 3};\nfor (int i = 0; i <= a.length; i++)\n    System.out.println(a[i]);',
      good: 'int[] a = {1, 2, 3};\nfor (int i = 0; i < a.length; i++)\n    System.out.println(a[i]);',
    },
  },
  {
    id: 'java-string-index',
    title: 'StringIndexOutOfBoundsException',
    languages: ['java'],
    patterns: [/StringIndexOutOfBoundsException/],
    text: {
      english: {
        meaning: "Your code asked for a character position in a String that does not exist.",
        cause: "`charAt(i)` or `substring(a, b)` was called with a position below `0` or beyond `length()`. Often the String is shorter than expected, or even empty `\"\"`.",
        fix: [
          "Valid positions for `charAt` are `0` to `s.length() - 1`.",
          "For `substring(a, b)`, `b` can be at most `s.length()` and `a` must not be bigger than `b`.",
          "Check `s.isEmpty()` or `s.length()` before reading characters.",
        ],
      },
      urdu: {
        meaning: "آپ کے کوڈ نے String میں ایسی جگہ کا حرف مانگا جو موجود نہیں۔",
        cause: "`charAt(i)` یا `substring(a, b)` کو `0` سے کم یا `length()` سے زیادہ جگہ دی گئی۔ اکثر String توقع سے چھوٹی ہوتی ہے یا بالکل خالی `\"\"` ہوتی ہے۔",
        fix: [
          "`charAt` کے لیے درست جگہیں `0` سے `s.length() - 1` تک ہیں۔",
          "`substring(a, b)` میں `b` زیادہ سے زیادہ `s.length()` ہو سکتا ہے اور `a`، `b` سے بڑا نہ ہو۔",
          "حروف پڑھنے سے پہلے `s.isEmpty()` یا `s.length()` چیک کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke code ne String mein aisi position ka character maanga jo maujood nahi.",
        cause: "`charAt(i)` ya `substring(a, b)` ko `0` se kam ya `length()` se zyada position di gayi. Aksar String expected se chhoti hoti hai ya bilkul khali `\"\"` hoti hai.",
        fix: [
          "`charAt` ke liye sahi positions `0` se `s.length() - 1` tak hain.",
          "`substring(a, b)` mein `b` zyada se zyada `s.length()` ho sakta hai aur `a`, `b` se bara na ho.",
          "Characters read karne se pehle `s.isEmpty()` ya `s.length()` check karen.",
        ],
      },
      hindi: {
        meaning: "आपके कोड ने String में ऐसी जगह का अक्षर माँगा जो मौजूद नहीं है।",
        cause: "`charAt(i)` या `substring(a, b)` को `0` से कम या `length()` से ज़्यादा जगह दी गई। अक्सर String उम्मीद से छोटी होती है या बिल्कुल ख़ाली `\"\"` होती है।",
        fix: [
          "`charAt` के लिए सही जगहें `0` से `s.length() - 1` तक हैं।",
          "`substring(a, b)` में `b` ज़्यादा से ज़्यादा `s.length()` हो सकता है और `a`, `b` से बड़ा न हो।",
          "अक्षर पढ़ने से पहले `s.isEmpty()` या `s.length()` जाँचें।",
        ],
      },
      arabic: {
        meaning: "طلب الكود حرفًا من موضع غير موجود في String.",
        cause: "استُدعيت `charAt(i)` أو `substring(a, b)` بموضع أقل من `0` أو أكبر من `length()`. غالبًا يكون النص أقصر من المتوقع أو فارغًا `\"\"`.",
        fix: [
          "المواضع الصحيحة لـ `charAt` من `0` إلى `s.length() - 1`.",
          "في `substring(a, b)` يجب ألا يتجاوز `b` القيمة `s.length()` وألا يكون `a` أكبر من `b`.",
          "تحقق من `s.isEmpty()` أو `s.length()` قبل قراءة الأحرف.",
        ],
      },
    },
  },
  {
    id: 'java-class-cast',
    title: 'ClassCastException',
    languages: ['java'],
    patterns: [/class ([\w.$]+) cannot be cast to class ([\w.$]+)/, /([\w.$]+) cannot be cast to ([\w.$]+)/],
    text: {
      english: {
        meaning: "Your code tried to treat a `{1}` object as a `{2}`, but it is not one.",
        cause: "A cast like `(Type) obj` was used on an object of a different type, often when reading from a raw `List`/`Object` or when converting text to a number with a cast instead of parsing.",
        fix: [
          "Check the real type first: `if (obj instanceof {2}) { ... }`.",
          "To turn a `String` into a number, use `Integer.parseInt(s)`, not a cast.",
          "Use generics like `List<String>` so the compiler catches wrong types early.",
        ],
      },
      urdu: {
        meaning: "آپ کے کوڈ نے `{1}` object کو `{2}` سمجھ کر استعمال کرنے کی کوشش کی، مگر وہ `{2}` نہیں ہے۔",
        cause: "`(Type) obj` جیسا cast ایک مختلف type کے object پر لگایا گیا، اکثر raw `List`/`Object` سے پڑھتے وقت یا text کو parse کرنے کی بجائے cast سے نمبر بنانے کی کوشش میں۔",
        fix: [
          "پہلے اصل type چیک کریں: `if (obj instanceof {2}) { ... }`۔",
          "`String` کو نمبر بنانے کے لیے cast نہیں بلکہ `Integer.parseInt(s)` استعمال کریں۔",
          "`List<String>` جیسے generics استعمال کریں تاکہ compiler غلط type پہلے ہی پکڑ لے۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke code ne `{1}` object ko `{2}` samajh kar use karne ki koshish ki, lekin wo `{2}` nahi hai.",
        cause: "`(Type) obj` jaisa cast aik different type ke object par lagaya gaya, aksar raw `List`/`Object` se read karte waqt ya text ko parse karne ki bajaye cast se number banane ki koshish mein.",
        fix: [
          "Pehle asal type check karen: `if (obj instanceof {2}) { ... }`.",
          "`String` ko number banane ke liye cast nahi balke `Integer.parseInt(s)` use karen.",
          "`List<String>` jaise generics use karen taake compiler ghalat type pehle hi pakar le.",
        ],
      },
      hindi: {
        meaning: "आपके कोड ने `{1}` object को `{2}` समझकर इस्तेमाल करने की कोशिश की, लेकिन वह `{2}` नहीं है।",
        cause: "`(Type) obj` जैसा cast किसी अलग type के object पर लगाया गया, अक्सर raw `List`/`Object` से पढ़ते समय या text को parse करने की जगह cast से नंबर बनाने की कोशिश में।",
        fix: [
          "पहले असली type जाँचें: `if (obj instanceof {2}) { ... }`।",
          "`String` को नंबर बनाने के लिए cast नहीं बल्कि `Integer.parseInt(s)` इस्तेमाल करें।",
          "`List<String>` जैसे generics इस्तेमाल करें ताकि compiler ग़लत type पहले ही पकड़ ले।",
        ],
      },
      arabic: {
        meaning: "حاول الكود معاملة كائن من نوع `{1}` على أنه `{2}`، لكنه ليس كذلك.",
        cause: "استُخدم تحويل مثل `(Type) obj` على كائن من نوع مختلف، غالبًا عند القراءة من `List` أو `Object` بلا نوع محدد، أو عند محاولة تحويل نص إلى رقم بالـ cast بدل التحليل.",
        fix: [
          "تحقق من النوع الحقيقي أولًا: `if (obj instanceof {2}) { ... }`.",
          "لتحويل `String` إلى رقم استخدم `Integer.parseInt(s)` لا الـ cast.",
          "استخدم generics مثل `List<String>` ليكتشف المترجم الأنواع الخاطئة مبكرًا.",
        ],
      },
    },
  },
  {
    id: 'java-number-format',
    title: 'NumberFormatException: For input string',
    languages: ['java'],
    patterns: [/NumberFormatException: For input string: "([^"\n]*)"/],
    text: {
      english: {
        meaning: "Java could not turn the text `\"{1}\"` into a number.",
        cause: "The text has letters, spaces, a decimal point (for `parseInt`), or is empty. This often comes from user input or a file line.",
        fix: [
          "Remove spaces first: `Integer.parseInt(s.trim())`.",
          "Use `Double.parseDouble(s)` for numbers with a decimal point.",
          "Wrap it in `try { ... } catch (NumberFormatException e) { ... }` and ask the user again.",
        ],
      },
      urdu: {
        meaning: "Java اس text `\"{1}\"` کو نمبر میں نہیں بدل سکا۔",
        cause: "Text میں حروف، spaces، اعشاریہ (`parseInt` کے لیے) ہیں یا وہ خالی ہے۔ اکثر یہ صارف کے input یا فائل کی لائن سے آتا ہے۔",
        fix: [
          "پہلے spaces ہٹائیں: `Integer.parseInt(s.trim())`۔",
          "اعشاریہ والے نمبر کے لیے `Double.parseDouble(s)` استعمال کریں۔",
          "اسے `try { ... } catch (NumberFormatException e) { ... }` میں لکھیں اور صارف سے دوبارہ پوچھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Java is text `\"{1}\"` ko number mein nahi badal saka.",
        cause: "Text mein letters, spaces, decimal point (`parseInt` ke liye) hain ya wo khali hai. Aksar ye user input ya file ki line se aata hai.",
        fix: [
          "Pehle spaces hatayen: `Integer.parseInt(s.trim())`.",
          "Decimal wale number ke liye `Double.parseDouble(s)` use karen.",
          "Isay `try { ... } catch (NumberFormatException e) { ... }` mein likhen aur user se dobara poochen.",
        ],
      },
      hindi: {
        meaning: "Java इस text `\"{1}\"` को नंबर में नहीं बदल पाया।",
        cause: "Text में अक्षर, spaces, दशमलव (`parseInt` के लिए) हैं या वह ख़ाली है। अक्सर यह user के input या फ़ाइल की लाइन से आता है।",
        fix: [
          "पहले spaces हटाएँ: `Integer.parseInt(s.trim())`।",
          "दशमलव वाले नंबर के लिए `Double.parseDouble(s)` इस्तेमाल करें।",
          "इसे `try { ... } catch (NumberFormatException e) { ... }` में लिखें और user से दोबारा पूछें।",
        ],
      },
      arabic: {
        meaning: "لم تستطع Java تحويل النص `\"{1}\"` إلى رقم.",
        cause: "النص يحتوي على حروف أو مسافات أو فاصلة عشرية (بالنسبة لـ `parseInt`) أو أنه فارغ. غالبًا يأتي من إدخال المستخدم أو من سطر في ملف.",
        fix: [
          "احذف المسافات أولًا: `Integer.parseInt(s.trim())`.",
          "استخدم `Double.parseDouble(s)` للأرقام العشرية.",
          "ضعه داخل `try { ... } catch (NumberFormatException e) { ... }` واطلب الإدخال مجددًا.",
        ],
      },
    },
  },
  {
    id: 'java-arithmetic-zero',
    title: 'ArithmeticException: / by zero',
    languages: ['java'],
    patterns: [/ArithmeticException: \/ by zero/],
    text: {
      english: {
        meaning: "Your program divided a whole number (`int`/`long`) by zero.",
        cause: "The value after `/` or `%` is `0`, for example a count of items that is still `0`.",
        fix: [
          "Check before dividing: `if (count != 0) { ... }`.",
          "Print the divisor to find out why it is `0`.",
          "If you need a decimal result, use `double` values.",
        ],
      },
      urdu: {
        meaning: "آپ کے پروگرام نے ایک پورے عدد (`int`/`long`) کو صفر سے تقسیم کیا۔",
        cause: "`/` یا `%` کے بعد والی value `0` ہے، مثلاً چیزوں کی گنتی جو ابھی تک `0` ہے۔",
        fix: [
          "تقسیم سے پہلے چیک کریں: `if (count != 0) { ... }`۔",
          "تقسیم کرنے والی value print کر کے دیکھیں کہ وہ `0` کیوں ہے۔",
          "اگر اعشاریہ والا جواب چاہیے تو `double` استعمال کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke program ne aik poore number (`int`/`long`) ko zero se divide kiya.",
        cause: "`/` ya `%` ke baad wali value `0` hai, maslan items ki ginti jo abhi tak `0` hai.",
        fix: [
          "Divide se pehle check karen: `if (count != 0) { ... }`.",
          "Divisor print kar ke dekhen ke wo `0` kyun hai.",
          "Agar decimal answer chahiye to `double` use karen.",
        ],
      },
      hindi: {
        meaning: "आपके प्रोग्राम ने एक पूर्ण संख्या (`int`/`long`) को शून्य से भाग दिया।",
        cause: "`/` या `%` के बाद वाली value `0` है, जैसे चीज़ों की गिनती जो अभी तक `0` है।",
        fix: [
          "भाग देने से पहले जाँचें: `if (count != 0) { ... }`।",
          "भाजक (divisor) print करके देखें कि वह `0` क्यों है।",
          "अगर दशमलव वाला जवाब चाहिए तो `double` इस्तेमाल करें।",
        ],
      },
      arabic: {
        meaning: "قسم برنامجك عددًا صحيحًا (`int`/`long`) على صفر.",
        cause: "القيمة بعد `/` أو `%` تساوي `0`، مثل عدد عناصر ما زال `0`.",
        fix: [
          "تحقق قبل القسمة: `if (count != 0) { ... }`.",
          "اطبع المقسوم عليه لتعرف لماذا هو `0`.",
          "إذا احتجت نتيجة عشرية فاستخدم قيمًا من نوع `double`.",
        ],
      },
    },
  },
  {
    id: 'java-cannot-find-symbol',
    title: 'error: cannot find symbol',
    languages: ['java'],
    patterns: [
      /cannot find symbol/,
      /\w+ cannot be resolved(?: to a (?:variable|type))?/,
      /The method \w+\([^)\n]*\) is undefined for the type/,
    ],
    text: {
      english: {
        meaning: "Java does not recognise a name (variable, method or class) used in your code.",
        cause: "Usually a spelling or capital-letter mistake (`string` vs `String`), a variable used outside the `{ }` block where it was declared, a missing `import` (e.g. `java.util.Scanner`), or a method that does not exist on that object.",
        fix: [
          "Read the `symbol:` line in the error to see which name is unknown.",
          "Check its spelling and capital letters; Java is case-sensitive.",
          "Make sure it is declared before use and inside the same `{ }` block.",
          "For library classes, add the import at the top, e.g. `import java.util.Scanner;`.",
        ],
      },
      urdu: {
        meaning: "Java آپ کے کوڈ میں استعمال ہونے والا کوئی نام (variable، method یا class) نہیں پہچانتا۔",
        cause: "عموماً spelling یا بڑے/چھوٹے حروف کی غلطی (`string` بمقابلہ `String`)، variable کو اس `{ }` block سے باہر استعمال کرنا جہاں وہ بنا تھا، `import` بھول جانا (جیسے `java.util.Scanner`)، یا ایسا method جو اس object میں موجود ہی نہیں۔",
        fix: [
          "Error میں `symbol:` والی لائن پڑھیں تاکہ پتا چلے کون سا نام نامعلوم ہے۔",
          "اس کی spelling اور بڑے/چھوٹے حروف چیک کریں؛ Java ان میں فرق کرتا ہے۔",
          "یقینی بنائیں کہ وہ استعمال سے پہلے اور اسی `{ }` block میں declare ہو۔",
          "Library کی class ہو تو اوپر import لکھیں، جیسے `import java.util.Scanner;`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Java aap ke code mein use hone wala koi naam (variable, method ya class) nahi pehchanta.",
        cause: "Aam tor par spelling ya capital/small letters ki ghalti (`string` vs `String`), variable ko us `{ }` block se bahar use karna jahan wo bana tha, `import` bhool jana (jaise `java.util.Scanner`), ya aisa method jo us object mein maujood hi nahi.",
        fix: [
          "Error mein `symbol:` wali line parhen taake pata chale kaunsa naam unknown hai.",
          "Uski spelling aur capital/small letters check karen; Java in mein farq karta hai.",
          "Ensure karen ke wo use se pehle aur usi `{ }` block mein declare ho.",
          "Library ki class ho to upar import likhen, jaise `import java.util.Scanner;`.",
        ],
      },
      hindi: {
        meaning: "Java आपके कोड में इस्तेमाल हुए किसी नाम (variable, method या class) को नहीं पहचानता।",
        cause: "आमतौर पर spelling या बड़े/छोटे अक्षरों की ग़लती (`string` बनाम `String`), variable को उस `{ }` block से बाहर इस्तेमाल करना जहाँ वह बना था, `import` भूल जाना (जैसे `java.util.Scanner`), या ऐसा method जो उस object में मौजूद ही नहीं।",
        fix: [
          "Error में `symbol:` वाली लाइन पढ़ें ताकि पता चले कौन-सा नाम अनजान है।",
          "उसकी spelling और बड़े/छोटे अक्षर जाँचें; Java इनमें फ़र्क़ करता है।",
          "पक्का करें कि वह इस्तेमाल से पहले और उसी `{ }` block में declare हो।",
          "Library की class हो तो ऊपर import लिखें, जैसे `import java.util.Scanner;`।",
        ],
      },
      arabic: {
        meaning: "لا تتعرّف Java على اسم (متغير أو دالة أو class) مستخدم في الكود.",
        cause: "غالبًا خطأ في الكتابة أو حالة الأحرف (`string` بدل `String`)، أو استخدام متغير خارج كتلة `{ }` التي عُرِّف فيها، أو نسيان `import` (مثل `java.util.Scanner`)، أو دالة غير موجودة في ذلك الكائن.",
        fix: [
          "اقرأ سطر `symbol:` في رسالة الخطأ لتعرف الاسم غير المعروف.",
          "تحقق من كتابته وحالة أحرفه، فـ Java تميّز بينها.",
          "تأكد أنه مُعرَّف قبل استخدامه وداخل كتلة `{ }` نفسها.",
          "لأصناف المكتبات أضف الاستيراد في الأعلى، مثل `import java.util.Scanner;`.",
        ],
      },
    },
    example: {
      bad: 'Scanner sc = new Scanner(System.in);',
      good: 'import java.util.Scanner;\n// ...\nScanner sc = new Scanner(System.in);',
    },
  },
  {
    id: 'java-incompatible-types',
    title: 'error: incompatible types',
    languages: ['java'],
    patterns: [
      /possible lossy conversion from (\w+) to (\w+)/,
      /incompatible types: ([^\n]+?) cannot be converted to ([^\n]+?)\s*$/m,
      /Type mismatch: cannot convert from ([^\n]+?) to ([^\n]+?)\s*$/m,
    ],
    text: {
      english: {
        meaning: "You put a `{1}` value where a `{2}` is expected, and Java will not convert it automatically.",
        cause: "The variable's type does not match the value, e.g. a `String` stored in an `int`, or a `double` stored in an `int` (which could lose the decimal part).",
        fix: [
          "Change the variable's type to match the value, or vice versa.",
          "Text to number: `Integer.parseInt(text)`; number to text: `String.valueOf(n)`.",
          "To knowingly drop decimals, cast: `int x = (int) 3.7;`.",
        ],
      },
      urdu: {
        meaning: "آپ نے وہاں `{1}` value رکھی جہاں `{2}` چاہیے تھی، اور Java اسے خود بخود نہیں بدلے گا۔",
        cause: "Variable کی type اور value آپس میں نہیں ملتیں، جیسے `int` میں `String` رکھنا، یا `int` میں `double` رکھنا (جس سے اعشاریہ والا حصہ ضائع ہو سکتا ہے)۔",
        fix: [
          "Variable کی type value کے مطابق کر دیں، یا value کو type کے مطابق۔",
          "Text سے نمبر: `Integer.parseInt(text)`؛ نمبر سے text: `String.valueOf(n)`۔",
          "اگر جان بوجھ کر اعشاریہ ہٹانا ہے تو cast کریں: `int x = (int) 3.7;`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne wahan `{1}` value rakhi jahan `{2}` chahiye thi, aur Java isay khud ba khud convert nahi karega.",
        cause: "Variable ki type aur value aapas mein match nahi karti, jaise `int` mein `String` rakhna, ya `int` mein `double` rakhna (jis se decimal wala hissa zaya ho sakta hai).",
        fix: [
          "Variable ki type value ke mutabiq kar den, ya value ko type ke mutabiq.",
          "Text se number: `Integer.parseInt(text)`; number se text: `String.valueOf(n)`.",
          "Agar jaan boojh kar decimal hatana hai to cast karen: `int x = (int) 3.7;`.",
        ],
      },
      hindi: {
        meaning: "आपने वहाँ `{1}` value रखी जहाँ `{2}` चाहिए था, और Java उसे अपने-आप नहीं बदलेगा।",
        cause: "Variable की type और value आपस में मेल नहीं खातीं, जैसे `int` में `String` रखना, या `int` में `double` रखना (जिससे दशमलव वाला हिस्सा खो सकता है)।",
        fix: [
          "Variable की type value के हिसाब से कर दें, या value को type के हिसाब से।",
          "Text से नंबर: `Integer.parseInt(text)`; नंबर से text: `String.valueOf(n)`।",
          "अगर जानबूझकर दशमलव हटाना है तो cast करें: `int x = (int) 3.7;`।",
        ],
      },
      arabic: {
        meaning: "وضعت قيمة من نوع `{1}` في مكان يُتوقع فيه `{2}`، ولن تحوّلها Java تلقائيًا.",
        cause: "نوع المتغير لا يطابق القيمة، مثل تخزين `String` في `int`، أو تخزين `double` في `int` (مما قد يُضيّع الجزء العشري).",
        fix: [
          "غيّر نوع المتغير ليطابق القيمة، أو العكس.",
          "من نص إلى رقم: `Integer.parseInt(text)`؛ ومن رقم إلى نص: `String.valueOf(n)`.",
          "إذا أردت حذف الكسور عن قصد فاستخدم cast: `int x = (int) 3.7;`.",
        ],
      },
    },
    example: {
      bad: 'int age = "20";',
      good: 'int age = Integer.parseInt("20");',
    },
  },
  {
    id: 'java-missing-return',
    title: 'error: missing return statement',
    languages: ['java'],
    patterns: [/missing return statement/, /This method must return a result of type/],
    text: {
      english: {
        meaning: "A method that promises to return a value can reach its end without returning anything.",
        cause: "There is a `return` only inside an `if` (or a loop), so some paths have no `return`. Java checks every possible path.",
        fix: [
          "Add a `return` at the very end of the method as a default.",
          "Or add an `else` branch that also returns a value.",
          "If the method should not return anything, change its type to `void`.",
        ],
      },
      urdu: {
        meaning: "جو method value واپس کرنے کا وعدہ کرتا ہے، وہ بغیر کچھ return کیے اپنے آخر تک پہنچ سکتا ہے۔",
        cause: "`return` صرف کسی `if` (یا loop) کے اندر ہے، اس لیے کچھ راستوں میں `return` نہیں۔ Java ہر ممکنہ راستہ چیک کرتا ہے۔",
        fix: [
          "Method کے بالکل آخر میں default کے طور پر ایک `return` لکھیں۔",
          "یا ایک `else` حصہ شامل کریں جو بھی value واپس کرے۔",
          "اگر method کو کچھ واپس نہیں کرنا تو اس کی type `void` کر دیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Jo method value return karne ka wada karta hai, wo bina kuch return kiye apne end tak pohanch sakta hai.",
        cause: "`return` sirf kisi `if` (ya loop) ke andar hai, is liye kuch raston mein `return` nahi. Java har mumkin rasta check karta hai.",
        fix: [
          "Method ke bilkul end mein default ke tor par aik `return` likhen.",
          "Ya aik `else` part add karen jo bhi value return kare.",
          "Agar method ko kuch return nahi karna to uski type `void` kar den.",
        ],
      },
      hindi: {
        meaning: "जो method value लौटाने का वादा करता है, वह बिना कुछ return किए अपने आख़िर तक पहुँच सकता है।",
        cause: "`return` सिर्फ़ किसी `if` (या loop) के अंदर है, इसलिए कुछ रास्तों में `return` नहीं है। Java हर मुमकिन रास्ता जाँचता है।",
        fix: [
          "Method के बिल्कुल आख़िर में default के तौर पर एक `return` लिखें।",
          "या एक `else` हिस्सा जोड़ें जो भी value लौटाए।",
          "अगर method को कुछ नहीं लौटाना है तो उसकी type `void` कर दें।",
        ],
      },
      arabic: {
        meaning: "دالة تَعِد بإرجاع قيمة يمكن أن تصل إلى نهايتها دون إرجاع أي شيء.",
        cause: "يوجد `return` داخل `if` (أو حلقة) فقط، فبعض المسارات تخلو من `return`. وJava تفحص كل المسارات الممكنة.",
        fix: [
          "أضف `return` في نهاية الدالة كقيمة افتراضية.",
          "أو أضف فرع `else` يُرجع قيمة أيضًا.",
          "إذا كانت الدالة لا يجب أن تُرجع شيئًا فاجعل نوعها `void`.",
        ],
      },
    },
    example: {
      bad: 'static String grade(int m) {\n    if (m >= 50) return "Pass";\n}',
      good: 'static String grade(int m) {\n    if (m >= 50) return "Pass";\n    return "Fail";\n}',
    },
  },
  {
    id: 'java-semicolon-expected',
    title: "error: ';' expected",
    languages: ['java'],
    patterns: [/';' expected/, /Syntax error, insert ";" to complete/],
    text: {
      english: {
        meaning: "Java expected a semicolon `;` to end a statement.",
        cause: "Almost always a `;` is missing at the end of the line shown, or of the line just before it.",
        fix: [
          "Add `;` at the end of the statement on that line.",
          "If that line looks fine, check the previous line too.",
          "Remember: lines ending with `{` or `}` (like `if`, `for`, method headers) do not need `;`.",
        ],
      },
      urdu: {
        meaning: "Java کو statement کے آخر میں semicolon `;` کی توقع تھی۔",
        cause: "تقریباً ہمیشہ بتائی گئی لائن یا اس سے پہلے والی لائن کے آخر میں `;` رہ گیا ہوتا ہے۔",
        fix: [
          "اس لائن کے statement کے آخر میں `;` لگا دیں۔",
          "اگر وہ لائن ٹھیک لگے تو اس سے پہلے والی لائن بھی چیک کریں۔",
          "یاد رکھیں: جو لائنیں `{` یا `}` پر ختم ہوں (جیسے `if`، `for`، method کی پہلی لائن) انہیں `;` نہیں چاہیے۔",
        ],
      },
      'roman-urdu': {
        meaning: "Java ko statement ke end mein semicolon `;` ki tawaqqo thi.",
        cause: "Taqreeban hamesha batayi gayi line ya us se pehle wali line ke end mein `;` reh gaya hota hai.",
        fix: [
          "Us line ke statement ke end mein `;` laga den.",
          "Agar wo line theek lage to us se pehle wali line bhi check karen.",
          "Yaad rakhen: jo lines `{` ya `}` par khatam hon (jaise `if`, `for`, method ki pehli line) unhein `;` nahi chahiye.",
        ],
      },
      hindi: {
        meaning: "Java को statement के आख़िर में semicolon `;` की उम्मीद थी।",
        cause: "लगभग हमेशा बताई गई लाइन या उससे पहले वाली लाइन के आख़िर में `;` छूट गया होता है।",
        fix: [
          "उस लाइन के statement के आख़िर में `;` लगा दें।",
          "अगर वह लाइन ठीक लगे तो उससे पहले वाली लाइन भी जाँचें।",
          "याद रखें: जो लाइनें `{` या `}` पर ख़त्म हों (जैसे `if`, `for`, method की पहली लाइन) उन्हें `;` नहीं चाहिए।",
        ],
      },
      arabic: {
        meaning: "كانت Java تتوقع فاصلة منقوطة `;` لإنهاء الجملة البرمجية.",
        cause: "في الغالب تكون `;` ناقصة في نهاية السطر المذكور أو السطر الذي قبله.",
        fix: [
          "أضف `;` في نهاية الجملة في ذلك السطر.",
          "إذا بدا السطر سليمًا فافحص السطر السابق أيضًا.",
          "تذكّر: الأسطر المنتهية بـ `{` أو `}` (مثل `if` و`for` وبداية الدوال) لا تحتاج `;`.",
        ],
      },
    },
    example: {
      bad: 'int x = 5\nSystem.out.println(x)',
      good: 'int x = 5;\nSystem.out.println(x);',
    },
  },
  {
    id: 'java-public-class-filename',
    title: 'class X is public, should be declared in a file named X.java',
    languages: ['java'],
    patterns: [/class (\w+) is public, should be declared in a file named \w+\.java/, /The public type (\w+) must be defined in its own file/],
    text: {
      english: {
        meaning: "The public class `{1}` must be saved in a file named exactly `{1}.java`.",
        cause: "The file name and the class name are different (including capital letters), for example class `Main` in `main.java` or `Test.java`.",
        fix: [
          "Rename the file to `{1}.java` (right-click → Rename in VS Code).",
          "Or rename the class to match the file name.",
          "Keep only one `public` class per file.",
        ],
      },
      urdu: {
        meaning: "Public class `{1}` کو لازمی طور پر بالکل `{1}.java` نام کی فائل میں save ہونا چاہیے۔",
        cause: "فائل کا نام اور class کا نام مختلف ہیں (بڑے/چھوٹے حروف سمیت)، مثلاً class `Main` فائل `main.java` یا `Test.java` میں ہے۔",
        fix: [
          "فائل کا نام بدل کر `{1}.java` کریں (VS Code میں right-click → Rename)۔",
          "یا class کا نام فائل کے نام کے مطابق کر دیں۔",
          "ایک فائل میں صرف ایک `public` class رکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Public class `{1}` ko lazmi tor par bilkul `{1}.java` naam ki file mein save hona chahiye.",
        cause: "File ka naam aur class ka naam different hain (capital/small letters samet), maslan class `Main` file `main.java` ya `Test.java` mein hai.",
        fix: [
          "File ka naam badal kar `{1}.java` karen (VS Code mein right-click → Rename).",
          "Ya class ka naam file ke naam ke mutabiq kar den.",
          "Aik file mein sirf aik `public` class rakhen.",
        ],
      },
      hindi: {
        meaning: "Public class `{1}` को ज़रूरी तौर पर बिल्कुल `{1}.java` नाम की फ़ाइल में save होना चाहिए।",
        cause: "फ़ाइल का नाम और class का नाम अलग हैं (बड़े/छोटे अक्षरों समेत), जैसे class `Main` फ़ाइल `main.java` या `Test.java` में है।",
        fix: [
          "फ़ाइल का नाम बदलकर `{1}.java` करें (VS Code में right-click → Rename)।",
          "या class का नाम फ़ाइल के नाम के हिसाब से कर दें।",
          "एक फ़ाइल में सिर्फ़ एक `public` class रखें।",
        ],
      },
      arabic: {
        meaning: "يجب حفظ الـ class العام `{1}` في ملف اسمه `{1}.java` تمامًا.",
        cause: "اسم الملف يختلف عن اسم الـ class (بما في ذلك حالة الأحرف)، مثل class `Main` في ملف `main.java` أو `Test.java`.",
        fix: [
          "غيّر اسم الملف إلى `{1}.java` (زر الفأرة الأيمن ← Rename في VS Code).",
          "أو غيّر اسم الـ class ليطابق اسم الملف.",
          "اجعل في كل ملف class واحدًا فقط من نوع `public`.",
        ],
      },
    },
  },
  {
    id: 'java-unreported-exception',
    title: 'error: unreported exception; must be caught or declared to be thrown',
    languages: ['java'],
    patterns: [/unreported exception ([\w.$]+); must be caught or declared to be thrown/, /Unhandled exception type (\w+)/],
    text: {
      english: {
        meaning: "This code can throw `{1}`, and Java requires you to handle it.",
        cause: "`{1}` is a checked exception (common with files, `Thread.sleep`, and network code). Java will not compile until you catch it or declare it.",
        fix: [
          "Wrap the code in `try { ... } catch ({1} e) { e.printStackTrace(); }`.",
          "Or add `throws {1}` to the method header, e.g. `public static void main(String[] args) throws {1}`.",
        ],
      },
      urdu: {
        meaning: "یہ کوڈ `{1}` پھینک سکتا ہے، اور Java چاہتا ہے کہ آپ اسے سنبھالیں۔",
        cause: "`{1}` ایک checked exception ہے (فائلوں، `Thread.sleep` اور network کوڈ میں عام)۔ جب تک آپ اسے catch یا declare نہ کریں، Java کوڈ compile نہیں کرے گا۔",
        fix: [
          "کوڈ کو `try { ... } catch ({1} e) { e.printStackTrace(); }` میں لپیٹیں۔",
          "یا method کی پہلی لائن میں `throws {1}` لکھیں، جیسے `public static void main(String[] args) throws {1}`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Ye code `{1}` throw kar sakta hai, aur Java chahta hai ke aap isay handle karen.",
        cause: "`{1}` aik checked exception hai (files, `Thread.sleep` aur network code mein common). Jab tak aap isay catch ya declare na karen, Java code compile nahi karega.",
        fix: [
          "Code ko `try { ... } catch ({1} e) { e.printStackTrace(); }` mein wrap karen.",
          "Ya method ki pehli line mein `throws {1}` likhen, jaise `public static void main(String[] args) throws {1}`.",
        ],
      },
      hindi: {
        meaning: "यह कोड `{1}` फेंक सकता है, और Java चाहता है कि आप उसे संभालें।",
        cause: "`{1}` एक checked exception है (फ़ाइलों, `Thread.sleep` और network कोड में आम)। जब तक आप उसे catch या declare न करें, Java कोड compile नहीं करेगा।",
        fix: [
          "कोड को `try { ... } catch ({1} e) { e.printStackTrace(); }` में लपेटें।",
          "या method की पहली लाइन में `throws {1}` लिखें, जैसे `public static void main(String[] args) throws {1}`।",
        ],
      },
      arabic: {
        meaning: "هذا الكود قد يرمي `{1}`، وتشترط Java أن تتعامل معه.",
        cause: "`{1}` استثناء من النوع checked (شائع مع الملفات و`Thread.sleep` وكود الشبكات)، ولن يُترجم الكود حتى تلتقطه أو تصرّح به.",
        fix: [
          "ضع الكود داخل `try { ... } catch ({1} e) { e.printStackTrace(); }`.",
          "أو أضف `throws {1}` إلى رأس الدالة، مثل `public static void main(String[] args) throws {1}`.",
        ],
      },
    },
  },
  {
    id: 'java-main-class-not-found',
    title: 'Error: Could not find or load main class',
    languages: ['java'],
    patterns: [/Could not find or load main class ([\w.$-]+)/],
    text: {
      english: {
        meaning: "The `java` command could not find a compiled class named `{1}` to run.",
        cause: "The name is wrong (it must match the class, without `.java` or `.class`), you are in the wrong folder, the file was not compiled, or the class has a `package` line and must be run by its full name.",
        fix: [
          "Compile first: `javac Main.java`, then run `java Main` (no extension).",
          "Run the command from the folder that contains the `.class` file.",
          "If the file starts with `package com.example;`, run it from the project root as `java com.example.Main`.",
          "Or simply use the `Run` button above `main` in VS Code.",
        ],
      },
      urdu: {
        meaning: "`java` کمانڈ کو چلانے کے لیے `{1}` نام کی compiled class نہیں ملی۔",
        cause: "نام غلط ہے (یہ class کے نام جیسا ہو، `.java` یا `.class` کے بغیر)، آپ غلط folder میں ہیں، فائل compile نہیں ہوئی، یا class میں `package` والی لائن ہے اس لیے اسے پورے نام سے چلانا ہو گا۔",
        fix: [
          "پہلے compile کریں: `javac Main.java`، پھر چلائیں `java Main` (extension کے بغیر)۔",
          "کمانڈ اسی folder سے چلائیں جس میں `.class` فائل ہے۔",
          "اگر فائل `package com.example;` سے شروع ہوتی ہے تو project کے root سے `java com.example.Main` چلائیں۔",
          "یا VS Code میں `main` کے اوپر والا `Run` بٹن استعمال کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "`java` command ko run karne ke liye `{1}` naam ki compiled class nahi mili.",
        cause: "Naam ghalat hai (ye class ke naam jaisa ho, `.java` ya `.class` ke baghair), aap ghalat folder mein hain, file compile nahi hui, ya class mein `package` wali line hai is liye usay poore naam se chalana hoga.",
        fix: [
          "Pehle compile karen: `javac Main.java`, phir chalayen `java Main` (extension ke baghair).",
          "Command usi folder se chalayen jis mein `.class` file hai.",
          "Agar file `package com.example;` se shuru hoti hai to project ke root se `java com.example.Main` chalayen.",
          "Ya VS Code mein `main` ke upar wala `Run` button use karen.",
        ],
      },
      hindi: {
        meaning: "`java` कमांड को चलाने के लिए `{1}` नाम की compiled class नहीं मिली।",
        cause: "नाम ग़लत है (यह class के नाम जैसा हो, `.java` या `.class` के बिना), आप ग़लत folder में हैं, फ़ाइल compile नहीं हुई, या class में `package` वाली लाइन है इसलिए उसे पूरे नाम से चलाना होगा।",
        fix: [
          "पहले compile करें: `javac Main.java`, फिर चलाएँ `java Main` (extension के बिना)।",
          "कमांड उसी folder से चलाएँ जिसमें `.class` फ़ाइल है।",
          "अगर फ़ाइल `package com.example;` से शुरू होती है तो project के root से `java com.example.Main` चलाएँ।",
          "या VS Code में `main` के ऊपर वाला `Run` बटन इस्तेमाल करें।",
        ],
      },
      arabic: {
        meaning: "لم يجد الأمر `java` صنفًا مُترجَمًا باسم `{1}` لتشغيله.",
        cause: "الاسم خاطئ (يجب أن يطابق اسم الـ class دون `.java` أو `.class`)، أو أنك في مجلد خاطئ، أو أن الملف لم يُترجم، أو أن الـ class يحتوي على سطر `package` فيجب تشغيله باسمه الكامل.",
        fix: [
          "ترجم أولًا: `javac Main.java`، ثم شغّل `java Main` (دون امتداد).",
          "نفّذ الأمر من المجلد الذي يحتوي ملف `.class`.",
          "إذا بدأ الملف بـ `package com.example;` فشغّله من جذر المشروع: `java com.example.Main`.",
          "أو استخدم زر `Run` فوق `main` في VS Code.",
        ],
      },
    },
  },
  {
    id: 'java-static-context',
    title: 'non-static ... cannot be referenced from a static context',
    languages: ['java'],
    patterns: [
      /non-static (?:method|variable) (\w+)(?:\([^)\n]*\))? cannot be referenced from a static context/,
      /Cannot make a static reference to the non-static (?:method|field) (\w+)/,
    ],
    text: {
      english: {
        meaning: "You used `{1}` from a `static` method (like `main`), but `{1}` belongs to an object, not to the class.",
        cause: "`main` is `static`, so it runs without any object. Non-static methods and fields need an object to exist first.",
        fix: [
          "Create an object and use it: `Main obj = new Main(); obj.{1}...`.",
          "Or, if `{1}` does not use object data, mark it `static`.",
        ],
      },
      urdu: {
        meaning: "آپ نے `{1}` کو کسی `static` method (جیسے `main`) سے استعمال کیا، مگر `{1}` کسی object کا حصہ ہے، class کا نہیں۔",
        cause: "`main` چونکہ `static` ہے، یہ کسی object کے بغیر چلتا ہے۔ Non-static methods اور fields کے لیے پہلے object کا ہونا ضروری ہے۔",
        fix: [
          "Object بنائیں اور اس کے ذریعے استعمال کریں: `Main obj = new Main(); obj.{1}...`۔",
          "یا اگر `{1}` object کا data استعمال نہیں کرتا تو اسے `static` کر دیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne `{1}` ko kisi `static` method (jaise `main`) se use kiya, lekin `{1}` kisi object ka hissa hai, class ka nahi.",
        cause: "`main` kyunki `static` hai, ye kisi object ke baghair chalta hai. Non-static methods aur fields ke liye pehle object ka hona zaroori hai.",
        fix: [
          "Object banayen aur uske zariye use karen: `Main obj = new Main(); obj.{1}...`.",
          "Ya agar `{1}` object ka data use nahi karta to usay `static` kar den.",
        ],
      },
      hindi: {
        meaning: "आपने `{1}` को किसी `static` method (जैसे `main`) से इस्तेमाल किया, लेकिन `{1}` किसी object का हिस्सा है, class का नहीं।",
        cause: "`main` क्योंकि `static` है, यह किसी object के बिना चलता है। Non-static methods और fields के लिए पहले object का होना ज़रूरी है।",
        fix: [
          "Object बनाएँ और उसके ज़रिए इस्तेमाल करें: `Main obj = new Main(); obj.{1}...`।",
          "या अगर `{1}` object का data इस्तेमाल नहीं करता तो उसे `static` कर दें।",
        ],
      },
      arabic: {
        meaning: "استخدمت `{1}` من دالة `static` (مثل `main`)، لكن `{1}` يتبع كائنًا وليس الـ class نفسه.",
        cause: "بما أن `main` من نوع `static` فهي تعمل دون أي كائن، أما الدوال والحقول غير الساكنة فتحتاج إلى كائن أولًا.",
        fix: [
          "أنشئ كائنًا واستخدمه: `Main obj = new Main(); obj.{1}...`.",
          "أو إذا كان `{1}` لا يستخدم بيانات الكائن فاجعله `static`.",
        ],
      },
    },
    example: {
      bad: 'public class Main {\n    void hello() { System.out.println("Hi"); }\n    public static void main(String[] a) { hello(); }\n}',
      good: 'public class Main {\n    static void hello() { System.out.println("Hi"); }\n    public static void main(String[] a) { hello(); }\n}',
    },
  },
  {
    id: 'java-input-mismatch',
    title: 'InputMismatchException (Scanner)',
    languages: ['java'],
    patterns: [/InputMismatchException/],
    text: {
      english: {
        meaning: "`Scanner` expected a certain kind of input (like a number), but the user typed something else.",
        cause: "For example `nextInt()` received `abc` or `12.5`. Also common: mixing `nextInt()` and `nextLine()` so the leftover Enter is read at the wrong time.",
        fix: [
          "Type input that matches what the code asks for (a whole number for `nextInt()`).",
          "Check first with `sc.hasNextInt()` before calling `sc.nextInt()`.",
          "After `nextInt()`, call `sc.nextLine()` once to clear the leftover Enter before reading text.",
        ],
      },
      urdu: {
        meaning: "`Scanner` کو ایک خاص قسم کا input (جیسے نمبر) چاہیے تھا، مگر صارف نے کچھ اور لکھ دیا۔",
        cause: "مثلاً `nextInt()` کو `abc` یا `12.5` ملا۔ یہ بھی عام ہے کہ `nextInt()` اور `nextLine()` ملا کر استعمال ہوں اور بچا ہوا Enter غلط وقت پر پڑھا جائے۔",
        fix: [
          "وہی input لکھیں جو کوڈ مانگ رہا ہے (`nextInt()` کے لیے پورا عدد)۔",
          "`sc.nextInt()` سے پہلے `sc.hasNextInt()` سے چیک کریں۔",
          "`nextInt()` کے بعد text پڑھنے سے پہلے ایک بار `sc.nextLine()` چلا کر بچا ہوا Enter صاف کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "`Scanner` ko aik khaas qisam ka input (jaise number) chahiye tha, lekin user ne kuch aur likh diya.",
        cause: "Maslan `nextInt()` ko `abc` ya `12.5` mila. Ye bhi common hai ke `nextInt()` aur `nextLine()` mila kar use hon aur bacha hua Enter ghalat waqt par read ho jaye.",
        fix: [
          "Wohi input likhen jo code maang raha hai (`nextInt()` ke liye poora number).",
          "`sc.nextInt()` se pehle `sc.hasNextInt()` se check karen.",
          "`nextInt()` ke baad text read karne se pehle aik baar `sc.nextLine()` chala kar bacha hua Enter saaf karen.",
        ],
      },
      hindi: {
        meaning: "`Scanner` को एक ख़ास तरह का input (जैसे नंबर) चाहिए था, लेकिन user ने कुछ और लिख दिया।",
        cause: "जैसे `nextInt()` को `abc` या `12.5` मिला। यह भी आम है कि `nextInt()` और `nextLine()` मिलाकर इस्तेमाल हों और बचा हुआ Enter ग़लत समय पर पढ़ा जाए।",
        fix: [
          "वही input लिखें जो कोड माँग रहा है (`nextInt()` के लिए पूर्ण संख्या)।",
          "`sc.nextInt()` से पहले `sc.hasNextInt()` से जाँचें।",
          "`nextInt()` के बाद text पढ़ने से पहले एक बार `sc.nextLine()` चलाकर बचा हुआ Enter साफ़ करें।",
        ],
      },
      arabic: {
        meaning: "كان `Scanner` يتوقع نوعًا معيّنًا من الإدخال (مثل رقم)، لكن المستخدم كتب شيئًا آخر.",
        cause: "مثلًا استقبلت `nextInt()` القيمة `abc` أو `12.5`. ومن الشائع أيضًا الخلط بين `nextInt()` و`nextLine()` فيُقرأ ضغط Enter المتبقي في وقت خاطئ.",
        fix: [
          "أدخل قيمة تطابق ما يطلبه الكود (عدد صحيح لـ `nextInt()`).",
          "تحقق أولًا بـ `sc.hasNextInt()` قبل استدعاء `sc.nextInt()`.",
          "بعد `nextInt()` استدعِ `sc.nextLine()` مرة واحدة لتنظيف Enter المتبقي قبل قراءة نص.",
        ],
      },
    },
  },
];
