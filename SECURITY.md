# 🔐 SECURITY GUIDELINES FOR CLAUDE CODE

## CRITICAL RULES - NEVER VIOLATE THESE

### 1. NEVER Commit Sensitive Data
- **NEVER hardcode passwords** - Not even "test", "password123", or "example" passwords
- **NEVER commit API keys, tokens, or secrets** to any file
- **NEVER include real credentials** in:
  - Documentation (README, CLAUDE.md, etc.)
  - Test scripts or seed files  
  - Comments or example code
  - Configuration files
  - Git commit messages

### 2. Always Use Secure Practices
- **ALWAYS use placeholders** like `[your-password]` or `<password>` in documentation
- **ALWAYS use environment variables** for sensitive data
- **ALWAYS check every file** before committing for exposed credentials
- **ALWAYS hash passwords** with bcrypt or similar before storing
- **NEVER log passwords**, even hashed ones

### 3. Before Every Commit
- Review ALL changed files for passwords or secrets
- Check for hardcoded credentials in:
  - Source code
  - Configuration files
  - Documentation
  - Test files
  - Scripts
- Replace any found credentials with environment variables

### 4. Password Requirements
- Never store passwords in plain text
- Always hash with bcrypt (minimum 10 rounds)
- Enforce strong password requirements
- Use secure random generation for tokens
- Implement rate limiting on auth endpoints

### 5. API Security
- Always validate and sanitize inputs
- Use parameterized queries (no SQL injection)
- Implement proper CORS policies
- Use HTTPS in production
- Add rate limiting to prevent abuse
- Validate file uploads (type, size, content)

## Common Mistakes to Avoid

1. **Hardcoding test credentials** - Even for development, use env variables
2. **Committing .env files** - Always add to .gitignore
3. **Logging sensitive data** - Never log passwords, tokens, or personal info
4. **Weak password policies** - Always enforce strong passwords
5. **Exposed error messages** - Never reveal system details in errors

## If a Security Mistake Happens

1. **Immediately rotate** all exposed credentials
2. **Remove from git history** if possible
3. **Notify affected users** if production data exposed
4. **Review and update** security practices
5. **Add additional checks** to prevent recurrence

## Environment Variables

Always use environment variables for:
- Database credentials
- API keys and secrets
- JWT secrets
- Admin passwords
- Third-party service tokens
- Email service credentials

Example:
```javascript
// ❌ WRONG
const password = "6809Timer";

// ✅ CORRECT  
const password = process.env.ADMIN_PASSWORD;
```

## Remember

**Security is not optional.** Every commit should be reviewed for security issues. When in doubt, use environment variables and never hardcode sensitive information.