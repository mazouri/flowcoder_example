# 设计规范 (Design Specifications)

> 本文档定义 UI/UX 原型的设计令牌、组件规范与布局规则，供原型与研发实现统一使用。

---

## 1. 设计令牌 (Design Tokens)

### 1.1 颜色 (Colors)

```css
/* 主色 - Primary */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;

/* 中性色 - Neutral */
--color-neutral-50: #fafafa;
--color-neutral-100: #f4f4f5;
--color-neutral-200: #e4e4e7;
--color-neutral-300: #d4d4d8;
--color-neutral-400: #a1a1aa;
--color-neutral-500: #71717a;
--color-neutral-600: #52525b;
--color-neutral-700: #3f3f46;
--color-neutral-800: #27272a;
--color-neutral-900: #18181b;

/* 语义色 */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;
```

### 1.2 间距 (Spacing)

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

### 1.3 字体 (Typography)

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### 1.4 圆角与阴影 (Border & Shadow)

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;

--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

### 1.5 断点 (Breakpoints)

```css
/* 移动端优先 */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 2. 组件规范

### 2.1 Button 按钮

| 属性 | 值 |
|------|-----|
| 变体 | primary, secondary, ghost, danger |
| 尺寸 | sm (32px), md (40px), lg (48px) |
| 状态 | default, hover, active, disabled, loading |

**Primary 按钮示例：**
- 背景：`--color-primary-500`
- Hover：`--color-primary-600`
- 文字：白色，`--font-weight-medium`
- 圆角：`--radius-md`
- 内边距：sm 8px 16px, md 10px 20px, lg 12px 24px

### 2.2 Input 输入框

| 属性 | 值 |
|------|-----|
| 尺寸 | sm (32px), md (40px), lg (48px) |
| 状态 | default, focus, error, disabled |

**规范：**
- 边框：1px solid `--color-neutral-300`
- Focus：边框 `--color-primary-500`，outline 2px
- Error：边框 `--color-error`
- 占位符：`--color-neutral-400`

### 2.3 Card 卡片

| 属性 | 值 |
|------|-----|
| 变体 | default, elevated, outlined |

**规范：**
- 背景：default 白/透明, elevated 白+shadow, outlined 白+边框
- 圆角：`--radius-lg`
- 内边距：`--spacing-lg`

### 2.4 Modal 弹窗

| 属性 | 值 |
|------|-----|
| 尺寸 | default (max 480px), large (max 640px), fullscreen |

**规范：**
- 遮罩：rgba(0,0,0,0.5)
- 内容区：白底，`--radius-lg`，`--shadow-lg`
- 动效：150ms ease-out

---

## 3. 布局规范

### 3.1 栅格系统

| 项目 | 值 |
|------|-----|
| 列数 | 12 |
| Gutter | 24px |
| 边距 | 16px (移动端), 24px (平板+), 32px (桌面) |

### 3.2 容器

| 断点 | 最大宽度 |
|------|----------|
| 默认 | 100% |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### 3.3 导航与侧边栏

| 组件 | 尺寸 |
|------|------|
| 顶部导航高度 | 64px |
| 侧边栏宽度 | 240px |
| 侧边栏折叠宽度 | 64px |

---

## 4. 图标规范

| 尺寸 | 用途 |
|------|------|
| 16px | 内联图标、表格操作 |
| 20px | 按钮图标、导航项 |
| 24px | 主要操作、空状态 |
| 32px | 功能入口、卡片图标 |

---

## 5. 动效规范

| 场景 | 时长 | 缓动 |
|------|------|------|
| 微交互 (hover, focus) | 150ms | ease-out |
| 页面/模块切换 | 200ms | ease-in-out |
| 弹窗出现/消失 | 150ms | ease-out |
| 列表项展开/收起 | 200ms | ease-in-out |
