# ErrorBuddy – Explain Errors in Urdu, Hindi, Arabic & English

**Got an error you don't understand? One click, and ErrorBuddy explains it in your language.**

ErrorBuddy turns confusing compiler, linter and runtime errors into a short, friendly explanation in **English, Urdu (اردو), Roman Urdu, Hindi (हिन्दी) or Arabic (العربية)**:

- **Meaning:** what the error is saying, in plain words
- **Why it happened:** the most likely cause in *your* code
- **How to fix it:** concrete steps, plus a small before/after code example

Common errors are explained **instantly and offline** from a built-in knowledge base, no AI needed. For everything else ErrorBuddy uses the AI you already have (GitHub Copilot, Claude Code, Ollama, or your own Claude / OpenAI / Gemini key). No account, no server, no cost.

Made for students, bootcamp learners and anyone who'd rather read an error explanation in their mother tongue. Pro mode gives experienced developers short, technical answers.

---

## Three ways to explain an error

1. **💡 In the editor:** put the cursor on a red or yellow squiggle and click the lightbulb (`Ctrl+.` / `Cmd+.`) → **Explain this error with ErrorBuddy**. You can also hover over the error and click **Explain with ErrorBuddy**.
2. **In the terminal:** when a command fails (`npm run build`, `python app.py`, `javac Main.java`, …), ErrorBuddy offers to explain the error output. Needs VS Code's terminal shell integration, which is on by default.
3. **Any error text:** select an error message or stack trace in any editor → right-click → **ErrorBuddy: Explain Selected Error**. Or run **ErrorBuddy: Explain an Error (paste)** and paste text from the browser console, a CI log or anywhere else. (You can also right-click in the terminal to reach this command.)

## Languages

On first run ErrorBuddy asks which language you want. Change it any time with **ErrorBuddy: Choose Explanation Language** or the `errorbuddy.language` setting. Urdu and Arabic are shown right-to-left, and Urdu uses a Nastaliq font.

Here is the same error in all five languages:

```text
TypeError: Cannot read properties of undefined (reading 'name')
```

**English**
> **Meaning:** You tried to read `.name` from something that is `undefined`, meaning it has no value yet.
> **Why:** The variable before `.name` was never set, or the data (e.g. from an API) hasn't arrived yet.
> **Fix:** Check that the value exists first, e.g. `user?.name`, or make sure it is assigned before this line.

**اردو (Urdu)**
> **مطلب:** آپ نے کسی ایسی چیز سے `.name` پڑھنے کی کوشش کی جو `undefined` ہے، یعنی اس میں ابھی کوئی قدر (value) نہیں ہے۔
> **وجہ:** `.name` سے پہلے والا ویری ایبل کبھی سیٹ نہیں ہوا، یا ڈیٹا (مثلاً API سے) ابھی تک نہیں آیا۔
> **حل:** پہلے چیک کریں کہ قدر موجود ہے، مثلاً `user?.name`، یا یقینی بنائیں کہ اس لائن سے پہلے اسے ویلیو دی گئی ہو۔

**Roman Urdu**
> **Matlab:** Aap ne `.name` aisi cheez se parhne ki koshish ki jo `undefined` hai, yani us mein abhi koi value nahi hai.
> **Wajah:** `.name` se pehle wala variable kabhi set nahi hua, ya data (maslan API se) abhi tak nahi aaya.
> **Hal:** Pehle check karein ke value maujood hai, jaise `user?.name`, ya yaqeeni banayein ke is line se pehle us ko value di gayi ho.

**हिन्दी (Hindi)**
> **मतलब:** आपने किसी ऐसी चीज़ से `.name` पढ़ने की कोशिश की जो `undefined` है, यानी उसमें अभी कोई value नहीं है।
> **वजह:** `.name` से पहले वाला variable कभी set नहीं हुआ, या डेटा (जैसे API से) अभी तक नहीं आया।
> **हल:** पहले जाँचें कि value मौजूद है, जैसे `user?.name`, या पक्का करें कि इस लाइन से पहले उसे value दी गई हो।

**العربية (Arabic)**
> **المعنى:** حاولت قراءة `.name` من شيء قيمته `undefined`، أي أنه لا يحتوي على قيمة بعد.
> **السبب:** المتغير الذي قبل `.name` لم يتم تعيينه، أو أن البيانات (مثلاً من API) لم تصل بعد.
> **الحل:** تحقّق أولاً من وجود القيمة، مثل `user?.name`، أو تأكد من تعيينها قبل هذا السطر.

Choose **beginner** (default: simple words, step by step) or **pro** (short and technical) with `errorbuddy.level`.

## Supported programming languages

| Language | Typical errors covered |
| --- | --- |
| JavaScript / TypeScript | `TypeError`, `ReferenceError`, `SyntaxError`, TS compiler errors (`TS2339`, `TS2322`, …), ESLint, Node.js module errors |
| Python | `NameError`, `IndentationError`, `TypeError`, `KeyError`, `ModuleNotFoundError`, Pylance diagnostics, tracebacks |
| HTML | Unclosed tags, invalid nesting, missing attributes |
| CSS / SCSS / Less | Unknown properties, missing semicolons or braces, invalid values |
| Java | `NullPointerException`, `cannot find symbol`, `incompatible types`, missing return |
| C / C++ | Undeclared identifiers, segmentation faults, linker errors (`undefined reference`) |
| PHP | Undefined variables/indexes, parse errors, fatal errors |

