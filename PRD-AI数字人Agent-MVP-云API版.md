# PRD：AI数字人 Agent（云API版）MVP

## 1. 文档信息
- 文档版本：v1.0
- 产品阶段：MVP（主流程可演示、可试用）
- 技术前提：LLM 使用云 API
- 目标：尽快跑通“可视化数字人 + 语音交互 + 记忆 + 情感 + 执行能力”主流程

---

## 2. 背景与问题定义

用户希望与数字人通过语音自然交互，不只是“聊天”，而是具备：
1. **可持续记忆**（记住用户偏好、历史事件、任务上下文）  
2. **情感表达**（语气、表情、状态连续）  
3. **执行能力**（可调用工具完成实际任务）  
4. **低延迟主流程体验**（尽快看到可用效果）

---

## 3. 产品目标与非目标

### 3.1 MVP目标（必须达成）
1. 用户可以按住说话/连续说话与数字人实时对话（支持打断）
2. 数字人具备基本表情与口型同步
3. Agent 能调用至少 3 类工具（查询类、写入类、通知类）
4. 具备短期记忆 + 长期记忆（可检索并影响回复）
5. 有简化情绪状态机，影响回复措辞与语音风格
6. 提供可演示的“端到端闭环”（说一句 -> 理解 -> 执行 -> 反馈）

### 3.2 MVP非目标（暂不做）
1. 高精度影视级数字人建模与动作捕捉
2. 多角色复杂剧情系统
3. 高风险自动化执行（支付、删库、外部不可逆动作）
4. 全量多模态感知（摄像头视觉理解）在 MVP 内仅预留接口

---

## 4. 用户画像与核心场景

### 4.1 用户画像（MVP聚焦）
- 内容创作者 / 独立开发者 / 知识工作者
- 需要“随时问、随时记、随时办”

### 4.2 核心场景
1. **问答+记忆**：  
   “我下周要准备 AI 分享会，记住我偏好‘商业化案例优先’。”  
2. **任务执行**：  
   “帮我整理 3 条最近 AI Agent 行业动态并发到飞书。”  
3. **情绪陪伴式反馈**：  
   用户焦虑表达时，数字人用更缓和语气回应并给出行动建议。

---

## 5. 方案总览（MVP）

```mermaid
flowchart LR
    U[用户语音输入] --> VAD[VAD/打断检测]
    VAD --> ASR[流式ASR]
    ASR --> ORCH[Agent Orchestrator]
    ORCH --> MEM[记忆服务\n短期+长期]
    ORCH --> EMO[情绪状态机]
    ORCH --> TOOLS[工具执行层]
    MEM --> ORCH
    EMO --> ORCH
    TOOLS --> ORCH
    ORCH --> TTS[流式TTS]
    TTS --> AVATAR[数字人口型+表情驱动]
    AVATAR --> U
```

---

## 6. 信息架构

```mermaid
graph TD
    A[客户端 Avatar App] --> B[Realtime Gateway]
    B --> C[Conversation Service]
    C --> D[Agent Core]
    D --> E[Tool Router]
    D --> F[Memory Service]
    D --> G[Emotion Service]
    D --> H[Prompt Policy]
    E --> I[Search Tool]
    E --> J[Task Tool]
    E --> K[Notify Tool]
    F --> L[(Postgres)]
    F --> M[(pgvector)]
    C --> N[ASR/TTS API]
    D --> O[LLM Cloud API]
```

---

## 7. 端到端主流程（重点）

### 7.1 用户主流程图（Happy Path）

```mermaid
flowchart TD
    S[开始会话] --> A[用户说话]
    A --> B{是否检测到语音}
    B -- 否 --> A
    B -- 是 --> C[ASR转写]
    C --> D[Agent理解意图]
    D --> E{是否需调用工具}
    E -- 否 --> H[直接生成回复]
    E -- 是 --> F[调用工具并回填结果]
    F --> H
    H --> I[更新情绪状态]
    I --> J[写入短期记忆]
    J --> K{是否触发长期记忆入库}
    K -- 是 --> L[写入长期记忆]
    K -- 否 --> M[结束本轮]
    L --> M
```

### 7.2 实时语音时序图（含打断）

```mermaid
sequenceDiagram
    participant User as 用户
    participant Client as 客户端
    participant GW as Realtime网关
    participant ASR as ASR云API
    participant Agent as Agent核心
    participant LLM as LLM云API
    participant TTS as TTS云API

    User->>Client: 说话
    Client->>GW: 音频分片
    GW->>ASR: 流式识别
    ASR-->>GW: 增量文本
    GW->>Agent: 增量文本/最终文本
    Agent->>LLM: 带记忆与情绪上下文请求
    LLM-->>Agent: 流式回复/工具调用建议
    Agent->>TTS: 分片文本合成
    TTS-->>Client: 音频流
    Client-->>User: 播放 + 数字人口型驱动
    User->>Client: 中途插话
    Client->>GW: interrupt
    GW->>TTS: stop
    GW->>Agent: cancel当前回复并进入新轮
```

