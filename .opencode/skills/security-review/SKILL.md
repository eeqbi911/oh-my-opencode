---
name: security-review
description: Security-focused code review for OWASP Top 10 vulnerabilities, secrets detection, and secure coding practices. Use when security is a concern or before production deployment.
origin: oh-my-opencode
version: 1.1
---

# Security Review Skill

## When to Activate

- Before production deployment
- User asks for security review
- Working with authentication/authorization
- Handling user data
- Payment or financial transactions
- New external integrations

## Security Review Mindset

> **Defense in Depth** - Never rely on a single security measure.

## OWASP Top 10 Checklist

### 1. Broken Access Control

- [ ] Users can only access their own data
- [ ] Admin routes properly protected
- [ ] API endpoints validate permissions
- [ ] IDOR prevented (don't trust user-supplied IDs)

```typescript
// ❌ Vulnerable - IDOR
app.get('/orders/:id', (req, res) => {
  const order = db.orders.find(req.params.id)
  res.json(order)  // Anyone can access any order!
})

// ✅ Secure
app.get('/orders/:id', auth.required, (req, res) => {
  const order = db.orders.findOne({
    id: req.params.id,
    userId: req.user.id  // Only owner can access
  })
  if (!order) return res.status(404).json({ error: 'Not found' })
  res.json(order)
})
```

### 2. Cryptographic Failures

- [ ] Sensitive data encrypted at rest
- [ ] HTTPS used everywhere
- [ ] Strong encryption (AES-256, RSA-2048+)
- [ ] No weak crypto (MD5, SHA1 for passwords)
- [ ] Secure random number generation

```typescript
// ❌ Never do this
const hash = md5(password)  // MD5 is broken!
const hash = sha1(data)      // SHA1 is broken!

// ✅ Do this
const hash = await bcrypt.hash(password, 12)  // bcrypt
const hash = await argon2.hash(password)     // argon2
```

### 3. Injection

- [ ] Parameterized queries for SQL
- [ ] Input sanitization for user data
- [ ] No `eval()` with user input
- [ ] Output encoding for XSS prevention

```typescript
// ❌ SQL Injection vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`
db.query(query)

// ✅ Parameterized query
const query = 'SELECT * FROM users WHERE id = $1'
db.query(query, [userId])

// ❌ XSS vulnerable
res.send(`<div>${userInput}</div>`)

// ✅ Safe - output encoding
import escapeHtml from 'escape-html'
res.send(`<div>${escapeHtml(userInput)}</div>`)
```

### 4. Insecure Design

- [ ] Threat modeling done
- [ ] Security boundaries defined
- [ ] Rate limiting implemented
- [ ] Account lockout policies

```typescript
// Rate limiting
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
})

app.use('/api/', limiter)
```

### 5. Security Misconfiguration

- [ ] Default credentials changed
- [ ] Debug mode off in production
- [ ] Error messages don't leak stack traces
- [ ] Unnecessary features disabled

```typescript
// ❌ Production misconfiguration
app.use(helmet())  // Good, but...
app.get('/debug', (req, res) => {
  res.json({ memory: process.memoryUsage() })  // Debug endpoint!
})

// ✅ Secure
if (process.env.NODE_ENV !== 'production') {
  // Only in development
}

// Error handling - don't leak details
app.use((err, req, res, next) => {
  logger.error(err)  // Log full error
  res.status(500).json({ error: 'Internal server error' })  // Generic message
})
```

### 6. Vulnerable Components

- [ ] Dependencies up to date
- [ ] No known CVEs in dependencies
- [ ] Unused dependencies removed

```bash
# Check for vulnerabilities
npm audit
npx snyk test

