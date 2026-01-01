"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __importDefault(require("vscode"));
const codeCompiler_1 = require("./codeCompiler");
const node_1 = require("vscode-languageclient/node");
let codeCompiler;
function setupDefaultConfiguration() {
    const config = vscode_1.default.workspace.getConfiguration('TypedAnt');
    // 如果Compiler未设置，则设置默认值
    if (!config.has('Compiler') || config.get('Compiler') === '') {
        const defaultCompilerPath = '';
        config.update('Compiler', defaultCompilerPath, vscode_1.default.ConfigurationTarget.Global)
            .then(() => {
            vscode_1.default.window.showInformationMessage(`TypedAnt: 'Compiler' set to default: ${defaultCompilerPath}`);
        });
    }
    // 如果LSP未设置，则设置默认值
    if (!config.has('LSP') || config.get('LSP') === '') {
        const defaultLSPPath = '';
        config.update('LSP', defaultLSPPath, vscode_1.default.ConfigurationTarget.Global)
            .then(() => {
            vscode_1.default.window.showInformationMessage(`TypedAnt: 'LSP' set to default: ${defaultLSPPath}`);
        });
    }
}
function activate(context) {
    codeCompiler = new codeCompiler_1.CodeCompiler();
    // 自动配置默认参数
    setupDefaultConfiguration();
    const extension_config = vscode_1.default.workspace.getConfiguration('TypedAnt');
    // 注册命令
    context.subscriptions.push(vscode_1.default.commands.registerCommand('TypedAnt.Compile', () => __awaiter(this, void 0, void 0, function* () {
        codeCompiler.compile();
    })), vscode_1.default.commands.registerCommand('TypedAnt.StopExecution', () => {
        codeCompiler.stopExecution();
    }));
    const statusBarItem = vscode_1.default.window.createStatusBarItem(vscode_1.default.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(play) Compile TypedAnt";
    statusBarItem.command = 'TypedAnt.Compile';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(vscode_1.default.languages.registerCompletionItemProvider('TypedAnt', {
        provideCompletionItems(document, position) {
            // 创建一个CompletionItem数组
            // const completionItems = [
            //   new vscode.CompletionItem('print()', vscode.CompletionItemKind.Function),
            //   new vscode.CompletionItem('len()', vscode.CompletionItemKind.Function),
            //   new vscode.CompletionItem('input()', vscode.CompletionItemKind.Function),
            //   new vscode.CompletionItem('clear()', vscode.CompletionItemKind.Function),
            //   new vscode.CompletionItem('force_exit()', vscode.CompletionItemKind.Function),
            // ];
            // 返回CompletionItem数组
            return [];
        }
    }));
    const lspPath = extension_config.get("LSP");
    if (!lspPath) {
        vscode_1.default.window.showErrorMessage("TypedAnt.LSP undefined!");
        return;
    }
    const serverOptions = {
        command: lspPath,
        args: [],
    };
    const client = new node_1.LanguageClient('typed_ant', 'TypedAnt Langauge Server', serverOptions, { documentSelector: [{ scheme: 'file', language: 'TypedAnt' }] });
    client.start();
    context.subscriptions.push(client);
}
function deactivate() { }
module.exports = {
    activate,
    deactivate
};
