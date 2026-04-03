---
name: api-design
description: REST API design patterns including versioning, pagination, error handling, and OpenAPI specs. Use when designing or implementing APIs.
origin: oh-my-opencode
---

# API Design Skill

## When to Activate

- Designing new API endpoints
- Improving existing API structure
- Creating API documentation
- Setting up API versioning

## RESTful Conventions

### URL Structure

```
GET    /api/v1/users        # List users
POST   /api/v1/users        # Create user
GET    /api/v1/users/:id    # Get user
PUT    /api/v1/users/:id    # Full update
PATCH  /api/v1/users/:id    # Partial update
DELETE /api/v1/users/:id    # Delete user
```

### Naming Rules

- Use nouns, not verbs: `/users` not `/getUsers`
- Use plural names: `/users` not `/user`
- Use kebab-case: `/user-profiles` not `/userProfiles`
- Nest resources logically: `/users/:id/orders`

## Request/Response Patterns

### Success Response

```json
{
  "data": {
    "id": "123",
    "name": "John",
    "email": "john@example.com"
  },
  "meta": {
    "requestId": "req_abc123"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  },
  "meta": {
    "requestId": "req_abc123"
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
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Versioning

### URL Path Versioning

```
/api/v1/users
/api/v2/users
```

### Header Versioning

```
Accept: application/vnd.api+json;version=2
```

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Security

- Use HTTPS only
- Implement rate limiting
- Validate all input
- Use OAuth2/JWT for authentication
- Sanitize output to prevent XSS
