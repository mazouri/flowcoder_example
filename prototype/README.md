# UI/UX 可运行原型

本目录包含基于设计规范的可运行 HTML 原型，无需构建即可在浏览器中直接打开。

## 快速启动

1. 在浏览器中打开 `index.html`，或使用本地服务器：

```bash
# 使用 Python
python3 -m http.server 8080 --directory .

# 使用 Node.js (npx)
npx serve .
```

2. 访问 http://localhost:8080

## 目录结构

```
prototype/
├── index.html          # 仪表盘入口
├── pages/
│   ├── list.html       # 列表页
│   └── detail.html     # 详情页
├── styles/
│   ├── tokens.css      # 设计令牌
│   ├── base.css        # 基础样式
│   └── components.css  # 组件样式
├── scripts/
│   └── interactions.js # 弹窗等交互
└── README.md
```

## 页面说明

| 页面 | 说明 |
|------|------|
| 仪表盘 | 统计卡片、数据表格、组件示例、弹窗 |
| 列表页 | 筛选、搜索、数据列表 |
| 详情页 | 基本信息、时间线、操作区 |

## 设计规范

样式遵循 `docs/design-specifications.md` 中的设计令牌与组件规范。

## 兼容性

- Chrome, Firefox, Safari, Edge (最新版)
- 支持响应式布局 (sm/md/lg 断点)
