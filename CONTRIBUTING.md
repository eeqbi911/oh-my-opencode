# Contributing to oh-my-opencode

Thank you for your interest in contributing!

## How to Contribute

### 1. Fork the Repository

Fork the repo on GitHub, then clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/oh-my-opencode.git
cd oh-my-opencode
```

### 2. Create a Topic Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes

#### Adding Skills

Create a new skill in `.opencode/skills/<skill-name>/SKILL.md`:

```markdown
---
name: skill-name
description: Brief description of what this skill does
origin: oh-my-opencode
---

# Skill Title

## When to Activate
[When should this skill be used?]

## Content
[Skill content with examples]
```

#### Adding Rules

Add rules to the appropriate language directory in `rules/<language>/`:

```markdown
---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Rule Title

[Rule content]
```

#### Adding Agents

Create a new agent in `agents/<agent-name>.md`:

```markdown
---
name: agent-name
description: Brief description
tools: ["Read", "Grep", "Glob"]
model: sonnet
---

# Agent Title

[Agent behavior and instructions]
```

### 4. Test Your Changes

```bash
node scripts/install.js
```

### 5. Commit and Push

```bash
git add .
git commit -m "feat: add new skill for X"
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

Open a PR on GitHub with:
- Clear title describing the change
- Description of what the change does
- Link to any related issues

## Pull Request Guidelines

- Keep PRs focused on a single concern
- Include tests if applicable
- Update documentation as needed
- Follow existing code style

## Types of Contributions

- **New Skills** - Domain-specific workflows and patterns
- **New Agents** - Specialized AI agents
- **Rules** - Coding standards for languages/frameworks
- **Documentation** - Improve docs/README
- **Bug Fixes** - Fix issues in existing content

## Questions?

Open an issue for discussion before starting major changes.
