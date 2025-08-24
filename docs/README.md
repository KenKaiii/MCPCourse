# MCP Development Documentation

This documentation is optimized for LLM consumption to help create MCP servers efficiently.

## Quick Reference

### Essential Files to Read
1. **[mcp-basics.md](./mcp-basics.md)** - Core MCP concepts and capabilities
2. **[project-structure.md](./project-structure.md)** - Project templates and patterns  
3. **[npm-setup.md](./npm-setup.md)** - NPM publishing workflow
4. **[troubleshooting.md](./troubleshooting.md)** - Common issues and solutions
5. **[local-testing.md](./local-testing.md)** - Local testing methods and best practices

## Development Workflow for LLMs

### 1. Project Setup
```bash
mkdir mcp-your-tool-server
cd mcp-your-tool-server
npm init -y
# Copy package.json template from project-structure.md
# Copy tsconfig.json template from project-structure.md  
npm install
```

### 2. Implementation
- Use server template from project-structure.md
- Follow patterns in mcp-basics.md
- Implement tools with proper validation

### 3. Testing and Publishing
- Test with MCP Inspector: `npm run inspector`
- Follow npm-setup.md for publishing
- Reference troubleshooting.md for issues

## Key Reminders for LLMs

### NPM Publishing Requirements
- **ALWAYS ask user**: "Have you completed NPM account setup and logged in?" before publishing
- User must run `npm login` and verify with `npm whoami`
- Check package name availability with `npm view package-name`

### Claude Code Integration
- Installation: `claude mcp add <name> npx -s user <package-name>`
- **Critical**: Must restart Claude Code after adding MCP (Ctrl+C twice, then `claude --continue`)

### Common Patterns
- Use Zod for ALL input validation
- Wrap tool logic in try-catch blocks
- Return `isError: true` for error responses
- Keep tools simple and focused
- Use clear, descriptive tool names and descriptions
- **Format responses beautifully** with emojis and markdown (see calculator example)
- Clean up ugly validation errors for users

### File Structure Checklist
- [ ] src/index.ts (main server)
- [ ] package.json (NPM config)
- [ ] tsconfig.json (TypeScript config)  
- [ ] .gitignore (ignore node_modules, build)
- [ ] README.md (user documentation)
- [ ] RESPONSE_FORMATTING.md (optional - for beautiful responses)

## Templates and Examples

All templates are provided in the respective documentation files:
- Server template: project-structure.md
- Package.json template: project-structure.md
- Tool validation patterns: mcp-basics.md
- Error handling: troubleshooting.md

## Success Criteria

Before considering an MCP complete:
- [ ] Builds without TypeScript errors
- [ ] All tools work in MCP Inspector
- [ ] Package publishes to NPM successfully  
- [ ] Works in Claude Code after restart
- [ ] Error handling covers edge cases
- [ ] Documentation is clear and complete