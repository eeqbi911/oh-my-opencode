---
paths:
  - "**/*.java"
---

# Java Rules

## Code Style

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Classes | PascalCase | `UserService` |
| Methods | camelCase | `getUserById()` |
| Variables | camelCase | `userName` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Packages | lowercase | `com.example.service` |

### Class Structure

```java
// ✅ Good - Organized class
public class UserService {

    // Static constants
    private static final Logger LOG = Logger.getLogger(UserService.class);
    private static final int MAX_RETRY = 3;

    // Instance fields
    private final UserRepository userRepository;
    private final EmailService emailService;

    // Constructors
    @Inject
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // Public methods
    public User createUser(CreateUserRequest request) {
        validateRequest(request);
        User user = buildUser(request);
        User saved = userRepository.save(user);
        emailService.sendWelcome(saved);
        return saved;
    }

    // Private methods
    private void validateRequest(CreateUserRequest request) {
        if (request.getEmail() == null) {
            throw new IllegalArgumentException("Email required");
        }
    }
}
```

## Error Handling

```java
// ✅ Good - Specific exceptions
public class UserService {

    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    public User createUser(CreateUserRequest request) {
        try {
            return userRepository.save(toEntity(request));
        } catch (DataIntegrityViolationException e) {
            if (isDuplicateEmail(e)) {
                throw new EmailAlreadyExistsException(request.getEmail());
            }
            throw e;
        }
    }
}

// Custom exception
public class UserNotFoundException extends RuntimeException {
    private final Long userId;

    public UserNotFoundException(Long userId) {
        super("User not found: " + userId);
        this.userId = userId;
    }
}
```

## Spring Boot Patterns

```java
// ✅ Good - REST Controller
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return userService.findById(id)
            .map(ResponseEntity::ok)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request) {
        User user = userService.createUser(request);
        return ResponseEntity.created(uriOf(user)).body(toResponse(user));
    }
}

// ✅ Good - Service Layer
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }
        User user = toEntity(request);
        return userRepository.save(user);
    }
}

// ✅ Good - Repository
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.status = :status")
    List<User> findByStatus(@Param("status") UserStatus status);
}
```

## Optional Usage

```java
// ✅ Good - Optional for nullable returns
public Optional<User> findByEmail(String email) {
    return Optional.ofNullable(userRepository.findByEmail(email));
}

// ❌ Bad - Optional as field type
public class User {
    private Optional<String> nickname;  // Don't do this
}

// ✅ Good - Optional chaining
public String getUserNickname(Long userId) {
    return userRepository.findById(userId)
        .map(User::getNickname)
        .orElse("Anonymous");
}

// ✅ Good - Optional with filter
public Optional<User> findActiveUser(Long id) {
    return userRepository.findById(id)
        .filter(User::isActive);
}
```

## Streams

```java
// ✅ Good - Stream operations
List<String> activeUserEmails = users.stream()
    .filter(User::isActive)
    .map(User::getEmail)
    .collect(Collectors.toList());

// ✅ Good - Grouping
Map<UserStatus, List<User>> byStatus = users.stream()
    .collect(Collectors.groupingBy(User::getStatus));

// ❌ Bad - Side effects in streams
users.stream()
    .forEach(user -> {
        if (user.isActive()) {
            sendEmail(user);  // Don't do this
        }
    });

// ✅ Good - Method reference
users.forEach(this::sendEmail);
```

## Testing

```java
// ✅ Good - Unit test with JUnit 5
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void findById_existingUser_returnsUser() {
        // Arrange
        Long userId = 1L;
        User user = User.builder()
            .id(userId)
            .email("test@example.com")
            .build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        Optional<User> result = userService.findById(userId);

        // Assert
        assertTrue(result.isPresent());
        assertEquals("test@example.com", result.get().getEmail());
    }
}

// ✅ Good - Integration test
@SpringBootTest
@Testcontainers
class UserRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Autowired
    private UserRepository userRepository;

    @Test
    void save_validUser_persistsAndRetrieves() {
        User user = User.builder()
            .email("test@example.com")
            .name("Test")
            .build();

        User saved = userRepository.save(user);

        assertNotNull(saved.getId());
        assertEquals("test@example.com", saved.getEmail());
    }
}
```
