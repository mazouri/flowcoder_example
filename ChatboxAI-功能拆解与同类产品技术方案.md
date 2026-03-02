# ChatboxAI（`chatboxai.app` / `web.chatboxai.app`）功能拆解与同类产品技术方案

> 文档目标：基于公开信息与黑盒分析，拆解 ChatboxAI 的**产品功能**、**交互设计**与**可能实现方式**，并给出你开发同类产品时可直接落地的技术方案。  
> 说明：以下结论来自公开页面、文档、前端资源与接口线索，不包含未公开后端源码。

---

## 1. 站点分工与产品定位

## 1.1 `chatboxai.app`（官网/增长/转化）
- 角色：品牌官网 + 下载分发 + 价格与套餐 + 指南与帮助中心入口。
- 主要任务：
  - 展示价值主张（多模型、多端、文档/图像/搜索能力）。
  - 承担下载与订阅转化（Lite / Pro / Pro+ 等）。
  - 承接文档、FAQ、License 购买与使用教育。

## 1.2 `web.chatboxai.app`（核心产品 Web App）
- 角色：实际 AI 客户端（聊天、模型管理、知识库、MCP、配额与设置）。
- 主要任务：
  - 聊天工作区（会话/线程/模型切换/多模态输入）。
  - Provider 管理（官方服务 + BYOK + 本地模型适配）。
  - 数据与能力管理（知识库、文档解析、Web Search、MCP）。

## 1.3 配套域名（从公开资源可见）
- `docs.chatboxai.app`：文档系统（Provider、OpenAI 兼容接口等）。
- `api.chatboxai.app`：API 服务域名线索。
- `ai.chatboxai.app/v1`：OpenAI 兼容 API（文档可见）。
- `mcp.chatboxai.app`：托管 MCP 服务线索。
- `cors-proxy.chatboxai.app`：网页抓取/代理线索。
- `artifact-preview.chatboxai.app`：代码产物预览线索。

---

## 2. 产品功能拆解（按用户旅程）

## 2.1 首次到达与选择路径
1. 用户到官网 → 看到多模型与多端能力介绍。
2. 可选两条入口：
   - **Launch Web App**（直接使用网页版）。
   - **Download**（桌面端/移动端）。
3. 首次使用时引导选择 Provider：
   - **Chatbox AI Service**（官方托管、订阅+统一计费）。
   - **BYOK**（自带 API Key，按各家平台计费）。

**交互目标**：降低上手门槛（官方托管）+ 保留技术用户自由度（BYOK）。

## 2.2 账户、License 与配额体系
- 用户输入/激活 License。
- UI 展示：
  - License 状态（Activated / Expired / Invalid）。
  - 套餐与配额（模型配额、图片配额、计算点）。
  - 升级入口（当功能受限时触发）。
- 触发场景：
  - 高级模型不可用。
  - 高级文档解析不可用。
  - 当月额度耗尽。

**典型交互**：
- 在设置或 Provider 面板完成 License 录入。
- 失败场景给出“检查 key / 网络 / 订阅有效期”提示。

## 2.3 核心聊天工作区
- 主结构通常为：
  - 左侧：会话列表/历史检索。
  - 中间：聊天消息流。
  - 底部：输入框 + 附件上传 + 模型选择 + 发送。
  - 右侧或弹层：参数配置、插件、知识库引用等。
- 核心能力：
  - 模型切换（默认模型 + 对话级覆盖）。
  - 系统提示词（System Prompt）。
  - 会话重命名（可能支持模型自动命名）。
  - Markdown / LaTeX / 代码高亮展示。
  - Artifact 预览（HTML/CSS/JS 等）。

## 2.4 多模型 / 多 Provider 管理
- 已公开可见 Provider 生态（示例）：
  - OpenAI、Anthropic、Google Gemini、OpenRouter、DeepSeek、Mistral、Groq、Perplexity、xAI。
  - 本地模型入口线索：Ollama（`127.0.0.1:11434`）、LM Studio（`127.0.0.1:1234`）。
- 配置项：
  - API Key
  - API Host / Base URL
  - API 类型（OpenAI compatible / Gemini compatible 等）
  - 模型列表与能力标签（视觉/工具调用等）

## 2.5 文档与图片理解
- 文档类型线索：PDF、Office（DOC/PPT/XLS）、代码文件、图像文件等。
- 能力路径：
  1. 本地解析（免费/低成本）。
  2. 云端高级解析（更高识别率，消耗配额/计算点）。
  3. OCR 模型兜底（当聊天模型不支持视觉输入时）。
- 失败处理：
  - 本地解析失败 → 引导升级到云解析。
  - 模型不支持文档/视觉 → 引导切换模型。

## 2.6 Web Search 与网页内容处理
- 能力线索：Web Search、URL 分析、网页内容抓取并转 Markdown。
- 可能流程：
  1. 模型先生成查询词。
  2. 搜索 API 获取结果。
  3. 抓取网页正文（可经 CORS Proxy）。
  4. 摘要与引用后进入回答上下文。
