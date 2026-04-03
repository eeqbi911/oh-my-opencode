---
name: code-review
description: Comprehensive code review checklist covering correctness, security, performance, and maintainability. Use when reviewing pull requests or before committing changes.
origin: oh-my-opencode
---

# Code Review Skill

## When to Activate

- PR opened or updated
- User asks for code review
- Before merging changes
- `/code-review` command invoked

## Review Checklist

### 1. Correctness

- [ ] Code does what it claims to do
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No silent failures
- [ ] Types are correct and complete

### 2. Security

- [ ] No hardcoded secrets or credentials
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention
- [ ] XSS prevention in frontend code
- [ ] Proper authentication/authorization checks
- [ ] Sensitive data is not logged

### 3. Performance

- [ ] No N+1 query problems
- [ ] Proper indexing on database fields
- [ ] Efficient algorithms (no unnecessary O(n²))
- [ ] Lazy loading where appropriate
- [ ] Caching for expensive operations
- [ ] Bundle size is reasonable (frontend)

### 4. Maintainability

- [ ] Code follows project style guide
- [ ] Functions are small and single-purpose
- [ ] No duplicated code
- [ ] Variables/functions have clear names
- [ ] Comments explain "why", not "what"
- [ ] No commented-out code

### 5. Testing

- [ ] Tests cover main functionality
- [ ] Edge cases are tested
- [ ] Tests are maintainable
- [ ] 80%+ code coverage for critical paths
- [ ] Integration tests for API endpoints

### 6. Documentation

- [ ] README updated if needed
- [ ] API endpoints documented
- [ ] Complex logic has comments
- [ ] Migration guides for DB changes

## Review Comments Format

```markdown
## [Comment Type] Brief Summary

**File:** `src/path/file.ts:45`

**Issue:** Description of the problem

**Suggestion:** How to fix it

> 💡 **Tip:** Add helpful tips for junior developers
```

### Comment Types

| Prefix | Meaning |
|--------|---------|
| 🔴 **Blocker** | Must fix before merge |
| 🟡 **Suggestion** | Should consider improving |
| 🟢 **Nitpick** | Optional, minor improvement |
| ❓ **Question** | Seeking clarification |

## Automated Checks

Run these tools before manual review:

```bash
# Linting
npm run lint

# Type checking
npm run typecheck

# Security audit
npm audit

# Test coverage
npm test -- --coverage
```

## PR Size Guidelines

| Size | Lines Changed | Review Time |
|------|--------------|-------------|
| XS | < 50 | 5 min |
| S | 50-200 | 15 min |
| M | 200-500 | 30 min |
| L | 500-1000 | 60 min |
| XL | > 1000 | Break into smaller PRs |

## Code Review Checklist for AI Agents

When reviewing code, check:

1. **No prompt injection vectors** - User input properly sanitized
2. **No system prompt leakage** - Internal instructions not exposed
3. **Tool calls are auditable** - All actions logged
4. **Fallback handling** - Graceful degradation on failures
5. **Resource limits** - No infinite loops or memory leaks