Errors from any other language still work through AI.

## No AI needed for common errors

ErrorBuddy ships with an **offline knowledge base** of the most common beginner errors, written in all five languages. When your error matches, the explanation appears instantly, offline and free. A button lets you ask AI for an explanation tailored to your exact code.

Turn off `errorbuddy.knowledgeBaseFirst` if you always want an AI answer first.

## AI setup (optional)

With the default `errorbuddy.aiProvider: auto`, ErrorBuddy uses the first one available:
**GitHub Copilot → Claude Code → Ollama → an API key you saved.** Most people need no setup at all.

| Provider | Setup |
| --- | --- |
| `auto` (default) | Picks the first available provider in the order above. |
| `copilot` | Sign in to GitHub Copilot in VS Code. Uses the VS Code Language Model API, no API key needed. VS Code asks once for permission. |
| `claude-code` | Have [Claude Code](https://claude.com/claude-code) installed and signed in. ErrorBuddy runs `claude -p` with the fast `haiku` model, in an empty temp folder with all tools disabled, so it never reads your project. Set `errorbuddy.claudeCodePath` if `claude` is not on your PATH. |
| `ollama` | Install [Ollama](https://ollama.com) and pull a model (e.g. `ollama pull llama3.2`). Free and fully offline. |
| `claude` | Get a key at [console.anthropic.com](https://console.anthropic.com/settings/keys), then run **ErrorBuddy: Set AI API Key**. |
| `openai` | Get a key at [platform.openai.com](https://platform.openai.com/api-keys), then run **ErrorBuddy: Set AI API Key**. |
| `gemini` | Get a key at [Google AI Studio](https://aistudio.google.com/apikey), then run **ErrorBuddy: Set AI API Key**. |
| `none` | Offline knowledge base only. Nothing is ever sent anywhere. |

API keys are stored in VS Code's encrypted **Secret Storage**, never in settings files. Use `errorbuddy.model` to override a provider's default model.

## Privacy

- **Only the error is sent.** The AI receives the error message and a few lines of code around it, never your whole file or project.
- **Secrets are stripped first.** Those few lines are sanitized before sending: things that look like API keys, tokens, passwords and connection strings are masked.
- **Your own AI.** Requests go straight from VS Code to the provider *you* chose. ErrorBuddy has no server, no telemetry and no account.
- **Offline mode.** Set `errorbuddy.aiProvider` to `none` and nothing leaves your machine.
- Explanations are cached locally so the same error isn't sent twice. Clear the cache with **ErrorBuddy: Clear Explanation Cache**.

## Commands

| Command | What it does |
| --- | --- |
| **ErrorBuddy: Explain Selected Error** | Explains the selected text (also in the editor right-click menu). |
| **ErrorBuddy: Explain an Error (paste)** | Paste any error message or stack trace and get it explained. |
| **ErrorBuddy: Choose Explanation Language** | Switch between English, اردو, Roman Urdu, हिन्दी and العربية. |
| **ErrorBuddy: Set AI API Key** | Save a Claude, OpenAI or Gemini API key securely. |
| **ErrorBuddy: Clear Explanation Cache** | Forget cached AI explanations. |

## Settings

| Setting | Default | Description |
| --- | --- | --- |
| `errorbuddy.language` | *(ask on first use)* | `english`, `urdu`, `roman-urdu`, `hindi` or `arabic`. |
| `errorbuddy.level` | `beginner` | `beginner` (simple, step by step) or `pro` (short, technical). |
| `errorbuddy.aiProvider` | `auto` | `auto`, `copilot`, `claude-code`, `claude`, `openai`, `gemini`, `ollama` or `none`. |
| `errorbuddy.model` | *(empty)* | Model override for the selected provider. |
| `errorbuddy.ollamaUrl` | `http://localhost:11434` | Ollama server URL. |
| `errorbuddy.claudeCodePath` | `claude` | Command or path of the Claude Code CLI. |
| `errorbuddy.knowledgeBaseFirst` | `true` | Show the offline answer instantly when a common error is recognized. |
| `errorbuddy.terminal.enabled` | `true` | Offer explanations when a terminal command fails. |
| `errorbuddy.codeActions.enabled` | `true` | Show the 💡 "Explain this error" quick fix. |
| `errorbuddy.hover.enabled` | `true` | Show the "Explain with ErrorBuddy" link on error hovers. |

## Requirements

- VS Code 1.93 or newer.
- For AI explanations: one of GitHub Copilot, Claude Code, Ollama, or an API key. Common errors work without any of them.

## Feedback

Found an error ErrorBuddy explains badly, or want another language? [Open an issue](https://github.com/malahimaamir/errorbuddy/issues).

## Author

Made by **Malahima Amir**, also the author of [DevDiary](https://marketplace.visualstudio.com/items?itemName=malahimaamir.devdiary).

## License

[MIT](LICENSE)
