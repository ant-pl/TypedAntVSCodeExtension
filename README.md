# TypedAnt VS Code Extension

## 项目简介
TypedAnt 是一个 Visual Studio Code 扩展，旨在为 TypedAnt 语言提供支持。它包括语法高亮、代码片段、语言配置、语法检查等功能，帮助开发者更高效地编写 TypedAnt 代码。

## 功能
- **语法高亮**: 提供 TypedAnt 语言的语法高亮支持。
- **代码片段**: 内置常用的 TypedAnt 代码片段，提升开发效率。
- **语言配置**: 定义了 TypedAnt 的语言配置，确保更好的编辑体验。
- **代码检查**: 下载 lsp 后在 vscode 配置

## 文件结构
```
TypedAntVSCodeExtension/
├── codeCompiler.ts                # 编译器相关代码
├── extension.ts                   # VS Code 扩展的入口文件
├── jsconfig.json                  # JavaScript 配置文件
├── language-configuration.json    # 语言配置文件
├── package.json                   # 扩展的元数据和依赖
├── tsconfig.json                  # TypeScript 配置文件
├── snippets/                      # 代码片段目录
│   └── snippets.json              # 定义的代码片段
└── syntaxes/                      # 语法定义目录
    └── TypedAnt.tmLanguage.json   # TypedAnt 的语法高亮定义
```

## 安装 & 调试
1. 克隆此仓库到本地：
   ```bash
   git clone https://github.com/your-repo/TypedAntVSCodeExtension.git
   ```
2. 打开 VS Code 并加载此项目。
3. 按 `F5` 启动扩展开发主机。
4. 如果想要打包扩展 运行 `npm run package`

## 使用方法
1. 在 VS Code 中打开一个 TypedAnt 项目。
2. 确保扩展已启用，并且在 VSCode 配置了你的编译器和 LSP 路径。
3. 享受语法高亮和代码片段的便捷功能。

## 贡献
欢迎对本项目进行贡献！请提交 Pull Request 或报告问题。

## 许可证
[MIT License](LICENSE)

---

感谢您使用 TypedAnt VS Code Extension！