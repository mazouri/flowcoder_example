# 植物大战僵尸 - 产品文档

## 文档索引

| 文档 | 说明 |
|------|------|
| [设计说明](./design/设计说明-植物大战僵尸.md) | 信息架构、交互规范、动效、无障碍 |
| [技术方案](./技术方案-植物大战僵尸.md) | 技术选型、架构设计、实现要点 |
| [测试计划](./测试计划-植物大战僵尸.md) | 测试范围、策略、发布标准 |
| [测试用例](./测试用例-植物大战僵尸.md) | 19 条功能/UI/无障碍用例 |

## 项目结构

```
/
├── docs/                    # 文档
│   ├── README.md
│   └── design/              # 设计说明
├── src/
│   ├── app/                 # 页面
│   ├── components/          # UI 组件
│   ├── lib/                 # 游戏逻辑与工具
│   │   ├── game/            # 游戏引擎
│   │   ├── types.ts
│   │   └── constants.ts
│   └── styles/              # 样式
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 快速开始

```bash
npm install
npm run dev
```

浏览器访问 `http://localhost:5173`。
