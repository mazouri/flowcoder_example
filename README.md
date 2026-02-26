# 植物大战僵尸 - 前端原型

Web 版塔防游戏原型，基于 PRD 实现。纯前端，不依赖后端。

## 功能概览

- **5×9 地图**：草地网格，可放置植物
- **5 种植物**：向日葵、豌豆射手、坚果墙、樱桃炸弹、双发豌豆
- **4 种僵尸**：普通、路障、铁桶、撑杆
- **阳光系统**：初始 50，自然掉落 + 向日葵产出，点击收集
- **胜负判定**：僵尸到达左边界失败；存活 60 秒且清空僵尸胜利

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS
- Canvas 2D（游戏渲染）
- Lucide React（图标）

## 快速开始

```bash
npm install
npm run dev
```

访问 `http://localhost:5173`。

## 操作说明

1. 点击「开始游戏」启动
2. 选择植物后点击草地格子放置
3. 点击掉落的阳光收集
4. 向日葵产生阳光，豌豆射手攻击僵尸
5. 坚果墙阻挡，樱桃炸弹范围清除
6. 使用暂停按钮可暂停/继续

## 项目结构

```
src/
├── app/           # 页面
├── components/    # UI 组件（状态栏、植物栏、画布）
├── lib/           # 游戏逻辑
│   ├── game/      # GameEngine、GameRenderer
│   ├── types.ts
│   └── constants.ts
└── styles/        # 全局样式
```

## 设计文档

详见 [docs/design/设计说明-植物大战僵尸.md](./docs/design/设计说明-植物大战僵尸.md)。

## 测试

```bash
npm run test:run    # 单元 + 组件测试（Vitest）
npm run test:e2e   # E2E 测试（Playwright）
```

详见 [docs/测试计划-植物大战僵尸.md](./docs/测试计划-植物大战僵尸.md) 与 [docs/测试用例-植物大战僵尸.md](./docs/测试用例-植物大战僵尸.md)。

## 验收标准

- 无 TypeScript 错误
- 游戏核心流程可玩
- 支持 `prefers-reduced-motion`
- 焦点与 ARIA 符合无障碍要求
- 单元/组件/E2E 测试通过
