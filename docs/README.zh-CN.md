# oh-my-opencode 中文文档

OpenCode 最佳 Agent 工具集 - Skills、Agents、Rules 和 Hooks。

## 特性

- **Skills** - 可复用的工作流定义和领域知识
- **Agents** - 专业化 AI Agent 处理不同任务
- **Rules** - 编码标准和最佳实践
- **Hooks** - 常见操作的自动化触发器

## 安装

### 快速安装

```bash
# 克隆仓库
git clone https://github.com/code-yeongyu/oh-my-opencode.git
cd oh-my-opencode

# 运行安装脚本
node scripts/install.js
```

### 手动安装

将 skills、rules 和 hooks 复制到 OpenCode 配置目录：

```bash
# Skills
cp -r .opencode/skills/* ~/.config/opencode/skills/

# Rules  
cp -r rules/* ~/.config/opencode/rules/

# Hooks
cp hooks/hooks.json ~/.config/opencode/hooks.json
```

## 可用 Skills

| Skill | 描述 |
|-------|------|
| `tdd-workflow` | 测试驱动开发，遵循红-绿-重构循环 |
| `code-review` | 全面的代码审查清单 |
| `security-review` | OWASP Top 10 安全分析 |
| `backend-patterns` | API 设计、数据库优化、缓存策略 |
| `frontend-patterns` | React、Vue、组件架构 |
| `git-workflow` | 原子提交、分支策略 |
| `search-first` | 编码前先研究的工作流 |
| `verification-loop` | 持续验证流水线 |
| `api-design` | REST API 设计模式 |
| `docker-patterns` | Docker 和容器化最佳实践 |
| `database-migrations` | 数据库迁移策略 |
| `deployment-patterns` | 部署和 CI/CD 最佳实践 |
| `continuous-learning` | 从项目历史中持续学习 |

## 可用 Agents

| Agent | 用途 |
|-------|------|
| `planner` | 功能规划和架构 |
| `code-reviewer` | 质量和安全审查 |
| `build-error-resolver` | TypeScript 和构建错误修复 |
| `tdd-guide` | 测试驱动开发指导 |

## Rules

多语言编码标准：

- **Common** - 语言无关规则
- **TypeScript** - TS/JS 特定模式
- **Python** - Python 最佳实践
- **Go** - Go 习惯用法和约定

## Hooks

自动化钩子：

- **Pre-bash** - Bash 命令安全检查
- **Post-edit** - 文件修改后格式化
- **Session start** - 加载项目上下文
- **Session end** - 保存会话状态

## 目录结构

```
oh-my-opencode/
├── .opencode/
│   ├── skills/          # OpenCode skills
│   ├── agents/          # OpenCode agents
│   └── opencode.json    # 配置文件
├── agents/              # Claude Code 兼容 agents
├── rules/               # 编码规则
│   ├── common/
│   ├── typescript/
│   ├── python/
│   └── golang/
├── hooks/               # Hook 配置
│   └── hooks.json
├── scripts/             # 安装脚本
└── docs/                # 文档
```

## 使用方法

### Skills

使用 skill 工具调用 Skills：

```
skill({ name: "tdd-workflow" })
```

### Agents

调用专业 agents 处理任务：

```
Use the planner agent to create an implementation plan for...
```

### Rules

Rules 会根据文件路径和语言自动应用。

## 贡献

欢迎贡献！请先阅读贡献指南。

## 许可证

MIT
