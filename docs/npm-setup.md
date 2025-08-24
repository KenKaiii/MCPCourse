# NPM Setup and Publishing Guide

## Pre-Publishing Checklist

### 1. NPM Account Setup
**INSTRUCTION FOR USER**: Before proceeding, you need an NPM account:
1. Go to https://www.npmjs.com/signup
2. Create account with username, email, password
3. Verify email address
4. Run `npm login` in terminal and enter credentials
5. Confirm with: `npm whoami` (should show your username)

**ASK USER**: "Have you completed NPM account setup and logged in? Type 'yes' when ready to continue."

### 2. Package.json Configuration
Required fields for NPM publishing:
- `name` - Unique package name (check availability with `npm view package-name`)
- `version` - Semantic version (start with 1.0.0)  
- `description` - Clear package description
- `author` - Your name and email
- `license` - Recommended: MIT
- `repository` - GitHub repo URL
- `keywords` - For discoverability
- `bin` - For executable packages
- `files` - What to include in package

### 3. Package Name Guidelines
- Use kebab-case: `mcp-my-tool-server`
- Must be unique on NPM registry
- Check availability: `npm view your-package-name`
- Consider scoped packages: `@username/package-name`

## Publishing Process

### 1. Pre-publish Steps
```bash
# Build the project
npm run build

# Test locally
npm pack
# This creates a .tgz file - test it locally before publishing
```

### 2. Version Management
```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0) 
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

### 3. Publishing
```bash
# Publish to NPM registry
npm publish

# For scoped packages (first time)
npm publish --access public
```

### 4. Post-publish Verification
```bash
# Check package exists
npm view your-package-name

# Test installation
npm install -g your-package-name

# Test executable (if applicable)
your-command-name --help
```

## Common Issues and Solutions

### "Package already exists"
- Choose different name or use scoped package `@username/package-name`
- Check existing package: `npm view package-name`

### "Authentication required" 
- Run `npm login` again
- Check credentials with `npm whoami`

### "Permission denied"
- For scoped packages, add `--access public`
- Check package.json permissions

### Files not included in package
- Update `files` array in package.json
- Use `npm pack` to preview package contents

## Best Practices

1. **Always test locally first** with `npm pack`
2. **Use semantic versioning** properly
3. **Include clear README** with installation/usage
4. **Add keywords** for discoverability  
5. **Set license** (MIT recommended for open source)
6. **Include repository URL** for source code access