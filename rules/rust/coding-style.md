---
paths:
  - "**/*.rs"
---

# Rust Rules

## Error Handling

### Use Result Type

```rust
// ✅ Good - Propagate errors
fn read_file(path: &str) -> Result<String, io::Error> {
    let mut file = File::open(path)?;  // ? operator
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

// ❌ Bad - Panicking
fn read_file(path: &str) -> String {
    let mut file = File::open(path).unwrap()  // Can panic!
}
```

### Custom Error Types

```rust
// ✅ Good - Custom error with thiserror
#[derive(Error, Debug)]
pub enum UserError {
    #[error("User not found: {0}")]
    NotFound(String),

    #[error("Invalid email: {0}")]
    InvalidEmail(String),

    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),
}

// ❌ Bad - String errors everywhere
fn find_user() -> Result<User, String> {
    Err("User not found".to_string())
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Functions | snake_case | `get_user_by_id()` |
| Variables | snake_case | `user_name` |
| Types/Structs | PascalCase | `UserService` |
| Enums | PascalCase | `OrderStatus` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Modules | snake_case | `user_service` |
| Traits | PascalCase | `Serialize` |

## Module Organization

```rust
// ✅ Good - Clear module structure
mod user;
mod order;

pub use user::{User, UserService};
pub use order::{Order, OrderService};

// lib.rs
pub mod user;
pub mod order;
pub mod error;

// main.rs
use mylib::{user, order, error};
```

## Async Rust

```rust
// ✅ Good - Async with Result
async fn fetch_user(id: &str) -> Result<User, ApiError> {
    let response = client.get(url).await?;
    let user = response.json::<User>().await?;
    Ok(user)
}

// ✅ Good - Parallel async
async fn fetch_users(ids: &[String]) -> Result<Vec<User>, Error> {
    let futures = ids.iter().map(fetch_user);
    let users = futures::future::join_all(futures)
        .into_iter()
        .collect::<Result<Vec<_>, _>>()?;
    Ok(users)
}
```

## Testing

```rust
// ✅ Good - Unit tests
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_divide_by_zero() {
        let result = divide(10, 0);
        assert!(result.is_err());
    }
}

// ✅ Good - Integration tests
// tests/integration_test.rs
#[test]
fn test_user_flow() {
    let app = app::test_app();
    let response = app.get_user("123");
    assert_eq!(response.status(), 200);
}
```

## Struct Design

```rust
// ✅ Good - Clear struct with From
#[derive(Debug, Clone)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub name: String,
}

impl From<DbUser> for User {
    fn from(db: DbUser) -> Self {
        Self {
            id: db.id,
            email: db.email,
            name: db.name,
        }
    }
}

// ✅ Good - Builder pattern
impl User {
    pub fn builder() -> UserBuilder {
        UserBuilder::default()
    }
}

#[derive(Default)]
pub struct UserBuilder {
    id: Option<Uuid>,
    email: Option<String>,
    name: Option<String>,
}

impl UserBuilder {
    pub fn id(mut self, id: Uuid) -> Self { self.id = Some(id); self }
    pub fn email(mut self, email: String) -> Self { self.email = Some(email); self }
    pub fn name(mut self, name: String) -> Self { self.name = Some(name); self }

    pub fn build(self) -> Result<User, &'static str> {
        Ok(User {
            id: self.id.ok_or("id required")?,
            email: self.email.ok_or("email required")?,
            name: self.name.ok_or("name required")?,
        })
    }
}
```

## Traits and Generics

```rust
// ✅ Good - Trait bounds clear
pub fn process<T: Processor>(processor: T) -> Result<T::Output, T::Error> {
    processor.execute()
}

// ✅ Good - Use where clause for complex bounds
pub fn process<P>(processor: P) -> Result<P::Output, P::Error>
where
    P: Processor + Clone,
    P::Output: Serialize,
{
    processor.execute()
}

// ✅ Good - Seperate traits for different behaviors
trait Serializer {
    fn serialize(&self) -> Vec<u8>;
}

trait Deserializer {
    fn deserialize(bytes: &[u8]) -> Result<Self, Error>;
}
```
