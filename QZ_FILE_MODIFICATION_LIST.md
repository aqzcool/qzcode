# QZ 项目重命名 - 关键文件修改清单

## 🆕 **新项目信息**
- **新域名**: qz.cool
- **新GitHub仓库**: https://github.com/aqzcool/qzcode.git
- **GitHub组织**: aqzcool
- **新仓库名**: qzcode

## 🎯 **高优先级文件（必须修改）**

### 1. **核心配置文件**
```
product.json                          # 产品名称、标识符、文件夹名称
                                      # 更新: darwinBundleIdentifier: com.voideditor.code → com.qzcool.code
package.json                          # 项目名称、脚本中的 void 引用
```

### 2. **用户界面字符串**
```
src/vs/workbench/contrib/void/browser/react/src/void-onboarding/VoidOnboarding.tsx
src/vs/workbench/contrib/void/browser/react/src/void-settings-tsx/Settings.tsx
src/vs/workbench/contrib/void/browser/react/src/void-settings-tsx/ModelDropdown.tsx
src/vs/workbench/contrib/void/browser/react/src/sidebar-tsx/Sidebar.tsx
src/vs/workbench/contrib/void/browser/react/src/sidebar-tsx/SidebarChat.tsx
src/vs/workbench/contrib/void/browser/voidSettingsPane.ts
src/vs/workbench/contrib/void/browser/sidebarPane.ts
```

### 3. **服务和功能类**
```
src/vs/workbench/contrib/void/common/voidSettingsService.ts
src/vs/workbench/contrib/void/common/voidModelService.ts
src/vs/workbench/contrib/void/common/voidUpdateService.ts
src/vs/workbench/contrib/void/browser/void.contribution.ts
src/vs/workbench/contrib/void/browser/voidUpdateActions.ts
src/vs/workbench/contrib/void/browser/voidOnboardingService.ts
src/vs/workbench/contrib/void/browser/voidSCMService.ts
```

## 🔄 **中优先级文件（建议修改）**

### 4. **文档文件**
```
README.md                             # 项目名称、描述、链接
                                      # 更新: voideditor.com → qz.cool
VOID_CODEBASE_GUIDE.md               # 重命名并更新内容
HOW_TO_CONTRIBUTE.md                 # 项目名称和链接
                                      # 更新: github.com/voideditor/void → github.com/aqzcool/qzcode
```

### 5. **图标和资源**
```
void_icons/                          # 整个目录重命名
src/vs/workbench/browser/media/void-icon-sm.png
src/vs/workbench/browser/parts/editor/media/void_cube_noshadow.png
scripts/appimage/void.png
scripts/appimage/void.desktop
scripts/appimage/void-url-handler.desktop
resources/win32/inno-void.bmp
```

### 6. **外部扩展配置**
```
extensions/open-remote-ssh/package.json
extensions/open-remote-wsl/package.json
extensions/open-remote-ssh/src/serverSetup.ts
extensions/open-remote-wsl/src/serverSetup.ts
```

## 🟡 **低优先级文件（可选修改）**

### 7. **开发工具配置**
```
.voidrules                           # 重命名为 .qzrules
.github/workflows/                   # CI/CD 配置中的仓库引用更新
                                      # 更新: voideditor/void → aqzcool/qzcode
.github/scripts/issue_triage.py      # 中的 voideditor 引用
```

### 8. **测试文件**
```
# 大部分测试文件可以保持原样，但涉及 UI 字符串的测试需要更新
test/smoke/README.md                 # 如果包含项目名称
```

## 📝 **具体的字符串替换模式**

### 品牌名称替换
```
Void → QZ
void → qz
VOID → QZ
voideditor → qzcool
```

### 产品标识符替换
```
com.voideditor.code → com.qzcool.code
void-editor → qz-editor
.void-editor → .qz-editor
void-tunnel → qz-tunnel
void-server → qz-server
```

