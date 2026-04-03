---
name: continuous-learning
description: Learn from project history and patterns to continuously improve agent performance. Extract patterns from git history and session data.
origin: oh-my-opencode
---

# Continuous Learning Skill

## When to Activate

- End of each session
- Analyzing project patterns
- Improving agent performance
- Onboarding to new codebase

## Learning Workflow

### 1. Extract Patterns

After each significant task:

```markdown
## Pattern Learned: [Brief Title]

**Context:** [When to use this pattern]
**Solution:** [What worked well]
**Example:** [Code snippet if applicable]
**Source:** [File/path or session]
```

### 2. Categorize Patterns

| Category | Description |
|----------|-------------|
| Architecture | System design patterns |
| Performance | Optimization techniques |
| Security | Security best practices |
| Workflow | Process improvements |
| Debugging | Troubleshooting patterns |

### 3. Store Patterns

```
.opencode/
├── patterns/
│   ├── architecture/
│   │   └── api-versioning.md
│   ├── performance/
│   │   └── query-optimization.md
│   └── debugging/
│       └── null-handling.md
```

## Git History Analysis

```bash
# Find common fix patterns
git log --grep="fix" --oneline | head -20

# Find most changed files (potential problem areas)
git log --stat --pretty=format: --name-only | \
  awk '{files[$1]++} END {for (f in files) print files[f], f}' | \
  sort -rn | head -10

# Find patterns in commit messages
git log --format="%s" | awk '{print $1}' | sort | uniq -c | sort -rn
```

## Session Learning

### What to Capture

```markdown
## Session Learnings: YYYY-MM-DD

### New Patterns Discovered
- [Pattern 1]
- [Pattern 2]

### Mistakes Made
- [Mistake 1] → [How to avoid]
- [Mistake 2] → [How to avoid]

### Commands/Shortcuts Learned
- [Useful command]

### Context That Was Helpful
- [Documentation, files, etc.]
```

### Anti-Patterns to Avoid

❌ Don't learn:
- Implementation details that change often
- Temporary workarounds
- Context that expires quickly

✅ Do learn:
- Architectural decisions
- Performance bottlenecks found
- Security issues discovered
- Useful patterns that recur

## Continuous Improvement Loop

```
Session → Extract Patterns → Categorize → Store
    ↑                                    ↓
    ←←←←←←← Review and Apply ←←←←←←←←←←←←
```

## Pattern Template

```markdown
---
name: pattern-name
category: architecture|performance|security|workflow|debugging
confidence: high|medium|low
created: YYYY-MM-DD
---

# Pattern Name

## When to Apply
[Describe the situation where this pattern is useful]

## Problem
[What problem does this solve?]

## Solution
[How to implement this pattern]

## Example

\`\`\`typescript
// Code example
\`\`\`

## Trade-offs
[Pros and cons]

## Related Patterns
[Links to related patterns]
```
