---
name: search-first
description: Research-first development workflow - understand the problem, find existing solutions, and gather context before writing code. Use when facing unfamiliar technology or complex problems.
origin: oh-my-opencode
---

# Search First Skill

## When to Activate

- Working with unfamiliar technology
- Solving complex problems
- Finding best practices
- Debugging tricky issues
- Making architectural decisions

## The Research-First Workflow

### 1. Understand the Problem

Before writing any code:

```markdown
## Problem Analysis
- What is the user trying to achieve?
- What have they already tried?
- What constraints exist?
- What's the expected outcome?
```

### 2. Search Existing Solutions

```bash
# Search project documentation
grep -r "relevant term" docs/

# Search code
rg "existing function" src/

# Check for similar features
find src -name "*similar*"
```

### 3. Research External Resources

```
Priority order:
1. Official documentation
2. Stack Overflow / Q&A sites
3. GitHub issues (same problem?)
4. Blog posts from maintainers
5. YouTube tutorials (for frameworks)
```

### 4. Create Context Document

```markdown
## Research Summary

### Problem
[Description]

### Found Solutions
1. [Solution A](url) - Pros/Cons
2. [Solution B](url) - Pros/Cons

### Recommended Approach
[Why this solution]

### Implementation Plan
1. [Step]
2. [Step]
```

## Search Strategies

### Code Search

```bash
# Find function usage
rg "functionName"

# Find patterns
rg "\.map\(.*=>

# Find TODOs and FIXMEs
rg "TODO|FIXME|HACK"

# Find all imports of a module
rg "from ['\"]@module"
```

### Documentation Search

```
# Official docs (in order of reliability)
1. https://docs.technology.com
2. https://developer.technology.com
3. https://technology.io/guide

# Search syntax for docs
site:docs.example.com "search term"
```

### GitHub Search

```
# Search issues
repo:owner/repo is:issue "problem description"

# Search code
repo:owner/repo "code pattern"

# Search READMEs
repo:owner/repo filename:README.md
```

## Decision Framework

### Evaluate Options

| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Complexity | Low | Medium | High |
| Performance | Good | Better | Best |
| Maintainability | High | Medium | Low |
| Community Support | Large | Medium | Small |
| Learning Curve | Easy | Medium | Steep |

### Make Decision

```markdown
## Decision: [What]

**Rationale:** [Why this choice]

**Alternatives considered:**
- [X] Rejected because [reason]
- [Y] Good but [limitation]

**Success metrics:**
- [Metric 1]
- [Metric 2]
```

## Anti-Patterns

### ❌ Don't Do This

```typescript
// Writing code without understanding
function solve() {
  // Google "how to X"
  // Copy first Stack Overflow answer
  // Ship it
}
```

### ✅ Do This

```typescript
// Research first
async function solve() {
  // 1. Understand problem deeply
  // 2. Research patterns used in codebase
  // 3. Check official docs for best practices
  // 4. Look at how similar features are implemented
  // 5. Write implementation plan
  // 6. Execute with tests
}
```

## Research Checklist

- [ ] Problem clearly understood
- [ ] Official documentation reviewed
- [ ] Similar issues found on GitHub
- [ ] Best practices identified
- [ ] Security considerations checked
- [ ] Performance implications considered
- [ ] Implementation plan documented

## Time Management

```typescript
const RESEARCH_TIME_LIMITS = {
  quick: 5 * 60,      // 5 min - simple questions
  medium: 15 * 60,    // 15 min - moderate problems  
  deep: 30 * 60,      // 30 min - complex architecture
  spike: 2 * 60 * 60  // 2 hours - research task
}
```

**Rule:** If research exceeds 2x expected time, escalate or pivot approach.
