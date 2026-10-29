# Changelog

All notable changes to ErrorDost are documented here. This project follows [Semantic Versioning](https://semver.org/).

## [0.1.1] - 2026-10-29

### Fixed

- Some AI answers (seen in Arabic) were shown as raw JSON when the model left quotes unescaped. They are now parsed correctly, the prompt asks for valid JSON, and answers cached by 0.1.0 are cleared.

## [0.1.0] - 2026-10-29

### Added

- First release.
- Explain errors in **English, Urdu (اردو), Roman Urdu, Hindi (हिन्दी) and Arabic (العربية)**, at **beginner** or **pro** level: meaning, why it happened, how to fix it, and a code example.
- Three ways to explain: 💡 quick fix and hover link on editor errors, failed terminal commands, and selected or pasted error text.
- Offline knowledge base of common JavaScript/TypeScript, Python, HTML, CSS, Java, C/C++ and PHP errors, with no AI needed.
- Bring your own AI: GitHub Copilot, Claude Code, Ollama, or a Claude / OpenAI / Gemini API key (`auto` picks the first available).
- Privacy: only the error message and a few sanitized lines around it are sent to AI. Explanations are cached locally.
- First-run language picker and the **Choose Explanation Language** command.
