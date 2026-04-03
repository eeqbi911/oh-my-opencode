---
paths:
  - "**/*.cpp"
  - "**/*.cc"
  - "**/*.h"
  - "**/*.hpp"
---

# C++ Rules

## Code Style

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `UserService` |
| Functions | snake_case | `get_user_by_id()` |
| Variables | snake_case | `user_name` |
| Constants | kCamelCase | `kMaxRetries` |
| Member variables | trailing_underscore_ | `name_` |
| Namespaces | lowercase | `user_service` |
| Enums | PascalCase | `OrderStatus` |
| Enum values | UPPER_SNAKE | `ORDER_PENDING` |

### Class Structure

```cpp
// ✅ Good - Organized class
class UserService {
public:
    UserService(std::shared_ptr<UserRepository> repo,
                std::shared_ptr<EmailService> email)
        : repo_(std::move(repo))
        , email_(std::move(email)) {}

    std::optional<User> findById(int64_t id) const {
        return repo_->findById(id);
    }

    Result<User> createUser(const CreateUserRequest& req) {
        if (!isValidEmail(req.email)) {
            return Result<User>::error("Invalid email");
        }
        User user = toEntity(req);
        auto saved = repo_->save(user);
        email_->sendWelcome(saved);
        return Result<User>::ok(saved);
    }

private:
    std::shared_ptr<UserRepository> repo_;
    std::shared_ptr<EmailService> email_;
};
```

## Modern C++ (C++17/20)

### Smart Pointers

```cpp
// ✅ Good - Smart pointers
auto user = std::make_unique<User>(args);
auto service = std::make_shared<UserService>(repo);

// ❌ Bad - Raw pointers
User* user = new User(args);  // Memory leak risk!

// ✅ Good - Weak pointer for caches
class UserCache {
    std::unordered_map<int64_t, std::weak_ptr<User>> cache_;
public:
    std::shared_ptr<User> get(int64_t id) {
        auto it = cache_.find(id);
        if (it != cache_.end()) {
            if (auto user = it->second.lock()) {
                return user;
            }
        }
        return nullptr;
    }
};
```

### Optional and Expected

```cpp
// ✅ Good - std::optional
std::optional<User> findUser(int64_t id) {
    auto user = db_.find(id);
    if (!user) return std::nullopt;
    return user;
}

// Usage
auto user = findUser(123);
if (user.has_value()) {
    std::cout << user->name() << '\n';
}

// Or with structured bindings
if (auto user = findUser(123); user) {
    std::cout << user->name() << '\n';
}

// ✅ Good - std::expected (C++23) or using tl::expected
tl::expected<User, Error> createUser(const CreateUserRequest& req) {
    if (!isValid(req)) {
        return tl::unexpected(Error::INVALID_REQUEST);
    }
    return User(req);
}

// Usage
auto result = createUser(req);
if (result) {
    use(result.value());
} else {
    handle(result.error());
}
```

### Structured Bindings

```cpp
// ✅ Good - Structured bindings
auto [id, name, email] = parseUser(data);

// ✅ Good - Destructure from map
std::map<std::string, int> scores = {{"Alice", 100}, {"Bob", 90}};
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << '\n';
}
```

## Memory Management

```cpp
// ✅ Good - RAII
class FileHandler {
    std::fstream file_;
public:
    FileHandler(const std::string& path) : file_(path) {
        if (!file_.is_open()) {
            throw std::runtime_error("Cannot open file");
        }
    }
    ~FileHandler() { file_.close(); }
};

// ✅ Good - Move semantics
class Buffer {
public:
    Buffer(Buffer&& other) noexcept
        : data_(std::move(other.data_))
        , size_(other.size_) {
        other.size_ = 0;
    }

    Buffer& operator=(Buffer&& other) noexcept {
        if (this != &other) {
            data_ = std::move(other.data_);
            size_ = other.size_;
        }
        return *this;
    }
};
```

## Error Handling

```cpp
// ✅ Good - Exception safety
class UserService {
public:
    void createUser(const CreateUserRequest& req) {
        User user = buildUser(req);
        transaction_.begin();
        try {
            repo_.save(user);
            email_.sendWelcome(user);
            transaction_.commit();
        } catch (...) {
            transaction_.rollback();
            throw;
        }
    }
};

// ✅ Good - noexcept for functions that don't throw
[[nodiscard]] int getValue() const noexcept {
    return value_;
}
```

## Templates and Generics

```cpp
// ✅ Good - Concepts (C++20)
template<typename T>
concept Serializable = requires(T a) {
    { a.serialize() } -> std::same_as<std::string>;
};

template<Serializable T>
std::string serializeAnything(const T& value) {
    return value.serialize();
}

// ✅ Good - Type traits
template<typename T>
std::enable_if_t<std::is_arithmetic_v<T>, T>
add(T a, T b) {
    return a + b;
}
```

## Testing

```cpp
// ✅ Good - GoogleTest
#include <gtest/gtest.h>

class UserServiceTest : public ::testing::Test {
protected:
    void SetUp() override {
        repo_ = std::make_shared<MockUserRepository>();
        service_ = std::make_shared<UserService>(repo_);
    }

    std::shared_ptr<MockUserRepository> repo_;
    std::shared_ptr<UserService> service_;
};

TEST_F(UserServiceTest, FindById_ExistingUser_ReturnsUser) {
    EXPECT_CALL(*repo_, findById(1))
        .WillOnce(Return(User{1, "test@example.com"}));

    auto result = service_->findById(1);

    ASSERT_TRUE(result.has_value());
    EXPECT_EQ(result->email(), "test@example.com");
}
```

## Performance

```cpp
// ✅ Good - Reserve for vectors
std::vector<User> users;
users.reserve(1000);  // Avoid reallocations

// ✅ Good - Emplace instead of push
std::vector<std::unique_ptr<User>> users;
users.emplace_back(std::make_unique<User>(args));  // No move

// ✅ Good --inline small functions
[[gnu::always_inline]] inline int getValue() const { return value_; }
```
