# Void 项目重命名为 QZ 的完整分析报告

## 📋 **概述**
本报告详细分析了将 Void 项目重命名为 QZ 时需要修改和保留的所有地方。

## 🆕 **新项目信息**
- **新域名**: qz.cool
- **新GitHub仓库**: https://github.com/aqzcool/qzcode.git
- **GitHub组织**: aqzcool
- **新仓库名**: qzcode

## 🔒 **需要保留 Void 的地方**

### 1. **版权和许可证信息**
- 所有版权声明中的 "Glass Devtools, Inc."
- Apache License 2.0 相关内容
- 第三方依赖的许可证信息（ThirdPartyNotices.txt）

### 2. **历史技术文档**
- 代码注释中关于技术架构的说明
- 开发历史记录
- 技术债务相关的注释

## ⚠️ **需要修改为 QZ 的地方**

### 1. **产品名称和品牌信息**

#### 核心配置文件
- `product.json` 中的所有产品名称字段
- `package.json` 中的项目信息

#### 产品名称字段映射：
```json
{
  "nameShort": "Void" → "QZ", 
  "nameLong": "Void" → "QZ",
  "applicationName": "void" → "qz",
  "dataFolderName": ".void-editor" → ".qz-editor",
  "win32DirName": "Void" → "QZ",
  "win32NameVersion": "Void" → "QZ",
  "win32RegValueName": "VoidEditor" → "QZEditor",
  "win32AppUserModelId": "Void.Editor" → "QZ.Editor",
  "win32ShellNameShort": "V&oid" → "Q&Z",
  "serverApplicationName": "void-server" → "qz-server",
  "serverDataFolderName": ".void-server" → ".qz-server",
  "tunnelApplicationName": "void-tunnel" → "qz-tunnel",
  "darwinBundleIdentifier": "com.voideditor.code" → "com.qzcool.code",
  "linuxIconName": "void-editor" → "qz-editor",
  "urlProtocol": "void" → "qz"
}
```

### 2. **用户界面文字**
- 所有 React 组件中的显示文字
- 设置页面的标签和说明
- 工具提示和帮助文本
- 侧边栏和菜单项文字

### 3. **网址和链接**
需要更新的域名和链接：
- `voideditor.com` → `qz.cool`
- `voideditor.dev` → `qz.cool`
- GitHub 仓库链接：`voideditor/void` → `aqzcool/qzcode`
- 问题追踪URL：`https://github.com/voideditor/void/issues` → `https://github.com/aqzcool/qzcode/issues`
- 扩展市场链接：`https://marketplace.visualstudio.com/items` → 更新为 qz.cool 相关

### 4. **应用程序标识符**
- Windows 注册表项
- macOS 包标识符：`com.voideditor.code` → `com.qzcool.code`
- Linux 桌面文件

### 5. **文件系统和路径**
考虑重命名的目录和文件：
- `src/vs/workbench/contrib/void/` → `src/vs/workbench/contrib/qz/`
- 图标文件中的 void 相关引用
- 资源文件中的路径

## 🔧 **具体修改清单**

### 1. **核心配置文件**
- [ ] `product.json` - 产品信息配置
- [ ] `package.json` - 项目元数据
- [ ] `.github/workflows/` - CI/CD 配置中的仓库引用

### 2. **源代码文件**
- [ ] `src/vs/workbench/contrib/void/` - 整个 void 贡献目录
- [ ] React 组件中的字符串常量
- [ ] 服务类名和接口名

### 3. **资源文件**
- [ ] 图标文件：`void_icons/` 目录
- [ ] CSS 文件中的 void 引用
- [ ] 媒体文件中的相关引用

### 4. **文档文件**
- [ ] `README.md`
- [ ] `VOID_CODEBASE_GUIDE.md` → `QZ_CODEBASE_GUIDE.md`
- [ ] `HOW_TO_CONTRIBUTE.md`
- [ ] `.voidrules` → `.qzrules`

### 5. **构建脚本**
- [ ] `scripts/appimage/` 中的 void 相关文件
- [ ] 构建配置中的产品名称
- [ ] 安装程序配置

## 🎯 **重命名策略**

### 阶段一：核心更改
1. 更新 `product.json` 和 `package.json`
2. 重命名核心源代码目录
3. 更新 React 组件中的用户界面文字

### 阶段二：资源文件
1. 更新图标和媒体文件
2. 修改 CSS 和样式文件
3. 更新文档字符串

### 阶段三：外部链接
1. 设置新域名 `qz.cool` 并配置重定向
2. 更新 GitHub 仓库链接到 `aqzcool/qzcode`
3. 更新 CI/CD 配置

### 阶段四：验证和发布
1. 全面测试所有功能
2. 更新下载链接
3. 发布公告

## ⚠️ **注意事项**

### 1. **向后兼容性**
- 考虑用户配置文件的迁移
- 保持现有功能的完整性

### 2. **测试覆盖**
- 确保所有修改都经过充分测试
- 特别关注用户界面和核心功能

### 3. **文档同步**
- 确保所有文档与新名称一致
- 更新开发者指南

### 4. **社区沟通**
- 在重命名过程中保持社区知情
- 提供迁移指南
- 更新所有外部链接

### 5. **域名迁移**
- 确保 `qz.cool` 域名正确配置
- 设置从旧域名的重定向（如果需要）
- 更新 DNS 记录

## 📊 **工作量估算**

### 核心更改：1-2天
- 配置文件的更新
- 基础代码修改

### 用户界面：2-3天
- React 组件的字符串更新
- 样式和资源文件

### 文档和链接：1天
- 文档重命名和更新
- 外部链接配置

### 测试和验证：2-3天
- 功能测试
- 集成测试

**总计：约 6-9 天工作量**

## 🚀 **建议的下一步行动**

### 立即行动
1. ✅ **域名已确认**: qz.cool
2. ✅ **仓库已确认**: https://github.com/aqzcool/qzcode.git
3. ⏳ 设置 DNS 记录和域名配置
4. ⏳ 创建新的 GitHub 仓库

### 短期计划（1-3天）
1. 开始核心配置文件的修改
2. 更新主要源代码目录结构
3. 更新 React 组件中的UI文字

### 中期计划（4-6天）
1. 完成所有用户界面文字的更新
2. 更新所有文档和指南
3. 配置 CI/CD 流水线

### 长期计划（7-9天）
1. 通知用户关于重命名
2. 提供迁移工具和指南
3. 监控和修复可能出现的问题

## 🔗 **重要链接更新**

### 更新前 → 更新后
- `https://voideditor.com` → `https://qz.cool`
- `https://github.com/voideditor/void` → `https://github.com/aqzcool/qzcode`
- `hello@voideditor.com` → `hello@qz.cool` (建议)
- `discord.gg/RSNjgaugJs` → 保持不变（如果社区迁移）

---

**注意**：此分析基于当前 Void 项目的代码库结构，并已整合最新的域名和仓库信息。如果项目结构发生重大变化，可能需要重新评估某些修改点。