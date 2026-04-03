---
name: security-review
description: Security-focused code review for OWASP Top 10 vulnerabilities, secrets detection, and secure coding practices. Use when security is a concern or before production deployment.
origin: oh-my-opencode
---

# Security Review Skill

## When to Activate

- Before production deployment
- User asks for security review
- Working with authentication/authorization
- Handling user data
- Payment or financial transactions

## OWASP Top 10 Checklist

### 1. Broken Access Control

- [ ] Users can only access their own data
- [ ] Admin routes protected
- [ ] API endpoints validate permissions
- [ ] IDOR prevention (don't trust user-supplied IDs)

### 2. Cryptographic Failures

- [ ] Sensitive data encrypted at rest
- [ ] HTTPS used everywhere
- [ ] Strong encryption algorithms (AES-256, RSA-2048+)
- [ ] No weak crypto in use (MD5, SHA1 for passwords)

### 3. Injection

- [ ] Parameterized queries for SQL
- [ ] Input sanitization for user data
- [ ] No `eval()` with user input
- [ ] Output encoding for XSS prevention

### 4. Insecure Design

- [ ] Threat modeling done
- [ ] Security boundaries defined
- [ ] Rate limiting implemented
- [ ] Account lockout policies

### 5. Security Misconfiguration

- [ ] Default credentials changed
- [ ] Debug mode off in production
- [ ] Error messages don't leak stack traces
- [ ] Unnecessary features disabled

### 6. Vulnerable Components

- [ ] Dependencies up to date
- [ ] No known CVEs in dependencies
- [ ] Unused dependencies removed

### 7. Authentication Failures

- [ ] Strong password policies
- [ ] MFA available
- [ ] Session timeout configured
- [ ] Secure session tokens

### 8. Software Integrity Failures

- [ ] Code signed where needed
- [ ] CI/CD pipeline secured
- [ ] No reliance on untrusted CDNs

### 9. Logging & Monitoring

- [ ] Security events logged
- [ ] Logs don't contain sensitive data
- [ ] Monitoring for attacks
- [ ] Alert thresholds set

### 10. SSRF Protection

- [ ] URL validation for user-provided URLs
- [ ] Block localhost and private IPs
- [ ] Use allowlists for destinations

## Secrets Detection Patterns

Check for these leaked secrets:

```regex
# API Keys
AKIA[0-9A-Z]{16}
sk-[0-9a-zA-Z]{48}
ghp_[0-9a-zA-Z]{36}

# Private Keys
-----BEGIN (RSA|DSA|EC) PRIVATE KEY-----

# JWT Tokens
eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+

# Database URLs
mongodb://
postgres://
mysql://
redis://

# AWS
aws_access_key_id
aws_secret_access_key
```

## Secure Coding Guidelines

### Input Validation

```typescript
// ✅ Good: Validate and sanitize
const sanitizeInput = (input: string) => {
  return input.trim().replace(/[<>]/g, '')
}

// ❌ Bad: Trust user input
const query = `SELECT * FROM users WHERE id = ${userId}`
```

### Authentication

```typescript
// ✅ Good: Use established auth libraries
import { hash, verify } from 'argon2'

// ❌ Bad: Roll your own crypto
const hash = (password) => md5(password + "salt")
```

### Error Handling

```typescript
// ✅ Good: Generic errors in production
catch (err) {
  logger.error(err)
  return res.status(500).json({ error: 'Internal server error' })
}

// ❌ Bad: Stack traces in responses
catch (err) {
  res.status(500).json({ error: err.stack })
}
```

## Security Scan Commands

```bash
# Check for secrets in code
npx gitLeaks --path .

# Dependency vulnerabilities
npm audit --audit-level=high

# Scan for known CVEs
npx snyk test

# Check Docker security
docker scout cves image:tag
```

## Security Headers

For web applications, ensure these headers:

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
X-XSS-Protection: 1; mode=block
```