---

## 8. Agent 编排设计（MVP）

### 8.1 编排状态机

```mermaid
stateDiagram-v2
    [*] --> Listening
    Listening --> Thinking: 收到final ASR文本
    Thinking --> ToolCalling: 需要工具
    Thinking --> Responding: 无需工具
    ToolCalling --> Thinking: 工具结果回填
    Responding --> Speaking: 进入TTS播放
    Speaking --> Listening: 播放完成
    Speaking --> Listening: 用户打断
```

### 8.2 工具调用流程

```mermaid
flowchart TD
    A[LLM输出tool_call] --> B{工具是否在白名单}
    B -- 否 --> C[拒绝执行并解释原因]
    B -- 是 --> D{是否高风险动作}
    D -- 是 --> E[请求用户二次确认]
    E -->|确认| F[执行工具]
    E -->|取消| C
    D -- 否 --> F
    F --> G[记录审计日志]
    G --> H[回填结果给LLM]
    H --> I[生成自然语言反馈]
```

---

## 9. 记忆系统设计（MVP可用版）

### 9.1 记忆分层
- **工作记忆（短期）**：当前会话窗口（Redis，可过期）
- **长期记忆（语义）**：用户偏好、事实事件、任务历史（Postgres + pgvector）
- **程序记忆（规则）**：用户限制与偏好策略（如“不自动外发敏感信息”）

### 9.2 记忆读写流程

```mermaid
flowchart LR
    I[用户输入文本] --> X[记忆检索器]
    X --> V[(pgvector)]
    X --> P[(Profile表)]
    V --> C[拼接上下文]
    P --> C
    C --> LLM[LLM推理]
    LLM --> O[回复与动作]
    O --> W[记忆写入判定器]
    W -->|重要/可复用| DB[(Memory表)]
    W -->|普通闲聊| SKIP[仅短期缓存]
```

### 9.3 长期记忆数据结构（示例）
```json
{
  "memory_id": "mem_20260326_001",
  "user_id": "u_001",
  "type": "preference",
  "content": "用户偏好商业化案例优先",
  "source": "conversation",
  "confidence": 0.87,
  "created_at": "2026-03-26T12:00:00Z",
  "last_used_at": "2026-03-26T12:30:00Z"
}
```

---

## 10. 情绪系统设计（MVP轻量）

### 10.1 情绪状态集合
- `calm`（平稳）
- `positive`（积极）
- `concerned`（关切）
- `focused`（专注）

### 10.2 情绪流转图

```mermaid
stateDiagram-v2
    [*] --> calm
    calm --> positive: 用户正向反馈
    calm --> concerned: 检测焦虑/挫败语义
    concerned --> focused: 进入行动建议
    focused --> positive: 任务完成
    positive --> calm: 对话结束/回落
```

### 10.3 情绪对输出的影响
1. Prompt 中注入语气约束（更简洁/更共情）
2. TTS 参数调整（语速、停顿、音高）
3. Avatar 表情权重调整（眉眼、嘴角）

---

## 11. 数字人渲染与交互设计（MVP）

### 11.1 渲染管线

```mermaid
flowchart LR
    TTSA[实时音频流] --> FEAT[音频特征提取]
    FEAT --> VISEME[Viseme映射]
    VISEME --> FACE[BlendShape驱动]
    EMO[情绪状态] --> FACE
    FACE --> RENDER[Avatar渲染]
    RENDER --> SCREEN[用户屏幕]
```

### 11.2 交互控件（最小集合）
1. 麦克风按钮（按住说/连续说）
2. 中断按钮（立即打断当前播报）
3. 任务卡片（显示工具执行结果）
4. 记忆卡片（显示“我记住了什么”）

---

## 12. 功能范围（MVP）

### 12.1 P0（本期必须）
1. 实时语音对话（ASR/TTS）
2. LLM 对话与 Function Calling
3. 3类工具：
   - `search_brief`（信息查询）
   - `save_memory`（写入记忆）
   - `send_notification`（发送通知）
4. 短期 + 长期记忆检索
5. 简化情绪状态机
6. 数字人口型与基础表情联动

### 12.2 P1（下一步）
1. 多工具并行规划
2. 记忆自动整理/冲突消解
3. 个性化声音克隆
4. 周度记忆复盘报告

---

## 13. 非功能需求（NFR）

1. 首字响应延迟（用户说完到开始播报）目标：<= 1.5s（理想）
2. 单轮完整响应（短回答）目标：<= 4s（网络依赖）
3. 可用性：核心链路成功率 >= 99%
4. 可观测性：全链路 trace_id，工具调用日志可追踪
5. 安全性：API Key 加密存储，敏感工具必须二次确认

---

## 14. 异常与降级策略

