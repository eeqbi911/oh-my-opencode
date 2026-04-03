---
name: backend-patterns
description: Backend architecture patterns including API design, database optimization, caching strategies, and server-side best practices for Node.js and Python.
origin: oh-my-opencode
---

# Backend Patterns Skill

## When to Activate

- Designing new API endpoints
- Database performance issues
- Caching implementation
- Microservices architecture
- Backend refactoring

## API Design Patterns

### RESTful API Structure

```
GET    /api/users        # List users
POST   /api/users        # Create user
GET    /api/users/:id    # Get user
PUT    /api/users/:id    # Update user
DELETE /api/users/:id    # Delete user
```

### Error Response Format

```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found",
    "details": {}
  }
}
```

### Pagination

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

## Database Patterns

### N+1 Query Prevention

```typescript
// ❌ Bad: N+1 queries
const users = await db.users.findMany()
for (const user of users) {
  user.posts = await db.posts.findMany({ where: { userId: user.id } })
}

// ✅ Good: Join once
const users = await db.users.findMany({
  include: { posts: true }
})
```

### Soft Deletes

```typescript
// Add deletedAt for soft deletes
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  deletedAt DateTime? // Soft delete
}

async function findUser(id: string) {
  return db.user.findFirst({
    where: { id, deletedAt: null }
  })
}
```

### Optimistic Locking

```typescript
// Prevent concurrent updates
async function updateUser(id: string, data: UserUpdate, version: number) {
  return db.user.updateMany({
    where: { id, version },
    data: { ...data, version: version + 1 }
  })
}
```

## Caching Patterns

### Cache-Aside

```typescript
async function getUser(id: string) {
  const cacheKey = `user:${id}`
  const cached = await redis.get(cacheKey)
  
  if (cached) return JSON.parse(cached)
  
  const user = await db.user.findUnique({ where: { id } })
  await redis.setex(cacheKey, 3600, JSON.stringify(user))
  
  return user
}
```

### Write-Through Cache

```typescript
async function createUser(data: CreateUser) {
  const user = await db.user.create({ data })
  await redis.setex(`user:${user.id}`, 3600, JSON.stringify(user))
  return user
}
```

## Authentication Patterns

### JWT Structure

```typescript
interface JWTPayload {
  sub: string        // User ID
  email: string
  roles: string[]
  iat: number         // Issued at
  exp: number         // Expiration
}
```

### Refresh Token Rotation

```typescript
async function refreshTokens(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken)
  
  // Invalidate old refresh token
  await db.refreshTokens.delete({ where: { token: refreshToken } })
  
  // Generate new tokens
  return generateTokenPair(payload.userId)
}
```

## Rate Limiting

```typescript
const rateLimiter = {
  windowMs: 60 * 1000,  // 1 minute
  maxRequests: 100,
  
  async check(clientId: string) {
    const key = `ratelimit:${clientId}`
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, this.windowMs / 1000)
    }
    
    return current <= this.maxRequests
  }
}
```

## Background Jobs

### Job Queue Pattern

```typescript
// Enqueue job
await queue.add('send-email', {
  to: user.email,
  template: 'welcome'
})

// Process job
import { Worker } from 'bullmq'

const worker = new Worker('email', async (job) => {
  const { to, template } = job.data
  await emailService.send(to, template)
}, { connection: redis })
```

## Circuit Breaker

```typescript
class CircuitBreaker {
  private failures = 0
  private lastFailure: number
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  
  async call(fn: () => Promise<any>) {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > 30000) {
        this.state = 'half-open'
      } else {
        throw new Error('Circuit is open')
      }
    }
    
    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (err) {
      this.onFailure()
      throw err
    }
  }
}
```
