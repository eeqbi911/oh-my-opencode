---
paths:
  - "**/*.py"
---

# Python Rules

## Type Hints

- Use type hints for all function signatures
- Use `from __future__ import annotations` for forward references
- Prefer `Optional[T]` over `T | None` for Python 3.9

```python
# ✅ Good
from typing import Optional, List

def get_user(user_id: int) -> Optional[User]:
    ...

def process_items(items: List[str]) -> Dict[str, Any]:
    ...

# ❌ Bad
def get_user(user_id):
    ...
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Functions | snake_case | `get_user_by_id()` |
| Classes | PascalCase | `UserService` |
| Constants | UPPER_SNAKE | `MAX_RETRIES` |
| Variables | snake_case | `user_name` |
| Private | _leading_underscore | `_internal_method()` |

## Docstrings

```python
# ✅ Good: Google style docstrings
def calculate_total(items: List[Item]) -> Decimal:
    """Calculate the total price for a list of items.
    
    Args:
        items: List of items to calculate
        
    Returns:
        Total price as Decimal
        
    Raises:
        ValueError: If items list is empty
    """
    if not items:
        raise ValueError("Items list cannot be empty")
    return sum(item.price for item in items)
```

## Error Handling

```python
# ✅ Good: Specific exceptions
try:
    result = risky_operation()
except ValueError as e:
    logger.error(f"Invalid input: {e}")
    raise
except Exception as e:
    logger.exception("Unexpected error")
    raise

# ❌ Bad: Bare except
try:
    result = operation()
except:
    pass
```

## Async Python

```python
# ✅ Good: Proper async handling
import asyncio

async def fetch_data(url: str) -> Dict[str, Any]:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

# Use asyncio.gather for concurrent operations
results = await asyncio.gather(
    fetch_data(url1),
    fetch_data(url2)
)
```

## Testing (pytest)

```python
# ✅ Good: Descriptive test names
class TestUserService:
    def test_get_user_returns_user_when_exists(self):
        ...
        
    def test_get_user_raises_when_not_found(self):
        with pytest.raises(UserNotFoundError):
            service.get_user(999)
```

## Django/Flask Specific

```python
# ✅ Good: Django patterns
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'created_at']
        
# ✅ Good: Flask route patterns
@app.route('/users/<int:user_id>')
def get_user(user_id: int):
    user = User.query.get_or_404(user_id)
    return jsonify(UserSchema().dump(user))
```
