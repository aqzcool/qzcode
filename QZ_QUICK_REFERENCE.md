## 🎯 **一键替换命令**

### 基础替换（安全）
```bash
# 在项目根目录执行
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.css" \) -exec sed -i 's/void/QZ/g' {} \;
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" -o -name "*.md" -o -name "*.css" \) -exec sed -i 's/voideditor/qzcool/g' {} \;
```