# Update vulnerable packages
npm audit fix
```

### 7. Authentication Failures

- [ ] Strong password policies enforced
- [ ] MFA available
- [ ] Session timeout configured
- [ ] Secure session tokens
- [ ] Password reset flow secure

```typescript
// ✅ Strong password policy
const isStrongPassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&    // uppercase
    /[a-z]/.test(password) &&   // lowercase
    /[0-9]/.test(password) &&   // number
    /[!@#$%^&*]/.test(password)   // special char
  )
}

// ✅ Secure session
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JS access
    sameSite: 'strict', // CSRF protection
    maxAge: 3600000    // 1 hour
  }
}))
```

### 8. Software Integrity Failures

- [ ] Code signed where needed
- [ ] CI/CD pipeline secured
- [ ] No reliance on untrusted CDNs

```html
<!-- ❌ Untrusted CDN -->
<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>

<!-- ✅ Trusted CDN with SRI -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"
  integrity="sha384-nvAaC+Vb..."
  crossorigin="anonymous"></script>
```

### 9. Logging & Monitoring

- [ ] Security events logged
- [ ] Logs don't contain sensitive data
- [ ] Monitoring for attacks
- [ ] Alert thresholds set

```typescript
// ✅ Log security events (not sensitive data)
logger.info('Login attempt', {
  userId: user.id,
  ip: req.ip,
  userAgent: req.get('User-Agent'),
  timestamp: new Date()
})

// ❌ Never log this
logger.info('User logged in', { password: user.password })  // NO!
```

### 10. SSRF Protection

- [ ] URL validation for user-provided URLs
- [ ] Block localhost and private IPs
- [ ] Use allowlists for destinations

```typescript
// ❌ SSRF vulnerable
app.get('/fetch', async (req, res) => {
  const response = await fetch(req.query.url)  // User controls URL!
  res.json(response)
})

// ✅ SSRF protected
import { isPublic } from 'ip-analyze'

app.get('/fetch', async (req, res) => {
  const url = new URL(req.query.url)

  // Block private IPs, localhost
  if (!isPublic(url.hostname)) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  // Allowlist
  const allowedHosts = ['api.example.com', 'cdn.trusted.com']
  if (!allowedHosts.includes(url.hostname)) {
    return res.status(400).json({ error: 'URL not allowed' })
  }

  const response = await fetch(url.toString())
  res.json(response)
})
```

## Secrets Detection Patterns

```regex
# AWS Keys
AKIA[0-9A-Z]{16}
aws_access_key_id
aws_secret_access_key

# GitHub Tokens
ghp_[0-9a-zA-Z]{36}
github_pat_[0-9a-zA-Z_]{22,}

# Private Keys
-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----

# API Keys
api[_-]?key[_-]?[0-9a-zA-Z]{16,}
secret[_-]?key

# JWT Tokens
eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+

# Database URLs
(mongodb|postgres|mysql|redis)://[^@]+@

# Slack Tokens
xox[baprs]-[0-9a-zA-Z-]+

# Discord Tokens
[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27}
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

# OWASP ZAP (DAST)
npx zaproxy https://your-app.com
```

## Security Headers

For web applications, ensure these headers:

```typescript
import helmet from 'helmet'

app.use(helmet())

// Specific headers:
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'trusted-cdn.com'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://api.yoursite.com"]
  }
}))

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})
```

## Input Validation

```typescript
import { z } from 'zod'

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Need uppercase'),
  age: z.number().min(13).max(120).optional()
})

// Validate
const result = UserSchema.safeParse(userInput)
if (!result.success) {
  return res.status(400).json({ errors: result.error.flatten() })
}
```

## Secure Coding Checklist

- [ ] All user input validated
- [ ] All user input sanitized on output
- [ ] Parameterized queries used
- [ ] No secrets in code
- [ ] No secrets in logs
- [ ] HTTPS enforced
- [ ] Strong encryption for sensitive data
- [ ] Rate limiting on public endpoints
- [ ] Security headers configured
- [ ] Dependencies audited
- [ ] Error messages generic
- [ ] Sessions secure
- [ ] Access controls tested
