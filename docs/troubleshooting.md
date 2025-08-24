# MCP Troubleshooting and Best Practices

## Common Build Issues

### TypeScript Compilation Errors
**Problem**: `error TS2307: Cannot find module '@modelcontextprotocol/sdk'`
**Solution**: Run `npm install` to install dependencies

**Problem**: `error TS5023: Unknown compiler option`
**Solution**: Remove comments from tsconfig.json (TypeScript doesn't support `//` comments)

**Problem**: Build succeeds but executable doesn't work
**Solution**: Check `chmod 755 build/index.js` is in build script

### NPM Publishing Issues

**Problem**: "Package already exists"
**Solution**: 
- Choose unique name: `npm view your-package-name` to check availability
- Use scoped package: `@username/package-name`

**Problem**: "Authentication required"
**Solution**: Run `npm login` and verify with `npm whoami`

**Problem**: Published package doesn't work when installed
**Solution**: 
- Check `files` array includes `build/` folder
- Verify `bin` field points to correct executable
- Test locally with `npm pack` first

## Claude Code Integration Issues

### MCP Not Working After Installation
**Problem**: Added MCP with `claude mcp add` but tools not available
**Solution**: Restart Claude Code completely:
1. Press `Ctrl+C` twice to stop
2. Run `claude --continue` to restart

**Problem**: "Command not found" error
**Solution**: 
- Ensure package published to NPM correctly
- Check package name matches exactly
- Try global install: `npm install -g your-package`

### MCP Inspector Issues
**Problem**: Inspector shows "Server failed to start"
**Solution**:
- Check build folder exists: `npm run build`
- Verify executable permissions: `ls -la build/index.js`
- Test with: `node build/index.js` (should not exit immediately)

## Runtime Issues

### Tool Validation Errors
**Problem**: "Invalid arguments" errors
**Solution**:
- Check Zod schema matches inputSchema in tool definition
- Ensure required fields are marked in both places
- Test with simple inputs first

**Problem**: Tools return unexpected results
**Solution**:
- Add error logging: `console.error()` goes to stderr
- Use MCP Inspector to test tools individually
- Validate input parameters before processing

### Server Communication Issues
**Problem**: Server starts but no tools listed
**Solution**:
- Check `ListToolsRequestSchema` handler is registered
- Verify tools array is not empty
- Ensure tool objects have required fields: name, description, inputSchema

**Problem**: Tools listed but execution fails  
**Solution**:
- Check `CallToolRequestSchema` handler is registered
- Verify switch statement includes all tool names
- Add default case with error message

## Best Practices for Development

### 1. Development Workflow
```bash
# Start with clean build
npm run build

# Use inspector for testing
npm run inspector

# Test individual tools thoroughly

# Only publish after complete testing
npm publish
```

### 2. Error Handling Patterns
```typescript
// Always wrap tool logic in try-catch
try {
  const result = await someOperation();
  return { content: [{ type: "text", text: result }] };
} catch (error) {
  return {
    content: [{ type: "text", text: `Error: ${error.message}` }],
    isError: true
  };
}
```

### 3. Input Validation
```typescript
// Define schema first
const schema = z.object({
  param1: z.string().min(1),
  param2: z.number().positive()
});

// Parse and handle validation errors
try {
  const { param1, param2 } = schema.parse(args);
} catch (error) {
  throw new Error(`Invalid parameters: ${error.message}`);
}
```

### 4. Tool Design Principles
- **Single responsibility**: Each tool does one thing well
- **Clear naming**: Use descriptive tool and parameter names  
- **Good defaults**: Provide sensible defaults for optional parameters
- **Helpful errors**: Return specific error messages that help users

### 5. Testing Checklist
- [ ] Build completes without errors
- [ ] MCP Inspector shows all tools
- [ ] Each tool executes successfully with valid inputs
- [ ] Invalid inputs return helpful error messages
- [ ] Package installs and runs globally
- [ ] Claude Code integration works after restart

## Performance Considerations

### Memory Usage
- Use streams for large data processing
- Clean up resources in error cases
- Avoid loading large files into memory at once

### Response Time
- Keep tool execution under 30 seconds
- For long operations, consider breaking into smaller tools
- Return progress updates for long-running tasks

### Resource Management
- Close file handles and database connections
- Use connection pooling for databases
- Implement timeouts for external API calls

## Security Best Practices

### Input Sanitization
- Always validate user inputs with Zod
- Sanitize file paths to prevent directory traversal
- Validate URLs before making HTTP requests

### Permissions
- Request minimal required permissions
- Document what external resources are accessed
- Never hardcode API keys or credentials

### Error Information
- Don't expose internal system details in errors
- Log sensitive errors to stderr, not tool responses
- Use generic error messages for security-sensitive operations