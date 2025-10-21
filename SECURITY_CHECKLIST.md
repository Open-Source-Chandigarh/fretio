# Security Checklist

## Pre-Commit Security Checks

Before committing any code, ensure you've completed these security checks:

### ✅ Environment Variables
- [ ] No hardcoded API keys, tokens, or secrets in code
- [ ] All sensitive data uses environment variables
- [ ] `.env` file is in `.gitignore`
- [ ] `.env.example` file exists with placeholder values

### ✅ Configuration Files
- [ ] No real credentials in documentation files
- [ ] No real URLs or project IDs in markdown files
- [ ] All examples use placeholder values
- [ ] Test files with credentials are in `.gitignore`

### ✅ Code Review
- [ ] No console.log statements with sensitive data
- [ ] No hardcoded database URLs
- [ ] No hardcoded email credentials
- [ ] No hardcoded cloud provider keys

### ✅ Documentation
- [ ] All setup guides use placeholder values
- [ ] No real project URLs in documentation
- [ ] No real API keys in examples
- [ ] All sensitive information is clearly marked as placeholders

## Common Security Issues to Avoid

### ❌ Never Commit These:
- Real Supabase URLs (use `YOUR_PROJECT_ID.supabase.co`)
- Real API keys (use `your-api-key-here`)
- Real database credentials
- Real email passwords
- Real cloud provider keys
- Real phone numbers or personal information

### ✅ Always Use These:
- Environment variables for sensitive data
- Placeholder values in documentation
- Generic examples in setup guides
- `.env.example` files for reference

## Quick Commands

### Check for potential secrets:
```bash
# Search for common secret patterns
grep -r "sk-" . --exclude-dir=node_modules
grep -r "eyJ" . --exclude-dir=node_modules
grep -r "supabase.co" . --exclude-dir=node_modules
```

### Verify .gitignore:
```bash
# Check if sensitive files are ignored
git check-ignore .env
git check-ignore test-email.js
```

## Emergency Response

If you accidentally commit sensitive data:

1. **Immediately** remove the sensitive data from the file
2. **Force push** to remove the commit from history (if possible)
3. **Rotate** any exposed credentials
4. **Review** all recent commits for similar issues
5. **Update** `.gitignore` to prevent future issues

## Resources

- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)
- [Environment Variables Guide](https://vitejs.dev/guide/env-and-mode.html)
- [Git Security Best Practices](https://git-scm.com/docs/gitignore)
