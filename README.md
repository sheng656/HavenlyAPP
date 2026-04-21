# HavenlyAPP

HavenlyAPP 是一个面向青少年情绪支持场景的 Web 应用，核心由情绪记录、AI 陪伴、花园成长、趋势洞察组成。

项目定位：
- 给用户提供低门槛、可持续的每日情绪打卡入口
- 通过轻量互动（聊天 + 花园）提升持续使用意愿
- 在安全边界内提供支持性对话，不做医疗诊断

## 当前实现状态

### 1. 页面与主流程

已实现 5 个主页面，并通过底部导航切换：
- Home：总入口、年龄切换、语言切换、快捷功能卡片
- Mood：情绪选择、可选备注/日记、记录落库
- Chat：与 AI 伙伴对话（支持历史上下文）
- Garden：宠物与植物养成、解锁、喂食浇水
- Insights：近 7 天日历、情绪分布、近期记录、摘要洞察

### 2. 年龄分层

支持 3 档年龄模式：
- toddler
- kid
- teen

已实现差异化行为：
- Mood 页面展示和引导语按年龄分层
- Chat 侧系统提示词按年龄分层
- Insights 页面解释文案按年龄分层

### 3. 语言支持（已按浏览器自动识别）

支持语言：
- English
- 中文

语言策略：
- 应用启动时优先识别浏览器语言
- 可识别中文和英文
- 识别不到时默认 English
- 首页提供手动语言切换（EN / 中文）

### 4. 情绪记录能力

已实现：
- 10 种情绪标签（emoji + 强度 + 中英文标签）
- 记录结构包含：情绪、文本、时间戳、强度
- teen 模式下支持更长文本日记输入
- 保存后发放快乐币并触发连续打卡逻辑

### 5. AI 对话能力

调用策略：
- 配置 GitHub Models Token 时走在线模型
- 未配置时自动降级为本地兜底回复

安全策略：
- 自伤/危机关键词预检测
- 命中后返回安全引导文案（中英文）
- 系统提示词明确禁止医疗诊断与危险内容

### 6. 花园养成能力

已实现：
- 宠物与植物两类资产
- 快乐币经济系统（获取、消耗）
- 解锁机制（按消耗金币）
- 喂食/浇水操作与状态更新
- 连续打卡会自动给花园加成
- 物种卡片：生物知识 + 心理启示（中英文）

### 7. 数据洞察能力

已实现：
- 时间范围筛选：近 7 天 / 近 30 天 / 全部
- 近 7 天日历化展示
- 情绪分布统计
- 积极情绪占比、平均强度
- 最近记录列表

## 数据与同步机制

### 本地存储

默认使用 LocalStorage 持久化：
- mood entries
- chat messages
- pets
- plants
- coins
- streak

### 可选云同步（Firebase）

项目已集成可选云同步能力（需环境变量开启）：
- 匿名认证获取用户 uid
- Firestore 文档集合：havenly_profiles
- 本地写入后会排队推送云端
- 本地空数据时支持从云端回填

详细配置见：FIREBASE_SETUP.md

## 技术栈

- React 19
- TypeScript
- Vite
- CSS Modules
- Firebase（可选）

## 本地开发

### 1) 安装依赖

```bash
npm install
```

### 2) 启动开发环境

```bash
npm run dev
```

### 3) 构建产物

```bash
npm run build
```

### 4) 本地预览构建结果

```bash
npm run preview
```

### 5) 代码检查

```bash
npm run lint
```

## 环境变量说明

### AI 对话（可选）

- VITE_GITHUB_TOKEN
- VITE_GITHUB_MODEL（可选，默认 gpt-4o-mini）
- VITE_GITHUB_MODELS_ENDPOINT（可选）

说明：未配置 Token 时，自动回退到本地安全回复。

### Firebase 云同步（可选）

- VITE_ENABLE_FIREBASE_SYNC=true
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID

说明：只有在 VITE_ENABLE_FIREBASE_SYNC=true 且 Firebase 配置完整时，云同步才会生效。

## 目录结构（核心）

- src/App.tsx：应用状态、路由分发、浏览器语言识别
- src/screens：页面层（Home / Mood / Chat / Garden / Insights）
- src/components：复用组件（底部导航、年龄切换、语言切换、物种卡片）
- src/utils/moodData.ts：情绪数据、危机词、AI 兜底文案
- src/utils/aiService.ts：在线模型调用与本地降级策略
- src/utils/storage.ts：本地数据读写、打卡与奖励逻辑
- src/utils/cloudSync.ts：本地与 Firebase 的快照同步
- src/utils/firebase.ts：Firebase 初始化与匿名登录
- src/utils/speciesData.ts：物种百科（中英文）
- src/types/index.ts：全局类型定义

## 已知边界

- 当前是 Web 端单仓实现，暂无独立后端服务
- 未实现正式账号体系（当前云同步以匿名认证为主）
- AI 对话为“支持性陪伴”定位，不替代专业心理服务

## 后续方向

后续总计划见：plan.md
