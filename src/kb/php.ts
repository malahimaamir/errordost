import type { KbEntry } from '../types';

/**
 * Offline knowledge base: PHP errors (PHP 7/8 runtime messages, PDO/mysqli
 * database errors and Intelephense diagnostics).
 * Order matters: the first matching entry wins.
 */
export const PHP_ENTRIES: KbEntry[] = [
  {
    id: 'php-parse-error',
    title: 'Parse error: syntax error, unexpected ...',
    languages: ['php'],
    patterns: [
      /syntax error, unexpected (end of file|token "[^"\n]*"|'[^'\n]*'|"[^"\n]*"|[^\s,]+)/i,
      /Syntax error: unexpected (end of file|token '[^'\n]*'|'[^'\n]*'|[^\s,]+)/i,
    ],
    text: {
      english: {
        meaning: "PHP could not read your code because it found `{1}` where it did not expect it.",
        cause: "Usually a missing `;` at the end of the previous line, a missing `)` or `}`, a missing `$` before a variable name, or an unclosed quote. `unexpected end of file` means a `{` was never closed.",
        fix: [
          "Look at the line in the error and the line just before it; add any missing `;`.",
          "Check that every `(`, `{` and quote is closed. Click a bracket in VS Code to see its partner.",
          "Make sure variables start with `$`, e.g. `$name`.",
        ],
      },
      urdu: {
        meaning: "PHP آپ کا کوڈ نہیں پڑھ سکا کیونکہ اسے ایسی جگہ پر `{1}` ملا جہاں اس کی توقع نہیں تھی۔",
        cause: "عموماً پچھلی لائن کے آخر میں `;` رہ جاتا ہے، `)` یا `}` غائب ہوتا ہے، variable کے نام سے پہلے `$` نہیں ہوتا، یا کوئی quote بند نہیں ہوتا۔ `unexpected end of file` کا مطلب ہے کوئی `{` کبھی بند نہیں ہوا۔",
        fix: [
          "Error والی لائن اور اس سے پہلے والی لائن دیکھیں؛ جہاں `;` نہ ہو وہاں لگائیں۔",
          "دیکھیں کہ ہر `(`، `{` اور quote بند ہو۔ VS Code میں bracket پر کلک کر کے اس کا جوڑی دار دیکھیں۔",
          "یقینی بنائیں کہ variables `$` سے شروع ہوں، جیسے `$name`۔",
        ],
      },
      'roman-urdu': {
        meaning: "PHP aap ka code nahi parh saka kyunki usay aisi jagah par `{1}` mila jahan uski tawaqqo nahi thi.",
        cause: "Aam tor par pichli line ke end mein `;` reh jata hai, `)` ya `}` missing hota hai, variable ke naam se pehle `$` nahi hota, ya koi quote band nahi hota. `unexpected end of file` ka matlab hai koi `{` kabhi band nahi hua.",
        fix: [
          "Error wali line aur us se pehle wali line dekhen; jahan `;` na ho wahan lagayen.",
          "Dekhen ke har `(`, `{` aur quote band ho. VS Code mein bracket par click kar ke uska matching bracket dekhen.",
          "Ensure karen ke variables `$` se shuru hon, jaise `$name`.",
        ],
      },
      hindi: {
        meaning: "PHP आपका कोड नहीं पढ़ पाया क्योंकि उसे ऐसी जगह पर `{1}` मिला जहाँ उसकी उम्मीद नहीं थी।",
        cause: "आमतौर पर पिछली लाइन के आख़िर में `;` छूट जाता है, `)` या `}` ग़ायब होता है, variable के नाम से पहले `$` नहीं होता, या कोई quote बंद नहीं होता। `unexpected end of file` का मतलब है कोई `{` कभी बंद नहीं हुआ।",
        fix: [
          "Error वाली लाइन और उससे पहले वाली लाइन देखें; जहाँ `;` न हो वहाँ लगाएँ।",
          "देखें कि हर `(`, `{` और quote बंद हो। VS Code में bracket पर क्लिक करके उसका जोड़ीदार देखें।",
          "पक्का करें कि variables `$` से शुरू हों, जैसे `$name`।",
        ],
      },
      arabic: {
        meaning: "لم يستطع PHP قراءة الكود لأنه وجد `{1}` في مكان لم يكن يتوقعه.",
        cause: "غالبًا تكون `;` ناقصة في نهاية السطر السابق، أو `)` أو `}` مفقودة، أو `$` ناقصة قبل اسم متغير، أو علامة اقتباس غير مغلقة. وعبارة `unexpected end of file` تعني أن `{` لم تُغلق.",
        fix: [
          "انظر إلى السطر المذكور والسطر الذي قبله، وأضف `;` الناقصة.",
          "تأكد أن كل `(` و`{` وعلامة اقتباس مغلقة. انقر على قوس في VS Code لترى القوس المقابل.",
          "تأكد أن المتغيرات تبدأ بـ `$`، مثل `$name`.",
        ],
      },
    },
    example: {
      bad: '<?php\n$name = "Ali"\necho $name;',
      good: '<?php\n$name = "Ali";\necho $name;',
    },
  },
  {
    id: 'php-undefined-variable',
    title: 'Warning: Undefined variable',
    languages: ['php'],
    patterns: [/Undefined variable:? '?\$?(\w+)/i],
    text: {
      english: {
        meaning: "PHP was asked to use the variable `${1}`, but it has no value yet.",
        cause: "A spelling or case mistake (`$Name` vs `$name`), the variable is set only inside an `if` that did not run, or it is used inside a function but was created outside it (functions cannot see outside variables).",
        fix: [
          "Check the spelling and case of `${1}`.",
          "Give it a starting value before use, e.g. `${1} = '';`.",
          "Inside a function, pass it as a parameter instead of using an outside variable.",
          "For form data, read it safely: `${1} = $_POST['{1}'] ?? '';`.",
        ],
      },
      urdu: {
        meaning: "PHP سے variable `${1}` استعمال کرنے کو کہا گیا، مگر اس میں ابھی تک کوئی value نہیں۔",
        cause: "Spelling یا بڑے/چھوٹے حروف کی غلطی (`$Name` بمقابلہ `$name`)، variable صرف کسی ایسے `if` میں بنا جو چلا نہیں، یا اسے function کے اندر استعمال کیا گیا جبکہ وہ باہر بنا تھا (function باہر کے variables نہیں دیکھ سکتا)۔",
        fix: [
          "`${1}` کی spelling اور بڑے/چھوٹے حروف چیک کریں۔",
          "استعمال سے پہلے اسے ابتدائی value دیں، جیسے `${1} = '';`۔",
          "Function کے اندر باہر والا variable استعمال کرنے کی بجائے اسے parameter میں بھیجیں۔",
          "Form کا data محفوظ طریقے سے پڑھیں: `${1} = $_POST['{1}'] ?? '';`۔",
        ],
      },
      'roman-urdu': {
        meaning: "PHP se variable `${1}` use karne ko kaha gaya, lekin us mein abhi tak koi value nahi.",
        cause: "Spelling ya capital/small letters ki ghalti (`$Name` vs `$name`), variable sirf kisi aise `if` mein bana jo chala nahi, ya usay function ke andar use kiya gaya jabke wo bahar bana tha (function bahar ke variables nahi dekh sakta).",
        fix: [
          "`${1}` ki spelling aur capital/small letters check karen.",
          "Use se pehle usay starting value den, jaise `${1} = '';`.",
          "Function ke andar bahar wala variable use karne ki bajaye usay parameter mein bhejen.",
          "Form ka data safe tareeqe se read karen: `${1} = $_POST['{1}'] ?? '';`.",
        ],
      },
      hindi: {
        meaning: "PHP से variable `${1}` इस्तेमाल करने को कहा गया, लेकिन उसमें अभी तक कोई value नहीं है।",
        cause: "Spelling या बड़े/छोटे अक्षरों की ग़लती (`$Name` बनाम `$name`), variable सिर्फ़ किसी ऐसे `if` में बना जो चला नहीं, या उसे function के अंदर इस्तेमाल किया गया जबकि वह बाहर बना था (function बाहर के variables नहीं देख सकता)।",
        fix: [
          "`${1}` की spelling और बड़े/छोटे अक्षर जाँचें।",
          "इस्तेमाल से पहले उसे शुरुआती value दें, जैसे `${1} = '';`।",
          "Function के अंदर बाहर वाला variable इस्तेमाल करने की जगह उसे parameter में भेजें।",
          "Form का data सुरक्षित तरीक़े से पढ़ें: `${1} = $_POST['{1}'] ?? '';`।",
        ],
      },
      arabic: {
        meaning: "طُلب من PHP استخدام المتغير `${1}`، لكنه لا يحمل أي قيمة بعد.",
        cause: "خطأ في الكتابة أو حالة الأحرف (`$Name` بدل `$name`)، أو أن المتغير يُعرَّف داخل `if` لم يُنفَّذ، أو أنه يُستخدم داخل دالة بينما أُنشئ خارجها (الدوال لا ترى المتغيرات الخارجية).",
        fix: [
          "تحقق من كتابة `${1}` وحالة أحرفه.",
          "أعطه قيمة ابتدائية قبل استخدامه، مثل `${1} = '';`.",
          "داخل الدالة مرّره كمعامل بدل استخدام متغير خارجي.",
          "اقرأ بيانات النموذج بأمان: `${1} = $_POST['{1}'] ?? '';`.",
        ],
      },
    },
  },
  {
    id: 'php-undefined-index',
    title: 'Undefined index / Undefined array key',
    languages: ['php'],
    patterns: [/Undefined array key "([^"\n]*)"/, /Undefined array key (-?\d+)/, /Undefined (?:index|offset): ?(\S+)/],
    text: {
      english: {
        meaning: "The array does not have the key `{1}` that your code is reading.",
        cause: "Very often a form field: `$_POST['{1}']` or `$_GET['{1}']` is read before the form is submitted, or the input's `name` attribute is different. It can also be a typo in the key.",
        fix: [
          "Use a default value: `$value = $_POST['{1}'] ?? '';`.",
          "Or check first: `if (isset($_POST['{1}'])) { ... }`.",
          "Make sure the HTML input has `name=\"{1}\"` and the form uses the right `method`.",
          "Use `print_r($array);` to see which keys really exist.",
        ],
      },
      urdu: {
        meaning: "Array میں وہ key `{1}` موجود نہیں جو آپ کا کوڈ پڑھ رہا ہے۔",
        cause: "اکثر یہ form کا field ہوتا ہے: form submit ہونے سے پہلے ہی `$_POST['{1}']` یا `$_GET['{1}']` پڑھا جاتا ہے، یا input کا `name` مختلف ہوتا ہے۔ Key میں spelling کی غلطی بھی ہو سکتی ہے۔",
        fix: [
          "Default value استعمال کریں: `$value = $_POST['{1}'] ?? '';`۔",
          "یا پہلے چیک کریں: `if (isset($_POST['{1}'])) { ... }`۔",
          "یقینی بنائیں کہ HTML input میں `name=\"{1}\"` ہو اور form کا `method` درست ہو۔",
          "`print_r($array);` سے دیکھیں کہ اصل میں کون سی keys موجود ہیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Array mein wo key `{1}` maujood nahi jo aap ka code read kar raha hai.",
        cause: "Aksar ye form ka field hota hai: form submit hone se pehle hi `$_POST['{1}']` ya `$_GET['{1}']` read kiya jata hai, ya input ka `name` different hota hai. Key mein spelling ki ghalti bhi ho sakti hai.",
        fix: [
          "Default value use karen: `$value = $_POST['{1}'] ?? '';`.",
          "Ya pehle check karen: `if (isset($_POST['{1}'])) { ... }`.",
          "Ensure karen ke HTML input mein `name=\"{1}\"` ho aur form ka `method` sahi ho.",
          "`print_r($array);` se dekhen ke asal mein kaunsi keys maujood hain.",
        ],
      },
      hindi: {
        meaning: "Array में वह key `{1}` मौजूद नहीं है जिसे आपका कोड पढ़ रहा है।",
        cause: "अक्सर यह form का field होता है: form submit होने से पहले ही `$_POST['{1}']` या `$_GET['{1}']` पढ़ा जाता है, या input का `name` अलग होता है। Key में spelling की ग़लती भी हो सकती है।",
        fix: [
          "Default value इस्तेमाल करें: `$value = $_POST['{1}'] ?? '';`।",
          "या पहले जाँचें: `if (isset($_POST['{1}'])) { ... }`।",
          "पक्का करें कि HTML input में `name=\"{1}\"` हो और form का `method` सही हो।",
          "`print_r($array);` से देखें कि असल में कौन-सी keys मौजूद हैं।",
        ],
      },
      arabic: {
        meaning: "المصفوفة لا تحتوي على المفتاح `{1}` الذي يقرؤه الكود.",
        cause: "غالبًا يكون حقلًا في نموذج: تُقرأ `$_POST['{1}']` أو `$_GET['{1}']` قبل إرسال النموذج، أو أن خاصية `name` للحقل مختلفة. وقد يكون خطأً إملائيًا في المفتاح.",
        fix: [
          "استخدم قيمة افتراضية: `$value = $_POST['{1}'] ?? '';`.",
          "أو تحقق أولًا: `if (isset($_POST['{1}'])) { ... }`.",
          "تأكد أن حقل HTML يحتوي على `name=\"{1}\"` وأن النموذج يستخدم `method` الصحيح.",
          "استخدم `print_r($array);` لترى المفاتيح الموجودة فعلًا.",
        ],
      },
    },
  },
  {
    id: 'php-undefined-method',
    title: 'Call to undefined method',
    languages: ['php'],
    patterns: [/Call to undefined method ([\w\\]+)::(\w+)\(\)/],
    text: {
      english: {
        meaning: "The class `{1}` has no method called `{2}()`.",
        cause: "A spelling mistake in the method name, the method is in a different class, it is `private`/defined in a child class, or you are using an old/new version of a library where the method was renamed.",
        fix: [
          "Check the spelling of `{2}` and open the `{1}` class to see its methods.",
          "Make sure the object is really a `{1}` you expect (`var_dump($obj);`).",
          "For a library, check its documentation for your installed version.",
        ],
      },
      urdu: {
        meaning: "Class `{1}` میں `{2}()` نام کا کوئی method نہیں ہے۔",
        cause: "Method کے نام کی spelling غلط ہے، method کسی دوسری class میں ہے، وہ `private` ہے یا child class میں بنا ہے، یا library کا ایسا version استعمال ہو رہا ہے جس میں method کا نام بدل گیا ہے۔",
        fix: [
          "`{2}` کی spelling چیک کریں اور `{1}` class کھول کر اس کے methods دیکھیں۔",
          "یقینی بنائیں کہ object واقعی وہی `{1}` ہے جس کی آپ توقع کر رہے ہیں (`var_dump($obj);`)۔",
          "Library ہو تو اپنے انسٹال شدہ version کی documentation دیکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Class `{1}` mein `{2}()` naam ka koi method nahi hai.",
        cause: "Method ke naam ki spelling ghalat hai, method kisi doosri class mein hai, wo `private` hai ya child class mein bana hai, ya library ka aisa version use ho raha hai jis mein method ka naam badal gaya hai.",
        fix: [
          "`{2}` ki spelling check karen aur `{1}` class khol kar uske methods dekhen.",
          "Ensure karen ke object waqai wahi `{1}` hai jis ki aap tawaqqo kar rahe hain (`var_dump($obj);`).",
          "Library ho to apne installed version ki documentation dekhen.",
        ],
      },
      hindi: {
        meaning: "Class `{1}` में `{2}()` नाम का कोई method नहीं है।",
        cause: "Method के नाम की spelling ग़लत है, method किसी दूसरी class में है, वह `private` है या child class में बना है, या library का ऐसा version इस्तेमाल हो रहा है जिसमें method का नाम बदल गया है।",
        fix: [
          "`{2}` की spelling जाँचें और `{1}` class खोलकर उसके methods देखें।",
          "पक्का करें कि object सच में वही `{1}` है जिसकी आप उम्मीद कर रहे हैं (`var_dump($obj);`)।",
          "Library हो तो अपने install किए version की documentation देखें।",
        ],
      },
      arabic: {
        meaning: "الـ class `{1}` لا يحتوي على دالة باسم `{2}()`.",
        cause: "خطأ في كتابة اسم الدالة، أو أنها في class آخر، أو أنها `private` أو معرّفة في class فرعي، أو أنك تستخدم إصدارًا من المكتبة تغيّر فيه اسم الدالة.",
        fix: [
          "تحقق من كتابة `{2}` وافتح الـ class `{1}` لترى دواله.",
          "تأكد أن الكائن هو فعلًا `{1}` الذي تتوقعه (`var_dump($obj);`).",
          "إن كانت مكتبة فراجع توثيق الإصدار المثبت لديك.",
        ],
      },
    },
  },
  {
    id: 'php-undefined-function',
    title: 'Call to undefined function',
    languages: ['php'],
    patterns: [/Call to undefined function ([\w\\]+)\(\)/, /Undefined function '([\w\\]+)'/],
    text: {
      english: {
        meaning: "PHP does not know any function called `{1}()`.",
        cause: "A spelling mistake, the file that defines it was not included, the PHP extension that provides it is turned off (e.g. `mysqli`, `mbstring`, `curl`, `gd`), or it was removed from PHP (e.g. old `mysql_*` functions are gone since PHP 7).",
        fix: [
          "Check the spelling of `{1}`.",
          "If it is your own function, add `require_once 'file.php';` for the file that defines it.",
          "If it comes from an extension, enable it in `php.ini` (e.g. remove `;` before `extension=mysqli`) and restart Apache/XAMPP.",
          "Replace old `mysql_*` calls with `mysqli_*` or PDO.",
        ],
      },
      urdu: {
        meaning: "PHP کسی `{1}()` نام کے function کو نہیں جانتا۔",
        cause: "Spelling کی غلطی، جس فائل میں function بنا ہے وہ include نہیں ہوئی، اسے فراہم کرنے والی PHP extension بند ہے (جیسے `mysqli`، `mbstring`، `curl`، `gd`)، یا وہ PHP سے ختم ہو چکا ہے (جیسے پرانے `mysql_*` functions، PHP 7 سے موجود نہیں)۔",
        fix: [
          "`{1}` کی spelling چیک کریں۔",
          "اگر یہ آپ کا اپنا function ہے تو اس کی فائل کے لیے `require_once 'file.php';` لکھیں۔",
          "اگر یہ کسی extension کا ہے تو `php.ini` میں اسے آن کریں (جیسے `extension=mysqli` سے پہلے والا `;` ہٹائیں) اور Apache/XAMPP دوبارہ چلائیں۔",
          "پرانے `mysql_*` کی جگہ `mysqli_*` یا PDO استعمال کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "PHP kisi `{1}()` naam ke function ko nahi janta.",
        cause: "Spelling ki ghalti, jis file mein function bana hai wo include nahi hui, isay dene wali PHP extension band hai (jaise `mysqli`, `mbstring`, `curl`, `gd`), ya wo PHP se khatam ho chuka hai (jaise purane `mysql_*` functions, PHP 7 se maujood nahi).",
        fix: [
          "`{1}` ki spelling check karen.",
          "Agar ye aap ka apna function hai to uski file ke liye `require_once 'file.php';` likhen.",
          "Agar ye kisi extension ka hai to `php.ini` mein usay on karen (jaise `extension=mysqli` se pehle wala `;` hatayen) aur Apache/XAMPP restart karen.",
          "Purane `mysql_*` ki jagah `mysqli_*` ya PDO use karen.",
        ],
      },
      hindi: {
        meaning: "PHP किसी `{1}()` नाम के function को नहीं जानता।",
        cause: "Spelling की ग़लती, जिस फ़ाइल में function बना है वह include नहीं हुई, उसे देने वाली PHP extension बंद है (जैसे `mysqli`, `mbstring`, `curl`, `gd`), या वह PHP से हटाया जा चुका है (जैसे पुराने `mysql_*` functions, PHP 7 से मौजूद नहीं)।",
        fix: [
          "`{1}` की spelling जाँचें।",
          "अगर यह आपका अपना function है तो उसकी फ़ाइल के लिए `require_once 'file.php';` लिखें।",
          "अगर यह किसी extension का है तो `php.ini` में उसे चालू करें (जैसे `extension=mysqli` से पहले वाला `;` हटाएँ) और Apache/XAMPP restart करें।",
          "पुराने `mysql_*` की जगह `mysqli_*` या PDO इस्तेमाल करें।",
        ],
      },
      arabic: {
        meaning: "لا يعرف PHP أي دالة باسم `{1}()`.",
        cause: "خطأ في الكتابة، أو أن الملف الذي يعرّف الدالة لم يُضمَّن، أو أن إضافة PHP التي توفرها معطّلة (مثل `mysqli` و`mbstring` و`curl` و`gd`)، أو أنها أُزيلت من PHP (مثل دوال `mysql_*` القديمة منذ PHP 7).",
        fix: [
          "تحقق من كتابة `{1}`.",
          "إذا كانت دالتك الخاصة فأضف `require_once 'file.php';` للملف الذي يعرّفها.",
          "إذا كانت من إضافة ففعّلها في `php.ini` (مثل حذف `;` قبل `extension=mysqli`) وأعد تشغيل Apache/XAMPP.",
          "استبدل دوال `mysql_*` القديمة بـ `mysqli_*` أو PDO.",
        ],
      },
    },
  },
  {
    id: 'php-member-function-on-null',
    title: 'Call to a member function on null',
    languages: ['php'],
    patterns: [/Call to a member function (\w+)\(\) on (null|bool|false|string|array|int)/],
    text: {
      english: {
        meaning: "You called `->{1}()`, but the variable is `{2}`, not an object.",
        cause: "The object was never created, a function returned `null`/`false` (for example a failed database query or connection), or the variable is out of scope (e.g. `$conn` used inside a function).",
        fix: [
          "Check where the variable gets its value; create it with `new` if needed.",
          "With a database, check that the connection and query succeeded before calling methods (`if ($result) { ... }`), and print `$conn->error` to see why it failed.",
          "Inside a function, pass the object (e.g. `$conn`) as a parameter.",
        ],
      },
      urdu: {
        meaning: "آپ نے `->{1}()` کو call کیا، مگر variable ایک object نہیں بلکہ `{2}` ہے۔",
        cause: "Object کبھی بنایا ہی نہیں گیا، کسی function نے `null`/`false` واپس کیا (مثلاً database query یا connection ناکام ہوا)، یا variable اپنی حد سے باہر ہے (جیسے function کے اندر `$conn` استعمال کرنا)۔",
        fix: [
          "دیکھیں variable کو value کہاں ملتی ہے؛ ضرورت ہو تو `new` سے object بنائیں۔",
          "Database میں methods call کرنے سے پہلے چیک کریں کہ connection اور query کامیاب ہوئے (`if ($result) { ... }`)، اور وجہ جاننے کے لیے `$conn->error` print کریں۔",
          "Function کے اندر object (جیسے `$conn`) کو parameter میں بھیجیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne `->{1}()` ko call kiya, lekin variable aik object nahi balke `{2}` hai.",
        cause: "Object kabhi banaya hi nahi gaya, kisi function ne `null`/`false` return kiya (maslan database query ya connection fail hua), ya variable apne scope se bahar hai (jaise function ke andar `$conn` use karna).",
        fix: [
          "Dekhen variable ko value kahan milti hai; zaroorat ho to `new` se object banayen.",
          "Database mein methods call karne se pehle check karen ke connection aur query kamyab hue (`if ($result) { ... }`), aur wajah janne ke liye `$conn->error` print karen.",
          "Function ke andar object (jaise `$conn`) ko parameter mein bhejen.",
        ],
      },
      hindi: {
        meaning: "आपने `->{1}()` को call किया, लेकिन variable कोई object नहीं बल्कि `{2}` है।",
        cause: "Object कभी बनाया ही नहीं गया, किसी function ने `null`/`false` लौटाया (जैसे database query या connection फ़ेल हुआ), या variable अपने दायरे (scope) से बाहर है (जैसे function के अंदर `$conn` इस्तेमाल करना)।",
        fix: [
          "देखें variable को value कहाँ मिलती है; ज़रूरत हो तो `new` से object बनाएँ।",
          "Database में methods call करने से पहले जाँचें कि connection और query सफल हुए (`if ($result) { ... }`), और वजह जानने के लिए `$conn->error` print करें।",
          "Function के अंदर object (जैसे `$conn`) को parameter में भेजें।",
        ],
      },
      arabic: {
        meaning: "استدعيت `->{1}()`، لكن المتغير قيمته `{2}` وليس كائنًا.",
        cause: "الكائن لم يُنشأ أصلًا، أو أن دالة أرجعت `null`/`false` (مثل فشل استعلام أو اتصال بقاعدة البيانات)، أو أن المتغير خارج نطاقه (مثل استخدام `$conn` داخل دالة).",
        fix: [
          "تحقق من مصدر قيمة المتغير، وأنشئ الكائن بـ `new` عند الحاجة.",
          "مع قواعد البيانات تأكد من نجاح الاتصال والاستعلام قبل استدعاء الدوال (`if ($result) { ... }`)، واطبع `$conn->error` لمعرفة السبب.",
          "داخل الدالة مرّر الكائن (مثل `$conn`) كمعامل.",
        ],
      },
    },
  },
  {
    id: 'php-headers-already-sent',
    title: 'Cannot modify header information - headers already sent',
    languages: ['php'],
    patterns: [/Cannot modify header information - headers already sent/i, /headers (?:have )?already (?:been )?sent/i],
    text: {
      english: {
        meaning: "You called `header()`, `setcookie()` or `session_start()` after the page had already started sending output to the browser.",
        cause: "Something was printed before: an `echo`, HTML, an error message, or even a blank line/space before `<?php` or after `?>` in an included file. The error tells you the file and line where output started (`output started at ...`).",
        fix: [
          "Open the file/line shown after `output started at` and remove the output there.",
          "Remove any spaces or blank lines before `<?php`; omit the closing `?>` in PHP-only files.",
          "Call `session_start()` and `header(...)` at the very top, before any `echo` or HTML.",
          "After `header('Location: ...')`, add `exit;`.",
        ],
      },
      urdu: {
        meaning: "آپ نے `header()`، `setcookie()` یا `session_start()` اس وقت call کیا جب صفحہ browser کو output بھیجنا شروع کر چکا تھا۔",
        cause: "پہلے ہی کچھ print ہو چکا تھا: کوئی `echo`، HTML، error پیغام، یا کسی include فائل میں `<?php` سے پہلے یا `?>` کے بعد خالی لائن/space۔ Error میں `output started at ...` کے بعد فائل اور لائن لکھی ہوتی ہے۔",
        fix: [
          "`output started at` کے بعد بتائی گئی فائل/لائن کھولیں اور وہاں کا output ہٹائیں۔",
          "`<?php` سے پہلے کی spaces یا خالی لائنیں ہٹائیں؛ صرف PHP والی فائلوں میں آخر کا `?>` نہ لکھیں۔",
          "`session_start()` اور `header(...)` کو بالکل شروع میں، کسی بھی `echo` یا HTML سے پہلے لکھیں۔",
          "`header('Location: ...')` کے بعد `exit;` لکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne `header()`, `setcookie()` ya `session_start()` us waqt call kiya jab page browser ko output bhejna shuru kar chuka tha.",
        cause: "Pehle hi kuch print ho chuka tha: koi `echo`, HTML, error message, ya kisi include file mein `<?php` se pehle ya `?>` ke baad khali line/space. Error mein `output started at ...` ke baad file aur line likhi hoti hai.",
        fix: [
          "`output started at` ke baad batayi gayi file/line kholen aur wahan ka output hatayen.",
          "`<?php` se pehle ki spaces ya khali lines hatayen; sirf PHP wali files mein end ka `?>` na likhen.",
          "`session_start()` aur `header(...)` ko bilkul shuru mein, kisi bhi `echo` ya HTML se pehle likhen.",
          "`header('Location: ...')` ke baad `exit;` likhen.",
        ],
      },
      hindi: {
        meaning: "आपने `header()`, `setcookie()` या `session_start()` उस समय call किया जब पेज browser को output भेजना शुरू कर चुका था।",
        cause: "पहले ही कुछ print हो चुका था: कोई `echo`, HTML, error संदेश, या किसी include फ़ाइल में `<?php` से पहले या `?>` के बाद ख़ाली लाइन/space। Error में `output started at ...` के बाद फ़ाइल और लाइन लिखी होती है।",
        fix: [
          "`output started at` के बाद बताई गई फ़ाइल/लाइन खोलें और वहाँ का output हटाएँ।",
          "`<?php` से पहले की spaces या ख़ाली लाइनें हटाएँ; सिर्फ़ PHP वाली फ़ाइलों में आख़िरी `?>` न लिखें।",
          "`session_start()` और `header(...)` को बिल्कुल शुरुआत में, किसी भी `echo` या HTML से पहले लिखें।",
          "`header('Location: ...')` के बाद `exit;` लिखें।",
        ],
      },
      arabic: {
        meaning: "استدعيت `header()` أو `setcookie()` أو `session_start()` بعد أن بدأت الصفحة بإرسال المخرجات إلى المتصفح.",
        cause: "طُبع شيء مسبقًا: `echo` أو HTML أو رسالة خطأ، أو حتى سطر فارغ/مسافة قبل `<?php` أو بعد `?>` في ملف مُضمَّن. وتذكر رسالة الخطأ الملف والسطر بعد `output started at ...`.",
        fix: [
          "افتح الملف/السطر المذكور بعد `output started at` واحذف المخرجات هناك.",
          "احذف المسافات أو الأسطر الفارغة قبل `<?php`، ولا تكتب `?>` الختامي في الملفات التي تحتوي PHP فقط.",
          "استدعِ `session_start()` و`header(...)` في أعلى الملف قبل أي `echo` أو HTML.",
          "بعد `header('Location: ...')` أضف `exit;`.",
        ],
      },
    },
  },
  {
    id: 'php-max-execution-time',
    title: 'Maximum execution time exceeded',
    languages: ['php'],
    patterns: [/Maximum execution time of (\d+) seconds? exceeded/i],
    text: {
      english: {
        meaning: "Your script ran longer than the allowed {1} seconds, so PHP stopped it.",
        cause: "Usually an endless loop (the loop condition never becomes false), very slow work like a huge database query, or waiting on a slow external website/API.",
        fix: [
          "Check your `while`/`for` loops: does the counter change so the loop can end?",
          "Make database queries smaller (add `WHERE`/`LIMIT`) or add indexes.",
          "Only if the work is really long, raise the limit: `set_time_limit(120);` or `max_execution_time` in `php.ini`.",
        ],
      },
      urdu: {
        meaning: "آپ کی script اجازت شدہ {1} سیکنڈ سے زیادہ چلی، اس لیے PHP نے اسے روک دیا۔",
        cause: "عموماً نہ ختم ہونے والا loop (جس کی شرط کبھی false نہیں ہوتی)، بہت سست کام جیسے بڑی database query، یا کسی سست بیرونی website/API کا انتظار۔",
        fix: [
          "اپنے `while`/`for` loops دیکھیں: کیا counter بدلتا ہے تاکہ loop ختم ہو سکے؟",
          "Database queries چھوٹی کریں (`WHERE`/`LIMIT` لگائیں) یا indexes بنائیں۔",
          "صرف اگر کام واقعی لمبا ہو تو حد بڑھائیں: `set_time_limit(120);` یا `php.ini` میں `max_execution_time`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ki script allowed {1} seconds se zyada chali, is liye PHP ne usay rok diya.",
        cause: "Aam tor par na khatam hone wala loop (jis ki condition kabhi false nahi hoti), bohat slow kaam jaise bari database query, ya kisi slow bahar ki website/API ka intezar.",
        fix: [
          "Apne `while`/`for` loops dekhen: kya counter badalta hai taake loop khatam ho sake?",
          "Database queries chhoti karen (`WHERE`/`LIMIT` lagayen) ya indexes banayen.",
          "Sirf agar kaam waqai lamba ho to limit barhayen: `set_time_limit(120);` ya `php.ini` mein `max_execution_time`.",
        ],
      },
      hindi: {
        meaning: "आपकी script तय {1} सेकंड से ज़्यादा चली, इसलिए PHP ने उसे रोक दिया।",
        cause: "आमतौर पर कभी न ख़त्म होने वाला loop (जिसकी शर्त कभी false नहीं होती), बहुत धीमा काम जैसे बड़ी database query, या किसी धीमी बाहरी website/API का इंतज़ार।",
        fix: [
          "अपने `while`/`for` loops देखें: क्या counter बदलता है ताकि loop ख़त्म हो सके?",
          "Database queries छोटी करें (`WHERE`/`LIMIT` लगाएँ) या indexes बनाएँ।",
          "सिर्फ़ अगर काम सच में लंबा हो तो सीमा बढ़ाएँ: `set_time_limit(120);` या `php.ini` में `max_execution_time`।",
        ],
      },
      arabic: {
        meaning: "استغرق السكربت أكثر من {1} ثانية المسموح بها، فأوقفه PHP.",
        cause: "غالبًا حلقة لا تنتهي (شرطها لا يصبح false أبدًا)، أو عمل بطيء جدًا مثل استعلام ضخم على قاعدة البيانات، أو انتظار موقع/واجهة API خارجية بطيئة.",
        fix: [
          "افحص حلقات `while`/`for`: هل يتغير العدّاد حتى تنتهي الحلقة؟",
          "صغّر استعلامات قاعدة البيانات (أضف `WHERE`/`LIMIT`) أو أنشئ فهارس.",
          "فقط إذا كان العمل طويلًا فعلًا ارفع الحد: `set_time_limit(120);` أو `max_execution_time` في `php.ini`.",
        ],
      },
    },
  },
  {
    id: 'php-memory-exhausted',
    title: 'Allowed memory size exhausted',
    languages: ['php'],
    patterns: [/Allowed memory size of (\d+) bytes exhausted/i],
    text: {
      english: {
        meaning: "Your script tried to use more memory than PHP allows ({1} bytes), so it was stopped.",
        cause: "Often an endless loop or endless recursion that keeps adding data, loading a whole big table or file into an array at once, or a big image being processed.",
        fix: [
          "Look for loops or recursive functions that never stop adding to an array.",
          "Fetch database rows one by one (`while ($row = $result->fetch_assoc())`) instead of all at once, and use `LIMIT`.",
          "Read big files line by line with `fgets()` instead of `file()`.",
          "If the task truly needs more, raise `memory_limit` in `php.ini` (e.g. `256M`). For Composer, run `php -d memory_limit=-1 composer.phar ...`.",
        ],
      },
      urdu: {
        meaning: "آپ کی script نے PHP کی اجازت ({1} bytes) سے زیادہ memory استعمال کرنے کی کوشش کی، اس لیے اسے روک دیا گیا۔",
        cause: "اکثر نہ ختم ہونے والا loop یا recursion جو data بڑھاتا رہتا ہے، پوری بڑی table یا فائل ایک ساتھ array میں لوڈ کرنا، یا کسی بڑی تصویر پر کام کرنا۔",
        fix: [
          "ایسے loops یا recursive functions ڈھونڈیں جو array میں مسلسل چیزیں ڈالتے رہتے ہیں۔",
          "Database کی rows ایک ایک کر کے لیں (`while ($row = $result->fetch_assoc())`)، سب ایک ساتھ نہیں، اور `LIMIT` استعمال کریں۔",
          "بڑی فائلیں `file()` کی بجائے `fgets()` سے لائن بہ لائن پڑھیں۔",
          "اگر کام کو واقعی زیادہ memory چاہیے تو `php.ini` میں `memory_limit` بڑھائیں (جیسے `256M`)۔ Composer کے لیے `php -d memory_limit=-1 composer.phar ...` چلائیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ki script ne PHP ki ijazat ({1} bytes) se zyada memory use karne ki koshish ki, is liye usay rok diya gaya.",
        cause: "Aksar na khatam hone wala loop ya recursion jo data barhata rehta hai, poori bari table ya file aik sath array mein load karna, ya kisi bari image par kaam karna.",
        fix: [
          "Aise loops ya recursive functions dhoonden jo array mein lagatar cheezen dalte rehte hain.",
          "Database ki rows aik aik kar ke len (`while ($row = $result->fetch_assoc())`), sab aik sath nahi, aur `LIMIT` use karen.",
          "Bari files `file()` ki bajaye `fgets()` se line by line read karen.",
          "Agar kaam ko waqai zyada memory chahiye to `php.ini` mein `memory_limit` barhayen (jaise `256M`). Composer ke liye `php -d memory_limit=-1 composer.phar ...` chalayen.",
        ],
      },
      hindi: {
        meaning: "आपकी script ने PHP की इजाज़त ({1} bytes) से ज़्यादा memory इस्तेमाल करने की कोशिश की, इसलिए उसे रोक दिया गया।",
        cause: "अक्सर कभी न ख़त्म होने वाला loop या recursion जो data बढ़ाता रहता है, पूरी बड़ी table या फ़ाइल एक साथ array में लोड करना, या किसी बड़ी तस्वीर पर काम करना।",
        fix: [
          "ऐसे loops या recursive functions ढूँढें जो array में लगातार चीज़ें डालते रहते हैं।",
          "Database की rows एक-एक करके लें (`while ($row = $result->fetch_assoc())`), सब एक साथ नहीं, और `LIMIT` इस्तेमाल करें।",
          "बड़ी फ़ाइलें `file()` की जगह `fgets()` से लाइन-दर-लाइन पढ़ें।",
          "अगर काम को सच में ज़्यादा memory चाहिए तो `php.ini` में `memory_limit` बढ़ाएँ (जैसे `256M`)। Composer के लिए `php -d memory_limit=-1 composer.phar ...` चलाएँ।",
        ],
      },
      arabic: {
        meaning: "حاول السكربت استخدام ذاكرة أكثر مما يسمح به PHP ({1} بايت)، فأُوقف.",
        cause: "غالبًا حلقة أو استدعاء ذاتي لا ينتهي ويستمر في إضافة البيانات، أو تحميل جدول أو ملف كبير كاملًا في مصفوفة دفعة واحدة، أو معالجة صورة كبيرة.",
        fix: [
          "ابحث عن حلقات أو دوال عودية لا تتوقف عن الإضافة إلى مصفوفة.",
          "اجلب صفوف قاعدة البيانات واحدًا تلو الآخر (`while ($row = $result->fetch_assoc())`) لا دفعة واحدة، واستخدم `LIMIT`.",
          "اقرأ الملفات الكبيرة سطرًا سطرًا بـ `fgets()` بدل `file()`.",
          "إذا احتاجت المهمة فعلًا إلى المزيد فارفع `memory_limit` في `php.ini` (مثل `256M`). ولـ Composer نفّذ `php -d memory_limit=-1 composer.phar ...`.",
        ],
      },
    },
  },
  {
    id: 'php-class-not-found',
    title: 'Class "X" not found',
    languages: ['php'],
    patterns: [/Class ["']([\w\\]+)["'] not found/, /Undefined type '([\w\\]+)'/],
    text: {
      english: {
        meaning: "PHP could not find the class `{1}`.",
        cause: "The file that defines it was not included, Composer's autoloader is not loaded or not updated, the `namespace`/`use` line is wrong, or the file name/case does not match the class (Linux servers are case-sensitive).",
        fix: [
          "If you use Composer, add `require __DIR__ . '/vendor/autoload.php';` at the top, and run `composer install` (or `composer require <package>`).",
          "After adding your own classes, run `composer dump-autoload`.",
          "Add the right `use` line, e.g. `use App\\Models\\User;`, and check the class's `namespace`.",
          "Without Composer, `require_once` the file that contains the class.",
        ],
      },
      urdu: {
        meaning: "PHP کو class `{1}` نہیں ملی۔",
        cause: "جس فائل میں class بنی ہے وہ include نہیں ہوئی، Composer کا autoloader لوڈ نہیں ہوا یا update نہیں ہوا، `namespace`/`use` والی لائن غلط ہے، یا فائل کا نام/حروف class سے نہیں ملتے (Linux servers بڑے/چھوٹے حروف میں فرق کرتے ہیں)۔",
        fix: [
          "اگر Composer استعمال کر رہے ہیں تو اوپر `require __DIR__ . '/vendor/autoload.php';` لکھیں، اور `composer install` (یا `composer require <package>`) چلائیں۔",
          "اپنی نئی classes بنانے کے بعد `composer dump-autoload` چلائیں۔",
          "درست `use` لائن لکھیں، جیسے `use App\\Models\\User;`، اور class کا `namespace` چیک کریں۔",
          "Composer کے بغیر ہوں تو class والی فائل کو `require_once` کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "PHP ko class `{1}` nahi mili.",
        cause: "Jis file mein class bani hai wo include nahi hui, Composer ka autoloader load nahi hua ya update nahi hua, `namespace`/`use` wali line ghalat hai, ya file ka naam/letters class se match nahi karte (Linux servers capital/small letters mein farq karte hain).",
        fix: [
          "Agar Composer use kar rahe hain to upar `require __DIR__ . '/vendor/autoload.php';` likhen, aur `composer install` (ya `composer require <package>`) chalayen.",
          "Apni nayi classes banane ke baad `composer dump-autoload` chalayen.",
          "Sahi `use` line likhen, jaise `use App\\Models\\User;`, aur class ka `namespace` check karen.",
          "Composer ke baghair hon to class wali file ko `require_once` karen.",
        ],
      },
      hindi: {
        meaning: "PHP को class `{1}` नहीं मिली।",
        cause: "जिस फ़ाइल में class बनी है वह include नहीं हुई, Composer का autoloader लोड नहीं हुआ या update नहीं हुआ, `namespace`/`use` वाली लाइन ग़लत है, या फ़ाइल का नाम/अक्षर class से मेल नहीं खाते (Linux servers बड़े/छोटे अक्षरों में फ़र्क़ करते हैं)।",
        fix: [
          "अगर Composer इस्तेमाल कर रहे हैं तो ऊपर `require __DIR__ . '/vendor/autoload.php';` लिखें, और `composer install` (या `composer require <package>`) चलाएँ।",
          "अपनी नई classes बनाने के बाद `composer dump-autoload` चलाएँ।",
          "सही `use` लाइन लिखें, जैसे `use App\\Models\\User;`, और class का `namespace` जाँचें।",
          "Composer के बिना हों तो class वाली फ़ाइल को `require_once` करें।",
        ],
      },
      arabic: {
        meaning: "لم يجد PHP الـ class `{1}`.",
        cause: "الملف الذي يعرّفه لم يُضمَّن، أو أن autoloader الخاص بـ Composer غير محمّل أو غير محدَّث، أو أن سطر `namespace`/`use` خاطئ، أو أن اسم الملف/حالة أحرفه لا تطابق الـ class (خوادم Linux تميّز بين الأحرف الكبيرة والصغيرة).",
        fix: [
          "إذا كنت تستخدم Composer فأضف `require __DIR__ . '/vendor/autoload.php';` في الأعلى، ونفّذ `composer install` (أو `composer require <package>`).",
          "بعد إضافة أصنافك الخاصة نفّذ `composer dump-autoload`.",
          "أضف سطر `use` الصحيح، مثل `use App\\Models\\User;`، وتحقق من `namespace` الخاص بالـ class.",
          "دون Composer استخدم `require_once` للملف الذي يحتوي الـ class.",
        ],
      },
    },
  },
  {
    id: 'php-db-access-denied',
    title: 'SQLSTATE[HY000] [1045] Access denied for user',
    languages: ['php'],
    patterns: [/Access denied for user '([^'\n]*)'/i],
    text: {
      english: {
        meaning: "The database server refused to log in the user `{1}`.",
        cause: "The username or password in your connection code is wrong, or that user has no permission on this database. On a fresh XAMPP, `root` usually has an empty password.",
        fix: [
          "Check the username and password in your `mysqli_connect`/`new PDO` call (or `.env` file).",
          "On XAMPP/WAMP try user `root` with password `''` (empty); on MAMP try `root`/`root`.",
          "Test the same login in phpMyAdmin; if it fails there too, reset the password or create a user with rights on the database.",
        ],
      },
      urdu: {
        meaning: "Database server نے user `{1}` کو لاگ اِن کرنے سے انکار کر دیا۔",
        cause: "آپ کے connection کوڈ میں username یا password غلط ہے، یا اس user کو اس database کی اجازت نہیں۔ نئے XAMPP میں عموماً `root` کا password خالی ہوتا ہے۔",
        fix: [
          "اپنی `mysqli_connect`/`new PDO` والی لائن (یا `.env` فائل) میں username اور password چیک کریں۔",
          "XAMPP/WAMP پر user `root` اور password `''` (خالی) آزمائیں؛ MAMP پر `root`/`root`۔",
          "یہی login phpMyAdmin میں آزمائیں؛ اگر وہاں بھی نہ چلے تو password reset کریں یا database کی اجازت والا نیا user بنائیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Database server ne user `{1}` ko login karne se inkaar kar diya.",
        cause: "Aap ke connection code mein username ya password ghalat hai, ya us user ko is database ki permission nahi. Naye XAMPP mein aam tor par `root` ka password khali hota hai.",
        fix: [
          "Apni `mysqli_connect`/`new PDO` wali line (ya `.env` file) mein username aur password check karen.",
          "XAMPP/WAMP par user `root` aur password `''` (khali) try karen; MAMP par `root`/`root`.",
          "Yahi login phpMyAdmin mein try karen; agar wahan bhi na chale to password reset karen ya database ki permission wala naya user banayen.",
        ],
      },
      hindi: {
        meaning: "Database server ने user `{1}` को लॉग-इन करने से मना कर दिया।",
        cause: "आपके connection कोड में username या password ग़लत है, या उस user को इस database की अनुमति नहीं है। नए XAMPP में आमतौर पर `root` का password ख़ाली होता है।",
        fix: [
          "अपनी `mysqli_connect`/`new PDO` वाली लाइन (या `.env` फ़ाइल) में username और password जाँचें।",
          "XAMPP/WAMP पर user `root` और password `''` (ख़ाली) आज़माएँ; MAMP पर `root`/`root`।",
          "यही login phpMyAdmin में आज़माएँ; अगर वहाँ भी न चले तो password reset करें या database की अनुमति वाला नया user बनाएँ।",
        ],
      },
      arabic: {
        meaning: "رفض خادم قاعدة البيانات تسجيل دخول المستخدم `{1}`.",
        cause: "اسم المستخدم أو كلمة المرور في كود الاتصال خاطئة، أو أن هذا المستخدم لا يملك صلاحية على قاعدة البيانات. في XAMPP الجديد تكون كلمة مرور `root` فارغة عادةً.",
        fix: [
          "تحقق من اسم المستخدم وكلمة المرور في `mysqli_connect` أو `new PDO` (أو في ملف `.env`).",
          "على XAMPP/WAMP جرّب المستخدم `root` بكلمة مرور `''` (فارغة)، وعلى MAMP جرّب `root`/`root`.",
          "جرّب بيانات الدخول نفسها في phpMyAdmin؛ وإن فشلت هناك أيضًا فأعد تعيين كلمة المرور أو أنشئ مستخدمًا له صلاحيات على قاعدة البيانات.",
        ],
      },
    },
  },
  {
    id: 'php-db-unknown-database',
    title: "SQLSTATE[HY000] [1049] Unknown database",
    languages: ['php'],
    patterns: [/Unknown database '([^'\n]+)'/i],
    text: {
      english: {
        meaning: "The database server is running, but there is no database named `{1}`.",
        cause: "The database was not created yet, the name in your code is misspelled, or you imported the `.sql` file into a different database.",
        fix: [
          "Open phpMyAdmin and check the exact database name on the left.",
          "Create it if missing (`CREATE DATABASE {1};`) and import your `.sql` file.",
          "Make the name in your connection code match exactly.",
        ],
      },
      urdu: {
        meaning: "Database server چل رہا ہے، مگر `{1}` نام کا کوئی database موجود نہیں۔",
        cause: "Database ابھی بنایا ہی نہیں گیا، کوڈ میں نام کی spelling غلط ہے، یا آپ نے `.sql` فائل کسی دوسرے database میں import کی۔",
        fix: [
          "phpMyAdmin کھولیں اور بائیں طرف database کا بالکل درست نام دیکھیں۔",
          "اگر موجود نہیں تو بنائیں (`CREATE DATABASE {1};`) اور اپنی `.sql` فائل import کریں۔",
          "Connection کوڈ میں نام بالکل اسی کے مطابق لکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Database server chal raha hai, lekin `{1}` naam ka koi database maujood nahi.",
        cause: "Database abhi banaya hi nahi gaya, code mein naam ki spelling ghalat hai, ya aap ne `.sql` file kisi doosre database mein import ki.",
        fix: [
          "phpMyAdmin kholen aur left side par database ka bilkul sahi naam dekhen.",
          "Agar maujood nahi to banayen (`CREATE DATABASE {1};`) aur apni `.sql` file import karen.",
          "Connection code mein naam bilkul usi ke mutabiq likhen.",
        ],
      },
      hindi: {
        meaning: "Database server चल रहा है, लेकिन `{1}` नाम का कोई database मौजूद नहीं है।",
        cause: "Database अभी बनाया ही नहीं गया, कोड में नाम की spelling ग़लत है, या आपने `.sql` फ़ाइल किसी दूसरे database में import की।",
        fix: [
          "phpMyAdmin खोलें और बाईं तरफ़ database का बिल्कुल सही नाम देखें।",
          "अगर मौजूद नहीं है तो बनाएँ (`CREATE DATABASE {1};`) और अपनी `.sql` फ़ाइल import करें।",
          "Connection कोड में नाम बिल्कुल उसी के हिसाब से लिखें।",
        ],
      },
      arabic: {
        meaning: "خادم قاعدة البيانات يعمل، لكن لا توجد قاعدة بيانات باسم `{1}`.",
        cause: "لم تُنشأ قاعدة البيانات بعد، أو أن الاسم في الكود مكتوب خطأً، أو أنك استوردت ملف `.sql` إلى قاعدة بيانات أخرى.",
        fix: [
          "افتح phpMyAdmin وتحقق من الاسم الدقيق لقاعدة البيانات في الجهة اليسرى.",
          "أنشئها إن لم تكن موجودة (`CREATE DATABASE {1};`) واستورد ملف `.sql`.",
          "اجعل الاسم في كود الاتصال مطابقًا تمامًا.",
        ],
      },
    },
  },
  {
    id: 'php-db-connection-refused',
    title: 'SQLSTATE[HY000] [2002] Connection refused / No such file or directory',
    languages: ['php'],
    patterns: [/SQLSTATE\[HY000\] \[2002\]/, /HY000\/2002/, /mysqli_sql_exception: (?:Connection refused|No connection could be made)/i],
    text: {
      english: {
        meaning: "PHP could not reach the database server at all.",
        cause: "MySQL/MariaDB is not running (very common with XAMPP), the host or port is wrong, or `localhost` uses a socket that does not exist (try `127.0.0.1`).",
        fix: [
          "Start MySQL in the XAMPP/WAMP control panel and make sure it stays green.",
          "Try host `127.0.0.1` instead of `localhost`, and check the port (default `3306`).",
          "If MySQL will not start, another program may be using port 3306; stop it or change the port in both MySQL and your code.",
        ],
      },
      urdu: {
        meaning: "PHP database server تک پہنچ ہی نہیں سکا۔",
        cause: "MySQL/MariaDB چل نہیں رہا (XAMPP میں بہت عام)، host یا port غلط ہے، یا `localhost` ایسا socket استعمال کر رہا ہے جو موجود نہیں (`127.0.0.1` آزمائیں)۔",
        fix: [
          "XAMPP/WAMP کے control panel سے MySQL شروع کریں اور دیکھیں کہ وہ سبز رہے۔",
          "`localhost` کی بجائے host `127.0.0.1` آزمائیں، اور port چیک کریں (default `3306`)۔",
          "اگر MySQL شروع نہ ہو تو شاید کوئی دوسرا پروگرام port 3306 استعمال کر رہا ہے؛ اسے بند کریں یا MySQL اور اپنے کوڈ دونوں میں port بدلیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "PHP database server tak pohanch hi nahi saka.",
        cause: "MySQL/MariaDB chal nahi raha (XAMPP mein bohat common), host ya port ghalat hai, ya `localhost` aisa socket use kar raha hai jo maujood nahi (`127.0.0.1` try karen).",
        fix: [
          "XAMPP/WAMP ke control panel se MySQL start karen aur dekhen ke wo green rahe.",
          "`localhost` ki bajaye host `127.0.0.1` try karen, aur port check karen (default `3306`).",
          "Agar MySQL start na ho to shayad koi doosra program port 3306 use kar raha hai; usay band karen ya MySQL aur apne code dono mein port badlen.",
        ],
      },
      hindi: {
        meaning: "PHP database server तक पहुँच ही नहीं पाया।",
        cause: "MySQL/MariaDB चल नहीं रहा (XAMPP में बहुत आम), host या port ग़लत है, या `localhost` ऐसा socket इस्तेमाल कर रहा है जो मौजूद नहीं (`127.0.0.1` आज़माएँ)।",
        fix: [
          "XAMPP/WAMP के control panel से MySQL शुरू करें और देखें कि वह हरा रहे।",
          "`localhost` की जगह host `127.0.0.1` आज़माएँ, और port जाँचें (default `3306`)।",
          "अगर MySQL शुरू न हो तो शायद कोई दूसरा प्रोग्राम port 3306 इस्तेमाल कर रहा है; उसे बंद करें या MySQL और अपने कोड दोनों में port बदलें।",
        ],
      },
      arabic: {
        meaning: "لم يتمكن PHP من الوصول إلى خادم قاعدة البيانات إطلاقًا.",
        cause: "خدمة MySQL/MariaDB لا تعمل (شائع جدًا مع XAMPP)، أو أن المضيف أو المنفذ خاطئ، أو أن `localhost` يستخدم socket غير موجود (جرّب `127.0.0.1`).",
        fix: [
          "شغّل MySQL من لوحة تحكم XAMPP/WAMP وتأكد أنه يبقى باللون الأخضر.",
          "جرّب المضيف `127.0.0.1` بدل `localhost`، وتحقق من المنفذ (الافتراضي `3306`).",
          "إذا لم يبدأ MySQL فربما يستخدم برنامج آخر المنفذ 3306؛ أوقفه أو غيّر المنفذ في MySQL وفي كودك معًا.",
        ],
      },
    },
  },
];