- 价值：减少幻觉、提升实时性。

## 2.7 知识库（RAG）
- 可见功能：Create Knowledge Base、上传文档、Query Knowledge Base、删除文档及 embeddings。
- 推测链路：
  - 文档预处理 → 分块 → embedding → 向量检索 → 注入上下文回答。
- 典型交互：
  - 用户选择知识库后发问。
  - 返回中结合知识库片段与模型回答。

## 2.8 MCP 能力（工具生态）
- 线索显示：
  - 内置 MCP Servers（一键接入）。
  - 自定义 MCP Servers（手动添加/JSON 导入）。
  - 可见示例服务：arxiv、fetch、context7、sequentialthinking 等。
- 用户价值：把 AI 对话扩展为“可执行工具流”。

## 2.9 图像生成与产物预览
- 可见能力：
  - 图像生成（Image Creator 对话模式）。
  - 每次回复图像数量配置。
  - Artifact 自动预览（Web 前端片段直接渲染）。

## 2.10 数据管理
- Data Backup / Restore。
- Provider 配置导入导出。
- MCP 配置导入导出。
- 本地存储优先（尤其桌面端），兼顾隐私与可迁移。

---

## 3. 从公开线索反推实现方式（技术证据）

## 3.1 前端框架与工程
- 官网（`chatboxai.app`）线索：
  - `/_next/static/...`、`_buildManifest.js` 等，符合 **Next.js** 特征。
  - 多语言 `hreflang`，说明有国际化 SEO 策略。
- Web App（`web.chatboxai.app`）线索：
  - `index.*.js` + `__vite__mapDeps`，符合 **Vite + SPA** 特征。
  - 明显 React 运行时与路由状态管理线索。
- UI 与状态生态线索：
  - Mantine、TanStack Router/Query、Zod、localforage、Sentry 等命中。

## 3.2 观测与分析
- 可见埋点/监控线索：
  - Google Analytics（gtag）
  - Plausible
  - Sentry（前端异常监控）
  - 官网环境变量中出现 PostHog host/key 线索

## 3.3 模型接入与协议抽象
- Web 包中出现多个 provider 域名与 endpoint 线索。
- 文档明确提供 OpenAI-compatible API：
  - `apiBase: https://ai.chatboxai.app/v1`
  - `apiKey: Chatbox License Key`
- 说明其后端做了**模型协议统一层**，将多家模型统一为单一调用抽象。

## 3.4 本地与云混合能力
- 可见 `IndexedDBStorage` / `localforage` 线索：Web 端本地缓存与持久化。
- 同时可见云服务域名（API、MCP、CORS Proxy、Artifact Preview）。
- 结论：采用“**本地状态 + 云能力增强**”的混合架构。

---

## 4. 你要开发同类产品：推荐技术方案（不写代码版）

## 4.1 总体架构（建议）

**前端层**
- 官网：Next.js（SEO、国际化、增长页）
- 产品 Web：React + Vite + TypeScript（高迭代效率）
- 桌面端：Electron（复用 Web UI，增强本地能力）
- 移动端：Capacitor / React Native（二选一，取决于团队经验）

**后端层（微服务或模块化单体）**
1. **API Gateway/BFF**
   - 鉴权、限流、统一错误码、灰度开关
2. **Model Router（模型路由层）**
   - Provider 适配器（OpenAI/Anthropic/Gemini/...）
   - 参数归一化（temperature、max_tokens、tool-calls）
   - 流式输出与重试熔断
3. **Conversation Service**
   - 会话、消息、线程、提示词模板
4. **Document Pipeline**
   - 文件上传、解析、OCR、分块、结构化
5. **RAG Service**
   - Embedding、向量检索、重排、引用拼装
6. **Search Service**
   - 查询生成、搜索聚合、网页正文抽取、摘要
7. **MCP Hub**
   - 内置服务目录、第三方服务注册、权限隔离
8. **Billing & Quota**
   - License、订阅计划、计算点扣减、账单事件
9. **Observability**
   - 日志、指标、追踪、异常告警

## 4.2 产品交互方案（建议稿）

## A. Onboarding 流程
1. 首次进入 Web App 显示“选择模式”：
   - 快速开始（官方托管）
   - 专业模式（BYOK）
2. 选择后进入 3 步向导：
   - 步骤1：激活 License 或填写 API Key
   - 步骤2：选择默认模型
   - 步骤3：是否启用 Web Search / Knowledge Base / MCP
3. 完成后自动创建首个会话并提供示例提示词。

## B. 聊天工作区交互
- 左栏：会话树 + 过滤（最近/收藏/模型）
- 中央：消息流（支持 Markdown、代码块、图表、附件卡片）
- 输入区：
  - 文本输入
  - 上传（图片/文档）
  - 模型切换器
  - 工具开关（Search / KB / MCP）
  - 高级参数抽屉（温度、上下文长度、系统提示词）

