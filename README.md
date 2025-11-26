# QZ - 开源AI代码编辑器

<div align="center">
	<img
		src="./void_icons/logo.jpg"
	 	alt="QZ Logo"
		width="300"
	 	height="300"
	/>
</div>

**QZ** 是一个开源的AI驱动代码编辑器，是Cursor的开源替代品，基于 [Void](https://github.com/voideditor/void) 项目进行二次开发。

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/aqzcool/qzcode.svg)](https://github.com/aqzcool/qzcode/issues)
[![GitHub stars](https://img.shields.io/github/stars/aqzcool/qzcode.svg)](https://github.com/aqzcool/qzcode/stargazers)
[![Discord](https://img.shields.io/badge/Discord-Join%20us-7289da.svg)](https://discord.gg/RSNjgaugJs)

## ✨ 特性

- 🤖 **AI智能编程**: 使用AI代理协助代码编辑、聊天和问题解决
- 🔄 **变更可视化**: 检查点机制，可视化代码变更历史
- 🏠 **本地模型支持**: 支持本地部署的AI模型，保护数据隐私
- 🔌 **多模型支持**: 兼容Anthropic、OpenAI、Ollama等多种AI提供商，支持国内厂商 Anthropic 兼容端点
- 📊 **实时协作**: 实时同步代码变更和AI建议
- 🛡️ **隐私保护**: 直接与AI提供商通信，不保留用户数据

## 🚀 快速开始

### 系统要求

- **Node.js** 20.x 或更高版本
- **npm** 或 **yarn**
- **Windows** 构建工具 (Windows平台构建时需要)

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
# 编译React组件
npm run buildreact

# 开发模式编译
npm run watchreact

# 完整项目编译
npm run compile
```

## 🏗️ 构建说明

### 完整编译流程

```bash
# 1. 安装依赖
npm install

# 2. 编译项目
npm run compile

# 3. 构建Windows版本
# Windows x64 版本
npm run gulp vscode-win32-x64

# Windows ARM64 版本
npm run gulp vscode-win32-arm64

# 4. 生成安装程序
# Windows x64 系统安装程序
npm run gulp vscode-win32-x64-system-setup

# Windows x64 用户安装程序
npm run gulp vscode-win32-x64-user-setup

# Windows ARM64 系统安装程序
npm run gulp vscode-win32-arm64-system-setup

# Windows ARM64 用户安装程序
npm run gulp vscode-win32-arm64-user-setup
```

### 构建输出

构建完成后，文件将生成在以下位置：

- **应用文件**: `../VSCode-win32-x64/` 或 `../VSCode-win32-arm64/`
- **安装程序**: `.build/win32-x64/system-setup/` 或 `.build/win32-x64/user-setup/`

### 快速构建命令

```bash
# 压缩版本（更小体积）
npm run gulp vscode-win32-x64-min
npm run gulp vscode-win32-arm64-min

# 纯应用包（无安装程序）
npm run gulp vscode-win32-x64-standalone
npm run gulp vscode-win32-arm64-standalone
```

## 🛠️ 开发指南

### 项目结构

```
QZ/
├── src/vs/workbench/contrib/void/     # QZ核心功能模块
│   ├── browser/                      # 浏览器端代码
│   │   ├── react/                    # React组件
│   │   │   ├── src/                  # React源码
│   │   │   └── out/                  # 编译输出
│   │   ├── voidSettingsPane.ts       # 设置面板
│   │   ├── sidebarPane.ts           # 侧边栏
│   │   └── void.contribution.ts     # 功能注册
│   ├── common/                      # 通用服务
│   └── electron-main/               # 主进程代码
├── extensions/                       # 扩展目录
│   ├── open-remote-ssh/             # SSH远程扩展
│   └── open-remote-wsl/             # WSL远程扩展
├── build/                           # 构建脚本
├── void_icons/                      # 图标资源
└── product.json                     # 产品配置
```

### 核心组件

- **React UI**: 现代化的用户界面组件
- **TypeScript**: 类型安全的开发体验
- **Gulp**: 自动化构建系统
- **Electron**: 跨平台桌面应用框架

### 关键脚本

```bash
# React相关
npm run buildreact          # 编译React组件
npm run watchreact          # 监听模式编译
npm run watchreactd         # 守护进程模式

# 代码质量
npm run monaco-compile-check # Monaco编译检查
npm run tsec-compile-check   # 安全检查
npm run eslint               # 代码规范检查
npm run stylelint           # 样式检查

# 测试
npm run test-browser        # 浏览器测试
npm run test-node           # Node.js测试
```

## 🎯 QZ特有功能

### AI设置配置

QZ支持多种AI提供商配置：

- **本地模型**: Ollama, vLLM, LM Studio
- **云端模型**: Anthropic, OpenAI, Google Gemini
- **代理服务**: OpenRouter, LiteLLM

### 键盘快捷键

- `Cmd/Ctrl + L`: 快速编辑模式
- `Cmd/Ctrl + K`: 发送聊天消息
- `Cmd/Ctrl + Shift + P`: 命令面板

### 配置管理

QZ使用`.qzrules`文件进行项目级配置：

```json
{
  "aiProviders": ["ollama", "anthropic"],
  "defaultModel": "claude-3-sonnet",
  "enableAutocomplete": true,
  "enableFastApply": true
}
```

## 📚 开发资源

### 核心文档

- **[代码库指南](QZ_CODEBASE_GUIDE.md)**: 深入了解QZ的代码架构
- **[贡献指南](HOW_TO_CONTRIBUTE.md)**: 如何参与QZ开发
- **[修改记录](QZ_MODIFICATION_STATUS.md)**: 最新的开发进展

### 外部资源

- [VS Code 源码组织](https://github.com/microsoft/vscode/wiki/Source-Code-Organization)
- [VS Code API 参考](https://code.visualstudio.com/api/references/vscode-api)
- [Electron 文档](https://electronjs.org/docs)

### QZ特定文档

- **[重命名分析](QZ_RENAMING_ANALYSIS.md)**: Void到QZ的品牌转换分析
- **[安全提醒](QZ_VOID_SAFETY_REMINDER.md)**: 开发过程中的安全注意事项
- **[文件修改清单](QZ_FILE_MODIFICATION_LIST.md)**: 需要修改的文件列表

## 🔧 自定义配置

### 产品配置

在`product.json`中修改应用信息：

```json
{
  "nameShort": "QZ",
  "nameLong": "QZ - AI Code Editor",
  "applicationName": "qz-code",
  "version": "1.4.9",
  "darwinBundleIdentifier": "com.qzcool.code",
  "urlProtocol": "qz"
}
```

### 扩展配置

扩展发布者信息更新为：

- **GitHub组织**: [aqzcool](https://github.com/aqzcool)
- **仓库**: [qzcode](https://github.com/aqzcool/qzcode)
- **网站**: [qz.cool](https://qz.cool)

## 📋 支持的平台

### 构建支持

- ✅ **Windows x64**
- ✅ **Windows ARM64**
- ⏳ **macOS** (开发中)
- ⏳ **Linux** (开发中)

### 运行时要求

- **Windows 10/11** (x64, ARM64)
- **内存**: 最少4GB，推荐8GB+
- **存储**: 至少1GB可用空间

## 🚧 开发状态

> **注意**: 我们正在积极开发 QZ IDE，持续增强 AI 编程体验！最新版本已支持 Anthropic 自定义端点配置。

### 当前阶段

- ✅ **品牌重命名**: Void → QZ
- ✅ **核心功能**: AI编程助手基本完成
- ✅ **构建系统**: 完整的编译和打包流程
- ✅ **Anthropic 支持**: 自定义端点配置，支持智谱、MiniMax、阿里百炼、Kimi 等国内厂商
- ✅ **Claude 4.5**: 集成最新的 Claude 4.5 系列模型
- 🔄 **功能增强**: 持续优化AI模型集成和用户体验
- ⏳ **平台扩展**: 持续开发更多功能特性

## 🤝 贡献指南

我们欢迎社区贡献！请查看 [贡献指南](HOW_TO_CONTRIBUTE.md) 了解详细信息。

### 贡献方式

1. **功能开发**: 新增AI功能或优化现有功能
2. **Bug修复**: 提交issue并提供修复
3. **文档改进**: 完善文档和示例
4. **翻译**: 将QZ本地化为您的语言

### 社区资源

- 🗣️ **[Discord社区](https://discord.gg/RSNjgaugJs)**: 实时交流和讨论
- 📊 **[项目看板](https://github.com/orgs/aqzcool/projects/2)**: 查看开发进度
- 🐛 **[问题追踪](https://github.com/aqzcool/qzcode/issues)**: 报告问题和请求功能

## 📄 许可证

QZ基于 [MIT许可证](LICENSE.txt) 开源，详见许可证文件。

## 📞 支持与联系

- 📧 **邮箱**: [hello@qz.cool](mailto:hello@qz.cool)
- 💬 **Discord**: [加入我们的社区](https://discord.gg/RSNjgaugJs)
- 🌐 **网站**: [qz.cool](https://qz.cool)
- 📖 **文档**: [完整文档](https://github.com/aqzcool/qzcode/wiki)

---

<div align="center">

**让AI成为您最好的编程伙伴**

*Built with ❤️ by the QZ team*

</div>
