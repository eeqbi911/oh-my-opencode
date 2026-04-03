---
name: refactor-guide
description: Code refactoring specialist for improving code quality without changing behavior. Use when asked to refactor, clean up, or modernize code.
origin: oh-my-opencode
version: 1.1
---

# Refactor Guide Skill

## When to Activate

- User asks to refactor code
- Code review flags maintainability issues
- Large functions/classes detected
- Duplicate code found
- Technical debt needs addressing

## Core Principles

1. **Behavior must not change** - Tests pass before and after
2. **Small, incremental changes** - One thing at a time
3. **Test after each step** - Verify nothing broke
4. **Commit frequently** - Can revert if needed

## Code Smells Checklist

### Problems to Find

| Smell | Symptom | Fix |
|-------|---------|-----|
| Long Function | > 50 lines | Extract smaller functions |
| Large Class | > 300 lines | Split responsibilities |
| Duplicate Code | Copy-paste | Extract function |
| Dead Code | Unused exports | Delete |
| Magic Numbers | `if (x > 86400000)` | Extract constant |
| God Object | Class knows too much | Split |
| Feature Envy | Class uses another's data more | Move method |
| Shotgun Surgery | One change requires many edits | Consolidate |

## Refactoring Patterns

### Extract Function

```typescript
// ❌ Before
function processOrder(order: Order) {
  // 50 lines of validation
  // 30 lines of calculation
  // 20 lines of saving
  // 10 lines of notification
}

// ✅ After
function processOrder(order: Order) {
  validateOrder(order)
  const total = calculateTotal(order)
  const discounted = applyDiscount(total)
  await saveOrder(order, discounted)
  await notifyUser(order)
}
```

### Replace Magic Numbers

```typescript
// ❌ Before
if (userAge > 18) { ... }
if (retryCount > 3) { ... }
setTimeout(callback, 5000)

// ✅ After
const MINIMUM_AGE = 18
const MAX_RETRY_COUNT = 3
const TIMEOUT_MS = 5000
```

### Rename to Clarify

```typescript
// ❌ Before
const d = new Date()
const r = data.filter(x => x.s === 'active')
const x = r.map(i => ({ ...i, ts: Date.now() }))

// ✅ After
const currentDate = new Date()
const activeUsers = users.filter(user => user.status === 'active')
const usersWithTimestamp = activeUsers.map(user => ({
  ...user,
  lastSeen: Date.now()
}))
```

### Simplify Conditionals

```typescript
// ❌ Before
if (user && user.isActive && user.hasPermission && !user.isLocked) {
  grantAccess()
}

// ✅ After
if (isEligibleForAccess(user)) {
  grantAccess()
}

function isEligibleForAccess(user: User): boolean {
  return user?.isActive && user?.hasPermission && !user?.isLocked
}
```

### Replace Switch with Object Map

```typescript
// ❌ Before
function getStatusLabel(status: Status): string {
  switch (status) {
    case 'pending': return 'Pending Approval'
    case 'approved': return 'Approved'
    case 'rejected': return 'Rejected'
    default: return 'Unknown'
  }
}

// ✅ After
const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected'
}

function getStatusLabel(status: Status): string {
  return STATUS_LABELS[status] ?? 'Unknown'
}
```

### Extract Try-Catch

```typescript
// ❌ Before
async function fetchUserData(id: string) {
  try {
    const user = await db.users.findOne(id)
    const profile = await db.profiles.findOne(user.profileId)
    const settings = await db.settings.findOne(user.settingsId)
    return { user, profile, settings }
  } catch (err) {
    logger.error(err)
    throw err
  }
}

// ✅ After
async function fetchUserData(id: string) {
  try {
    return await getAllUserData(id)
  } catch (err) {
    logger.error(err)
    throw err
  }
}

async function getAllUserData(id: string) {
  const user = await db.users.findOne(id)
  const profile = await db.profiles.findOne(user.profileId)
  const settings = await db.settings.findOne(user.settingsId)
  return { user, profile, settings }
}
```

### Replace Inheritance with Composition

```typescript
// ❌ Before - Tight coupling
class Dog extends Animal {}
class Cat extends Animal {}

// ✅ After - Composition
class Dog {
  constructor(walking: WalkingBehavior, barking: BarkingBehavior) {
    this.walking = walking
    this.barking = barking
  }
}
```

## Workflow

```bash
# 1. Verify tests exist and pass
npm test

# 2. Create branch
git checkout -b refactor/descriptive-name

# 3. Make ONE small change

# 4. Run tests
npm test

# 5. Commit
git commit -m "refactor: extract validateOrder function"

# 6. Repeat for next change
```

## Anti-Patterns

### ❌ Don't Do These

```typescript
// Refactor and change behavior at the same time
// Comment out code instead of deleting
// Make huge changes in one commit
// Skip tests
// Refactor without understanding
```

### ✅ Do These

```typescript
// Small, incremental changes
// Keep tests green
// Clear commit messages
// Document why
```

## Pre-Refactor Checklist

- [ ] Tests exist
- [ ] All tests pass
- [ ] Code is version controlled
- [ ] Understand what the code does
- [ ] Identify specific smells
- [ ] Plan changes
- [ ] Time limit set
