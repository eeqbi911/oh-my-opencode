---
name: docker-patterns
description: Docker and containerization best practices including multi-stage builds, security, and docker-compose patterns.
origin: oh-my-opencode
---

# Docker Patterns Skill

## When to Activate

- Writing Dockerfiles
- Setting up docker-compose
- Optimizing container builds
- Troubleshooting container issues

## Multi-Stage Builds

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Security Best Practices

```dockerfile
# Use specific versions, not 'latest'
FROM node:20-alpine:3.19

# Create non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

# Copy files as root, then change ownership
COPY --chown=appuser:appgroup . .

# Set user
USER appuser

# Read-only filesystem
VOLUME ["/app/data"]
```

## Docker Compose Patterns

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped
    networks:
      - backend

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

volumes:
  postgres_data:

networks:
  backend:
    driver: bridge

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

## Common Patterns

### Node.js Optimization

```dockerfile
# Best practices for Node.js
FROM node:20-alpine

# Use production dependencies only
RUN npm ci --only=production --ignore-scripts

# Set NODE_ENV
ENV NODE_ENV=production

# Use node user
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
```

### Python Optimization

```dockerfile
FROM python:3.12-slim

# Install dependencies first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Use virtual environment
ENV PATH="/opt/venv/bin:$PATH"
RUN python -m venv /opt/venv

CMD ["python", "main.py"]
```

## Debugging

```bash
# View logs
docker logs <container>

# Interactive shell
docker exec -it <container> sh

# Check resource usage
docker stats

# Inspect network
docker network inspect <network>

# Copy files from container
docker cp <container>:/path/to/file ./local/path
```

## Dockerignore

```gitignore
# Dependencies
node_modules
__pycache__
*.pyc

# Build output
dist
build

# Git
.git
.gitignore

# IDE
.vscode
.idea

# Environment
.env
.env.*

# Logs
*.log
logs

# Misc
*.md
README*
