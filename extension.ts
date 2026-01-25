import * as vscode from 'vscode';
import { CodeCompiler } from './codeCompiler';
import { LanguageClient } from 'vscode-languageclient/node';

let codeCompiler: CodeCompiler;
let client: LanguageClient | undefined;

function setupDefaultConfiguration() {
  const config = vscode.workspace.getConfiguration('TypedAnt');

  if (!config.has('Compiler') || config.get('Compiler') === '') {
    config.update('Compiler', '', vscode.ConfigurationTarget.Global);
  }

  if (!config.has('LSP') || config.get('LSP') === '') {
    config.update('LSP', '', vscode.ConfigurationTarget.Global);
  }
}

/* =======================
   Language Server Control
======================= */

async function startLanguageServer(context: vscode.ExtensionContext) {
  if (client) {
    vscode.window.showWarningMessage('TypedAnt LSP already running.');
    return;
  }

  const config = vscode.workspace.getConfiguration('TypedAnt');
  const lspPath = config.get<string>('LSP');

  if (!lspPath) {
    vscode.window.showErrorMessage('TypedAnt.LSP undefined!');
    return;
  }

  const serverOptions = {
    command: lspPath,
    args: []
  };

  client = new LanguageClient(
    'typed_ant',
    'TypedAnt Language Server',
    serverOptions,
    {
      documentSelector: [{ scheme: 'file', language: 'TypedAnt' }]
    }
  );

  context.subscriptions.push(client);

  await client.start();

  vscode.window.showInformationMessage('TypedAnt Language Server started.');
}

async function stopLanguageServer() {
  if (!client) {
    vscode.window.showWarningMessage('TypedAnt LSP not running.');
    return;
  }

  await client.stop();
  client = undefined;

  vscode.window.showInformationMessage('TypedAnt Language Server stopped.');
}

async function restartLanguageServer(context: vscode.ExtensionContext) {
  if (!!client) {
    await stopLanguageServer();
  }
  
  await startLanguageServer(context);
}

/* =======================
          Activate
======================= */

export function activate(context: vscode.ExtensionContext) {
  codeCompiler = new CodeCompiler();

  setupDefaultConfiguration();

  context.subscriptions.push(

    vscode.commands.registerCommand('TypedAnt.Compile', () => {
      codeCompiler.compile();
    }),

    vscode.commands.registerCommand('TypedAnt.StopExecution', () => {
      codeCompiler.stopExecution();
    }),

    vscode.commands.registerCommand('TypedAnt.StartLSP', () => {
      startLanguageServer(context);
    }),

    vscode.commands.registerCommand('TypedAnt.StopLSP', () => {
      stopLanguageServer();
    }),

    vscode.commands.registerCommand('TypedAnt.RestartLSP', () => {
      restartLanguageServer(context);
    })
  );

  /* Status Bar */

  const compileItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  compileItem.text = '$(play) Compile TypedAnt';
  compileItem.command = 'TypedAnt.Compile';
  compileItem.show();

  context.subscriptions.push(compileItem);

  /* Auto restart on config change */

  vscode.workspace.onDidChangeConfiguration(e => {
    if (e.affectsConfiguration('TypedAnt.LSP')) {
      restartLanguageServer(context);
    }
  });

  /* Auto start LSP */

  startLanguageServer(context);
}

export function deactivate() {
  if (client) {
    client.stop();
  }
}
