import vscode, { OutputChannel, Terminal } from 'vscode';
import path from 'path';

export class CodeCompiler {
  outputChannel: OutputChannel;
  terminal: Terminal | undefined;

  constructor() {
    // 日志通道保留，用来给“超时/异常”做备忘
    this.outputChannel = vscode.window.createOutputChannel('TypedAnt Execution');
    /** @type {vscode.Terminal} */
    this.terminal = undefined;
  }

  async compile() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) { return; }

    const doc = editor.document;
    if (doc.languageId !== 'TypedAnt') { return; }

    const config = vscode.workspace.getConfiguration('TypedAnt');
    const antPath = config.get('Compiler');   // 编译器路径
    if (!antPath) {
      vscode.window.showErrorMessage('TypedAnt.Compiler undefined!');
      return;
    }

    const filePath = doc.uri.fsPath;

    // 如果终端已存在且被用户关了，就重新创建
    if (!this.terminal || this.terminal.exitStatus) {
      this.terminal = vscode.window.createTerminal('TypedAntCompile');
    }

    this.terminal.show(); // 聚焦终端

    const cmd = `${antPath} --file "${filePath}"`;
    this.terminal.sendText(cmd);
  }

  /** 手动停止（命令面板可绑定） */
  stopExecution() {
    if (this.terminal && !this.terminal.exitStatus) {
      this.terminal.sendText('\x03'); // Ctrl+C
      this.outputChannel.appendLine('🛑 Execution stopped by user');
      this.outputChannel.show(true);
    }
  }

  dispose() {
    if (this.terminal) { this.terminal.dispose(); }
    this.outputChannel.dispose();
  }
}