## C. 文件与知识库交互
1. 上传文档后立即展示解析状态（排队/解析中/完成/失败）。
2. 失败时提供“切换高级解析服务”CTA。
3. 知识库问答时返回引用片段（来源文件 + 段落定位）。

## D. 配额与升级交互
- 在模型选择器中实时显示该模型成本等级。
- 当配额不足时不给“硬报错”，先给：
  - 降级推荐模型
  - 购买扩展包
  - 改用 BYOK

## E. MCP 交互
- 内置市场（推荐 + 一键连接）
- 自定义配置（JSON 导入、连接测试、权限提示）
- 对话中可见工具调用轨迹（可折叠）

## 4.3 技术栈建议（同类产品可直接采用）

**前端**
- React + TypeScript + Vite
- UI：Mantine / MUI（二选一或混合）
- 路由：TanStack Router
- 数据请求：TanStack Query / SWR
- 表单校验：Zod
- 文本渲染：react-markdown + remark-gfm + rehype-katex

**后端**
- Node.js（NestJS/Fastify）或 Go（Gin/Fiber）
- API 风格：REST + SSE（流式输出）
- 任务队列：BullMQ / RabbitMQ / Kafka（解析与索引任务）
- 存储：
  - 关系型：PostgreSQL（账号、会话、订阅）
  - 对象存储：S3/OSS（文件）
  - 向量库：pgvector / Milvus / Weaviate
  - 缓存：Redis

**AI 与工具层**
- Provider Adapter 模式（统一多家 LLM 接口）
- OCR：可插拔（本地 + 云）
- 文档解析：可插拔（基础版 + 高级版）
- MCP：兼容官方 SDK，支持 SSE/HTTP Transport

**运维与安全**
- 网关：API Key + JWT + RBAC
- 限流：按用户/模型/租户
- 内容安全：上传文件扫描、URL 安全校验、Prompt 注入防护
- 观测：Sentry + OpenTelemetry + 日志聚合（ELK/Loki）

## 4.4 数据模型（建议）
- `users`
- `licenses`
- `subscriptions`
- `provider_configs`
- `models`
- `conversations`
- `messages`
- `attachments`
- `knowledge_bases`
- `kb_documents`
- `kb_chunks`
- `usage_events`（token、图片次数、解析次数、计算点）
- `mcp_servers`
- `mcp_server_bindings`

## 4.5 关键能力的实现难点与规避

1. **多模型参数不兼容**
   - 方案：中间层做参数映射与能力标注（是否支持视觉/工具调用/长上下文）。
2. **文件解析稳定性**
   - 方案：双通道（本地解析失败自动回退云解析）。
3. **配额扣减一致性**
   - 方案：事件驱动记账 + 幂等扣费 + 对账任务。
4. **Web 搜索质量**
   - 方案：检索结果重排 + 网页正文抽取 + 引用回写。
5. **MCP 安全**
   - 方案：沙箱隔离、权限白名单、超时与调用预算。

## 4.6 分阶段落地路线（建议）

## Phase 1（4~6 周）：MVP
- 单会话聊天
- 2~3 个主流 Provider（OpenAI/Claude/Gemini）
- BYOK 配置
- 基础文件上传 + 图片输入
- 最小可用配额统计

## Phase 2（6~8 周）：产品化
- 多会话管理、搜索、提示词模板
- Web Search
- License 与订阅体系
- 文档解析管线 + 基础知识库
- 监控告警与灰度发布

## Phase 3（8~12 周）：差异化
- MCP 市场 + 自定义 MCP
- 高级文档解析与 OCR 路由
- Artifact 预览
- 团队协作（共享配置/共享知识库）

---

## 5. 关键结论（给决策者）

1. ChatboxAI 的核心竞争力不是“单一模型能力”，而是**多模型统一编排 + 工具化扩展（文档/搜索/MCP）+ 商业化配额体系**。
2. 如果你要做同类产品，优先顺序建议是：  
   **统一模型路由 > 聊天体验 > 文件/RAG > 配额/订阅 > MCP生态**。
3. 技术上最关键的是“中间层抽象”：
   - 对上层 UI 提供一致能力
   - 对下层 Provider 屏蔽差异
   - 对商业化做可审计记账

---

## 6. 本次拆解的公开证据摘要

- 官网页面存在 Next.js 资源特征（`/_next/static/...`）。
- Web App 为 Vite 构建单页应用（`index.*.js` + `__vite__mapDeps`）。
- Web 端可见本地存储与状态线索（`localforage`、`IndexedDBStorage`）。
- 可见监控与埋点（Sentry、GA、Plausible）。
- 可见多 Provider endpoint 线索（OpenAI/Anthropic/Gemini/OpenRouter/DeepSeek 等）。
- 文档明确 OpenAI-compatible API 与 `https://ai.chatboxai.app/v1`。
- 可见知识库、MCP、Web Search、高级文档解析、配额与 License 等产品文案与交互文本。

