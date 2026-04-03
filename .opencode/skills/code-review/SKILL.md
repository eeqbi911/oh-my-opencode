---
name: code-review
description: Comprehensive code review checklist covering correctness, security, performance, and maintainability. Use when reviewing pull requests or before committing changes.
origin: oh-my-opencode
version: 1.1
---

# Code Review Skill

## When to Activate

- PR opened or updated
- User asks for code review
- Before merging changes
- `/code-review` command invoked
- Pre-commit review

## Review Mindset

> Code review is about **improving code quality** and **sharing knowledge**, not about finding faults.

**Be constructive, not critical.**
**Suggest improvements, don't dictate.**

## Review Checklist

### 1. Correctness

- [ ] Code does what it claims to do
- [ ] Edge cases handled
- [ ] Error handling is appropriate
- [ ] No silent failures
- [ ] Types are correct and complete
- [ ] Boundary conditions checked

### 2. Security (OWASP Top 10)

| Category | Checkpoint |
|----------|-----------|
| Broken Access Control | Users can only access their own data |
| Cryptographic Failures | No weak encryption, secrets not hardcoded |
| Injection | Input validated, parameterized queries used |
| Insecure Design | Threat modeling done, rate limiting present |
| Security Misconfiguration | No debug mode in production |

**Secrets Detection Patterns:**

```regex
# API Keys
AKIA[0-9A-Z]{16}
sk-[0-9a-zA-Z]{48}
ghp_[0-9a-zA-Z]{36}

# Private Keys
-----BEGIN (RSA|DSA|EC) PRIVATE KEY-----

# Database URLs
mongodb://
postgres://
mysql://
redis://

# JWT Tokens
eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+
```

### 3. Performance

- [ ] No N+1 query problems
- [ ] Proper indexing on database fields
- [ ] Efficient algorithms (no O(n²) when O(n) possible)
- [ ] Lazy loading where appropriate
- [ ] Caching for expensive operations
- [ ] Bundle size reasonable (frontend)

### 4. Maintainability

- [ ] Code follows project style guide
- [ ] Functions are small (< 30 lines ideal)
- [ ] Single responsibility principle
- [ ] No duplicated code
- [ ] Clear, descriptive names
- [ ] Comments explain "why", not "what"
- [ ] No commented-out code

### 5. Testing

- [ ] Tests cover main functionality
- [ ] Edge cases tested
- [ ] Error scenarios covered
- [ ] 80%+ coverage on critical paths
- [ ] Tests are maintainable and readable

### 6. Documentation

- [ ] README updated if needed
- [ ] API endpoints documented
- [ ] Complex logic has explanatory comments
- [ ] Migration guides for DB changes

### 7. UI/UX (Frontend)

- [ ] Responsive design
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states

## Review Comment Format

### Blocker Comment (Must Fix)

```markdown
## 🔴 Blocker: [Issue Title]

**File:** `src/services/user.ts:45`

**Problem:** [Clear description of the issue and why it's blocking]

**Impact:** [What could go wrong if this is merged]

**Suggestion:** [How to fix it - be specific]

```typescript
// Current (problematic)
const hash = md5(password + "salt")

// Suggested fix
const hash = await bcrypt.hash(password, 12)
```
```

### Suggestion Comment (Should Fix)

```markdown
## 🟡 Suggestion: [Title]

**File:** `src/utils/helper.ts:23`

**Issue:** [Description]

**Suggestion:** [Optional improvement]

```typescript
// Current
data.map(item => item.value)

// Consider
data.map(({ value }) => value)
```
</>

### Nitpick Comment (Nice to Have)

```markdown
## 🟢 Nitpick: [Title]

**Suggestion:** [Minor improvement, non-blocking]
```

### Question Comment

```markdown
## ❓ Question: [Title]

**Context:** [What you're unsure about]

I'm not entirely clear on why this approach was chosen. Could you clarify?
```

## PR Size Guidelines

| Size | Lines | Review Time | Recommendation |
|------|-------|-------------|----------------|
| XS | < 50 | 5 min | ✅ Ideal |
| S | 50-200 | 15 min | ✅ Good |
| M | 200-500 | 30 min | ⚠️ Consider splitting |
| L | 500-1000 | 60 min | ⚠️ Split into smaller PRs |
| XL | > 1000 | 90+ min | ❌ Must split |

## PR Description Checklist

```markdown
## Summary
[Brief description of changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactoring
- [ ] Documentation update

## Testing
[How was this tested?]

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log/debugger left
- [ ] No commented-out code
- [ ] Security checklist passed
```

## Automated Checks

Run these tools before manual review:

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Tests
npm test

# Security audit
npm audit

# Coverage
npm test -- --coverage
```

## Code Review Checklist for AI Agents

When reviewing code, specifically check:

1. **No prompt injection vectors** - User input properly sanitized
2. **No system prompt leakage** - Internal instructions not exposed
3. **Tool calls are auditable** - All actions logged
4. **Fallback handling** - Graceful degradation on failures
5. **Resource limits** - No infinite loops or memory leaks
6. **Context window management** - No context overflow risks
7. **Rate limiting** - External API calls rate limited

## Giving constructive feedback

### ✅ Good

```markdown
"This pattern could lead to a race condition. Consider using a mutex here."
```

### ❌ Bad

```markdown
"This is wrong."
```

### ✅ Good

```markdown
"Have you considered extracting this into a separate function? It would make it more testable."
```

### ❌ Bad

```markdown
"You should refactor this."
```

## Approval Guidelines

| Status | Meaning |
|--------|---------|
| **Approved** | Ready to merge |
| **Changes Requested** | Fix issues before merge |
| **Blocked** | Major issues that need discussion |

## Review Speed

- Respond to review requests within **24 hours**
- If you need more time, acknowledge and give ETA
- Don't block PRs unnecessarily
