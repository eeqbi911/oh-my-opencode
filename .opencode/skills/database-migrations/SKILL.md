---
name: database-migrations
description: Database migration strategies and patterns for PostgreSQL, MySQL, and MongoDB. Use when implementing schema changes or data migrations.
origin: oh-my-opencode
---

# Database Migrations Skill

## When to Activate

- Adding new tables or columns
- Changing existing schema
- Rolling back problematic migrations
- Data migration between versions

## Migration Tools

| Database | Tools |
|----------|-------|
| PostgreSQL | Prisma, Drizzle, Flyway, goose |
| MySQL | Prisma, Sequelize, Flyway |
| MongoDB | Prisma, Mongoose migrations |

## Prisma Migrations

```prisma
// schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  posts Post[]
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
}
```

```bash
# Create migration
npx prisma migrate dev --name add_user_table

# Apply in production
npx prisma migrate deploy
```

## Safe Migrations

### Add Column (Safe)

```sql
-- Add nullable column first
ALTER TABLE users ADD COLUMN bio TEXT;

-- Backfill data
UPDATE users SET bio = 'Default bio' WHERE bio IS NULL;

-- Add NOT NULL constraint (after backfill)
ALTER TABLE users ALTER COLUMN bio SET NOT NULL;
```

### Rename Column (Safe)

```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN display_name VARCHAR(255);

-- Step 2: Backfill
UPDATE users SET display_name = name;

-- Step 3: Swap references in app code

-- Step 4: Drop old column
ALTER TABLE users DROP COLUMN name;
```

### Drop Column (Safe)

```sql
-- Step 1: Remove all references in app code
-- Step 2: Deploy
-- Step 3: Drop column (in separate migration)
ALTER TABLE users DROP COLUMN old_field;
```

## Dangerous Operations

| Operation | Risk | Mitigation |
|-----------|------|------------|
| DROP TABLE | Data loss | Always backup first |
| DROP COLUMN | App breakage | Remove code references first |
| Rename | App breakage | Add new, migrate, remove old |
| Change type | Data loss | Use USING clause |

## Rollback Strategy

```typescript
// migrations/20240101_add_user_index.ts
export async function up(db) {
  await db.query(`
    CREATE INDEX idx_users_email ON users(email);
  `)
}

export async function down(db) {
  await db.query(`
    DROP INDEX idx_users_email;
  `)
}
```

## Data Migrations

```typescript
// Run as separate migration after schema change
export async function migrateUserData(db) {
  const batchSize = 1000
  let lastId = ''
  
  while (true) {
    const users = await db.query(`
      SELECT id, old_field 
      FROM users 
      WHERE id > $1 
      ORDER BY id 
      LIMIT $2
    `, [lastId, batchSize])
    
    if (users.length === 0) break
    
    for (const user of users) {
      await db.query(`
        UPDATE users 
        SET new_field = $1 
        WHERE id = $2
      `, [transformOldToNew(user.old_field), user.id])
    }
    
    lastId = users[users.length - 1].id
  }
}
```

## Migration Checklist

- [ ] Backup database before production migration
- [ ] Test migration on staging environment
- [ ] Ensure migration is idempotent
- [ ] Plan rollback strategy
- [ ] Schedule during low-traffic period
- [ ] Monitor after deployment