### 网址替换
```
voideditor.com → qz.cool
voideditor.dev → qz.cool
github.com/voideditor/void → github.com/aqzcool/qzcode
```

### 链接更新
```
https://voideditor.com → https://qz.cool
https://github.com/voideditor/void → https://github.com/aqzcool/qzcode
https://github.com/voideditor/void/issues → https://github.com/aqzcool/qzcode/issues
hello@voideditor.com → hello@qz.cool (建议)
```

## ⚠️ **特别注意的文件**

### 版权保护（不要修改）
```
ThirdPartyNotices.txt                # 第三方许可证信息
LICENSE.txt                          # 主要许可证文件
```

### 技术实现（谨慎修改）
```
src/vs/workbench/contrib/void/       # 整个目录结构需要重构
# 建议按功能模块逐一重命名，而不是一次性全部修改
```

## 🔧 **替换工具建议**

### 使用全局替换工具
1. **VS Code**：使用 Ctrl+H 进行全局替换
2. **命令行工具**：
   ```bash
   # Linux/Mac
   find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) -exec sed -i 's/void/QZ/g' {} \;
   find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) -exec sed -i 's/voideditor/qzcool/g' {} \;
   find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) -exec sed -i 's/voideditor.com/qz.cool/g' {} \;
   
   # Windows (PowerShell)
   Get-ChildItem -Recurse -Include "*.ts","*.tsx","*.js","*.json","*.md" | ForEach-Object { 
     (Get-Content $_.FullName) -replace 'void', 'QZ' -replace 'voideditor', 'qzcool' -replace 'voideditor\.com', 'qz.cool' | Set-Content $_.FullName 
   }
   ```

### 手动检查的文件
- 产品标识符相关的配置
- 版权信息
- 第三方许可证

## 📋 **修改验证清单**

### ✅ 功能测试
- [ ] 应用启动正常
- [ ] 用户界面显示正确
- [ ] 设置页面正常工作
- [ ] 侧边栏功能正常
- [ ] 更新功能正常

### ✅ 构建测试
- [ ] 本地开发构建成功
- [ ] 生产版本构建成功
- [ ] 图标和资源正确显示
- [ ] 包安装和卸载正常

### ✅ 兼容性测试
- [ ] 用户配置文件迁移正常
- [ ] 扩展兼容性保持
- [ ] 现有工作流程不受影响

### ✅ 链接验证
- [ ] qz.cool 域名正常访问
- [ ] GitHub 仓库链接正确
- [ ] 邮件地址更新生效
- [ ] 外部文档链接更新

## 🎯 **关键更新点**

### 1. 产品标识符重点更新
```json
// product.json 关键字段
{
  "darwinBundleIdentifier": "com.voideditor.code" → "com.qzcool.code",
  "licenseUrl": "https://github.com/voideditor/void/blob/main/LICENSE.txt" → "https://github.com/aqzcool/qzcode/blob/main/LICENSE.txt",
  "reportIssueUrl": "https://github.com/voideditor/void/issues/new" → "https://github.com/aqzcool/qzcode/issues/new",
  "linkProtectionTrustedDomains": [
    "https://voideditor.com",
    "https://voideditor.dev"
  ] → [
    "https://qz.cool"
  ]
}
```

### 2. GitHub 相关更新
```json
// package.json 中的 repository 字段
{
  "repository": {
    "type": "git",
    "url": "https://github.com/microsoft/vscode.git"
  } → "https://github.com/aqzcool/qzcode.git",
  
  "bugs": {
    "url": "https://github.com/microsoft/vscode/issues"
  } → "https://github.com/aqzcool/qzcode/issues"
}
```

---

**修改顺序建议**：
1. 先修改核心配置文件（产品正常运行）
2. 再修改用户界面文字（改善用户体验）
3. 最后修改文档和外部链接（完善品牌形象）

**重要提醒**：记得同步更新开发文档、README 文件，以及任何外部引用的链接！