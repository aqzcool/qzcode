# QZ 重命名 - void 关键字安全提醒

## 🚨 **重要：void 关键字不能替换！**

你的担心完全正确！在编程中，`void` 是一个非常重要的关键字，绝对不能随意替换。

## 🔒 **必须保留的 void 关键字**

### TypeScript/JavaScript 中的 void 使用：

```typescript
// 1. 函数返回类型声明 - 绝对不能修改
function myFunction(): void {
  // 函数体
}

const myArrowFunction = (): void => {
  // 函数体
};

// 2. 接口方法声明 - 绝对不能修改
interface MyInterface {
  myMethod(): void;
  myProperty: () => void;
}

// 3. 类方法声明 - 绝对不能修改
class MyClass {
  myMethod(): void {
    // 实现
  }
}

// 4. void 操作符 - 绝对不能修改
const result = void 0;           // 等同于 undefined
const cleanup = void someFunction();  // 调用函数但返回 undefined

// 5. 事件处理器类型 - 绝对不能修改
const handleClick: (event: MouseEvent) => void = () => {
  // 处理点击事件
};

// 6. 回调函数类型 - 绝对不能修改
const callback: (data: string) => void = (data) => {
  console.log(data);
};
```

## ✅ **可以安全替换的情况**

### 1. 字符串常量
```typescript
// ✅ 这些可以替换
const productName = "void-editor";  →  const productName = "qz-editor";
const welcomeMessage = "Welcome to void";  →  const welcomeMessage = "Welcome to qz";
```

### 2. 配置对象属性
```typescript
// ✅ 这些可以替换
const config = {
  name: "void",           →  name: "qz",
  applicationName: "void", →  applicationName: "qz"
};
```

### 3. 文档和注释
```markdown
// ✅ 这些可以替换
# Welcome to Void  →  # Welcome to QZ
This is void editor  →  This is qz editor
```

## ⚠️ **错误的替换示例**

### ❌ 错误做法：
```bash
# 这样的全局替换会破坏代码！
sed 's/void/QZ/g' *.ts    # 绝对不能这样做！
```

**后果：**
```typescript
// 原来的正确代码：
function callback(): void {
  return;
}

// 被错误替换后：
function callback(): QZ {    // ❌ 错误！TypeScript 会报错
  return;
}

// 原来的正确代码：
const result = void 0;

// 被错误替换后：
const result = QZ 0;         // ❌ 错误！语法错误
```

## 🛡️ **安全的替换策略**

### 方法1：仅替换字符串和配置
```bash
# 只替换双引号中的内容
find . -name "*.json" -exec sed -i 's/"void"/"qz"/g' {} \;

# 只替换明显的字符串常量
find . -name "*.tsx" -exec sed -i 's/"Welcome to void"/"Welcome to qz"/g' {} \;
```

### 方法2：手动逐文件替换
```bash
# 搜索包含 "void" 的文件
find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "void"

# 手动检查每个文件
# 使用编辑器逐行检查，只替换字符串常量中的 void
```

### 方法3：使用正则表达式（高级）
```bash
# 只替换字符串常量中的 void（需要更复杂的正则）
# 这需要根据具体代码结构调整
```

## 🔍 **替换前检查清单**

### 运行这些命令检查风险：
```bash
# 检查有多少 void 关键字使用
echo "=== TypeScript void 返回类型 ==="
grep -r "(): void" . --include="*.ts" --include="*.tsx" | wc -l

echo "=== void 操作符使用 ==="
grep -r "void " . --include="*.ts" --include="*.tsx" | wc -l

echo "=== 接口中的 void ==="
grep -r "void" . --include="*.ts" --include="*.tsx" | grep "interface" | wc -l
```

### 如果发现大量使用 void：
```bash
# 说明代码中有很多 void 关键字，建议不要使用全局替换
# 应该采用手动逐文件替换的方式
```

## 📋 **推荐的替换流程**

### 阶段1：安全替换
```bash
# 1. 替换配置文件（安全）
find . -name "*.json" -exec sed -i 's/"void"/"qz"/g' {} \;

# 2. 替换文档（安全）
find . -name "*.md" -exec sed -i 's/Void/QZ/g' {} \;

# 3. 替换明显的UI字符串（安全）
find . -name "*.tsx" -exec sed -i 's/Welcome to Void/Welcome to QZ/g' {} \;
```

### 阶段2：手动精修
```bash
# 搜索需要手动处理的 void
find . -name "*.ts" -o -name "*.tsx" | xargs grep -n "void" | less

# 逐个文件手动检查和替换
# 只替换字符串常量中的 void，保留编程关键字
```

### 阶段3：验证
```bash
# 检查编译是否正常
npx tsc --noEmit

# 检查是否有误替换
grep -r "(): QZ" . --include="*.ts" --include="*.tsx"  # 应该返回空结果
grep -r "QZ 0" . --include="*.ts" --include="*.tsx"   # 应该返回空结果
```

## 🆘 **如果已经误替换了怎么办？**

### 立即恢复：
```bash
# 1. 从 Git 恢复
git checkout HEAD -- .

# 2. 或者恢复单个文件
git checkout HEAD -- <文件名>
```

### 重新开始：
```bash
# 使用更安全的方法重新开始
git reset --hard HEAD
```

---

**记住**：在代码文件中看到 `void` 时，99% 的概率它是编程关键字，只有在字符串常量、配置文件和文档中才可能是需要替换的品牌名称！
