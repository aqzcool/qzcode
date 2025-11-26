# QZ 项目重命名 - 快速参考指南（安全版）

## 🆕 **项目重命名关键信息**

| 项目 | 旧值 | 新值 |
|------|------|------|
| 项目名称 | Void | QZ |
| 域名 | voideditor.com | **qz.cool** |
| GitHub 组织 | voideditor | **aqzcool** |
| 仓库名 | void | **qzcode** |
| 仓库地址 | github.com/voideditor/void | **github.com/aqzcool/qzcode** |

## 🚨 **重要警告：void 关键字保护**

⚠️ **`void` 在代码中是编程关键字，不能随意替换！**

### 🔒 绝对不能修改的 void：
```typescript
// ❌ 函数返回类型 - 绝对不能修改
function foo(): void { }
const bar = (): void => { };

// ❌ void 操作符 - 绝对不能修改
void 0
void someFunction()

// ❌ 接口定义 - 绝对不能修改
interface MyInterface {
  method(): void;
}
```

### ✅ 可以安全替换的 void：
```typescript
// ✅ 字符串常量 - 可以替换
"Welcome to void" → "Welcome to qz"
'void-editor' → 'qz-editor'

// ✅ 配置属性 - 可以替换
{ name: "void" } → { name: "qz" }
applicationName: "void" → applicationName: "qz"
```

## 🛡️ **安全替换命令（推荐）**

### 步骤1：安全的自动替换
```bash
# 只替换配置文件（安全）
find . -name "*.json" -exec sed -i 's/"void"/"qz"/g' {} \;

# 只替换文档（安全）
find . -name "*.md" -exec sed -i 's/Void/QZ/g' {} \;

# 替换明显的品牌字符串（安全）
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/Welcome to Void/Welcome to QZ/g' {} \;
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i 's/Void Editor/QZ Editor/g' {} \;
```

### 步骤2：手动检查替换
```bash
# 搜索所有包含 "void" 的代码文件，需要手动检查
find . -name "*.ts" -o -name "*.tsx" | xargs grep -n "void" | less
```

## ⚠️ **危险的一键替换命令（不推荐）**
```bash
# ⚠️ 这些命令可能破坏代码，请谨慎使用！
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.css" \) -exec sed -i 's/void/QZ/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.css" \) -exec sed -i 's/voideditor/qzcool/g' {} \;
```

## 📝 **必须手动检查的配置文件**

### 1. product.json
```json
{
  "nameShort": "Void",           → "QZ",
  "nameLong": "Void",            → "QZ",
  "applicationName": "void",     → "qz",
  "darwinBundleIdentifier": "com.voideditor.code",  → "com.qzcool.code",
  "licenseUrl": "https://github.com/voideditor/void/blob/main/LICENSE.txt", → "https://github.com/aqzcool/qzcode/blob/main/LICENSE.txt",
  "reportIssueUrl": "https://github.com/voideditor/void/issues/new", → "https://github.com/aqzcool/qzcode/issues/new",
  "linkProtectionTrustedDomains": [
    "https://voideditor.com",     → "https://qz.cool"
  ]
}
```

### 2. package.json
```json
{
  "repository": {
    "url": "https://github.com/microsoft/vscode.git" → "https://github.com/aqzcool/qzcode.git"
  },
  "bugs": {
    "url": "https://github.com/microsoft/vscode/issues" → "https://github.com/aqzcool/qzcode/issues"
  }
}
```

### 3. README.md
需要更新的链接：
- `https://voideditor.com` → `https://qz.cool`
- `https://github.com/voideditor/void` → `https://github.com/aqzcool/qzcode`

## 🔍 **代码文件手动检查清单**

### 高风险文件（需要逐行检查）
```
src/vs/workbench/contrib/void/**/*.ts
src/vs/workbench/contrib/void/**/*.tsx
```

### 需要特别检查的模式
```bash
# 检查可能误替换的代码
grep -r "(): QZ" . --include="*.ts" --include="*.tsx"    # 应该返回空结果
grep -r "void 0" . --include="*.ts" --include="*.tsx"    # 应该保留
grep -r "(): void" . --include="*.ts" --include="*.tsx"  # 应该保留
```

## 🚨 **危险信号检查**

### 如果看到以下模式，说明替换过度了：
```typescript
// ❌ 错误：函数返回类型被错误替换
function foo(): QZ { }          // 应该是 :void
const bar = (): QZ => { };      // 应该是 :void

// ❌ 错误：void 操作符被错误替换
QZ 0                            // 应该是 void 0
QZ someFunction()              // 应该是 void someFunction()
```

## 🛠️ **修复误替换的方法**

### 如果发现代码被误替换：
```bash
# 1. 从 Git 恢复被误修改的文件
git checkout -- <误修改的文件名>

# 2. 或者恢复整个项目到修改前
git reset --hard HEAD

# 3. 手动重新进行安全的替换
```

## 🚨 **发布前验证清单**

### 编译检查
```bash
# 确保 TypeScript 编译通过
npx tsc --noEmit

# 运行构建测试
npm run compile
```

### 功能检查
```bash
# 启动应用测试
npm run watch
./scripts/code.sh
```

### 代码完整性检查
```bash
# 检查是否还有明显的 void 相关误替换
grep -r "(): QZ" . --include="*.ts" --include="*.tsx"    # 应该是空结果
grep -r "QZ 0" . --include="*.ts" --include="*.tsx"     # 应该是空结果

# 检查关键功能是否正常
grep -r "(): void" . --include="*.ts" --include="*.tsx" | head -10  # 应该能看到正确的 void 返回类型
```

---

**核心原则**：宁可少替换，也不能破坏代码功能！在代码文件中，`void` 99% 都是编程关键字，只有字符串常量和配置值才需要替换。
