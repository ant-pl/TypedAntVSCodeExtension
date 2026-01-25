"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const codeCompiler_1 = require("./codeCompiler");
const node_1 = require("vscode-languageclient/node");
let codeCompiler;
let client;
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
function startLanguageServer(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (client) {
            vscode.window.showWarningMessage('TypedAnt LSP already running.');
            return;
        }
        const config = vscode.workspace.getConfiguration('TypedAnt');
        const lspPath = config.get('LSP');
        if (!lspPath) {
            vscode.window.showErrorMessage('TypedAnt.LSP undefined!');
            return;
        }
        const serverOptions = {
            command: lspPath,
            args: []
        };
        client = new node_1.LanguageClient('typed_ant', 'TypedAnt Language Server', serverOptions, {
            documentSelector: [{ scheme: 'file', language: 'TypedAnt' }]
        });
        context.subscriptions.push(client);
        yield client.start();
        vscode.window.showInformationMessage('TypedAnt Language Server started.');
    });
}
function stopLanguageServer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!client) {
            vscode.window.showWarningMessage('TypedAnt LSP not running.');
            return;
        }
        yield client.stop();
        client = undefined;
        vscode.window.showInformationMessage('TypedAnt Language Server stopped.');
    });
}
function restartLanguageServer(context) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!!client) {
            yield stopLanguageServer();
        }
        yield startLanguageServer(context);
    });
}
/* =======================
          Activate
======================= */
function activate(context) {
    codeCompiler = new codeCompiler_1.CodeCompiler();
    setupDefaultConfiguration();
    context.subscriptions.push(vscode.commands.registerCommand('TypedAnt.Compile', () => {
        codeCompiler.compile();
    }), vscode.commands.registerCommand('TypedAnt.StopExecution', () => {
        codeCompiler.stopExecution();
    }), vscode.commands.registerCommand('TypedAnt.StartLSP', () => {
        startLanguageServer(context);
    }), vscode.commands.registerCommand('TypedAnt.StopLSP', () => {
        stopLanguageServer();
    }), vscode.commands.registerCommand('TypedAnt.RestartLSP', () => {
        restartLanguageServer(context);
    }));
    /* Status Bar */
    const compileItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
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
function deactivate() {
    if (client) {
        client.stop();
    }
}