```mermaid
flowchart TD
    A[请求进入] --> B{ASR可用?}
    B -- 否 --> B1[降级文本输入模式]
    B -- 是 --> C{LLM可用?}
    C -- 否 --> C1[返回兜底话术+稍后重试]
    C -- 是 --> D{TTS可用?}
    D -- 否 --> D1[返回文本并静态表情]
    D -- 是 --> E{工具超时?}
    E -- 是 --> E1[跳过工具+解释未完成原因]
    E -- 否 --> F[标准流程返回]
```

---

## 15. 技术架构图（部署拓扑）

```mermaid
graph TD
    subgraph ClientSide[客户端]
      C1[Web/App]
      C2[Avatar Renderer]
    end

    subgraph Backend[业务后端]
      G1[API Gateway]
      G2[Realtime Gateway]
      S1[Conversation Service]
      S2[Agent Service]
      S3[Tool Service]
      S4[Memory Service]
      S5[Emotion Service]
    end

    subgraph DataLayer[数据层]
      D1[(Redis)]
      D2[(Postgres)]
      D3[(pgvector)]
    end

    subgraph CloudAPI[云API]
      A1[LLM API]
      A2[ASR API]
      A3[TTS API]
    end

    C1 --> G1
    C1 --> G2
    C2 --> G2
    G2 --> S1
    S1 --> S2
    S2 --> S3
    S2 --> S4
    S2 --> S5
    S4 --> D1
    S4 --> D2
    S4 --> D3
    S2 --> A1
    S1 --> A2
    S1 --> A3
```

---

## 16. API 草案（MVP）

### 16.1 会话接口
- `POST /v1/session/start`：创建会话
- `POST /v1/session/{id}/interrupt`：打断当前回复
- `WS /v1/session/{id}/stream`：音频/文本双向流

### 16.2 Agent接口
- `POST /v1/agent/respond`：输入文本，返回流式回复与动作
- `POST /v1/agent/tool-callback`：工具结果回填

### 16.3 记忆接口
- `POST /v1/memory`：写入长期记忆
- `GET /v1/memory/search?q=`：语义检索

---

## 17. 数据库草案（核心表）

1. `users`：用户基础信息  
2. `sessions`：会话状态、开始结束时间  
3. `messages`：对话消息（文本、角色、时间）  
4. `tool_calls`：工具调用记录、入参、结果、耗时  
5. `memories`：长期记忆正文与元数据  
6. `emotion_states`：会话情绪快照  
7. `deliveries`：通知发送记录

---

## 18. 验收标准（UAT）

### 18.1 功能验收
1. 可完成 10 轮以上语音对话，不崩溃
2. 至少 3 种工具调用成功并可回显结果
3. 可记住用户偏好，并在后续轮次正确引用
4. 用户打断时，当前播报可在 500ms 内停止
5. 数字人口型与语音基本同步（肉眼无明显错位）

### 18.2 体验验收
1. 用户首次上手 3 分钟内能完成一轮“提问->执行->反馈”
2. 对话风格相对稳定，不出现明显人格漂移

---

## 19. MVP实施路径（按闭环）

```mermaid
flowchart LR
    A[闭环1: 语音对话跑通] --> B[闭环2: Tool Calling跑通]
    B --> C[闭环3: 长期记忆跑通]
    C --> D[闭环4: 情绪+表情联动]
    D --> E[闭环5: 观测与降级完善]
```

### 闭环说明
1. **闭环1**：ASR -> LLM -> TTS -> Avatar
2. **闭环2**：在闭环1基础上增加工具执行
3. **闭环3**：增加记忆读写与检索
4. **闭环4**：引入情绪状态机影响音色与表情
5. **闭环5**：完善日志、重试、降级

---

## 20. 风险与应对

1. **云API延迟波动**：采用流式输出 + 本地缓存兜底文案  
2. **工具误调用**：白名单 + 二次确认 + 审计日志  
3. **记忆污染**：写入门槛 + 低置信度隔离区  
4. **情绪失真**：状态机约束优先于自由生成  
5. **渲染性能瓶颈**：先保证口型，复杂表情逐步增强

---

## 21. 演示脚本（用于“尽快看到主流程效果”）

1. 用户：`“你好，记住我关注 AI Agent 商业化案例。”`  
2. 数字人：确认记忆写入并语音播报  
3. 用户：`“帮我查 3 条今天的相关动态，并发到飞书。”`  
4. Agent：调用查询工具 -> 调用通知工具 -> 回传执行结果  
5. 用户打断：`“等等，先只发给我自己。”`  
6. 系统：即时中断并重新规划执行  
7. 对话结束后，展示“新增记忆卡片 + 执行日志卡片”

---

## 22. 附录：MVP推荐技术选型（云API版）

- 前端：React + WebSocket + WebRTC（可选）
- 数字人：Three.js + VRM（或 Unity）
- 后端：FastAPI / NestJS（二选一）
- Agent编排：LangGraph（或轻量状态机）
- 数据：Postgres + pgvector + Redis
- 云能力：LLM API + ASR API + TTS API
- 可观测：OpenTelemetry + Prometheus + Grafana

> 备注：MVP优先“主流程丝滑可演示”，而非“一次性做满全部能力”。

