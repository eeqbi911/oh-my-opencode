---
name: tdd-workflow
description: Test-driven development workflow with red-green-refactor cycle and 80%+ coverage requirement. Use when implementing new features or refactoring existing code.
origin: oh-my-opencode
---

# Test-Driven Development Workflow

## When to Activate

Activate this skill when:
- User asks to implement a new feature
- User asks to add tests to existing code
- User asks to do TDD
- Starting a new module or service

## Workflow

### 1. RED - Write Failing Tests First

```bash
# Create test file first
touch src/__tests__/feature.test.ts
```

Write the test that describes the expected behavior:

```typescript
// Example: Test structure
describe('FeatureName', () => {
  it('should do X when Y', () => {
    // Arrange
    const input = setupTestData()
    
    // Act
    const result = featureName(input)
    
    // Assert
    expect(result).toEqual(expectedOutput)
  })
})
```

### 2. GREEN - Write Minimal Code

Write only the code needed to make tests pass:

```typescript
// Implement the simplest solution
export function featureName(input) {
  return input // just make it work
}
```

### 3. REFACTOR - Improve Code

After tests pass, refactor for:
- Performance
- Readability
- DRY principles
- Best practices

### 4. VERIFY - Ensure 80%+ Coverage

```bash
# Run coverage report
npm test -- --coverage
```

## Coverage Requirements

| Project Type | Minimum Coverage |
|--------------|-------------------|
| Core Business Logic | 90% |
| Utility Functions | 85% |
| API Handlers | 80% |
| UI Components | 70% |

## Anti-Patterns to Avoid

1. **Don't write tests after implementation** - This leads to test pollution
2. **Don't test implementation details** - Test behavior, not internals
3. **Don't skip refactoring** - Technical debt accumulates
4. **Don't ignore coverage gaps** - Low coverage = untested edge cases

## File Naming

```
src/
├── feature.ts           # Implementation
└── __tests__/
    └── feature.test.ts  # Tests
```

## Example Commands

```bash
# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- feature.test.ts

# Generate coverage report
npm test -- --coverage --coverageReporters=html
```
