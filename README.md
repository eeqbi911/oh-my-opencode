# oh-my-opencode

The best agent harness for OpenCode - Skills, Agents, Rules, and Hooks.

## Features

- **Skills** - Reusable workflow definitions and domain knowledge
- **Agents** - Specialized AI agents for different tasks
- **Rules** - Coding standards and best practices
- **Hooks** - Automated triggers for common operations

## Installation

### Quick Install

```bash
# Clone the repository
git clone https://github.com/code-yeongyu/oh-my-opencode.git
cd oh-my-opencode

# Run installer
node scripts/install.js
```

### Manual Install

Copy skills, rules, and hooks to your OpenCode config directory:

```bash
# Skills
cp -r .opencode/skills/* ~/.config/opencode/skills/

# Rules  
cp -r rules/* ~/.config/opencode/rules/

# Hooks
cp hooks/hooks.json ~/.config/opencode/hooks.json
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `tdd-workflow` | Test-driven development with red-green-refactor cycle |
| `code-review` | Comprehensive code review checklist |
| `security-review` | OWASP Top 10 security analysis |
| `backend-patterns` | API design, database optimization, caching |
| `frontend-patterns` | React, Vue, component architecture |
| `git-workflow` | Atomic commits, branch strategy |
| `search-first` | Research before coding workflow |
| `verification-loop` | Continuous verification pipeline |

## Available Agents

| Agent | Purpose |
|-------|---------|
| `planner` | Feature planning and architecture |
| `code-reviewer` | Quality and security review |
| `build-error-resolver` | TypeScript and build error fixes |
| `tdd-guide` | Test-driven development guidance |

## Rules

Coding standards for multiple languages:

- **Common** - Language-agnostic rules
- **TypeScript** - TS/JS specific patterns
- **Python** - Python best practices
- **Go** - Go idioms and conventions

## Hooks

Automated hooks for:

- Pre-bash security checks
- Post-edit formatting
- Session start context loading
- Session end state saving

## Directory Structure

```
oh-my-opencode/
├── .opencode/
│   ├── skills/          # OpenCode skills
│   │   ├── tdd-workflow/
│   │   ├── code-review/
│   │   └── ...
│   ├── agents/          # OpenCode agents
│   └── opencode.json    # Config
├── agents/              # Claude Code compatible agents
├── rules/               # Coding rules
│   ├── common/
│   ├── typescript/
│   ├── python/
│   └── golang/
├── hooks/               # Hook configurations
│   └── hooks.json
├── scripts/             # Installation scripts
└── docs/                # Documentation
```

## Usage

### Skills

Use skills in OpenCode with the skill tool:

```
skill({ name: "tdd-workflow" })
```

### Agents

Invoke agents for specialized tasks:

```
Use the planner agent to create an implementation plan for...
```

### Rules

Rules are automatically applied based on file paths and language.

## Contributing

Contributions welcome! Please read the contribution guidelines first.

## License

MIT
