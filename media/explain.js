// ErrorBuddy explanation webview script. Plain JS, no external libraries.
(function () {
  // eslint-disable-next-line no-undef
  const vscode = acquireVsCodeApi();
  const body = document.body;
  const statusEl = document.getElementById('status');
  const languageSelect = document.getElementById('language');
  const copyBtn = document.getElementById('copy');
  const askBtn = document.getElementById('ask-ai');
  const toggleBtn = document.getElementById('toggle-error');
  const errorBox = document.getElementById('error-box');
  const openFileBtn = document.getElementById('open-file');
  const levelButtons = Array.prototype.slice.call(document.querySelectorAll('.seg[data-level]'));
  const busyText = body.dataset.busyText || 'Explaining…';

  let language = body.dataset.language || 'english';
  let level = body.dataset.level || 'beginner';

  function setBusy(busy) {
    body.classList.toggle('busy', busy);
    languageSelect.disabled = busy;
    levelButtons.forEach(function (b) { b.disabled = busy; });
    if (askBtn) askBtn.disabled = busy;
    statusEl.textContent = busy ? busyText : '';
    if (!busy) {
      // Restore the controls to what is actually shown.
      languageSelect.value = language;
      levelButtons.forEach(function (b) {
        const active = b.dataset.level === level;
        b.classList.toggle('active', active);
        b.setAttribute('aria-pressed', String(active));
      });
    }
  }

  function reexplain(nextLanguage, nextLevel) {
    if (nextLanguage === language && nextLevel === level) return;
    setBusy(true);
    vscode.postMessage({ type: 'reexplain', language: nextLanguage, level: nextLevel });
  }

  languageSelect.addEventListener('change', function () {
    reexplain(languageSelect.value, level);
  });

  levelButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      levelButtons.forEach(function (o) { o.classList.toggle('active', o === b); });
      reexplain(language, b.dataset.level);
    });
  });

  copyBtn.addEventListener('click', function () {
    vscode.postMessage({ type: 'copy' });
    const label = copyBtn.textContent;
    copyBtn.textContent = '✔';
    setTimeout(function () { copyBtn.textContent = label; }, 1200);
  });

  if (askBtn) {
    askBtn.addEventListener('click', function () {
      setBusy(true);
      vscode.postMessage({ type: 'askAI' });
    });
  }

  if (toggleBtn && errorBox) {
    toggleBtn.addEventListener('click', function () {
      const collapsed = errorBox.classList.toggle('collapsed');
      toggleBtn.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  if (openFileBtn) {
    openFileBtn.addEventListener('click', function () {
      vscode.postMessage({ type: 'openFile' });
    });
  }

  window.addEventListener('message', function (event) {
    const msg = event.data;
    if (msg && msg.type === 'busy') setBusy(!!msg.busy);
  });

  setBusy(body.dataset.busy === 'true');
})();
