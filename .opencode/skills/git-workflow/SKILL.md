---
name: git-workflow
description: Git workflow conventions including atomic commits, branch naming, PR guidelines, and history management. Use for any git operations or commit messages.
origin: oh-my-opencode
---

# Git Workflow Skill

## When to Activate

- Creating commits
- Branch management
- Pull request creation
- Merge conflicts
- Git history cleanup

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type Prefixes

| Type | Description |
|------|-------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting, no code change |
| refactor | Code restructuring |
| test | Adding tests |
| chore | Maintenance tasks |
| perf | Performance improvement |
| ci | CI/CD changes |
| revert | Revert previous commit |

### Examples

```
feat(auth): add OAuth2 login with Google

Implement Google OAuth2 authentication flow:
- Add passport-google-oauth20 strategy
- Create auth routes
- Add session management

Closes #123
```

```
fix(api): prevent SQL injection in user search

Escaped user input in raw SQL query.
Added parameterized query for user lookup.

Fixes #456
```

## Branch Naming

```
<type>/<ticket>-<short-description>

feat/123-add-user-auth
fix/456-login-redirect
chore/update-dependencies
docs/789-api-documentation
```

## Branch Strategy

```
main (production)
  └── develop (integration)
        ├── feature/123-user-auth
        ├── feature/124-payment
        ├── fix/456-login-bug
        └── release/1.2.0
```

## Atomic Commits

### Good Atomic Commit

```bash
# Commit one logical change
git add src/auth/login.ts
git commit -m "feat(auth): add user login form

- Create LoginForm component
- Add email/password validation
- Connect to auth API"
```

### Bad Non-Atomic Commit

```bash
# Don't do this - mixes unrelated changes
git commit -m "fix stuff and add features"
# Changes: login, validation, styles, tests, docs
```

## Interactive Rebase

### Squash Related Commits

```bash
# Squash last 3 commits into one
git rebase -i HEAD~3

# In editor:
pick abc123 feat: add login
squash def456 feat: add validation
squash ghi789 feat: add tests
```

### Clean Up Before PR

```bash
# Rebase on main to get latest changes
git fetch origin
git rebase origin/main

# Interactive clean
git rebase -i origin/main
```

## Working with PRs

### PR Title Format

```
[<type>] <Short description>

Examples:
[feat] Add user authentication
[fix] Prevent XSS in search input
[refactor] Extract payment logic
```

### PR Description Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
```

## Git Operations

### Undo Safely

```bash
# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Undo last commit (keep changes unstaged)
git reset HEAD~1

# Undo specific commit
git revert <commit-hash>

# Undo file changes
git checkout -- <file>
git restore <file>
```

### Stash Work

```bash
# Save work in progress
git stash
git stash push -m "WIP: feature X"

# List stashes
git stash list

# Apply stash
git stash apply
git stash pop

# Apply specific stash
git stash apply stash@{2}
```

## Merge vs Rebase

### Use Rebase For
- Feature branches integrating main
- Cleaning up commits before PR
- Keeping history linear

### Use Merge For
- Release branches
- Public/shared branches
- Preserving full history

```bash
# Rebase (cleaner history)
git checkout feature/123
git rebase main

# Merge (preserves history)
git checkout main
git merge feature/123
```

## Tags

```bash
# Create annotated tag
git tag -a v1.2.0 -m "Release version 1.2.0

Features:
- User authentication
- Payment integration"

# Push tag
git push origin v1.2.0
```
