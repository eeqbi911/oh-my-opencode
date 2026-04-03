---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.jsx"
---

# TypeScript/JavaScript Rules

## Type Safety

- Enable strict mode in tsconfig.json
- Avoid `any` type - use `unknown` instead
- Prefer interfaces over type aliases for object shapes
- Use strict null checks
- Export types explicitly when needed

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName` |
| Functions | camelCase | `getUserById()` |
| Classes | PascalCase | `UserService` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Interfaces | PascalCase | `UserProfile` |
| Type Aliases | PascalCase | `ApiResponse` |

## Imports

```typescript
// ✅ Good: Organized imports
import { useState, useEffect } from 'react'
import { api } from './api'
import type { User } from './types'

// ❌ Bad: Unorganized, barrel imports
import * as Utils from './utils'
```

## Async/Await

```typescript
// ✅ Good: Clear async flow
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  } catch (error) {
    logger.error('Failed to fetch user', { id, error })
    throw error
  }
}

// ❌ Bad: Unhandled errors
async function fetchUser(id: string) {
  return api.get(`/users/${id}`)
}
```

## Error Handling

```typescript
// ✅ Good: Typed errors
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

// ✅ Good: Try-catch with context
try {
  await riskyOperation()
} catch (error) {
  if (error instanceof ValidationError) {
    return { error: error.message, field: error.field }
  }
  throw error
}
```

## Component Rules (React)

```typescript
// ✅ Good: Explicit props and return type
interface Props {
  user: User
  onLogout: () => void
}

export function UserCard({ user, onLogout }: Props): JSX.Element {
  return (
    <div>
      <span>{user.name}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}

// ❌ Bad: Implicit any, missing return type
function UserCard(props) {
  return <div>{props.user.name}</div>
}
```

## TypeScript-specific

```typescript
// ✅ Good: Discriminated unions
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error }

// ✅ Good: Branded types for IDs
type UserId = string & { readonly brand: unique symbol }

// ✅ Good: Const assertions
const ROUTES = {
  home: '/',
  about: '/about',
  contact: '/contact'
} as const
```
