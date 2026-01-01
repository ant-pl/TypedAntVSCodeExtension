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
exports.CodeCompiler = void 0;
const vscode_1 = __importDefault(require("vscode"));
class CodeCompiler {
    constructor() {
        // 日志通道保留，用来给“超时/异常”做备忘
        this.outputChannel = vscode_1.default.window.createOutputChannel('TypedAnt Execution');
        /** @type {vscode.Terminal} */
        this.terminal = undefined;
    }
    compile() {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = vscode_1.default.window.activeTextEditor;
            if (!editor) {
                return;
            }
            const doc = editor.document;
            if (doc.languageId !== 'TypedAnt') {
                return;
            }
            const config = vscode_1.default.workspace.getConfiguration('TypedAnt');
            const antPath = config.get('Compiler'); // 编译器路径
            if (!antPath) {
                vscode_1.default.window.showErrorMessage('TypedAnt.Compiler undefined!');
                return;
            }
            const filePath = doc.uri.fsPath;
            // 如果终端已存在且被用户关了，就重新创建
            if (!this.terminal || this.terminal.exitStatus) {
                this.terminal = vscode_1.default.window.createTerminal('TypedAntCompile');
            }
            this.terminal.show(); // 聚焦终端
            const cmd = `${antPath} --file "${filePath}"`;
            this.terminal.sendText(cmd);
        });
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
        if (this.terminal) {
            this.terminal.dispose();
        }
        this.outputChannel.dispose();
    }
}
exports.CodeCompiler = CodeCompiler;
