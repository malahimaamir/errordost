import type { KbEntry } from '../types';

/**
 * Offline knowledge base: Python errors (runtime tracebacks, SyntaxErrors,
 * Pylance diagnostics and common Windows setup problems).
 * Order matters: the first matching entry wins, so specific entries come first.
 */
export const PYTHON_ENTRIES: KbEntry[] = [
  // ───────────────────────── Indentation ─────────────────────────
  {
    id: 'py-indent-unexpected',
    title: 'IndentationError: unexpected indent',
    languages: ['python'],
    patterns: [/IndentationError: unexpected indent/, /Unexpected indentation/i],
    text: {
      english: {
        meaning: "Python found a line that is pushed to the right (indented) when it should not be.",
        cause: "In Python, the spaces at the start of a line have meaning. An extra space or tab at the beginning of a line, often after copy-pasting code, causes this.",
        fix: [
          "Go to the line shown in the error and remove the extra spaces at its start.",
          "Make sure all lines in the same block start at exactly the same column.",
          "Use 4 spaces per level. In VS Code, turn on `View > Appearance > Render Whitespace` to see spaces and tabs.",
        ],
      },
      urdu: {
        meaning: "Python کو ایک ایسی لائن ملی ہے جو بلاوجہ آگے کھسکی ہوئی (indented) ہے۔",
        cause: "Python میں لائن کے شروع کی spaces کا مطلب ہوتا ہے۔ اکثر کوڈ کاپی پیسٹ کرتے وقت کسی لائن کے شروع میں ایک فالتو space یا tab آ جاتا ہے۔",
        fix: [
          "Error میں بتائی گئی لائن پر جائیں اور اس کے شروع سے فالتو spaces ہٹا دیں۔",
          "ایک ہی block کی تمام لائنیں بالکل ایک ہی جگہ سے شروع ہونی چاہئیں۔",
          "ہر level کے لیے 4 spaces استعمال کریں۔ VS Code میں `View > Appearance > Render Whitespace` آن کر کے spaces اور tabs دیکھ سکتے ہیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Python ko aik aisi line mili hai jo bila wajah aage khiski hui (indented) hai.",
        cause: "Python mein line ke shuru ki spaces ka matlab hota hai. Aksar code copy-paste karte waqt kisi line ke shuru mein aik extra space ya tab aa jata hai.",
        fix: [
          "Error mein batayi gayi line par jayen aur uske shuru se extra spaces hata den.",
          "Aik hi block ki saari lines bilkul same jagah se shuru honi chahiyen.",
          "Har level ke liye 4 spaces use karen. VS Code mein `View > Appearance > Render Whitespace` on kar ke spaces aur tabs dekh sakte hain.",
        ],
      },
      hindi: {
        meaning: "Python को एक ऐसी लाइन मिली है जो बिना वजह आगे खिसकी हुई (indented) है।",
        cause: "Python में लाइन की शुरुआत की spaces का मतलब होता है। अक्सर कोड कॉपी-पेस्ट करते समय किसी लाइन की शुरुआत में एक फ़ालतू space या tab आ जाता है।",
        fix: [
          "Error में बताई गई लाइन पर जाएँ और उसकी शुरुआत से फ़ालतू spaces हटा दें।",
          "एक ही block की सारी लाइनें बिल्कुल एक ही जगह से शुरू होनी चाहिए।",
          "हर level के लिए 4 spaces इस्तेमाल करें। VS Code में `View > Appearance > Render Whitespace` चालू करके spaces और tabs देख सकते हैं।",
        ],
      },
      arabic: {
        meaning: "وجد Python سطرًا فيه مسافة بادئة (indentation) في غير مكانها.",
        cause: "في Python للمسافات في بداية السطر معنى. غالبًا ما تظهر مسافة أو tab زائدة في بداية سطر بعد نسخ الكود ولصقه.",
        fix: [
          "انتقل إلى السطر المذكور في الخطأ واحذف المسافات الزائدة من بدايته.",
          "تأكد أن جميع أسطر الكتلة الواحدة تبدأ من العمود نفسه تمامًا.",
          "استخدم 4 مسافات لكل مستوى، ويمكنك إظهار المسافات في VS Code عبر `View > Appearance > Render Whitespace`.",
        ],
      },
    },
    example: {
      bad: 'x = 5\n    print(x)',
      good: 'x = 5\nprint(x)',
    },
  },
  {
    id: 'py-indent-expected',
    title: 'IndentationError: expected an indented block',
    languages: ['python'],
    patterns: [/expected (?:an )?indented block/i],
    text: {
      english: {
        meaning: "Python expected the next line to be indented, but it was not.",
        cause: "After a line ending with `:` (like `if`, `for`, `while`, `def`, `class`), the next lines must be indented. Either the body is not indented, or the block is empty.",
        fix: [
          "Indent the lines that belong inside the block by 4 spaces.",
          "If the block is intentionally empty for now, write `pass` inside it.",
          "Check that you did not accidentally delete the body of the `if`/`for`/`def`.",
        ],
      },
      urdu: {
        meaning: "Python توقع کر رہا تھا کہ اگلی لائن آگے کھسکی ہوئی (indented) ہو گی، مگر ایسا نہیں تھا۔",
        cause: "جس لائن کے آخر میں `:` ہو (جیسے `if`، `for`، `while`، `def`، `class`) اس کے بعد والی لائنیں indent ہونی چاہئیں۔ یا تو اندر کا کوڈ indent نہیں ہے، یا block بالکل خالی ہے۔",
        fix: [
          "Block کے اندر آنے والی لائنوں کو 4 spaces آگے کریں۔",
          "اگر block فی الحال خالی رکھنا ہے تو اس کے اندر `pass` لکھ دیں۔",
          "دیکھ لیں کہ کہیں `if`/`for`/`def` کا اندر والا کوڈ غلطی سے ڈیلیٹ تو نہیں ہو گیا۔",
        ],
      },
      'roman-urdu': {
        meaning: "Python expect kar raha tha ke agli line indented (aage khiski hui) hogi, lekin aisa nahi tha.",
        cause: "Jis line ke end mein `:` ho (jaise `if`, `for`, `while`, `def`, `class`) uske baad wali lines indent honi chahiyen. Ya to andar ka code indent nahi hai, ya block bilkul khali hai.",
        fix: [
          "Block ke andar aane wali lines ko 4 spaces aage karen.",
          "Agar block abhi khali rakhna hai to uske andar `pass` likh den.",
          "Check karen ke kahin `if`/`for`/`def` ka andar wala code ghalti se delete to nahi ho gaya.",
        ],
      },
      hindi: {
        meaning: "Python उम्मीद कर रहा था कि अगली लाइन आगे खिसकी हुई (indented) होगी, लेकिन ऐसा नहीं था।",
        cause: "जिस लाइन के आख़िर में `:` हो (जैसे `if`, `for`, `while`, `def`, `class`) उसके बाद की लाइनें indent होनी चाहिए। या तो अंदर का कोड indent नहीं है, या block बिल्कुल ख़ाली है।",
        fix: [
          "Block के अंदर आने वाली लाइनों को 4 spaces आगे करें।",
          "अगर block अभी ख़ाली रखना है तो उसके अंदर `pass` लिख दें।",
          "देख लें कि कहीं `if`/`for`/`def` के अंदर का कोड ग़लती से डिलीट तो नहीं हो गया।",
        ],
      },
      arabic: {
        meaning: "كان Python يتوقع أن يكون السطر التالي مُزاحًا بمسافة بادئة (indented)، لكنه لم يكن كذلك.",
        cause: "بعد أي سطر ينتهي بـ `:` (مثل `if` و`for` و`while` و`def` و`class`) يجب أن تكون الأسطر التالية مُزاحة. إما أن جسم الكتلة غير مُزاح، أو أن الكتلة فارغة.",
        fix: [
          "أزِح الأسطر التي تنتمي إلى الكتلة بمقدار 4 مسافات.",
          "إذا أردت ترك الكتلة فارغة مؤقتًا فاكتب بداخلها `pass`.",
          "تأكد أنك لم تحذف جسم `if` أو `for` أو `def` عن طريق الخطأ.",
        ],
      },
    },
    example: {
      bad: 'if age > 18:\nprint("Adult")',
      good: 'if age > 18:\n    print("Adult")',
    },
  },
  {
    id: 'py-indent-unindent',
    title: 'IndentationError: unindent does not match any outer indentation level',
    languages: ['python'],
    patterns: [/unindent does not match any outer indentation level/, /Unindent amount does not match previous indent/i],
    text: {
      english: {
        meaning: "A line moved back to the left, but it does not line up with any earlier block.",
        cause: "The line has a different number of spaces than the block it should belong to (for example 3 spaces instead of 4), or tabs and spaces are mixed.",
        fix: [
          "Line up this line exactly with the `if`/`for`/`def` line it belongs to.",
          "Use only spaces (4 per level), not a mix of tabs and spaces.",
          "In VS Code, click `Spaces: 4` in the status bar and choose `Convert Indentation to Spaces`.",
        ],
      },
      urdu: {
        meaning: "ایک لائن واپس بائیں طرف آئی ہے، مگر وہ پہلے والے کسی block کے ساتھ سیدھی نہیں ہے۔",
        cause: "اس لائن میں spaces کی تعداد اپنے block سے مختلف ہے (مثلاً 4 کی بجائے 3 spaces)، یا tabs اور spaces ملے ہوئے ہیں۔",
        fix: [
          "اس لائن کو بالکل اسی `if`/`for`/`def` والی لائن کی سیدھ میں لائیں جس سے یہ تعلق رکھتی ہے۔",
          "صرف spaces استعمال کریں (ہر level پر 4)، tabs اور spaces کو نہ ملائیں۔",
          "VS Code میں نیچے status bar پر `Spaces: 4` پر کلک کریں اور `Convert Indentation to Spaces` چنیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aik line wapis left side par aayi hai, lekin wo pehle wale kisi block ke sath seedhi nahi hai.",
        cause: "Is line mein spaces ki ginti apne block se different hai (maslan 4 ki bajaye 3 spaces), ya tabs aur spaces mix ho gaye hain.",
        fix: [
          "Is line ko bilkul usi `if`/`for`/`def` wali line ki seedh mein layen jis se ye belong karti hai.",
          "Sirf spaces use karen (har level par 4), tabs aur spaces mix na karen.",
          "VS Code mein neeche status bar par `Spaces: 4` par click karen aur `Convert Indentation to Spaces` select karen.",
        ],
      },
      hindi: {
        meaning: "एक लाइन वापस बाईं तरफ़ आई है, लेकिन वह पहले के किसी block की सीध में नहीं है।",
        cause: "इस लाइन में spaces की गिनती अपने block से अलग है (जैसे 4 की जगह 3 spaces), या tabs और spaces मिले हुए हैं।",
        fix: [
          "इस लाइन को बिल्कुल उसी `if`/`for`/`def` वाली लाइन की सीध में लाएँ जिससे यह जुड़ी है।",
          "सिर्फ़ spaces इस्तेमाल करें (हर level पर 4), tabs और spaces को न मिलाएँ।",
          "VS Code में नीचे status bar पर `Spaces: 4` पर क्लिक करें और `Convert Indentation to Spaces` चुनें।",
        ],
      },
      arabic: {
        meaning: "عاد سطر إلى اليسار، لكنه لا يحاذي أي كتلة سابقة.",
        cause: "عدد المسافات في هذا السطر يختلف عن الكتلة التي ينتمي إليها (مثلًا 3 مسافات بدل 4)، أو أن هناك خلطًا بين tabs والمسافات.",
        fix: [
          "حاذِ هذا السطر تمامًا مع سطر `if` أو `for` أو `def` الذي ينتمي إليه.",
          "استخدم المسافات فقط (4 لكل مستوى) ولا تخلط بين tabs والمسافات.",
          "في VS Code اضغط على `Spaces: 4` في شريط الحالة واختر `Convert Indentation to Spaces`.",
        ],
      },
    },
  },
  {
    id: 'py-tab-error',
    title: 'TabError: inconsistent use of tabs and spaces',
    languages: ['python'],
    patterns: [/TabError/, /inconsistent use of tabs and spaces/i],
    text: {
      english: {
        meaning: "Your file mixes tab characters and spaces for indentation, and Python cannot tell how far each line is indented.",
        cause: "Usually happens when code is copied from a website or another editor that uses tabs, while your file uses spaces (or the other way round).",
        fix: [
          "Open the Command Palette (Ctrl+Shift+P) and run `Convert Indentation to Spaces`.",
          "Re-indent the lines around the error with 4 spaces each.",
          "Keep `editor.insertSpaces` turned on in VS Code settings so Tab inserts spaces.",
        ],
      },
      urdu: {
        meaning: "آپ کی فائل میں indentation کے لیے tabs اور spaces دونوں ملے ہوئے ہیں، اس لیے Python سمجھ نہیں پا رہا کہ کون سی لائن کتنی آگے ہے۔",
        cause: "عموماً ایسا تب ہوتا ہے جب کسی ویب سائٹ یا دوسرے editor سے tabs والا کوڈ کاپی کیا جائے جبکہ آپ کی فائل میں spaces ہوں (یا اس کے الٹ)۔",
        fix: [
          "Command Palette (Ctrl+Shift+P) کھولیں اور `Convert Indentation to Spaces` چلائیں۔",
          "Error والی لائن کے آس پاس کی لائنوں کو دوبارہ 4، 4 spaces سے indent کریں۔",
          "VS Code کی settings میں `editor.insertSpaces` آن رکھیں تاکہ Tab دبانے پر spaces لگیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ki file mein indentation ke liye tabs aur spaces dono mix hain, is liye Python samajh nahi pa raha ke kaunsi line kitni aage hai.",
        cause: "Aam tor par ye tab hota hai jab kisi website ya doosre editor se tabs wala code copy kiya jaye jabke aap ki file mein spaces hon (ya iska ulta).",
        fix: [
          "Command Palette (Ctrl+Shift+P) kholen aur `Convert Indentation to Spaces` chalayen.",
          "Error wali line ke aas paas ki lines ko dobara 4-4 spaces se indent karen.",
          "VS Code settings mein `editor.insertSpaces` on rakhen taake Tab dabane par spaces lagen.",
        ],
      },
      hindi: {
        meaning: "आपकी फ़ाइल में indentation के लिए tabs और spaces दोनों मिले हुए हैं, इसलिए Python समझ नहीं पा रहा कि कौन-सी लाइन कितनी आगे है।",
        cause: "आमतौर पर ऐसा तब होता है जब किसी वेबसाइट या दूसरे editor से tabs वाला कोड कॉपी किया जाए, जबकि आपकी फ़ाइल में spaces हों (या इसका उल्टा)।",
        fix: [
          "Command Palette (Ctrl+Shift+P) खोलें और `Convert Indentation to Spaces` चलाएँ।",
          "Error वाली लाइन के आसपास की लाइनों को दोबारा 4-4 spaces से indent करें।",
          "VS Code की settings में `editor.insertSpaces` चालू रखें ताकि Tab दबाने पर spaces लगें।",
        ],
      },
      arabic: {
        meaning: "ملفك يخلط بين tabs والمسافات في الإزاحة، فلا يستطيع Python معرفة مقدار إزاحة كل سطر.",
        cause: "يحدث هذا عادةً عند نسخ كود من موقع أو محرر آخر يستخدم tabs بينما يستخدم ملفك المسافات (أو العكس).",
        fix: [
          "افتح Command Palette (Ctrl+Shift+P) ونفّذ `Convert Indentation to Spaces`.",
          "أعد إزاحة الأسطر حول الخطأ بـ 4 مسافات لكل مستوى.",
          "أبقِ الإعداد `editor.insertSpaces` مفعّلًا في VS Code ليُدرج زر Tab مسافات.",
        ],
      },
    },
  },

  // ───────────────────────── SyntaxError ─────────────────────────
  {
    id: 'py-syntax-unterminated-string',
    title: 'SyntaxError: unterminated string literal',
    languages: ['python'],
    patterns: [/EOL while scanning string literal/, /unterminated (?:triple-quoted )?string literal/i, /String literal is unterminated/i],
    text: {
      english: {
        meaning: "A piece of text (string) was started with a quote but never closed.",
        cause: "A closing quote `\"` or `'` is missing, or the text itself contains the same quote character (like `'it's'`).",
        fix: [
          "Add the missing closing quote at the end of the text.",
          "Use the same type of quote at the start and the end.",
          "If the text contains `'`, wrap it in double quotes: `\"it's\"` (or escape it: `'it\\'s'`).",
        ],
      },
      urdu: {
        meaning: "ایک text (string) quote سے شروع تو ہوا مگر بند نہیں ہوا۔",
        cause: "آخر والا quote `\"` یا `'` غائب ہے، یا text کے اندر وہی quote موجود ہے (جیسے `'it's'`)۔",
        fix: [
          "Text کے آخر میں غائب quote لگا دیں۔",
          "شروع اور آخر میں ایک ہی قسم کا quote استعمال کریں۔",
          "اگر text کے اندر `'` ہو تو اسے double quotes میں لکھیں: `\"it's\"` (یا escape کریں: `'it\\'s'`)۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aik text (string) quote se shuru to hua lekin band nahi hua.",
        cause: "Closing quote `\"` ya `'` missing hai, ya text ke andar wahi quote maujood hai (jaise `'it's'`).",
        fix: [
          "Text ke end mein missing quote laga den.",
          "Shuru aur end mein aik hi type ka quote use karen.",
          "Agar text ke andar `'` ho to usay double quotes mein likhen: `\"it's\"` (ya escape karen: `'it\\'s'`).",
        ],
      },
      hindi: {
        meaning: "एक text (string) quote से शुरू तो हुआ लेकिन बंद नहीं हुआ।",
        cause: "आख़िरी quote `\"` या `'` छूट गया है, या text के अंदर वही quote मौजूद है (जैसे `'it's'`)।",
        fix: [
          "Text के आख़िर में छूटा हुआ quote लगा दें।",
          "शुरू और आख़िर में एक ही तरह का quote इस्तेमाल करें।",
          "अगर text के अंदर `'` हो तो उसे double quotes में लिखें: `\"it's\"` (या escape करें: `'it\\'s'`)।",
        ],
      },
      arabic: {
        meaning: "بدأ نص (string) بعلامة اقتباس لكنه لم يُغلق.",
        cause: "علامة الاقتباس الختامية `\"` أو `'` مفقودة، أو أن النص نفسه يحتوي على علامة الاقتباس نفسها (مثل `'it's'`).",
        fix: [
          "أضف علامة الاقتباس الختامية في نهاية النص.",
          "استخدم نوع علامة الاقتباس نفسه في البداية والنهاية.",
          "إذا احتوى النص على `'` فضعه بين علامتي اقتباس مزدوجتين: `\"it's\"` (أو استخدم `'it\\'s'`).",
        ],
      },
    },
    example: {
      bad: 'print("Hello)',
      good: 'print("Hello")',
    },
  },
  {
    id: 'py-syntax-never-closed',
    title: 'SyntaxError: bracket was never closed',
    languages: ['python'],
    patterns: [/'([(\[{])' was never closed/, /unexpected EOF while parsing/],
    text: {
      english: {
        meaning: "A bracket `(`, `[` or `{` was opened but never closed.",
        cause: "A closing bracket is missing, often at the end of a `print(...)` or a function call that spans several lines. Python sometimes reports the error on the next line.",
        fix: [
          "Check the line in the error and the line just above it.",
          "Count the opening and closing brackets; they must be equal.",
          "Click right after a bracket: VS Code highlights its matching partner.",
        ],
      },
      urdu: {
        meaning: "ایک bracket `(`، `[` یا `{` کھولا گیا مگر بند نہیں کیا گیا۔",
        cause: "بند کرنے والا bracket غائب ہے، اکثر `print(...)` یا کئی لائنوں والی function call کے آخر میں۔ Python کبھی کبھی error اگلی لائن پر دکھاتا ہے۔",
        fix: [
          "Error والی لائن اور اس سے اوپر والی لائن دونوں چیک کریں۔",
          "کھلنے اور بند ہونے والے brackets گنیں، دونوں برابر ہونے چاہئیں۔",
          "کسی bracket کے بالکل بعد کلک کریں، VS Code اس کا جوڑی دار bracket highlight کر دے گا۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aik bracket `(`, `[` ya `{` khola gaya lekin band nahi kiya gaya.",
        cause: "Closing bracket missing hai, aksar `print(...)` ya kai lines wali function call ke end mein. Python kabhi kabhi error agli line par dikhata hai.",
        fix: [
          "Error wali line aur us se upar wali line dono check karen.",
          "Opening aur closing brackets ginen, dono barabar hone chahiyen.",
          "Kisi bracket ke bilkul baad click karen, VS Code uska matching bracket highlight kar dega.",
        ],
      },
      hindi: {
        meaning: "एक bracket `(`, `[` या `{` खोला गया लेकिन बंद नहीं किया गया।",
        cause: "बंद करने वाला bracket छूट गया है, अक्सर `print(...)` या कई लाइनों वाली function call के आख़िर में। Python कभी-कभी error अगली लाइन पर दिखाता है।",
        fix: [
          "Error वाली लाइन और उसके ऊपर वाली लाइन दोनों जाँचें।",
          "खुलने और बंद होने वाले brackets गिनें, दोनों बराबर होने चाहिए।",
          "किसी bracket के ठीक बाद क्लिक करें, VS Code उसका जोड़ीदार bracket highlight कर देगा।",
        ],
      },
      arabic: {
        meaning: "تم فتح قوس `(` أو `[` أو `{` ولم يُغلق.",
        cause: "القوس الختامي مفقود، غالبًا في نهاية `print(...)` أو استدعاء دالة يمتد على عدة أسطر. أحيانًا يُظهر Python الخطأ في السطر التالي.",
        fix: [
          "افحص السطر المذكور في الخطأ والسطر الذي قبله.",
          "عُدّ الأقواس المفتوحة والمغلقة، يجب أن يتساوى عددها.",
          "انقر بعد أي قوس مباشرة، وسيُبرز VS Code القوس المقابل له.",
        ],
      },
    },
    example: {
      bad: 'print("Total:", sum([1, 2, 3])',
      good: 'print("Total:", sum([1, 2, 3]))',
    },
  },
  {
    id: 'py-syntax-expected-colon',
    title: "SyntaxError: expected ':'",
    languages: ['python'],
    patterns: [/expected ['"]:['"]/i],
    text: {
      english: {
        meaning: "Python expected a colon `:` at the end of this line.",
        cause: "Lines that start a block, such as `if`, `elif`, `else`, `for`, `while`, `def`, `class` and `try`, must end with `:`.",
        fix: [
          "Add `:` at the end of the `if`/`for`/`def` line.",
          "Then indent the lines inside the block by 4 spaces.",
        ],
      },
      urdu: {
        meaning: "Python اس لائن کے آخر میں colon `:` کی توقع کر رہا تھا۔",
        cause: "جو لائنیں block شروع کرتی ہیں، جیسے `if`، `elif`، `else`، `for`، `while`، `def`، `class` اور `try`، ان کے آخر میں `:` لازمی ہے۔",
        fix: [
          "`if`/`for`/`def` والی لائن کے آخر میں `:` لگا دیں۔",
          "پھر block کے اندر والی لائنوں کو 4 spaces آگے کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Python is line ke end mein colon `:` expect kar raha tha.",
        cause: "Jo lines block shuru karti hain, jaise `if`, `elif`, `else`, `for`, `while`, `def`, `class` aur `try`, unke end mein `:` zaroori hai.",
        fix: [
          "`if`/`for`/`def` wali line ke end mein `:` laga den.",
          "Phir block ke andar wali lines ko 4 spaces aage karen.",
        ],
      },
      hindi: {
        meaning: "Python इस लाइन के आख़िर में colon `:` की उम्मीद कर रहा था।",
        cause: "जो लाइनें block शुरू करती हैं, जैसे `if`, `elif`, `else`, `for`, `while`, `def`, `class` और `try`, उनके आख़िर में `:` ज़रूरी है।",
        fix: [
          "`if`/`for`/`def` वाली लाइन के आख़िर में `:` लगा दें।",
          "फिर block के अंदर वाली लाइनों को 4 spaces आगे करें।",
        ],
      },
      arabic: {
        meaning: "كان Python يتوقع نقطتين `:` في نهاية هذا السطر.",
        cause: "الأسطر التي تبدأ كتلة، مثل `if` و`elif` و`else` و`for` و`while` و`def` و`class` و`try`، يجب أن تنتهي بـ `:`.",
        fix: [
          "أضف `:` في نهاية سطر `if` أو `for` أو `def`.",
          "ثم أزِح أسطر الكتلة الداخلية بمقدار 4 مسافات.",
        ],
      },
    },
    example: {
      bad: 'if marks > 50\n    print("Pass")',
      good: 'if marks > 50:\n    print("Pass")',
    },
  },
  {
    id: 'py-syntax-invalid',
    title: 'SyntaxError: invalid syntax',
    languages: ['python'],
    patterns: [/SyntaxError: invalid syntax/],
    text: {
      english: {
        meaning: "Python could not understand how this line is written. It breaks Python's grammar rules.",
        cause: "Common reasons: a missing `:` or comma, `=` used instead of `==` in a condition, a misspelled keyword, a missing bracket on the line above, or Python 2 code like `print \"hi\"`.",
        fix: [
          "Look at the place marked with `^` and also the line just above it.",
          "Use `==` for comparison inside `if`, and `=` only for assignment.",
          "Check for missing commas, colons and brackets.",
          "Write `print(...)` with brackets (Python 3).",
        ],
      },
      urdu: {
        meaning: "Python یہ نہیں سمجھ سکا کہ یہ لائن کس طرح لکھی گئی ہے، یہ Python کے قواعد کے مطابق نہیں۔",
        cause: "عام وجوہات: `:` یا comma غائب ہونا، شرط میں `==` کی بجائے `=` لکھنا، keyword کی غلط spelling، اوپر والی لائن میں bracket کا رہ جانا، یا Python 2 والا کوڈ جیسے `print \"hi\"`۔",
        fix: [
          "`^` والے نشان کی جگہ اور اس سے اوپر والی لائن دونوں دیکھیں۔",
          "`if` میں موازنہ کے لیے `==` لکھیں، `=` صرف value رکھنے کے لیے ہے۔",
          "غائب commas، colons اور brackets چیک کریں۔",
          "`print(...)` ہمیشہ brackets کے ساتھ لکھیں (Python 3)۔",
        ],
      },
      'roman-urdu': {
        meaning: "Python ye nahi samajh saka ke ye line kis tarah likhi gayi hai, ye Python ke rules ke mutabiq nahi.",
        cause: "Aam wajah: `:` ya comma missing hona, condition mein `==` ki jagah `=` likhna, keyword ki ghalat spelling, upar wali line mein bracket reh jana, ya Python 2 wala code jaise `print \"hi\"`.",
        fix: [
          "`^` wale nishan ki jagah aur us se upar wali line dono dekhen.",
          "`if` mein comparison ke liye `==` likhen, `=` sirf value rakhne ke liye hai.",
          "Missing commas, colons aur brackets check karen.",
          "`print(...)` hamesha brackets ke sath likhen (Python 3).",
        ],
      },
      hindi: {
        meaning: "Python यह नहीं समझ पाया कि यह लाइन किस तरह लिखी गई है, यह Python के नियमों के हिसाब से नहीं है।",
        cause: "आम वजहें: `:` या comma छूट जाना, शर्त में `==` की जगह `=` लिखना, keyword की ग़लत spelling, ऊपर वाली लाइन में bracket छूट जाना, या Python 2 वाला कोड जैसे `print \"hi\"`।",
        fix: [
          "`^` वाले निशान की जगह और उसके ऊपर वाली लाइन दोनों देखें।",
          "`if` में तुलना के लिए `==` लिखें, `=` सिर्फ़ value रखने के लिए है।",
          "छूटे हुए commas, colons और brackets जाँचें।",
          "`print(...)` हमेशा brackets के साथ लिखें (Python 3)।",
        ],
      },
      arabic: {
        meaning: "لم يفهم Python طريقة كتابة هذا السطر، فهو مخالف لقواعد اللغة.",
        cause: "أسباب شائعة: نسيان `:` أو فاصلة، أو استخدام `=` بدل `==` في الشرط، أو خطأ في كتابة كلمة محجوزة، أو قوس ناقص في السطر السابق، أو كود Python 2 مثل `print \"hi\"`.",
        fix: [
          "انظر إلى الموضع المُشار إليه بـ `^` وإلى السطر الذي قبله.",
          "استخدم `==` للمقارنة داخل `if`، و`=` للإسناد فقط.",
          "تحقق من الفواصل والنقطتين والأقواس الناقصة.",
          "اكتب `print(...)` مع الأقواس (Python 3).",
        ],
      },
    },
    example: {
      bad: 'if x = 5:\n    print("five")',
      good: 'if x == 5:\n    print("five")',
    },
  },

  // ───────────────────────── Name / scope ─────────────────────────
  {
    id: 'py-unbound-local',
    title: 'UnboundLocalError: local variable referenced before assignment',
    languages: ['python'],
    patterns: [
      /local variable '(\w+)' referenced before assignment/,
      /cannot access local variable '(\w+)' where it is not associated with a value/,
    ],
    text: {
      english: {
        meaning: "Inside a function, the variable `{1}` was used before it got a value.",
        cause: "If you assign to `{1}` anywhere inside a function, Python treats it as a local variable for the whole function, so reading it before that assignment fails. It also happens when `{1}` is only set inside an `if` that did not run.",
        fix: [
          "Give `{1}` a starting value at the top of the function.",
          "If you meant the global variable, pass it as a parameter and `return` the new value (or use `global {1}` as a last resort).",
          "Make sure every `if`/`else` path assigns `{1}` before it is used.",
        ],
      },
      urdu: {
        meaning: "Function کے اندر variable `{1}` کو value ملنے سے پہلے ہی استعمال کر لیا گیا۔",
        cause: "اگر function کے اندر کہیں بھی `{1}` کو value دی جائے تو Python اسے پورے function میں local سمجھتا ہے، اس لیے اس سے پہلے اسے پڑھنے پر یہ error آتا ہے۔ یہ تب بھی ہوتا ہے جب `{1}` صرف کسی ایسے `if` میں بنے جو چلا ہی نہیں۔",
        fix: [
          "Function کے شروع میں `{1}` کو کوئی ابتدائی value دیں۔",
          "اگر آپ global variable استعمال کرنا چاہتے تھے تو اسے parameter میں بھیجیں اور نئی value `return` کریں (یا آخری حل کے طور پر `global {1}`)۔",
          "یقینی بنائیں کہ ہر `if`/`else` راستے میں `{1}` کو استعمال سے پہلے value مل جائے۔",
        ],
      },
      'roman-urdu': {
        meaning: "Function ke andar variable `{1}` ko value milne se pehle hi use kar liya gaya.",
        cause: "Agar function ke andar kahin bhi `{1}` ko value di jaye to Python usay poore function mein local samajhta hai, is liye us se pehle usay read karne par ye error aata hai. Ye tab bhi hota hai jab `{1}` sirf kisi aise `if` mein bane jo chala hi nahi.",
        fix: [
          "Function ke shuru mein `{1}` ko koi starting value den.",
          "Agar aap global variable use karna chahte the to usay parameter mein bhejen aur nayi value `return` karen (ya last option ke tor par `global {1}`).",
          "Ensure karen ke har `if`/`else` raste mein `{1}` ko use se pehle value mil jaye.",
        ],
      },
      hindi: {
        meaning: "Function के अंदर variable `{1}` को value मिलने से पहले ही इस्तेमाल कर लिया गया।",
        cause: "अगर function के अंदर कहीं भी `{1}` को value दी जाए तो Python उसे पूरे function में local मानता है, इसलिए उससे पहले उसे पढ़ने पर यह error आता है। यह तब भी होता है जब `{1}` सिर्फ़ किसी ऐसे `if` में बने जो चला ही नहीं।",
        fix: [
          "Function की शुरुआत में `{1}` को कोई शुरुआती value दें।",
          "अगर आप global variable इस्तेमाल करना चाहते थे तो उसे parameter में भेजें और नई value `return` करें (या आख़िरी उपाय के तौर पर `global {1}`)।",
          "पक्का करें कि हर `if`/`else` रास्ते में `{1}` को इस्तेमाल से पहले value मिल जाए।",
        ],
      },
      arabic: {
        meaning: "داخل دالة، استُخدم المتغير `{1}` قبل أن يُعطى قيمة.",
        cause: "إذا أُسندت قيمة إلى `{1}` في أي مكان داخل الدالة، يعدّه Python متغيرًا محليًا في الدالة كلها، فتفشل قراءته قبل ذلك الإسناد. ويحدث أيضًا عندما يُعرَّف `{1}` داخل `if` لم يُنفَّذ.",
        fix: [
          "أعطِ `{1}` قيمة ابتدائية في أول الدالة.",
          "إذا كنت تقصد المتغير العام فمرّره كمعامل وأعد القيمة الجديدة بـ `return` (أو استخدم `global {1}` كحل أخير).",
          "تأكد أن كل مسار `if`/`else` يُسند قيمة إلى `{1}` قبل استخدامه.",
        ],
      },
    },
    example: {
      bad: 'count = 0\ndef add():\n    count += 1',
      good: 'count = 0\ndef add(count):\n    return count + 1\ncount = add(count)',
    },
  },
  {
    id: 'py-name-error',
    title: "NameError: name is not defined",
    languages: ['python'],
    patterns: [/NameError: name '(\w+)' is not defined/, /name '(\w+)' is not defined/, /"(\w+)" is not defined/],
    text: {
      english: {
        meaning: "Python does not know anything called `{1}` at this point in the code.",
        cause: "Usually a spelling or capital-letter mistake (Python is case-sensitive), using a variable before creating it, a missing `import`, or forgetting quotes around text.",
        fix: [
          "Check the spelling and capital letters of `{1}`.",
          "Make sure `{1}` is created (assigned or defined) above this line.",
          "If `{1}` is a module or function from a library, add the correct `import` at the top.",
          "If you meant plain text, put it in quotes: `\"{1}\"`.",
        ],
      },
      urdu: {
        meaning: "کوڈ کی اس جگہ پر Python کسی `{1}` نام کی چیز کو نہیں جانتا۔",
        cause: "عموماً spelling یا بڑے/چھوٹے حروف کی غلطی (Python میں capital اور small الگ ہیں)، variable بنانے سے پہلے اسے استعمال کرنا، `import` بھول جانا، یا text کے گرد quotes نہ لگانا۔",
        fix: [
          "`{1}` کی spelling اور بڑے/چھوٹے حروف چیک کریں۔",
          "یقینی بنائیں کہ `{1}` اس لائن سے اوپر بنایا (assign یا define کیا) گیا ہو۔",
          "اگر `{1}` کسی library کا module یا function ہے تو فائل کے اوپر صحیح `import` لکھیں۔",
          "اگر یہ سادہ text تھا تو اسے quotes میں لکھیں: `\"{1}\"`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Code ki is jagah par Python kisi `{1}` naam ki cheez ko nahi janta.",
        cause: "Aam tor par spelling ya capital/small letters ki ghalti (Python mein capital aur small alag hain), variable banane se pehle usay use karna, `import` bhool jana, ya text ke gird quotes na lagana.",
        fix: [
          "`{1}` ki spelling aur capital/small letters check karen.",
          "Ensure karen ke `{1}` is line se upar banaya (assign ya define kiya) gaya ho.",
          "Agar `{1}` kisi library ka module ya function hai to file ke upar sahi `import` likhen.",
          "Agar ye simple text tha to usay quotes mein likhen: `\"{1}\"`.",
        ],
      },
      hindi: {
        meaning: "कोड की इस जगह पर Python किसी `{1}` नाम की चीज़ को नहीं जानता।",
        cause: "आमतौर पर spelling या बड़े/छोटे अक्षरों की ग़लती (Python में capital और small अलग हैं), variable बनाने से पहले उसे इस्तेमाल करना, `import` भूल जाना, या text के चारों ओर quotes न लगाना।",
        fix: [
          "`{1}` की spelling और बड़े/छोटे अक्षर जाँचें।",
          "पक्का करें कि `{1}` इस लाइन से ऊपर बनाया (assign या define किया) गया हो।",
          "अगर `{1}` किसी library का module या function है तो फ़ाइल के ऊपर सही `import` लिखें।",
          "अगर यह सादा text था तो उसे quotes में लिखें: `\"{1}\"`।",
        ],
      },
      arabic: {
        meaning: "لا يعرف Python أي شيء باسم `{1}` في هذا الموضع من الكود.",
        cause: "غالبًا خطأ في الكتابة أو في الأحرف الكبيرة والصغيرة (Python يميّز بينها)، أو استخدام متغير قبل إنشائه، أو نسيان `import`، أو نسيان علامات الاقتباس حول نص.",
        fix: [
          "تحقق من كتابة `{1}` وحالة أحرفه.",
          "تأكد أن `{1}` مُعرَّف (أُسندت له قيمة أو عُرِّف) فوق هذا السطر.",
          "إذا كان `{1}` وحدة أو دالة من مكتبة فأضف `import` الصحيح في أعلى الملف.",
          "إذا كنت تقصد نصًا عاديًا فضعه بين علامتي اقتباس: `\"{1}\"`.",
        ],
      },
    },
    example: {
      bad: 'Name = "Ali"\nprint(name)',
      good: 'name = "Ali"\nprint(name)',
    },
  },

  // ───────────────────────── TypeError ─────────────────────────
  {
    id: 'py-type-unsupported-operand',
    title: 'TypeError: unsupported operand type(s)',
    languages: ['python'],
    patterns: [/unsupported operand type\(s\) for ([^:\n]+): '(\w+)' and '(\w+)'/],
    text: {
      english: {
        meaning: "You used `{1}` between a `{2}` and a `{3}`, and Python cannot combine these two types.",
        cause: "Most often a number is mixed with text, for example a value from `input()` (always a `str`) used in maths. A `NoneType` here means a function returned nothing.",
        fix: [
          "Convert the values to the same type first, e.g. `int(x)`, `float(x)` or `str(x)`.",
          "Wrap `input()` in `int(...)` when you need a number: `age = int(input())`.",
          "If one side is `NoneType`, check that the function has a `return` statement.",
        ],
      },
      urdu: {
        meaning: "آپ نے `{2}` اور `{3}` کے درمیان `{1}` استعمال کیا ہے، اور Python ان دونوں types کو آپس میں نہیں جوڑ سکتا۔",
        cause: "زیادہ تر نمبر اور text ملا دیے جاتے ہیں، مثلاً `input()` سے آنے والی value (جو ہمیشہ `str` ہوتی ہے) کو حساب میں لگانا۔ اگر یہاں `NoneType` ہے تو کسی function نے کچھ return نہیں کیا۔",
        fix: [
          "پہلے دونوں values کو ایک ہی type میں بدلیں، جیسے `int(x)`، `float(x)` یا `str(x)`۔",
          "نمبر چاہیے ہو تو `input()` کو `int(...)` میں لپیٹیں: `age = int(input())`۔",
          "اگر ایک طرف `NoneType` ہے تو دیکھیں کہ function میں `return` موجود ہے۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne `{2}` aur `{3}` ke darmiyan `{1}` use kiya hai, aur Python in dono types ko aapas mein nahi jor sakta.",
        cause: "Zyada tar number aur text mix ho jate hain, maslan `input()` se aane wali value (jo hamesha `str` hoti hai) ko calculation mein lagana. Agar yahan `NoneType` hai to kisi function ne kuch return nahi kiya.",
        fix: [
          "Pehle dono values ko aik hi type mein convert karen, jaise `int(x)`, `float(x)` ya `str(x)`.",
          "Number chahiye ho to `input()` ko `int(...)` mein wrap karen: `age = int(input())`.",
          "Agar aik side `NoneType` hai to check karen ke function mein `return` maujood hai.",
        ],
      },
      hindi: {
        meaning: "आपने `{2}` और `{3}` के बीच `{1}` इस्तेमाल किया है, और Python इन दोनों types को आपस में नहीं जोड़ सकता।",
        cause: "ज़्यादातर नंबर और text मिला दिए जाते हैं, जैसे `input()` से आई value (जो हमेशा `str` होती है) को हिसाब में लगाना। अगर यहाँ `NoneType` है तो किसी function ने कुछ return नहीं किया।",
        fix: [
          "पहले दोनों values को एक ही type में बदलें, जैसे `int(x)`, `float(x)` या `str(x)`।",
          "नंबर चाहिए तो `input()` को `int(...)` में लपेटें: `age = int(input())`।",
          "अगर एक तरफ़ `NoneType` है तो देखें कि function में `return` मौजूद है।",
        ],
      },
      arabic: {
        meaning: "استخدمت `{1}` بين قيمة من نوع `{2}` وأخرى من نوع `{3}`، ولا يستطيع Python الجمع بين هذين النوعين.",
        cause: "غالبًا يُخلط رقم مع نص، مثل استخدام قيمة من `input()` (وهي دائمًا `str`) في عملية حسابية. وظهور `NoneType` يعني أن دالةً لم تُرجع شيئًا.",
        fix: [
          "حوّل القيم أولًا إلى النوع نفسه، مثل `int(x)` أو `float(x)` أو `str(x)`.",
          "ضع `input()` داخل `int(...)` عندما تحتاج رقمًا: `age = int(input())`.",
          "إذا كان أحد الطرفين `NoneType` فتأكد أن الدالة تحتوي على `return`.",
        ],
      },
    },
    example: {
      bad: 'age = input("Age: ")\nprint(age + 1)',
      good: 'age = int(input("Age: "))\nprint(age + 1)',
    },
  },
  {
    id: 'py-type-concat-str',
    title: 'TypeError: can only concatenate str (not "int") to str',
    languages: ['python'],
    patterns: [/can only concatenate (\w+) \(not "(\w+)"\) to \w+/],
    text: {
      english: {
        meaning: "You tried to join a `{1}` with a `{2}` using `+`, but `+` only joins values of the same type.",
        cause: "Typically text and a number are joined, like `\"Age: \" + 20`.",
        fix: [
          "Convert the number to text with `str(...)`: `\"Age: \" + str(age)`.",
          "Or use an f-string: `f\"Age: {age}\"`.",
          "Or pass separate values to `print`: `print(\"Age:\", age)`.",
        ],
      },
      urdu: {
        meaning: "آپ نے `+` سے `{1}` اور `{2}` کو جوڑنے کی کوشش کی، مگر `+` صرف ایک جیسی types کو جوڑتا ہے۔",
        cause: "عام طور پر text اور نمبر کو جوڑا جاتا ہے، جیسے `\"Age: \" + 20`۔",
        fix: [
          "نمبر کو `str(...)` سے text میں بدلیں: `\"Age: \" + str(age)`۔",
          "یا f-string استعمال کریں: `f\"Age: {age}\"`۔",
          "یا `print` کو الگ الگ values دیں: `print(\"Age:\", age)`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne `+` se `{1}` aur `{2}` ko jorne ki koshish ki, lekin `+` sirf aik jaisi types ko jorta hai.",
        cause: "Aam tor par text aur number ko jora jata hai, jaise `\"Age: \" + 20`.",
        fix: [
          "Number ko `str(...)` se text mein badlen: `\"Age: \" + str(age)`.",
          "Ya f-string use karen: `f\"Age: {age}\"`.",
          "Ya `print` ko alag alag values den: `print(\"Age:\", age)`.",
        ],
      },
      hindi: {
        meaning: "आपने `+` से `{1}` और `{2}` को जोड़ने की कोशिश की, लेकिन `+` सिर्फ़ एक जैसी types को जोड़ता है।",
        cause: "आमतौर पर text और नंबर को जोड़ा जाता है, जैसे `\"Age: \" + 20`।",
        fix: [
          "नंबर को `str(...)` से text में बदलें: `\"Age: \" + str(age)`।",
          "या f-string इस्तेमाल करें: `f\"Age: {age}\"`।",
          "या `print` को अलग-अलग values दें: `print(\"Age:\", age)`।",
        ],
      },
      arabic: {
        meaning: "حاولت ربط قيمة من نوع `{1}` بقيمة من نوع `{2}` باستخدام `+`، لكن `+` يربط القيم من النوع نفسه فقط.",
        cause: "عادةً يُربط نص برقم، مثل `\"Age: \" + 20`.",
        fix: [
          "حوّل الرقم إلى نص بـ `str(...)`: `\"Age: \" + str(age)`.",
          "أو استخدم f-string: `f\"Age: {age}\"`.",
          "أو مرّر القيم منفصلة إلى `print`: `print(\"Age:\", age)`.",
        ],
      },
    },
    example: {
      bad: 'age = 20\nprint("Age: " + age)',
      good: 'age = 20\nprint(f"Age: {age}")',
    },
  },
  {
    id: 'py-type-nonetype',
    title: "TypeError: 'NoneType' object is not subscriptable / callable",
    languages: ['python'],
    patterns: [/'NoneType' object is not (subscriptable|callable|iterable)/],
    text: {
      english: {
        meaning: "You treated a value that is `None` (nothing) as if it were a list, dict or function. `None` is not {1}.",
        cause: "Usually a function did not `return` anything, or you saved the result of a method that changes things in place, like `x = my_list.sort()` or `x = my_list.append(5)` (these return `None`).",
        fix: [
          "Print the variable before this line to see that it is `None`.",
          "Make sure the function you called ends with a `return` statement.",
          "Do not assign the result of `.sort()`, `.append()` or `.reverse()`; call them on their own, or use `sorted(...)`.",
        ],
      },
      urdu: {
        meaning: "آپ نے ایک ایسی value کو جو `None` (یعنی کچھ نہیں) ہے، list، dict یا function کی طرح استعمال کیا۔ `None` {1} نہیں ہوتا۔",
        cause: "عموماً کسی function نے کچھ `return` نہیں کیا، یا آپ نے ایسے method کا نتیجہ save کیا جو چیز کو وہیں بدل دیتا ہے، جیسے `x = my_list.sort()` یا `x = my_list.append(5)` (یہ `None` دیتے ہیں)۔",
        fix: [
          "اس لائن سے پہلے variable کو print کر کے دیکھیں کہ وہ `None` ہے۔",
          "یقینی بنائیں کہ جس function کو call کیا اس کے آخر میں `return` موجود ہو۔",
          "`.sort()`، `.append()` یا `.reverse()` کا نتیجہ کسی variable میں نہ رکھیں، انہیں الگ سے چلائیں یا `sorted(...)` استعمال کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne aik aisi value ko jo `None` (yani kuch nahi) hai, list, dict ya function ki tarah use kiya. `None` {1} nahi hota.",
        cause: "Aam tor par kisi function ne kuch `return` nahi kiya, ya aap ne aise method ka result save kiya jo cheez ko wahin badal deta hai, jaise `x = my_list.sort()` ya `x = my_list.append(5)` (ye `None` dete hain).",
        fix: [
          "Is line se pehle variable ko print kar ke dekhen ke wo `None` hai.",
          "Ensure karen ke jis function ko call kiya uske end mein `return` maujood ho.",
          "`.sort()`, `.append()` ya `.reverse()` ka result kisi variable mein na rakhen, inhein alag se chalayen ya `sorted(...)` use karen.",
        ],
      },
      hindi: {
        meaning: "आपने एक ऐसी value को जो `None` (यानी कुछ नहीं) है, list, dict या function की तरह इस्तेमाल किया। `None` {1} नहीं होता।",
        cause: "आमतौर पर किसी function ने कुछ `return` नहीं किया, या आपने ऐसे method का नतीजा save किया जो चीज़ को वहीं बदल देता है, जैसे `x = my_list.sort()` या `x = my_list.append(5)` (ये `None` देते हैं)।",
        fix: [
          "इस लाइन से पहले variable को print करके देखें कि वह `None` है।",
          "पक्का करें कि जिस function को call किया उसके आख़िर में `return` मौजूद हो।",
          "`.sort()`, `.append()` या `.reverse()` का नतीजा किसी variable में न रखें, इन्हें अलग से चलाएँ या `sorted(...)` इस्तेमाल करें।",
        ],
      },
      arabic: {
        meaning: "تعاملت مع قيمة هي `None` (لا شيء) كأنها قائمة أو قاموس أو دالة. القيمة `None` ليست {1}.",
        cause: "غالبًا لم تُرجع دالةٌ شيئًا بـ `return`، أو حفظت نتيجة دالة تعدّل الكائن مباشرة مثل `x = my_list.sort()` أو `x = my_list.append(5)` (وهذه تُرجع `None`).",
        fix: [
          "اطبع المتغير قبل هذا السطر لتتأكد أنه `None`.",
          "تأكد أن الدالة التي استدعيتها تنتهي بـ `return`.",
          "لا تُسند نتيجة `.sort()` أو `.append()` أو `.reverse()` إلى متغير؛ استدعها وحدها أو استخدم `sorted(...)`.",
        ],
      },
    },
    example: {
      bad: 'nums = [3, 1, 2].sort()\nprint(nums[0])',
      good: 'nums = sorted([3, 1, 2])\nprint(nums[0])',
    },
  },
  {
    id: 'py-type-missing-arg',
    title: 'TypeError: missing required positional argument',
    languages: ['python'],
    patterns: [/(\w+)\(\) missing \d+ required (?:positional |keyword-only )?arguments?: (.+)/],
    text: {
      english: {
        meaning: "The function `{1}()` needs more values, but you did not give it: {2}.",
        cause: "The call has fewer arguments than the `def` line asks for. For a method inside a class, it can also mean you called it on the class instead of on an object.",
        fix: [
          "Look at the `def {1}(...)` line and pass one value for each parameter.",
          "If `{1}` is a method, create an object first: `obj = MyClass()` then `obj.{1}(...)`.",
          "Or give the parameter a default value in the `def` line, e.g. `def {1}(x=0)`.",
        ],
      },
      urdu: {
        meaning: "Function `{1}()` کو مزید values چاہئیں جو آپ نے نہیں دیں: {2}۔",
        cause: "Call میں arguments کی تعداد `def` والی لائن سے کم ہے۔ اگر یہ class کا method ہے تو ممکن ہے آپ نے object کی بجائے سیدھا class پر call کیا ہو۔",
        fix: [
          "`def {1}(...)` والی لائن دیکھیں اور ہر parameter کے لیے ایک value دیں۔",
          "اگر `{1}` method ہے تو پہلے object بنائیں: `obj = MyClass()` پھر `obj.{1}(...)`۔",
          "یا `def` والی لائن میں parameter کو default value دے دیں، جیسے `def {1}(x=0)`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Function `{1}()` ko aur values chahiyen jo aap ne nahi din: {2}.",
        cause: "Call mein arguments ki ginti `def` wali line se kam hai. Agar ye class ka method hai to ho sakta hai aap ne object ki bajaye seedha class par call kiya ho.",
        fix: [
          "`def {1}(...)` wali line dekhen aur har parameter ke liye aik value den.",
          "Agar `{1}` method hai to pehle object banayen: `obj = MyClass()` phir `obj.{1}(...)`.",
          "Ya `def` wali line mein parameter ko default value de den, jaise `def {1}(x=0)`.",
        ],
      },
      hindi: {
        meaning: "Function `{1}()` को और values चाहिए जो आपने नहीं दीं: {2}।",
        cause: "Call में arguments की गिनती `def` वाली लाइन से कम है। अगर यह class का method है तो हो सकता है आपने object की जगह सीधे class पर call किया हो।",
        fix: [
          "`def {1}(...)` वाली लाइन देखें और हर parameter के लिए एक value दें।",
          "अगर `{1}` method है तो पहले object बनाएँ: `obj = MyClass()` फिर `obj.{1}(...)`।",
          "या `def` वाली लाइन में parameter को default value दे दें, जैसे `def {1}(x=0)`।",
        ],
      },
      arabic: {
        meaning: "الدالة `{1}()` تحتاج إلى قيم لم تمرّرها: {2}.",
        cause: "عدد الوسائط في الاستدعاء أقل مما يطلبه سطر `def`. وإذا كانت دالة داخل class فربما استدعيتها على الـ class نفسه بدل كائن منه.",
        fix: [
          "انظر إلى سطر `def {1}(...)` ومرّر قيمة لكل معامل.",
          "إذا كانت `{1}` دالة في class فأنشئ كائنًا أولًا: `obj = MyClass()` ثم `obj.{1}(...)`.",
          "أو أعطِ المعامل قيمة افتراضية في سطر `def`، مثل `def {1}(x=0)`.",
        ],
      },
    },
  },
  {
    id: 'py-type-args-count',
    title: 'TypeError: takes N positional arguments but M were given',
    languages: ['python'],
    patterns: [/(\w+)\(\) takes (?:from \d+ to )?(\d+) positional arguments? but (\d+) (?:were|was) given/],
    text: {
      english: {
        meaning: "The function `{1}()` accepts {2} argument(s), but it received {3}.",
        cause: "You passed too many values. Inside a class, a very common reason is forgetting `self` as the first parameter of the method: Python passes the object automatically, so it counts as one extra argument.",
        fix: [
          "Compare the call with the `def {1}(...)` line and remove the extra values.",
          "If `{1}` is a method in a class, add `self` as its first parameter: `def {1}(self, ...)`.",
        ],
      },
      urdu: {
        meaning: "Function `{1}()` صرف {2} argument(s) لیتا ہے، مگر اسے {3} دیے گئے۔",
        cause: "آپ نے زیادہ values بھیج دیں۔ Class کے اندر سب سے عام وجہ method کے پہلے parameter میں `self` بھول جانا ہے: Python خود object بھیجتا ہے، اس لیے وہ ایک اضافی argument گنا جاتا ہے۔",
        fix: [
          "Call کو `def {1}(...)` والی لائن سے ملائیں اور فالتو values ہٹا دیں۔",
          "اگر `{1}` کسی class کا method ہے تو پہلا parameter `self` رکھیں: `def {1}(self, ...)`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Function `{1}()` sirf {2} argument(s) leta hai, lekin usay {3} diye gaye.",
        cause: "Aap ne zyada values bhej din. Class ke andar sab se common wajah method ke pehle parameter mein `self` bhool jana hai: Python khud object bhejta hai, is liye wo aik extra argument gina jata hai.",
        fix: [
          "Call ko `def {1}(...)` wali line se milayen aur extra values hata den.",
          "Agar `{1}` kisi class ka method hai to pehla parameter `self` rakhen: `def {1}(self, ...)`.",
        ],
      },
      hindi: {
        meaning: "Function `{1}()` सिर्फ़ {2} argument(s) लेता है, लेकिन उसे {3} दिए गए।",
        cause: "आपने ज़्यादा values भेज दीं। Class के अंदर सबसे आम वजह method के पहले parameter में `self` भूल जाना है: Python ख़ुद object भेजता है, इसलिए वह एक extra argument गिना जाता है।",
        fix: [
          "Call को `def {1}(...)` वाली लाइन से मिलाएँ और फ़ालतू values हटा दें।",
          "अगर `{1}` किसी class का method है तो पहला parameter `self` रखें: `def {1}(self, ...)`।",
        ],
      },
      arabic: {
        meaning: "الدالة `{1}()` تقبل {2} من الوسائط، لكنها استقبلت {3}.",
        cause: "مرّرت قيمًا أكثر من اللازم. وداخل الـ class السبب الأشهر هو نسيان `self` كأول معامل: Python يمرّر الكائن تلقائيًا فيُحسب وسيطًا إضافيًا.",
        fix: [
          "قارن الاستدعاء بسطر `def {1}(...)` واحذف القيم الزائدة.",
          "إذا كانت `{1}` دالة داخل class فأضف `self` كأول معامل: `def {1}(self, ...)`.",
        ],
      },
    },
    example: {
      bad: 'class Dog:\n    def bark():\n        print("Woof")\nDog().bark()',
      good: 'class Dog:\n    def bark(self):\n        print("Woof")\nDog().bark()',
    },
  },
  {
    id: 'py-type-not-iterable',
    title: "TypeError: object is not iterable",
    languages: ['python'],
    patterns: [/'(\w+)' object is not iterable/, /cannot unpack non-iterable (\w+) object/],
    text: {
      english: {
        meaning: "You tried to loop over (or unpack) a `{1}`, but a `{1}` cannot be looped over.",
        cause: "Most often `for i in 10:` is written instead of `for i in range(10):`, or a function returned a single value where you expected a list or tuple.",
        fix: [
          "To repeat N times, use `range(N)`: `for i in range(n):`.",
          "Check that the variable really holds a list, string, tuple or dict here (print it with `type(...)`).",
          "If you unpack like `a, b = f()`, make sure `f` returns two values.",
        ],
      },
      urdu: {
        meaning: "آپ نے `{1}` پر loop چلانے (یا اسے unpack کرنے) کی کوشش کی، مگر `{1}` پر loop نہیں چل سکتا۔",
        cause: "زیادہ تر `for i in range(10):` کی بجائے `for i in 10:` لکھ دیا جاتا ہے، یا کسی function نے list/tuple کی بجائے ایک ہی value واپس کی۔",
        fix: [
          "N بار دہرانے کے لیے `range(N)` لکھیں: `for i in range(n):`۔",
          "دیکھیں کہ variable میں واقعی list، string، tuple یا dict ہے (`type(...)` سے print کریں)۔",
          "اگر `a, b = f()` لکھا ہے تو یقینی بنائیں کہ `f` دو values واپس کرے۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne `{1}` par loop chalane (ya usay unpack karne) ki koshish ki, lekin `{1}` par loop nahi chal sakta.",
        cause: "Zyada tar `for i in range(10):` ki bajaye `for i in 10:` likh diya jata hai, ya kisi function ne list/tuple ki bajaye aik hi value return ki.",
        fix: [
          "N baar repeat karne ke liye `range(N)` likhen: `for i in range(n):`.",
          "Check karen ke variable mein waqai list, string, tuple ya dict hai (`type(...)` se print karen).",
          "Agar `a, b = f()` likha hai to ensure karen ke `f` do values return kare.",
        ],
      },
      hindi: {
        meaning: "आपने `{1}` पर loop चलाने (या उसे unpack करने) की कोशिश की, लेकिन `{1}` पर loop नहीं चल सकता।",
        cause: "ज़्यादातर `for i in range(10):` की जगह `for i in 10:` लिख दिया जाता है, या किसी function ने list/tuple की जगह एक ही value लौटाई।",
        fix: [
          "N बार दोहराने के लिए `range(N)` लिखें: `for i in range(n):`।",
          "देखें कि variable में सच में list, string, tuple या dict है (`type(...)` से print करें)।",
          "अगर `a, b = f()` लिखा है तो पक्का करें कि `f` दो values लौटाए।",
        ],
      },
      arabic: {
        meaning: "حاولت المرور بحلقة على قيمة من نوع `{1}` (أو تفكيكها)، لكن هذا النوع لا يمكن المرور عليه.",
        cause: "غالبًا يُكتب `for i in 10:` بدل `for i in range(10):`، أو أن دالة أرجعت قيمة واحدة بدل قائمة أو tuple.",
        fix: [
          "للتكرار N مرة استخدم `range(N)`: `for i in range(n):`.",
          "تأكد أن المتغير يحتوي فعلًا على list أو string أو tuple أو dict (اطبعه مع `type(...)`).",
          "إذا كتبت `a, b = f()` فتأكد أن `f` تُرجع قيمتين.",
        ],
      },
    },
    example: {
      bad: 'for i in 5:\n    print(i)',
      good: 'for i in range(5):\n    print(i)',
    },
  },

  // ───────────────────────── AttributeError ─────────────────────────
  {
    id: 'py-attribute-none',
    title: "AttributeError: 'NoneType' object has no attribute",
    languages: ['python'],
    patterns: [/'NoneType' object has no attribute '(\w+)'/],
    text: {
      english: {
        meaning: "You tried to use `.{1}` on a value that is `None` (nothing).",
        cause: "The variable is `None` because a function did not `return` a value, a search found nothing (for example `re.match(...)` or `soup.find(...)`), or you saved the result of an in-place method like `.sort()`.",
        fix: [
          "Print the variable just before this line to confirm it is `None`.",
          "Check the function that created it: does it `return` something?",
          "Guard against no result: `if result is not None:` before using `.{1}`.",
        ],
      },
      urdu: {
        meaning: "آپ نے ایک ایسی value پر `.{1}` استعمال کرنے کی کوشش کی جو `None` (یعنی کچھ نہیں) ہے۔",
        cause: "Variable اس لیے `None` ہے کہ کسی function نے value `return` نہیں کی، کسی تلاش کو کچھ نہیں ملا (جیسے `re.match(...)` یا `soup.find(...)`)، یا آپ نے `.sort()` جیسے method کا نتیجہ save کیا۔",
        fix: [
          "اس لائن سے ذرا پہلے variable کو print کر کے دیکھیں کہ وہ `None` ہے۔",
          "جس function نے یہ value دی اسے چیک کریں: کیا وہ کچھ `return` کرتا ہے؟",
          "نتیجہ نہ ملنے کی صورت سنبھالیں: `.{1}` سے پہلے `if result is not None:` لکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne aik aisi value par `.{1}` use karne ki koshish ki jo `None` (yani kuch nahi) hai.",
        cause: "Variable is liye `None` hai ke kisi function ne value `return` nahi ki, kisi search ko kuch nahi mila (jaise `re.match(...)` ya `soup.find(...)`), ya aap ne `.sort()` jaise method ka result save kiya.",
        fix: [
          "Is line se zara pehle variable ko print kar ke dekhen ke wo `None` hai.",
          "Jis function ne ye value di usay check karen: kya wo kuch `return` karta hai?",
          "Result na milne ki surat handle karen: `.{1}` se pehle `if result is not None:` likhen.",
        ],
      },
      hindi: {
        meaning: "आपने एक ऐसी value पर `.{1}` इस्तेमाल करने की कोशिश की जो `None` (यानी कुछ नहीं) है।",
        cause: "Variable इसलिए `None` है क्योंकि किसी function ने value `return` नहीं की, किसी खोज में कुछ नहीं मिला (जैसे `re.match(...)` या `soup.find(...)`), या आपने `.sort()` जैसे method का नतीजा save किया।",
        fix: [
          "इस लाइन से ठीक पहले variable को print करके देखें कि वह `None` है।",
          "जिस function ने यह value दी उसे जाँचें: क्या वह कुछ `return` करता है?",
          "नतीजा न मिलने की हालत संभालें: `.{1}` से पहले `if result is not None:` लिखें।",
        ],
      },
      arabic: {
        meaning: "حاولت استخدام `.{1}` على قيمة هي `None` (لا شيء).",
        cause: "المتغير قيمته `None` لأن دالةً لم تُرجع قيمة، أو لأن بحثًا لم يجد شيئًا (مثل `re.match(...)` أو `soup.find(...)`)، أو لأنك حفظت نتيجة دالة مثل `.sort()`.",
        fix: [
          "اطبع المتغير قبل هذا السطر مباشرة لتتأكد أنه `None`.",
          "افحص الدالة التي أنشأته: هل تُرجع شيئًا بـ `return`؟",
          "تعامل مع حالة عدم وجود نتيجة: `if result is not None:` قبل استخدام `.{1}`.",
        ],
      },
    },
  },
  {
    id: 'py-attribute-error',
    title: "AttributeError: object has no attribute",
    languages: ['python'],
    patterns: [/'(\w+)' object has no attribute '(\w+)'/, /module '([\w.]+)' has no attribute '(\w+)'/],
    text: {
      english: {
        meaning: "`{1}` does not have anything called `{2}`.",
        cause: "Common reasons: a spelling or capital-letter mistake in `{2}`, using a method from a different type (like `.append` on a `str`), or naming your own file the same as a library (e.g. `random.py`), which hides the real module.",
        fix: [
          "Check the spelling of `{2}`; type `.` after the variable to see VS Code suggestions.",
          "Check the variable's real type with `print(type(x))`; it may not be what you think.",
          "If `{1}` is a module, make sure none of your own files is named `{1}.py`.",
        ],
      },
      urdu: {
        meaning: "`{1}` کے پاس `{2}` نام کی کوئی چیز نہیں ہے۔",
        cause: "عام وجوہات: `{2}` کی spelling یا بڑے/چھوٹے حروف کی غلطی، کسی دوسری type کا method استعمال کرنا (جیسے `str` پر `.append`)، یا اپنی فائل کا نام کسی library جیسا رکھنا (مثلاً `random.py`) جس سے اصل module چھپ جاتا ہے۔",
        fix: [
          "`{2}` کی spelling چیک کریں؛ variable کے بعد `.` لکھ کر VS Code کی تجاویز دیکھیں۔",
          "`print(type(x))` سے variable کی اصل type دیکھیں، ہو سکتا ہے وہ آپ کی سوچ سے مختلف ہو۔",
          "اگر `{1}` ایک module ہے تو دیکھیں کہ آپ کی اپنی کسی فائل کا نام `{1}.py` نہ ہو۔",
        ],
      },
      'roman-urdu': {
        meaning: "`{1}` ke paas `{2}` naam ki koi cheez nahi hai.",
        cause: "Aam wajah: `{2}` ki spelling ya capital/small letters ki ghalti, kisi doosri type ka method use karna (jaise `str` par `.append`), ya apni file ka naam kisi library jaisa rakhna (maslan `random.py`) jis se asal module chhup jata hai.",
        fix: [
          "`{2}` ki spelling check karen; variable ke baad `.` likh kar VS Code ki suggestions dekhen.",
          "`print(type(x))` se variable ki asal type dekhen, ho sakta hai wo aap ki soch se different ho.",
          "Agar `{1}` aik module hai to dekhen ke aap ki apni kisi file ka naam `{1}.py` na ho.",
        ],
      },
      hindi: {
        meaning: "`{1}` के पास `{2}` नाम की कोई चीज़ नहीं है।",
        cause: "आम वजहें: `{2}` की spelling या बड़े/छोटे अक्षरों की ग़लती, किसी दूसरी type का method इस्तेमाल करना (जैसे `str` पर `.append`), या अपनी फ़ाइल का नाम किसी library जैसा रखना (जैसे `random.py`) जिससे असली module छिप जाता है।",
        fix: [
          "`{2}` की spelling जाँचें; variable के बाद `.` लिखकर VS Code के सुझाव देखें।",
          "`print(type(x))` से variable की असली type देखें, हो सकता है वह आपकी सोच से अलग हो।",
          "अगर `{1}` एक module है तो देखें कि आपकी अपनी किसी फ़ाइल का नाम `{1}.py` न हो।",
        ],
      },
      arabic: {
        meaning: "`{1}` لا يحتوي على شيء باسم `{2}`.",
        cause: "أسباب شائعة: خطأ في كتابة `{2}` أو في حالة الأحرف، أو استخدام دالة من نوع آخر (مثل `.append` على `str`)، أو تسمية ملفك باسم مكتبة (مثل `random.py`) مما يُخفي الوحدة الأصلية.",
        fix: [
          "تحقق من كتابة `{2}`؛ اكتب `.` بعد المتغير لترى اقتراحات VS Code.",
          "اعرف النوع الحقيقي للمتغير بـ `print(type(x))`، فقد يكون غير ما تتوقع.",
          "إذا كان `{1}` وحدة (module) فتأكد أنه لا يوجد ملف لك باسم `{1}.py`.",
        ],
      },
    },
    example: {
      bad: 'name = "ali"\nname.append("!")',
      good: 'name = "ali"\nname = name + "!"',
    },
  },

  // ───────────────────────── Lookup errors ─────────────────────────
  {
    id: 'py-index-error',
    title: 'IndexError: list index out of range',
    languages: ['python'],
    patterns: [/IndexError: (\w+) (?:assignment )?index out of range/],
    text: {
      english: {
        meaning: "You asked for a position in a {1} that does not exist.",
        cause: "Positions start at `0`, so the last item is at `len(x) - 1`. Common causes: using `x[len(x)]`, a loop going one step too far, or the {1} being empty.",
        fix: [
          "Remember: a {1} with 3 items has positions `0`, `1`, `2`.",
          "Loop with `for item in x:` or `for i in range(len(x)):` instead of manual counters.",
          "Check the length first: `if i < len(x):` or `if x:` (not empty).",
        ],
      },
      urdu: {
        meaning: "آپ نے {1} میں ایسی جگہ (index) مانگی جو موجود ہی نہیں۔",
        cause: "گنتی `0` سے شروع ہوتی ہے، اس لیے آخری چیز `len(x) - 1` پر ہوتی ہے۔ عام وجوہات: `x[len(x)]` لکھنا، loop کا ایک قدم زیادہ چل جانا، یا {1} کا خالی ہونا۔",
        fix: [
          "یاد رکھیں: 3 چیزوں والی {1} کی جگہیں `0`، `1`، `2` ہیں۔",
          "خود گنتی کرنے کی بجائے `for item in x:` یا `for i in range(len(x)):` استعمال کریں۔",
          "پہلے لمبائی چیک کریں: `if i < len(x):` یا `if x:` (خالی نہ ہو)۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ne {1} mein aisi position (index) maangi jo maujood hi nahi.",
        cause: "Counting `0` se shuru hoti hai, is liye aakhri item `len(x) - 1` par hota hai. Aam wajah: `x[len(x)]` likhna, loop ka aik step zyada chal jana, ya {1} ka khali hona.",
        fix: [
          "Yaad rakhen: 3 items wali {1} ki positions `0`, `1`, `2` hain.",
          "Khud counter chalane ki bajaye `for item in x:` ya `for i in range(len(x)):` use karen.",
          "Pehle length check karen: `if i < len(x):` ya `if x:` (khali na ho).",
        ],
      },
      hindi: {
        meaning: "आपने {1} में ऐसी जगह (index) माँगी जो मौजूद ही नहीं है।",
        cause: "गिनती `0` से शुरू होती है, इसलिए आख़िरी चीज़ `len(x) - 1` पर होती है। आम वजहें: `x[len(x)]` लिखना, loop का एक क़दम ज़्यादा चल जाना, या {1} का ख़ाली होना।",
        fix: [
          "याद रखें: 3 चीज़ों वाली {1} की जगहें `0`, `1`, `2` हैं।",
          "ख़ुद गिनती करने की जगह `for item in x:` या `for i in range(len(x)):` इस्तेमाल करें।",
          "पहले लंबाई जाँचें: `if i < len(x):` या `if x:` (ख़ाली न हो)।",
        ],
      },
      arabic: {
        meaning: "طلبت موضعًا (index) غير موجود في الـ {1}.",
        cause: "الترقيم يبدأ من `0`، فآخر عنصر يكون في `len(x) - 1`. أسباب شائعة: كتابة `x[len(x)]`، أو حلقة تتجاوز بخطوة واحدة، أو أن الـ {1} فارغ.",
        fix: [
          "تذكّر: {1} فيه 3 عناصر مواضعه `0` و`1` و`2`.",
          "استخدم `for item in x:` أو `for i in range(len(x)):` بدل العدّاد اليدوي.",
          "تحقق من الطول أولًا: `if i < len(x):` أو `if x:` (غير فارغ).",
        ],
      },
    },
    example: {
      bad: 'nums = [10, 20, 30]\nprint(nums[3])',
      good: 'nums = [10, 20, 30]\nprint(nums[2])  # or nums[-1]',
    },
  },
  {
    id: 'py-key-error',
    title: 'KeyError',
    languages: ['python'],
    patterns: [/KeyError: ('[^'\n]*'|"[^"\n]*"|[^\s]+)/],
    text: {
      english: {
        meaning: "The dictionary does not contain the key {1}.",
        cause: "The key is spelled differently (keys are case-sensitive), it was never added, or the data (e.g. from JSON or a form) does not have it.",
        fix: [
          "Print the keys to see what is really there: `print(d.keys())`.",
          "Use `d.get(key)` (or `d.get(key, default)`) when the key may be missing.",
          "Check first: `if key in d:`.",
        ],
      },
      urdu: {
        meaning: "Dictionary میں {1} نام کی key موجود نہیں ہے۔",
        cause: "Key کی spelling مختلف ہے (بڑے/چھوٹے حروف کا فرق بھی)، وہ کبھی شامل ہی نہیں کی گئی، یا data (مثلاً JSON یا form) میں وہ موجود نہیں۔",
        fix: [
          "اصل keys دیکھنے کے لیے print کریں: `print(d.keys())`۔",
          "جہاں key نہ ہونے کا امکان ہو وہاں `d.get(key)` (یا `d.get(key, default)`) استعمال کریں۔",
          "پہلے چیک کر لیں: `if key in d:`۔",
        ],
      },
      'roman-urdu': {
        meaning: "Dictionary mein {1} naam ki key maujood nahi hai.",
        cause: "Key ki spelling different hai (capital/small ka farq bhi), wo kabhi add hi nahi ki gayi, ya data (maslan JSON ya form) mein wo maujood nahi.",
        fix: [
          "Asal keys dekhne ke liye print karen: `print(d.keys())`.",
          "Jahan key na hone ka chance ho wahan `d.get(key)` (ya `d.get(key, default)`) use karen.",
          "Pehle check kar len: `if key in d:`.",
        ],
      },
      hindi: {
        meaning: "Dictionary में {1} नाम की key मौजूद नहीं है।",
        cause: "Key की spelling अलग है (बड़े/छोटे अक्षरों का फ़र्क़ भी), वह कभी जोड़ी ही नहीं गई, या data (जैसे JSON या form) में वह मौजूद नहीं है।",
        fix: [
          "असली keys देखने के लिए print करें: `print(d.keys())`।",
          "जहाँ key न होने की संभावना हो वहाँ `d.get(key)` (या `d.get(key, default)`) इस्तेमाल करें।",
          "पहले जाँच लें: `if key in d:`।",
        ],
      },
      arabic: {
        meaning: "القاموس (dictionary) لا يحتوي على المفتاح {1}.",
        cause: "المفتاح مكتوب بشكل مختلف (مع مراعاة حالة الأحرف)، أو لم يُضَف أصلًا، أو أن البيانات (مثل JSON أو نموذج) لا تحتوي عليه.",
        fix: [
          "اطبع المفاتيح لترى ما هو موجود فعلًا: `print(d.keys())`.",
          "استخدم `d.get(key)` (أو `d.get(key, default)`) عندما قد يكون المفتاح غير موجود.",
          "تحقق أولًا: `if key in d:`.",
        ],
      },
    },
    example: {
      bad: 'student = {"name": "Sara"}\nprint(student["age"])',
      good: 'student = {"name": "Sara"}\nprint(student.get("age", "unknown"))',
    },
  },
  {
    id: 'py-value-convert',
    title: 'ValueError: invalid literal for int()',
    languages: ['python'],
    patterns: [
      /invalid literal for (\w+)\(\) with base \d+: ('[^\n]*'|"[^\n]*")/,
      /could not convert string to (\w+): ('[^\n]*'|"[^\n]*")/,
    ],
    text: {
      english: {
        meaning: "`{1}()` could not turn the text {2} into a number.",
        cause: "The text contains letters, spaces, a decimal point (for `int`), or is empty `''`. This often happens with `input()` when the user presses Enter or types a word.",
        fix: [
          "Make sure the input is only digits; use `float(...)` for numbers with a decimal point.",
          "Remove extra spaces with `.strip()`: `int(text.strip())`.",
          "Handle bad input with `try: ... except ValueError:` and ask again.",
        ],
      },
      urdu: {
        meaning: "`{1}()` اس text {2} کو نمبر میں نہیں بدل سکا۔",
        cause: "Text میں حروف، spaces، اعشاریہ (`int` کے لیے) ہیں یا وہ خالی `''` ہے۔ اکثر `input()` کے ساتھ ایسا ہوتا ہے جب صارف صرف Enter دبا دے یا کوئی لفظ لکھ دے۔",
        fix: [
          "یقینی بنائیں کہ input میں صرف ہندسے ہوں؛ اعشاریہ والے نمبر کے لیے `float(...)` استعمال کریں۔",
          "`.strip()` سے فالتو spaces ہٹائیں: `int(text.strip())`۔",
          "غلط input کو `try: ... except ValueError:` سے سنبھالیں اور دوبارہ پوچھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "`{1}()` is text {2} ko number mein nahi badal saka.",
        cause: "Text mein letters, spaces, decimal point (`int` ke liye) hain ya wo khali `''` hai. Aksar `input()` ke sath aisa hota hai jab user sirf Enter daba de ya koi word likh de.",
        fix: [
          "Ensure karen ke input mein sirf digits hon; decimal wale number ke liye `float(...)` use karen.",
          "`.strip()` se extra spaces hatayen: `int(text.strip())`.",
          "Ghalat input ko `try: ... except ValueError:` se handle karen aur dobara poochen.",
        ],
      },
      hindi: {
        meaning: "`{1}()` इस text {2} को नंबर में नहीं बदल पाया।",
        cause: "Text में अक्षर, spaces, दशमलव (`int` के लिए) हैं या वह ख़ाली `''` है। अक्सर `input()` के साथ ऐसा होता है जब user सिर्फ़ Enter दबा दे या कोई शब्द लिख दे।",
        fix: [
          "पक्का करें कि input में सिर्फ़ अंक हों; दशमलव वाले नंबर के लिए `float(...)` इस्तेमाल करें।",
          "`.strip()` से फ़ालतू spaces हटाएँ: `int(text.strip())`।",
          "ग़लत input को `try: ... except ValueError:` से संभालें और दोबारा पूछें।",
        ],
      },
      arabic: {
        meaning: "لم تستطع `{1}()` تحويل النص {2} إلى رقم.",
        cause: "النص يحتوي على حروف أو مسافات أو فاصلة عشرية (بالنسبة لـ `int`)، أو أنه فارغ `''`. يحدث هذا كثيرًا مع `input()` عندما يضغط المستخدم Enter فقط أو يكتب كلمة.",
        fix: [
          "تأكد أن الإدخال أرقام فقط، واستخدم `float(...)` للأرقام العشرية.",
          "احذف المسافات الزائدة بـ `.strip()`: `int(text.strip())`.",
          "تعامل مع الإدخال الخاطئ بـ `try: ... except ValueError:` واطلب الإدخال مجددًا.",
        ],
      },
    },
    example: {
      bad: 'n = int("12.5")',
      good: 'n = float("12.5")\nm = int(float("12.5"))',
    },
  },
  {
    id: 'py-zero-division',
    title: 'ZeroDivisionError: division by zero',
    languages: ['python'],
    patterns: [/ZeroDivisionError/],
    text: {
      english: {
        meaning: "Your code tried to divide a number by zero, which is not possible.",
        cause: "The value after `/`, `//` or `%` is `0`, for example an average computed on an empty list (`len(x)` is `0`) or a user entering `0`.",
        fix: [
          "Check before dividing: `if b != 0:`.",
          "For averages, make sure the list is not empty first.",
          "Print the divisor to see why it became `0`.",
        ],
      },
      urdu: {
        meaning: "آپ کے کوڈ نے کسی نمبر کو صفر سے تقسیم کرنے کی کوشش کی، جو ممکن نہیں۔",
        cause: "`/`، `//` یا `%` کے بعد والی value `0` ہے، مثلاً خالی list کا average نکالنا (`len(x)` صفر ہے) یا صارف کا `0` لکھ دینا۔",
        fix: [
          "تقسیم سے پہلے چیک کریں: `if b != 0:`۔",
          "Average نکالنے سے پہلے یقینی بنائیں کہ list خالی نہ ہو۔",
          "تقسیم کرنے والی value print کر کے دیکھیں کہ وہ `0` کیوں ہوئی۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke code ne kisi number ko zero se divide karne ki koshish ki, jo mumkin nahi.",
        cause: "`/`, `//` ya `%` ke baad wali value `0` hai, maslan khali list ka average nikalna (`len(x)` zero hai) ya user ka `0` likh dena.",
        fix: [
          "Divide se pehle check karen: `if b != 0:`.",
          "Average nikalne se pehle ensure karen ke list khali na ho.",
          "Divisor ko print kar ke dekhen ke wo `0` kyun hua.",
        ],
      },
      hindi: {
        meaning: "आपके कोड ने किसी नंबर को शून्य से भाग देने की कोशिश की, जो मुमकिन नहीं है।",
        cause: "`/`, `//` या `%` के बाद वाली value `0` है, जैसे ख़ाली list का average निकालना (`len(x)` शून्य है) या user का `0` लिख देना।",
        fix: [
          "भाग देने से पहले जाँचें: `if b != 0:`।",
          "Average निकालने से पहले पक्का करें कि list ख़ाली न हो।",
          "भाजक (divisor) को print करके देखें कि वह `0` क्यों हुआ।",
        ],
      },
      arabic: {
        meaning: "حاول الكود قسمة رقم على صفر، وهذا غير ممكن.",
        cause: "القيمة بعد `/` أو `//` أو `%` تساوي `0`، مثل حساب متوسط قائمة فارغة (`len(x)` يساوي صفرًا) أو إدخال المستخدم `0`.",
        fix: [
          "تحقق قبل القسمة: `if b != 0:`.",
          "عند حساب المتوسط تأكد أولًا أن القائمة غير فارغة.",
          "اطبع المقسوم عليه لتعرف لماذا أصبح `0`.",
        ],
      },
    },
    example: {
      bad: 'marks = []\navg = sum(marks) / len(marks)',
      good: 'marks = []\navg = sum(marks) / len(marks) if marks else 0',
    },
  },

  // ───────────────────────── Imports / modules ─────────────────────────
  {
    id: 'py-module-not-found',
    title: 'ModuleNotFoundError: No module named',
    languages: ['python'],
    patterns: [/No module named '([\w.]+)'/],
    text: {
      english: {
        meaning: "Python could not find the module `{1}` that you are trying to import.",
        cause: "The package is not installed, or it is installed for a different Python (another version or virtual environment) than the one VS Code is using. Sometimes the install name differs from the import name (e.g. `cv2` → `opencv-python`, `sklearn` → `scikit-learn`, `PIL` → `Pillow`).",
        fix: [
          "Install it in the VS Code terminal: `python -m pip install {1}` (on Windows you can use `py -m pip install {1}`).",
          "Select the right interpreter: Ctrl+Shift+P → `Python: Select Interpreter`, then choose your `.venv` or the Python where you installed it.",
          "If you use a virtual environment, activate it before installing (`.venv\\Scripts\\activate` on Windows).",
          "If `{1}` is your own file, make sure `{1}.py` is in the same folder you run from.",
        ],
      },
      urdu: {
        meaning: "Python کو وہ module `{1}` نہیں ملا جو آپ import کر رہے ہیں۔",
        cause: "Package انسٹال نہیں ہے، یا کسی دوسرے Python (دوسرا version یا virtual environment) میں انسٹال ہے، اس میں نہیں جو VS Code استعمال کر رہا ہے۔ کبھی انسٹال کا نام import سے مختلف ہوتا ہے (جیسے `cv2` → `opencv-python`، `sklearn` → `scikit-learn`، `PIL` → `Pillow`)۔",
        fix: [
          "VS Code کے terminal میں انسٹال کریں: `python -m pip install {1}` (Windows پر `py -m pip install {1}` بھی چلے گا)۔",
          "صحیح interpreter چنیں: Ctrl+Shift+P → `Python: Select Interpreter`، پھر اپنا `.venv` یا وہ Python چنیں جس میں انسٹال کیا تھا۔",
          "اگر virtual environment استعمال کر رہے ہیں تو انسٹال سے پہلے اسے activate کریں (Windows پر `.venv\\Scripts\\activate`)۔",
          "اگر `{1}` آپ کی اپنی فائل ہے تو دیکھیں کہ `{1}.py` اسی folder میں ہو جہاں سے آپ چلا رہے ہیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Python ko wo module `{1}` nahi mila jo aap import kar rahe hain.",
        cause: "Package install nahi hai, ya kisi doosre Python (doosra version ya virtual environment) mein install hai, us mein nahi jo VS Code use kar raha hai. Kabhi install ka naam import se different hota hai (jaise `cv2` → `opencv-python`, `sklearn` → `scikit-learn`, `PIL` → `Pillow`).",
        fix: [
          "VS Code ke terminal mein install karen: `python -m pip install {1}` (Windows par `py -m pip install {1}` bhi chalega).",
          "Sahi interpreter select karen: Ctrl+Shift+P → `Python: Select Interpreter`, phir apna `.venv` ya wo Python chunen jis mein install kiya tha.",
          "Agar virtual environment use kar rahe hain to install se pehle usay activate karen (Windows par `.venv\\Scripts\\activate`).",
          "Agar `{1}` aap ki apni file hai to dekhen ke `{1}.py` usi folder mein ho jahan se aap run kar rahe hain.",
        ],
      },
      hindi: {
        meaning: "Python को वह module `{1}` नहीं मिला जिसे आप import कर रहे हैं।",
        cause: "Package install नहीं है, या किसी दूसरे Python (दूसरा version या virtual environment) में install है, उसमें नहीं जिसे VS Code इस्तेमाल कर रहा है। कभी-कभी install का नाम import से अलग होता है (जैसे `cv2` → `opencv-python`, `sklearn` → `scikit-learn`, `PIL` → `Pillow`)।",
        fix: [
          "VS Code के terminal में install करें: `python -m pip install {1}` (Windows पर `py -m pip install {1}` भी चलेगा)।",
          "सही interpreter चुनें: Ctrl+Shift+P → `Python: Select Interpreter`, फिर अपना `.venv` या वह Python चुनें जिसमें install किया था।",
          "अगर virtual environment इस्तेमाल कर रहे हैं तो install से पहले उसे activate करें (Windows पर `.venv\\Scripts\\activate`)।",
          "अगर `{1}` आपकी अपनी फ़ाइल है तो देखें कि `{1}.py` उसी folder में हो जहाँ से आप चला रहे हैं।",
        ],
      },
      arabic: {
        meaning: "لم يجد Python الوحدة `{1}` التي تحاول استيرادها.",
        cause: "الحزمة غير مثبتة، أو مثبتة في نسخة Python أخرى (إصدار آخر أو بيئة افتراضية) غير التي يستخدمها VS Code. وأحيانًا يختلف اسم التثبيت عن اسم الاستيراد (مثل `cv2` ← `opencv-python`، و`sklearn` ← `scikit-learn`، و`PIL` ← `Pillow`).",
        fix: [
          "ثبّتها من طرفية VS Code: `python -m pip install {1}` (وعلى Windows يمكنك استخدام `py -m pip install {1}`).",
          "اختر المفسّر الصحيح: Ctrl+Shift+P ← `Python: Select Interpreter`، ثم اختر `.venv` أو نسخة Python التي ثبّتت فيها الحزمة.",
          "إذا كنت تستخدم بيئة افتراضية ففعّلها قبل التثبيت (`.venv\\Scripts\\activate` على Windows).",
          "إذا كان `{1}` ملفًا خاصًا بك فتأكد أن `{1}.py` موجود في المجلد نفسه الذي تشغّل منه.",
        ],
      },
    },
  },
  {
    id: 'py-import-name',
    title: 'ImportError: cannot import name',
    languages: ['python'],
    patterns: [/cannot import name '(\w+)'/],
    text: {
      english: {
        meaning: "Python found the module, but could not find `{1}` inside it.",
        cause: "`{1}` is misspelled or does not exist in that module (or in your installed version of the library). If the error says `partially initialized module` or `circular import`, two of your files import each other.",
        fix: [
          "Check the spelling and capital letters of `{1}`.",
          "For a library, check its documentation for your version; upgrade with `python -m pip install -U <package>` if needed.",
          "For a circular import: move the shared code into a third file, or put the `import` inside the function that needs it.",
          "Make sure your own file is not named like the library (e.g. `requests.py`).",
        ],
      },
      urdu: {
        meaning: "Python کو module تو مل گیا، مگر اس کے اندر `{1}` نہیں ملا۔",
        cause: "`{1}` کی spelling غلط ہے یا وہ اس module (یا library کے انسٹال شدہ version) میں موجود نہیں۔ اگر error میں `partially initialized module` یا `circular import` لکھا ہو تو آپ کی دو فائلیں ایک دوسرے کو import کر رہی ہیں۔",
        fix: [
          "`{1}` کی spelling اور بڑے/چھوٹے حروف چیک کریں۔",
          "Library ہو تو اپنے version کی documentation دیکھیں؛ ضرورت ہو تو `python -m pip install -U <package>` سے update کریں۔",
          "Circular import میں: مشترکہ کوڈ کو تیسری فائل میں منتقل کریں، یا `import` کو اسی function کے اندر لکھیں جسے اس کی ضرورت ہے۔",
          "دیکھیں کہ آپ کی فائل کا نام library جیسا نہ ہو (مثلاً `requests.py`)۔",
        ],
      },
      'roman-urdu': {
        meaning: "Python ko module to mil gaya, lekin uske andar `{1}` nahi mila.",
        cause: "`{1}` ki spelling ghalat hai ya wo us module (ya library ke installed version) mein maujood nahi. Agar error mein `partially initialized module` ya `circular import` likha ho to aap ki do files aik doosre ko import kar rahi hain.",
        fix: [
          "`{1}` ki spelling aur capital/small letters check karen.",
          "Library ho to apne version ki documentation dekhen; zaroorat ho to `python -m pip install -U <package>` se update karen.",
          "Circular import mein: shared code ko teesri file mein le jayen, ya `import` ko usi function ke andar likhen jisay iski zaroorat hai.",
          "Dekhen ke aap ki file ka naam library jaisa na ho (maslan `requests.py`).",
        ],
      },
      hindi: {
        meaning: "Python को module तो मिल गया, लेकिन उसके अंदर `{1}` नहीं मिला।",
        cause: "`{1}` की spelling ग़लत है या वह उस module (या library के install किए गए version) में मौजूद नहीं है। अगर error में `partially initialized module` या `circular import` लिखा हो तो आपकी दो फ़ाइलें एक-दूसरे को import कर रही हैं।",
        fix: [
          "`{1}` की spelling और बड़े/छोटे अक्षर जाँचें।",
          "Library हो तो अपने version की documentation देखें; ज़रूरत हो तो `python -m pip install -U <package>` से update करें।",
          "Circular import में: साझा कोड को तीसरी फ़ाइल में ले जाएँ, या `import` को उसी function के अंदर लिखें जिसे इसकी ज़रूरत है।",
          "देखें कि आपकी फ़ाइल का नाम library जैसा न हो (जैसे `requests.py`)।",
        ],
      },
      arabic: {
        meaning: "وجد Python الوحدة، لكنه لم يجد `{1}` بداخلها.",
        cause: "`{1}` مكتوب خطأً أو غير موجود في تلك الوحدة (أو في الإصدار المثبت من المكتبة). وإذا ذكر الخطأ `partially initialized module` أو `circular import` فهذا يعني أن ملفين من ملفاتك يستورد كل منهما الآخر.",
        fix: [
          "تحقق من كتابة `{1}` وحالة أحرفه.",
          "إن كانت مكتبة فراجع توثيق إصدارك، وحدّثها عند الحاجة بـ `python -m pip install -U <package>`.",
          "في الاستيراد الدائري: انقل الكود المشترك إلى ملف ثالث، أو ضع `import` داخل الدالة التي تحتاجه.",
          "تأكد أن ملفك لا يحمل اسم المكتبة (مثل `requests.py`).",
        ],
      },
    },
  },
  {
    id: 'py-pylance-unresolved-import',
    title: 'Pylance: Import could not be resolved',
    languages: ['python'],
    patterns: [/Import ["']([\w.]+)["'] could not be resolved/],
    text: {
      english: {
        meaning: "VS Code (Pylance) cannot find the package `{1}` in the Python interpreter that is currently selected.",
        cause: "The package is not installed in the selected interpreter, or VS Code is pointing to a different Python than the one you used with `pip`. Your code may even run fine in another terminal.",
        fix: [
          "Ctrl+Shift+P → `Python: Select Interpreter` and pick the Python or `.venv` where `{1}` is installed.",
          "Or install it into the selected interpreter: open a new VS Code terminal and run `python -m pip install {1}`.",
          "If the warning stays, run `Developer: Reload Window` from the Command Palette.",
        ],
      },
      urdu: {
        meaning: "VS Code (Pylance) کو اس وقت چنے گئے Python interpreter میں package `{1}` نہیں مل رہا۔",
        cause: "Package چنے گئے interpreter میں انسٹال نہیں، یا VS Code کسی اور Python کی طرف اشارہ کر رہا ہے، اس کی طرف نہیں جس کے ساتھ آپ نے `pip` چلایا۔ ہو سکتا ہے آپ کا کوڈ کسی دوسرے terminal میں ٹھیک چل بھی رہا ہو۔",
        fix: [
          "Ctrl+Shift+P → `Python: Select Interpreter` اور وہ Python یا `.venv` چنیں جس میں `{1}` انسٹال ہے۔",
          "یا اسے چنے گئے interpreter میں انسٹال کریں: VS Code کا نیا terminal کھولیں اور `python -m pip install {1}` چلائیں۔",
          "اگر warning پھر بھی رہے تو Command Palette سے `Developer: Reload Window` چلائیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "VS Code (Pylance) ko is waqt selected Python interpreter mein package `{1}` nahi mil raha.",
        cause: "Package selected interpreter mein install nahi, ya VS Code kisi aur Python ki taraf point kar raha hai, us ki taraf nahi jis ke sath aap ne `pip` chalaya. Ho sakta hai aap ka code kisi doosre terminal mein theek chal bhi raha ho.",
        fix: [
          "Ctrl+Shift+P → `Python: Select Interpreter` aur wo Python ya `.venv` select karen jis mein `{1}` install hai.",
          "Ya usay selected interpreter mein install karen: VS Code ka naya terminal kholen aur `python -m pip install {1}` chalayen.",
          "Agar warning phir bhi rahe to Command Palette se `Developer: Reload Window` chalayen.",
        ],
      },
      hindi: {
        meaning: "VS Code (Pylance) को अभी चुने गए Python interpreter में package `{1}` नहीं मिल रहा।",
        cause: "Package चुने गए interpreter में install नहीं है, या VS Code किसी और Python की तरफ़ इशारा कर रहा है, उसकी तरफ़ नहीं जिसके साथ आपने `pip` चलाया। हो सकता है आपका कोड किसी दूसरे terminal में ठीक चल भी रहा हो।",
        fix: [
          "Ctrl+Shift+P → `Python: Select Interpreter` और वह Python या `.venv` चुनें जिसमें `{1}` install है।",
          "या उसे चुने गए interpreter में install करें: VS Code का नया terminal खोलें और `python -m pip install {1}` चलाएँ।",
          "अगर warning फिर भी रहे तो Command Palette से `Developer: Reload Window` चलाएँ।",
        ],
      },
      arabic: {
        meaning: "لا يجد VS Code (Pylance) الحزمة `{1}` في مفسّر Python المختار حاليًا.",
        cause: "الحزمة غير مثبتة في المفسّر المختار، أو أن VS Code يشير إلى نسخة Python غير التي استخدمتها مع `pip`. وقد يعمل كودك بشكل سليم في طرفية أخرى.",
        fix: [
          "Ctrl+Shift+P ← `Python: Select Interpreter` واختر نسخة Python أو `.venv` المثبتة فيها `{1}`.",
          "أو ثبّتها في المفسّر المختار: افتح طرفية جديدة في VS Code ونفّذ `python -m pip install {1}`.",
          "إذا بقي التحذير فنفّذ `Developer: Reload Window` من Command Palette.",
        ],
      },
    },
  },

  // ───────────────────────── Files / recursion ─────────────────────────
  {
    id: 'py-file-not-found',
    title: 'FileNotFoundError: [Errno 2] No such file or directory',
    languages: ['python'],
    patterns: [/can't open file '([^'\n]+)': \[Errno 2\]/, /\[Errno 2\] No such file or directory: '([^'\n]+)'/],
    text: {
      english: {
        meaning: "Python could not find the file `{1}`.",
        cause: "The file name or path is wrong, or Python is running from a different folder than you think. Relative paths like `data.txt` are looked up from the terminal's current folder, not from your script's folder.",
        fix: [
          "Check the exact file name and extension (Windows may hide `.txt`).",
          "In VS Code, open the folder that contains the file (`File > Open Folder`) and run from there.",
          "Build the path from your script's location: `Path(__file__).parent / \"data.txt\"` (with `from pathlib import Path`).",
          "On Windows, write paths as `r\"C:\\folder\\file.txt\"` or use forward slashes.",
        ],
      },
      urdu: {
        meaning: "Python کو فائل `{1}` نہیں ملی۔",
        cause: "فائل کا نام یا path غلط ہے، یا Python کسی دوسرے folder سے چل رہا ہے۔ `data.txt` جیسے relative path terminal کے موجودہ folder میں ڈھونڈے جاتے ہیں، آپ کی script والے folder میں نہیں۔",
        fix: [
          "فائل کا بالکل درست نام اور extension چیک کریں (Windows کبھی `.txt` چھپا دیتا ہے)۔",
          "VS Code میں وہ folder کھولیں جس میں فائل ہے (`File > Open Folder`) اور وہیں سے چلائیں۔",
          "Path کو script کی جگہ سے بنائیں: `Path(__file__).parent / \"data.txt\"` (`from pathlib import Path` کے ساتھ)۔",
          "Windows پر path کو `r\"C:\\folder\\file.txt\"` کی طرح لکھیں یا forward slashes استعمال کریں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Python ko file `{1}` nahi mili.",
        cause: "File ka naam ya path ghalat hai, ya Python kisi doosre folder se chal raha hai. `data.txt` jaise relative path terminal ke current folder mein dhoonde jate hain, aap ki script wale folder mein nahi.",
        fix: [
          "File ka bilkul sahi naam aur extension check karen (Windows kabhi `.txt` chhupa deta hai).",
          "VS Code mein wo folder kholen jis mein file hai (`File > Open Folder`) aur wahin se run karen.",
          "Path ko script ki location se banayen: `Path(__file__).parent / \"data.txt\"` (`from pathlib import Path` ke sath).",
          "Windows par path ko `r\"C:\\folder\\file.txt\"` ki tarah likhen ya forward slashes use karen.",
        ],
      },
      hindi: {
        meaning: "Python को फ़ाइल `{1}` नहीं मिली।",
        cause: "फ़ाइल का नाम या path ग़लत है, या Python किसी दूसरे folder से चल रहा है। `data.txt` जैसे relative path terminal के मौजूदा folder में खोजे जाते हैं, आपकी script वाले folder में नहीं।",
        fix: [
          "फ़ाइल का बिल्कुल सही नाम और extension जाँचें (Windows कभी-कभी `.txt` छिपा देता है)।",
          "VS Code में वह folder खोलें जिसमें फ़ाइल है (`File > Open Folder`) और वहीं से चलाएँ।",
          "Path को script की जगह से बनाएँ: `Path(__file__).parent / \"data.txt\"` (`from pathlib import Path` के साथ)।",
          "Windows पर path को `r\"C:\\folder\\file.txt\"` की तरह लिखें या forward slashes इस्तेमाल करें।",
        ],
      },
      arabic: {
        meaning: "لم يجد Python الملف `{1}`.",
        cause: "اسم الملف أو مساره خاطئ، أو أن Python يعمل من مجلد آخر غير الذي تظنه. المسارات النسبية مثل `data.txt` يُبحث عنها في المجلد الحالي للطرفية، لا في مجلد السكربت.",
        fix: [
          "تحقق من اسم الملف وامتداده بدقة (قد يُخفي Windows الامتداد `.txt`).",
          "افتح في VS Code المجلد الذي يحتوي الملف (`File > Open Folder`) وشغّل منه.",
          "ابنِ المسار انطلاقًا من موقع السكربت: `Path(__file__).parent / \"data.txt\"` (مع `from pathlib import Path`).",
          "على Windows اكتب المسار هكذا `r\"C:\\folder\\file.txt\"` أو استخدم الشرطة المائلة الأمامية.",
        ],
      },
    },
  },
  {
    id: 'py-recursion-error',
    title: 'RecursionError: maximum recursion depth exceeded',
    languages: ['python'],
    patterns: [/maximum recursion depth exceeded/],
    text: {
      english: {
        meaning: "A function kept calling itself too many times, and Python stopped it.",
        cause: "The recursive function has no stopping condition (base case), or the base case is never reached because the value does not move towards it.",
        fix: [
          "Add a base case at the top, e.g. `if n <= 1: return 1`.",
          "Make sure each call moves closer to it, e.g. call with `n - 1`, not `n`.",
          "For very deep problems, rewrite the function with a loop instead.",
        ],
      },
      urdu: {
        meaning: "ایک function خود کو بہت زیادہ بار call کرتا رہا، اس لیے Python نے اسے روک دیا۔",
        cause: "Recursive function میں رکنے کی شرط (base case) نہیں ہے، یا value اس شرط کی طرف بڑھتی ہی نہیں اس لیے وہاں کبھی پہنچتی نہیں۔",
        fix: [
          "شروع میں base case لکھیں، جیسے `if n <= 1: return 1`۔",
          "یقینی بنائیں کہ ہر call اس شرط کے قریب جائے، مثلاً `n` کی بجائے `n - 1` کے ساتھ call کریں۔",
          "بہت گہرے مسئلوں کے لیے function کو loop سے دوبارہ لکھیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aik function khud ko bohat zyada baar call karta raha, is liye Python ne usay rok diya.",
        cause: "Recursive function mein rukne ki condition (base case) nahi hai, ya value us condition ki taraf barhti hi nahi is liye wahan kabhi pohanchti nahi.",
        fix: [
          "Shuru mein base case likhen, jaise `if n <= 1: return 1`.",
          "Ensure karen ke har call us condition ke qareeb jaye, maslan `n` ki bajaye `n - 1` ke sath call karen.",
          "Bohat deep problems ke liye function ko loop se dobara likhen.",
        ],
      },
      hindi: {
        meaning: "एक function ख़ुद को बहुत ज़्यादा बार call करता रहा, इसलिए Python ने उसे रोक दिया।",
        cause: "Recursive function में रुकने की शर्त (base case) नहीं है, या value उस शर्त की तरफ़ बढ़ती ही नहीं इसलिए वहाँ कभी पहुँचती नहीं।",
        fix: [
          "शुरुआत में base case लिखें, जैसे `if n <= 1: return 1`।",
          "पक्का करें कि हर call उस शर्त के क़रीब जाए, जैसे `n` की जगह `n - 1` के साथ call करें।",
          "बहुत गहरी problems के लिए function को loop से दोबारा लिखें।",
        ],
      },
      arabic: {
        meaning: "استمرت دالة في استدعاء نفسها مرات كثيرة جدًا، فأوقفها Python.",
        cause: "الدالة العودية (recursive) ليس لها شرط توقف (base case)، أو أن القيمة لا تقترب منه فلا يُبلغ أبدًا.",
        fix: [
          "أضف شرط التوقف في البداية، مثل `if n <= 1: return 1`.",
          "تأكد أن كل استدعاء يقترب منه، مثل الاستدعاء بـ `n - 1` لا بـ `n`.",
          "للمسائل العميقة جدًا أعد كتابة الدالة باستخدام حلقة.",
        ],
      },
    },
    example: {
      bad: 'def fact(n):\n    return n * fact(n - 1)',
      good: 'def fact(n):\n    if n <= 1:\n        return 1\n    return n * fact(n - 1)',
    },
  },

  // ───────────────────────── Setup (Windows) ─────────────────────────
  {
    id: 'py-python-not-recognized',
    title: "'python' is not recognized",
    languages: ['python'],
    patterns: [
      /'python3?(?:\.exe)?' is not recognized as an internal or external command/i,
      /The term 'python3?(?:\.exe)?' is not recognized/i,
      /Python was not found; run without arguments to install from the Microsoft Store/i,
      /python3?: command not found/i,
    ],
    text: {
      english: {
        meaning: "Your terminal cannot find the `python` program.",
        cause: "Python is not installed, or it was installed without the `Add python.exe to PATH` option. On Windows, the Microsoft Store shortcut can also hide the real Python.",
        fix: [
          "Try the Windows launcher instead: `py --version` and `py your_file.py`.",
          "If that fails, install Python from python.org and tick `Add python.exe to PATH` on the first screen.",
          "Turn off the Store shortcuts: Settings → Apps → Advanced app settings → App execution aliases → switch off `python.exe` and `python3.exe`.",
          "Close and reopen VS Code (so the terminal sees the new PATH), then run `python --version`.",
        ],
      },
      urdu: {
        meaning: "آپ کے terminal کو `python` پروگرام نہیں مل رہا۔",
        cause: "Python انسٹال نہیں، یا انسٹال کرتے وقت `Add python.exe to PATH` والا آپشن نہیں چنا گیا۔ Windows پر Microsoft Store کا shortcut بھی اصل Python کو چھپا دیتا ہے۔",
        fix: [
          "Windows launcher آزمائیں: `py --version` اور `py your_file.py`۔",
          "اگر وہ بھی نہ چلے تو python.org سے Python انسٹال کریں اور پہلی اسکرین پر `Add python.exe to PATH` پر ٹک لگائیں۔",
          "Store والے shortcuts بند کریں: Settings → Apps → Advanced app settings → App execution aliases → `python.exe` اور `python3.exe` بند کر دیں۔",
          "VS Code بند کر کے دوبارہ کھولیں (تاکہ terminal نیا PATH دیکھ سکے)، پھر `python --version` چلائیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke terminal ko `python` program nahi mil raha.",
        cause: "Python install nahi, ya install karte waqt `Add python.exe to PATH` wala option select nahi kiya gaya. Windows par Microsoft Store ka shortcut bhi asal Python ko chhupa deta hai.",
        fix: [
          "Windows launcher try karen: `py --version` aur `py your_file.py`.",
          "Agar wo bhi na chale to python.org se Python install karen aur pehli screen par `Add python.exe to PATH` par tick lagayen.",
          "Store wale shortcuts band karen: Settings → Apps → Advanced app settings → App execution aliases → `python.exe` aur `python3.exe` off kar den.",
          "VS Code band kar ke dobara kholen (taake terminal naya PATH dekh sake), phir `python --version` chalayen.",
        ],
      },
      hindi: {
        meaning: "आपके terminal को `python` प्रोग्राम नहीं मिल रहा।",
        cause: "Python install नहीं है, या install करते समय `Add python.exe to PATH` वाला option नहीं चुना गया। Windows पर Microsoft Store का shortcut भी असली Python को छिपा देता है।",
        fix: [
          "Windows launcher आज़माएँ: `py --version` और `py your_file.py`।",
          "अगर वह भी न चले तो python.org से Python install करें और पहली स्क्रीन पर `Add python.exe to PATH` पर टिक लगाएँ।",
          "Store वाले shortcuts बंद करें: Settings → Apps → Advanced app settings → App execution aliases → `python.exe` और `python3.exe` बंद कर दें।",
          "VS Code बंद करके दोबारा खोलें (ताकि terminal नया PATH देख सके), फिर `python --version` चलाएँ।",
        ],
      },
      arabic: {
        meaning: "لا تستطيع الطرفية العثور على برنامج `python`.",
        cause: "Python غير مثبت، أو ثُبّت دون اختيار `Add python.exe to PATH`. وعلى Windows قد يُخفي اختصار Microsoft Store نسخة Python الحقيقية.",
        fix: [
          "جرّب مشغّل Windows بدلًا منه: `py --version` و`py your_file.py`.",
          "إذا لم ينجح فثبّت Python من python.org وحدّد `Add python.exe to PATH` في الشاشة الأولى.",
          "عطّل اختصارات المتجر: Settings ← Apps ← Advanced app settings ← App execution aliases ← أوقف `python.exe` و`python3.exe`.",
          "أغلق VS Code وافتحه مجددًا (لترى الطرفية المسار الجديد)، ثم نفّذ `python --version`.",
        ],
      },
    },
  },
  {
    id: 'py-pip-not-recognized',
    title: "'pip' is not recognized",
    languages: ['python'],
    patterns: [
      /'pip3?(?:\.exe)?' is not recognized as an internal or external command/i,
      /The term 'pip3?(?:\.exe)?' is not recognized/i,
      /pip3?: command not found/i,
    ],
    text: {
      english: {
        meaning: "Your terminal cannot find the `pip` command.",
        cause: "Python's `Scripts` folder is not on PATH, or `pip` belongs to a different Python. This is very common on Windows.",
        fix: [
          "Run pip through Python instead: `python -m pip install <package>`.",
          "On Windows, if `python` also fails, use `py -m pip install <package>`.",
          "If pip is missing completely, run `python -m ensurepip --upgrade`.",
        ],
      },
      urdu: {
        meaning: "آپ کے terminal کو `pip` کمانڈ نہیں مل رہی۔",
        cause: "Python کا `Scripts` folder PATH میں شامل نہیں، یا `pip` کسی دوسرے Python کا ہے۔ Windows پر یہ بہت عام ہے۔",
        fix: [
          "pip کو Python کے ذریعے چلائیں: `python -m pip install <package>`۔",
          "Windows پر اگر `python` بھی نہ چلے تو `py -m pip install <package>` استعمال کریں۔",
          "اگر pip بالکل موجود نہ ہو تو `python -m ensurepip --upgrade` چلائیں۔",
        ],
      },
      'roman-urdu': {
        meaning: "Aap ke terminal ko `pip` command nahi mil rahi.",
        cause: "Python ka `Scripts` folder PATH mein shamil nahi, ya `pip` kisi doosre Python ka hai. Windows par ye bohat common hai.",
        fix: [
          "pip ko Python ke zariye chalayen: `python -m pip install <package>`.",
          "Windows par agar `python` bhi na chale to `py -m pip install <package>` use karen.",
          "Agar pip bilkul maujood na ho to `python -m ensurepip --upgrade` chalayen.",
        ],
      },
      hindi: {
        meaning: "आपके terminal को `pip` कमांड नहीं मिल रही।",
        cause: "Python का `Scripts` folder PATH में शामिल नहीं है, या `pip` किसी दूसरे Python का है। Windows पर यह बहुत आम है।",
        fix: [
          "pip को Python के ज़रिए चलाएँ: `python -m pip install <package>`।",
          "Windows पर अगर `python` भी न चले तो `py -m pip install <package>` इस्तेमाल करें।",
          "अगर pip बिल्कुल मौजूद न हो तो `python -m ensurepip --upgrade` चलाएँ।",
        ],
      },
      arabic: {
        meaning: "لا تستطيع الطرفية العثور على الأمر `pip`.",
        cause: "مجلد `Scripts` الخاص بـ Python غير مضاف إلى PATH، أو أن `pip` تابع لنسخة Python أخرى. هذا شائع جدًا على Windows.",
        fix: [
          "شغّل pip عبر Python: `python -m pip install <package>`.",
          "على Windows إذا لم يعمل `python` أيضًا فاستخدم `py -m pip install <package>`.",
          "إذا كان pip غير موجود أصلًا فنفّذ `python -m ensurepip --upgrade`.",
        ],
      },
    },
  },
];
