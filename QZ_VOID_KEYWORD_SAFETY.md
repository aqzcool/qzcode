# ⚠️ QZ 重命名 - void 关键字安全问题分析

## 🚨 **关键警告：void 关键字保护**

`void` 在代码中经常作为**编程关键字**使用，绝对不能替换！以下情况必须**保留 void**：

## 🔒 **必须保留的 void 关键字**

### 1. **TypeScript/JavaScript void 操作符**
```typescript
// ❌ 错误：这些都不能修改
void 0
void (expression)
void someFunction()
```

### 2. **函数返回类型声明**
```typescript
// ❌ 错误：这些都不能修改
function myFunction(): void { }
const myArrowFunction = (): void => { };
interface MyInterface {
  myMethod(): void;
}
class MyClass {
  myMethod(): void { }
}
```

### 3. **变量类型声明**
```typescript
// ❌ 错误：这些都不能修改
let result: void = undefined;
const callback: () => void = () => {};
```

### 4. **事件处理器类型**
```typescript
// ❌ 错误：这些都不能修改
const handleClick: (event: MouseEvent) => void = () => {};
```

## ✅ **可以安全替换的 void 情况**

### 1. **用户界面字符串**
```typescript
// ✅ 这些可以替换
'Welcome to Void' → 'Welcome to QZ'
'Void Editor' → 'QZ Editor'
'void' → 'qz' (在字符串常量中)
```

### 2. **产品名称和标识符**
```typescript
// ✅ 这些可以替换
applicationName: 'void' → 'qz'
const PRODUCT_NAME = 'void' → 'qz'
```

### 3. **路径和文件名**
```typescript
// ✅ 这些可以替换
'./void-service' → './qz-service'
'/void/config' → '/qz/config'
```

## 🛡️ **安全的替换策略**

### 方法1：精确上下文替换
```bash
# 只替换在字符串中的 void
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) -exec sed -i "s/'void'/'qz'/g" {} \;

# 只替换在对象属性中的 void
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" \) -exec sed -i 's/"void":/"qz":/g' {} \;
```

### 方法2：白名单替换
```bash
# 只替换特定的文件类型和上下文
# 替换 JSON 配置中的 void
find . -name "*.json" -exec sed -i 's/"void"/"qz"/g' {} \;

# 替换文档中的 Void 品牌名
find . -name "*.md" -exec sed -i 's/Void/QZ/g' {} \;
```

### 方法3：逐文件手动替换
推荐对每个关键文件进行手动检查和替换：

## 📋 **需要手动检查的关键文件**

### 1. **核心配置文件**
```
product.json                    # 可以安全替换
package.json                    # 可以安全替换
```

### 2. **React 组件文件**
```
src/vs/workbench/contrib/void/browser/react/src/**/*.tsx
# ⚠️ 需要逐行检查，只替换字符串常量
```

### 3. **服务类文件**
```
src/vs/workbench/contrib/void/**/*.ts
# ⚠️ 需要检查函数签名和类型声明
```

## 🔍 **替换前的检查清单**

### 代码语义检查
- [ ] 检查是否有 `(): void` 模式（函数返回类型）
- [ ] 检查是否有 `void` 操作符使用
- [ ] 检查接口定义中的 void
- [ ] 检查类方法定义中的 void

### 上下文分析
```bash
# 搜索可能受影响的代码模式
grep -r "(): void" . --include="*.ts" --include="*.tsx"
grep -r "void 0" . --include="*.ts" --include="*.tsx"
grep -r "void (" . --include="*.ts" --include="*.tsx"
```

## 🛠️ **推荐的替换流程**

### 阶段1：安全的自动替换
```bash
# 1. 只替换配置文件
find . -name "*.json" -exec sed -i 's/"void"/"qz"/g' {} \;
find . -name "*.md" -exec sed -i 's/Void/QZ/g' {} \;

# 2. 替换明显的品牌字符串
find . -name "*.tsx" -o -name "*.ts" | xargs grep -l "Welcome to Void" | xargs sed -i 's/Welcome to Void/Welcome to QZ/g'
```

### 阶段2：手动精修
```bash
# 搜索并手动检查每个包含 "void" 的文件
find . -name "*.ts" -o -name "*.tsx" | xargs grep -n "void" | less
```

### 阶段3：验证
```bash
# 运行 TypeScript 编译检查
npm run compile

# 运行测试
npm test
```

## ⚠️ **特别危险的文件模式**

### 高风险模式（绝对不要替换）
```typescript
// 函数声明
function foo(): void { }
const bar = (): void => { };

// 接口和类型
interface Foo {
  bar(): void;
}
type Callback = () => void;

// void 操作符
const x = void 0;
const result = void someFunction();

// 事件处理
const handler: (e: Event) => void = () => {};
```

### 低风险模式（可以替换）
```typescript
// 字符串常量
const productName = "void";
const welcomeMessage = "Welcome to void";

// 对象属性
{
  name: "void",
  type: "void-editor"
}

// 配置对象
const config = {
  applicationName: "void"
};
```

## 🧪 **测试策略**

### 1. 编译测试
```bash
# 确保 TypeScript 编译通过
npx tsc --noEmit
```

### 2. 单元测试
```bash
# 运行相关测试
npm test
```

### 3. 功能测试
```bash
# 构建并测试应用
npm run build
./scripts/code.sh --user-data-dir ./.tmp/user-data
```

## 📞 **应急处理**

如果不小心替换了 void 关键字：
```bash
# 从 git 恢复被误修改的文件
git checkout -- <文件名>

# 或者恢复整个项目
git reset --hard HEAD
```

---

**记住**：在代码文件中，`void` 99% 的情况都是编程关键字，只有在字符串常量、配置值和文档中才可能需要替换为 `qz`！
