import * as vscode from 'vscode';
import { ExplainService } from './explain/explainService';
import { registerTriggers } from './triggers';
import { registerSetApiKeyCommand } from './commands/setApiKey';
import { ensureLanguage, registerChooseLanguageCommand } from './util/language';

const WELCOMED_KEY = 'errordost.welcomed';

export function activate(ctx: vscode.ExtensionContext): void {
  const service = new ExplainService(ctx);
  ctx.subscriptions.push(service);
  // Drop the v0.1.0 cache, which could hold answers the old parser got wrong.
  void ctx.globalState.update('errordost.cache', undefined);

  registerTriggers(ctx, service);
  registerSetApiKeyCommand(ctx);
  registerChooseLanguageCommand(ctx);

  ctx.subscriptions.push(
    vscode.commands.registerCommand('errordost.clearCache', async () => {
      await service.clearCache();
      vscode.window.showInformationMessage('ErrorDost: explanation cache cleared.');
    }),
  );

  if (!ctx.globalState.get<boolean>(WELCOMED_KEY)) {
    void welcome(ctx);
  }
}

/** First run: ask for the explanation language, then show a short hint. */
async function welcome(ctx: vscode.ExtensionContext): Promise<void> {
  await ctx.globalState.update(WELCOMED_KEY, true);
  await ensureLanguage();
  const tryIt = 'Try it';
  const choice = await vscode.window.showInformationMessage(
    'ErrorDost is ready. Click the 💡 on any error, or right-click selected error text → Explain.',
    tryIt,
  );
  if (choice === tryIt) {
    await vscode.commands.executeCommand('errordost.explainText');
  }
}

export function deactivate(): void {
  // Everything is disposed through ctx.subscriptions.
}
