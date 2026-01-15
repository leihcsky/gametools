# Minecraft Damage Calculator – MVP 需求说明书

## 1. 项目背景与目标

### 1.1 项目背景
Minecraft 是全球用户量最大的沙盒游戏之一，战斗系统（Damage / Armor / Enchantments）复杂，
大量玩家在以下场景中存在明确计算需求：

- PvP 战斗伤害预判
- PvE（怪物）输出计算
- 装备 / 附魔选择对比
- 不同版本（Java / Bedrock）差异判断

搜索关键词 **“minecraft damage calculator”** 具备：
- 明确工具意图（Transactional）
- SERP 以子页面 / Wiki / 简易工具为主
- 存在被“专用高质量工具页”击穿的可能

---

### 1.2 MVP 核心目标（阶段 1）

- 用 **一个极致聚焦的工具**，打赢 `minecraft damage calculator`
- SEO 上表现为「单工具权威站」
- 技术结构上，为未来扩展多个 Minecraft 计算器预留空间

---

## 2. 网站整体定位

### 2.1 对用户的定位（表层）

> The most accurate Minecraft Damage Calculator  
> Calculate combat damage, armor reduction, and enchantment effects instantly.

- 专业
- 即用
- 比 Wiki / 表格更直观

---

### 2.2 对搜索引擎的定位（深层）

- 当前阶段：  
  **一个专注于 Minecraft Damage 计算的权威站点**
- 架构层面：  
  **Minecraft 战斗计算工具体系的起点**

---

## 3. URL 与网站结构规划（关键）

### 3.1 当前阶段（仅 1 个工具）
/
├── /tools/
│ └── /tools/minecraft-damage-calculator

说明：
- 首页用于 SEO 权威与入口
- 工具页用于排名、使用、外链承接
- 不做真正的“工具集合首页”，但结构已预置

---

### 3.2 Canonical 规则

- `/`  
  - canonical 指向自身
- `/tools/minecraft-damage-calculator`  
  - canonical 指向自身
- 首页与工具页 **不互相 canonical**

---

## 4. 首页需求说明（/）

### 4.1 首页角色定义

- SEO：  
  - 覆盖 `minecraft damage calculator` 的解释型与信任型搜索
- 产品：  
  - 工具入口页（不是工具本体）
- 战略：  
  - 未来工具扩展的“可演进外壳”

---

### 4.2 首页内容结构规划

#### 4.2.1 Hero 区（强关键词）

- H1：  
  **Minecraft Damage Calculator**
- 副标题：  
  Accurately calculate combat damage, armor reduction, and enchantment effects.
- 主 CTA：  
  - Open Damage Calculator → `/tools/minecraft-damage-calculator`

---

#### 4.2.2 What Is Minecraft Damage?（解释型内容）

- 内容重点：
  - 什么是 damage
  - 哪些因素影响最终伤害
- 目的：
  - 覆盖 informational intent
  - 提升页面语义完整度

---

#### 4.2.3 Why This Damage Calculator Is Accurate（信任模块）

- 对比：
  - Wiki 表格
  - 手算 / 经验
- 强调：
  - 版本支持
  - 公式透明
  - 更新频率

---

#### 4.2.4 FAQ 区块（长尾 & PAA）

示例问题：
- How is damage calculated in Minecraft?
- Does armor fully block damage?
- Java vs Bedrock damage differences?
- Does difficulty affect damage?

---

### 4.3 首页不应包含的内容

- ❌ 完整计算表单
- ❌ 所有参数细节
- ❌ 大量公式堆叠

---

## 5. 工具页面需求说明  
`/tools/minecraft-damage-calculator`

### 5.1 工具页角色定义

- 主排名页面（SEO）
- 主外链承接页面
- 主用户行为页面（使用 / 停留）

---

### 5.2 工具页内容结构规划

#### 5.2.1 第一屏：计算器本体（必须）

- 输入项（示例）：
  - Weapon / Attack type
  - Enchantments
  - Target armor
  - Difficulty
- 输出：
  - Final damage
  - Hearts / HP 损失

---

#### 5.2.2 How to Use（操作说明）

- Step-by-step
- 简短直接
- 面向第一次使用用户

---

#### 5.2.3 Damage Calculation Logic（核心信任区）

- 计算逻辑说明：
  - 基础伤害
  - 附魔加成
  - 护甲减免
- 可用：
  - 简化公式
  - 示例表格

---

#### 5.2.4 Version & Edge Cases

- Java / Bedrock 差异
- 特殊装备
- 常见误解澄清

---

### 5.3 工具页 SEO 要点

- H1：Minecraft Damage Calculator
- 外链主目标页面
- 内链回首页（品牌 / 主题支持）

---

## 6. 首页 vs 工具页内容分工原则（核心）

| 项目 | 首页 | 工具页 |
|----|----|----|
| 搜索意图 | Why / What | Calculate Now |
| 功能代码 | ❌ | ✅ |
| 外链重点 | 次要 | 主要 |
| FAQ / 解释 | 多 | 少 |
| 排名核心 | 辅助 | 主力 |

---

## 7. 外链与推广策略（阶段 1）

- 80–90% 外链 → 工具页
- 10–20% 外链 → 首页（品牌 / naked / generic）
- 锚文本以：
  - partial match
  - branded
  - naked URL 为主

---

## 8. 扩展预期（阶段 2+，不立即执行）

未来可扩展工具（示例）：

/tools/minecraft-armor-calculator
/tools/minecraft-pvp-damage
/tools/minecraft-enchanting-calculator

- 首页逐步演进为：
  - Minecraft Combat Calculators
- 但 **damage calculator 始终保留核心位置**

---

## 9. MVP 成功判定标准

- 工具页获得稳定自然流量
- 出现长尾排名（GSC）
- 用户真实使用（停留 / 交互）
- 被引用 / 分享 / 外链

---

## 10. 总结（一句话）

> 用“单工具站的 SEO 强度”  
> 构建“可持续扩展的工具体系”

