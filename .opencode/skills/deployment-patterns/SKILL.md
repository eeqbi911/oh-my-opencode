---
name: deployment-patterns
description: Deployment and CI/CD best practices including blue-green deployments, canary releases, and rollback strategies.
origin: oh-my-opencode
---

# Deployment Patterns Skill

## When to Activate

- Setting up CI/CD pipelines
- Planning production deployments
- Implementing rollback strategies
- Setting up monitoring and alerting

## Deployment Strategies

### 1. Blue-Green Deployment

```
[Blue Environment]  [Green Environment]
     prod v1              prod v2 (new)
     
Traffic → Blue (100%)     Green (0%)
               ↓
          Switch traffic
               ↓
[Blue Environment]  [Green Environment]
     standby              active
     prod v1              prod v2
```

**Advantages:**
- Instant rollback capability
- Zero downtime deployments
- Easy testing before full traffic switch

**Disadvantages:**
- Double infrastructure cost
- Database sync complexity

### 2. Canary Deployment

```
Traffic split:
90% → v1 (current)
10% → v2 (new)
      ↓
Monitor for errors
      ↓
Gradual increase: 10% → 50% → 100%
```

**Best for:**
- Large-scale systems
- High-risk changes
- A/B testing scenarios

### 3. Rolling Deployment

```
v1 v1 v1 → v1 v1 v2 → v1 v2 v2 → v2 v2 v2

Gradually replace instances with new version
```

**Best for:**
- Kubernetes deployments
- Stateless services
- Resource-constrained environments

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm run deploy:staging
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - run: npm run deploy:production
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

## Rollback Strategy

### Automated Rollback Triggers

```yaml
monitoring:
  error_threshold: 1%  # Rollback if errors exceed 1%
  latency_threshold: 500ms  # Rollback if p99 > 500ms
  
rollback:
  automatic: true
  cooldown: 5m
```

### Manual Rollback

```bash
# Kubernetes
kubectl rollout undo deployment/app

# Docker Swarm
docker service rollback app

# AWS ECS
aws ecs update-service \
  --service app \
  --task-definition app:previous
```

## Health Checks

```yaml
# Kubernetes liveness/readiness probes
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 10
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  failureThreshold: 3
```

## Environment Strategy

```
┌─────────────────────────────────────────┐
│              Production                  │
│  - Real data                            │
│  - Full monitoring                       │
│  - Blue-green or canary                 │
└─────────────────────────────────────────┘
                    ↑
┌─────────────────────────────────────────┐
│               Staging                   │
│  - Production snapshot (anonymized)     │
│  - Full testing                         │
│  - Pre-production validation             │
└─────────────────────────────────────────┘
                    ↑
┌─────────────────────────────────────────┐
│             Preview/QA                   │
│  - Feature branches                     │
│  - Integration testing                  │
│  - Stakeholder review                   │
└─────────────────────────────────────────┘
```

## Secrets Management

```yaml
# Use secrets manager, never env files in repo
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  DATABASE_URL: {{ .Values.database.url }}
  API_KEY: {{ .Values.secrets.apiKey }}
```

## Deployment Checklist

- [ ] Tests passing in CI
- [ ] Database migrations tested
- [ ] Feature flags configured
- [ ] Monitoring dashboards ready
- [ ] Runbook updated
- [ ] Team notified
- [ ] Rollback plan confirmed
- [ ] Backup verified
