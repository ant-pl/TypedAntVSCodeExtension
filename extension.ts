import vscode from 'vscode';
import { CodeCompiler } from './codeCompiler';
import { LanguageClient } from 'vscode-languageclient/node';
import { spawn } from 'child_process';

let codeCompiler: CodeCompiler;

function setupDefaultConfiguration() {
  const config = vscode.workspace.getConfiguration('TypedAnt');

  // 如果Compiler未设置，则设置默认值
  if (!config.has('Compiler') || config.get('Compiler') === '') {
    const defaultCompilerPath = ''
    config.update('Compiler', defaultCompilerPath, vscode.ConfigurationTarget.Global)
      .then(() => {
        vscode.window.showInformationMessage(
          `TypedAnt: 'Compiler' set to default: ${defaultCompilerPath}`
        );
      });
  }

  // 如果LSP未设置，则设置默认值
  if (!config.has('LSP') || config.get('LSP') === '') {
    const defaultLSPPath = ''
    config.update('LSP', defaultLSPPath, vscode.ConfigurationTarget.Global)
      .then(() => {
        vscode.window.showInformationMessage(
          `TypedAnt: 'LSP' set to default: ${defaultLSPPath}`
        );
      });
  }
}


function activate(context: vscode.ExtensionContext) {
  codeCompiler = new CodeCompiler();

  // 自动配置默认参数
  setupDefaultConfiguration()

  const extension_config = vscode.workspace.getConfiguration('TypedAnt');

  // 注册命令
  context.subscriptions.push(
    vscode.commands.registerCommand('TypedAnt.Compile', async () => {
      codeCompiler.compile();
    }),
    vscode.commands.registerCommand('TypedAnt.StopExecution', () => {
      codeCompiler.stopExecution();
    })
  );

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = "$(play) Compile TypedAnt";
  statusBarItem.command = 'TypedAnt.Compile';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  const lspPath = extension_config.get<string>("LSP");

  if (!lspPath) {
    vscode.window.showErrorMessage("TypedAnt.LSP undefined!");
    return;
  }

  const serverOptions = {
    command: lspPath,
    args: [],
  };

  const client = new LanguageClient(
    'typed_ant',
    'TypedAnt Langauge Server',
    serverOptions,
    { documentSelector: [{ scheme: 'file', language: 'TypedAnt' }] }
  );

  client.start();

  context.subscriptions.push(client);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};