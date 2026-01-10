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

## 安装 & 配置 (使用者)
1. 从 `VSCode市场` 下载并安装扩展
2. 请确保你下载并配置好了 `编译器本体` 和 `LSP` 否则 请前往仓库 `typed_ant_lsp`, `ant_cranelift_compiler` 下载并构建
3. 点击左下角齿轮图标，点击设置，进入设置面板
4. 上方可能会有两个或多个选项 `用户` `工作区` 请选择 `用户` 选项卡
5. 在左侧边栏中点击扩展 (不是扩展市场!)，往下滑找到 `TypedAnt`
6. 您将会看到两个配置。即 `Compiler` 和 `LSP`。在 `Compiler` 中输入你的编译器本体路径，在 `LSP` 中输入您的 LSP 路径，配置就完成了

## 安装 & 调试 (开发者)
1. 克隆此仓库到本地：
   ```bash
   git clone https://github.com/LKBaka/TypedAntVSCodeExtension.git
   ```
2. 打开 VS Code 并加载此项目。
3. 按 `F5` 启动扩展开发主机。  
   (注意，请确保配置了 `编译器本体` 和 `LSP` 路径 如果没有 `编译器本体` 和 `LSP` 请前往仓库 `typed_ant_lsp`, `ant_cranelift_compiler` 下载并构建)
4. 如果想要打包扩展 运行 `npm run package`

## 如何编译一个文件
(前置条件: 已配置 `LSP` 和 `编译器本体` 的路径)
如果已完成前置条件 点击下方的 `Compile TypedAnt` 按钮即可编译 (需要切换到 TypedAnt 文件)

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