---
paths:
  - "**/*.go"
---

# Go Rules

## Error Handling

- Always handle errors (no ignored errors with `_`)
- Return errors rather than panicking for expected failures
- Wrap errors with context using `fmt.Errorf`

```go
// ✅ Good
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("GetUser(%s): %w", id, err)
    }
    return user, nil
}

// ❌ Bad
user, _ := db.FindUser(id)
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Functions | PascalCase | `GetUser()` |
| Variables | camelCase | `userName` |
| Constants | PascalCase or UPPER_SNAKE | `MaxRetries` or `MAX_RETRIES` |
| Packages | lowercase, no underscores | `userpkg` not `user_pkg` |
| Interfaces | PascalCase, often `-er` | `Reader`, `Writer` |

## Package Structure

```
module/
├── internal/
│   ├── handler/     # HTTP handlers
│   ├── service/     # Business logic
│   ├── repository/  # Data access
│   └── model/       # Domain models
├── pkg/
│   └── utils/       # Shared utilities
├── api/             # API definitions (protobuf/openapi)
└── cmd/
    └── server/      # Main entry points
```

## Context Propagation

```go
// ✅ Good: Pass context through the call chain
func (s *Service) GetUser(ctx context.Context, id string) (*User, error) {
    user, err := s.repo.FindUser(ctx, id)
    if err != nil {
        return nil, err
    }
    return user, nil
}

// ❌ Bad: Creating new context
func GetUser(id string) (*User, error) {
    ctx := context.Background()
    return repo.FindUser(ctx, id)
}
```

## Concurrency

```go
// ✅ Good: Proper goroutine synchronization
func ProcessItems(items []Item) Results {
    results := make(chan Result, len(items))
    var wg sync.WaitGroup
    
    for _, item := range items {
        wg.Add(1)
        go func(i Item) {
            defer wg.Done()
            results <- process(i)
        }(item)
    }
    
    go func() {
        wg.Wait()
        close(results)
    }()
    
    return collectResults(results)
}

// ❌ Bad: Goroutine leak
func ProcessItems(items []Item) {
    for _, item := range items {
        go process(item)  // No waiting!
    }
}
```

## Testing

```go
// ✅ Good: Table-driven tests
func TestAdd(t *testing.T) {
    tests := []struct {
        name    string
        a, b    int
        want    int
        wantErr bool
    }{
        {"simple add", 1, 2, 3, false},
        {"negative", -1, -1, -2, false},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := Add(tt.a, tt.b)
            if (err != nil) != tt.wantErr {
                t.Errorf("Add() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if got != tt.want {
                t.Errorf("Add() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

## Interfaces

```go
// ✅ Good: Define interfaces where used
type UserService interface {
    GetUser(ctx context.Context, id string) (*User, error)
    CreateUser(ctx context.Context, user *User) error
}

// ✅ Good: Interface segregation
// Smaller interfaces are better
type Reader interface {
    Read(ctx context.Context, id string) ([]byte, error)
}

type Writer interface {
    Write(ctx context.Context, data []byte) error
}
```
