# Common Rules - Language Agnostic

These rules apply to all projects regardless of language.

---

## Coding Style

- Use meaningful variable and function names
- Keep functions small (under 30 lines)
- Single responsibility principle
- Don't repeat yourself (DRY)
- Prefer composition over inheritance

## Git Workflow

- Commit message format: `<type>(<scope>): <description>`
- Branch naming: `<type>/<ticket>-<description>`
- Keep commits atomic (one logical change per commit)
- Rebase before merge for feature branches
- Write tests before committing new features

## Testing

- Test coverage minimum: 80%
- Write tests for new features
- Include edge cases
- Mock external dependencies
- Keep tests fast

## Performance

- Profile before optimizing
- Use lazy loading where appropriate
- Avoid premature optimization
- Cache expensive operations
- Pagination for large datasets

## Security

- Never hardcode secrets
- Validate all input
- Use parameterized queries
- Implement proper auth/authz
- Log security events
