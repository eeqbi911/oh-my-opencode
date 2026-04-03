---
name: tdd-workflow
description: Test-driven development workflow with red-green-refactor cycle and 80%+ coverage requirement. Use when implementing new features or refactoring existing code.
origin: oh-my-opencode
version: 1.1
---

# Test-Driven Development Workflow

## When to Activate

Activate this skill when:
- User asks to implement a new feature
- User asks to add tests to existing code
- User asks to do TDD
- Starting a new module or service
- Refactoring existing code

## Core Principles

1. **Red** - Write a failing test first
2. **Green** - Write minimal code to pass
3. **Refactor** - Improve code while keeping tests green

## The TDD Cycle

```
┌─────────────────────────────────────────┐
│            Write Failing Test            │
│         (matches expected behavior)      │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│         Write Minimal Code               │
│     (only what's needed to pass)         │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│          All Tests Pass                  │
└─────────────────┬───────────────────────┘
                  ▼
┌─────────────────────────────────────────┐
│            REFACTOR                     │
│    (improve code, keep tests green)      │
└─────────────────┬───────────────────────┘
                  ▼
                  │
                  └── Repeat ──┘
```

## Test Structure

### AAA Pattern (Arrange-Act-Assert)

```typescript
describe('Calculator', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      // Arrange
      const calc = new Calculator()
      const a = 2
      const b = 3

      // Act
      const result = calc.add(a, b)

      // Assert
      expect(result).toBe(5)
    })

    it('should handle negative numbers', () => {
      // Arrange
      const calc = new Calculator()

      // Act
      const result = calc.add(-1, -2)

      // Assert
      expect(result).toBe(-3)
    })

    it('should throw on overflow', () => {
      // Arrange
      const calc = new Calculator()

      // Act & Assert
      expect(() => calc.add(Number.MAX_VALUE, 1))
        .toThrow('Overflow')
    })
  })
})
```

### Given-When-Then Pattern (BDD)

```typescript
describe('User Registration', () => {
  scenario('valid email creates account', () => {
    // Given
    const validEmail = 'user@example.com'
    const password = 'SecurePass123!'

    // When
    const result = registerUser(validEmail, password)

    // Then
    expect(result.success).toBe(true)
    expect(result.user.email).toBe(validEmail)
    expect(result.user.id).toBeDefined()
  })

  scenario('duplicate email fails', () => {
    // Given
    const existingEmail = 'existing@example.com'
    createUser(existingEmail)

    // When
    const result = registerUser(existingEmail, 'password')

    // Then
    expect(result.success).toBe(false)
    expect(result.error).toBe('EMAIL_EXISTS')
  })
})
```

## Coverage Requirements

| Project Type | Minimum | Target |
|--------------|---------|--------|
| Core Business Logic | 90% | 95% |
| Library/Utility | 85% | 90% |
| API Handlers | 80% | 85% |
| UI Components | 70% | 80% |
| Integration Tests | 60% | 70% |

## Test Categories

### Unit Tests
- Test single function/class in isolation
- Mock all dependencies
- Fast execution (< 100ms each)

```typescript
it('should validate email format', () => {
  // Mock dependencies
  const mockDb = { findByEmail: vi.fn() }
  const validator = new EmailValidator(mockDb)

  // Test
  expect(validator.isValid('user@example.com')).toBe(true)
  expect(validator.isValid('invalid')).toBe(false)
})
```

### Integration Tests
- Test multiple components together
- Real database (or test database)
- Slower execution

```typescript
it('should create user and persist to database', async () => {
  // Real test database
  const db = await createTestDatabase()

  // Create user
  const userRepo = new UserRepository(db)
  const user = await userRepo.create({
    email: 'new@example.com',
    name: 'New User'
  })

  // Verify persisted
  const found = await userRepo.findById(user.id)
  expect(found.email).toBe('new@example.com')
})
```

### E2E Tests
- Test entire application flow
- Use real browser (Playwright)
- Slowest execution

```typescript
it('should complete checkout flow', async () => {
  const page = await browser.newPage()

  await page.goto('/products')
  await page.click('[data-testid="product-1"]')
  await page.click('button:has-text("Add to Cart")')
  await page.click('button:has-text("Checkout")')

  await expect(page.locator('.order-confirmation'))
    .toBeVisible()
})
```

## Mocking Patterns

### Function Mocks

```typescript
import { vi } from 'vitest'

// Mock a function
const fetchUser = vi.fn()

// Set return value
fetchUser.mockResolvedValue({ id: 1, name: 'John' })
// or
fetchUser.mockReturnValue({ id: 1, name: 'John' })

// Mock implementation
fetchUser.mockImplementation(async (id) => {
  return { id, name: `User ${id}` }
})

// Assertions
expect(fetchUser).toHaveBeenCalledWith(1)
expect(fetchUser).toHaveBeenCalledTimes(1)
```

### Module Mocks

```typescript
vi.mock('./api', () => ({
  fetchUser: vi.fn(),
  createUser: vi.fn()
}))

import { fetchUser } from './api'

it('should fetch user', async () => {
  fetchUser.mockResolvedValue({ id: 1, name: 'John' })

  const result = await fetchUser(1)

  expect(result.name).toBe('John')
})
```

## Test File Organization

```
src/
├── services/
│   ├── UserService.ts
│   └── __tests__/
│       └── UserService.test.ts
├── utils/
│   ├── helpers.ts
│   └── __tests__/
│       ├── helpers.test.ts
│       └── helpers.edge-cases.test.ts
└── api/
    └── __tests__/
        └── api.integration.test.ts
```

## Anti-Patterns

### ❌ Don't Do These

```typescript
// 1. Test implementation details
it('should call internal method', () => {
  const result = calculate()
  expect(result._internalCache).toBeDefined() // NO!
})

// 2. Multiple assertions in one test
it('should do everything', () => {
  const result = calculate()
  expect(result.a).toBe(1)
  expect(result.b).toBe(2)  // Separate tests!
  expect(result.c).toBe(3)
})

// 3. No assertions
it('should calculate', () => {
  calculate() // Where's the assertion?!
})

// 4. Test without Arrange
it('should work', () => {
  expect(calculate(1, 2)).toBe(3) // Missing setup context
})
```

### ✅ Do These

```typescript
// 1. Test behavior, not implementation
it('should return sum of two numbers', () => {
  expect(calculate(1, 2)).toBe(3)
})

// 2. Single concept per test
it('should return sum', () => { /* ... */ })
it('should throw on invalid input', () => { /* ... */ })

// 3. Clear assertions
it('should return sum', () => {
  const result = calculate(1, 2)
  expect(result).toBe(3)
})

// 4. Meaningful setup
it('should return sum of positive numbers', () => {
  const a = 1, b = 2  // Arrange
  const result = calculate(a, b)  // Act
  expect(result).toBe(3)  // Assert
})
```

## Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Specific file
npm test -- src/services/UserService.test.ts

# Coverage
npm test -- --coverage

# Coverage report
npm test -- --coverage --coverageReporters=html
npx open coverage/index.html
```

## Coverage Reports

```bash
# vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        functions: 80,
        branches: 80,
        lines: 80,
        statements: 80
      }
    }
  }
})
```

## TDD Checklist

- [ ] Write test before code
- [ ] Tests fail initially (Red)
- [ ] Write minimal code to pass (Green)
- [ ] Refactor while tests pass
- [ ] 80%+ coverage achieved
- [ ] Tests are fast (< 100ms unit tests)
- [ ] No flaky tests
- [ ] Mock external dependencies
- [ ] Test edge cases
- [ ] Test error paths
