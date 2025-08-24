# Local MCP Server Testing Guide

## Overview
Before publishing or integrating an MCP server, it's essential to test it locally to ensure all functionality works correctly.

## Testing Methods

### 1. MCP Inspector (Recommended)
The official testing tool for MCP servers:

```bash
# Build the server first
npm run build

# Launch MCP Inspector
npm run inspector
# or
npx @modelcontextprotocol/inspector build/index.js
```

**What to test in Inspector:**
- [ ] Server initializes without errors
- [ ] All tools appear in the tools list
- [ ] Tool descriptions are clear and accurate
- [ ] Input schemas match your expectations
- [ ] Each tool executes successfully with valid inputs
- [ ] Error handling works for invalid inputs

### 2. Manual JSON-RPC Testing
For debugging and automated testing:

#### Server Initialization Test
```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}' | timeout 5s ./build/index.js
```

**Expected Response:**
```json
{"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"your-server-name","version":"1.0.0"}},"jsonrpc":"2.0","id":1}
```

#### Tool Listing Test
```bash
echo -e '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}\n{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}' | timeout 5s ./build/index.js
```

**Expected Response:**
- Array of tools with name, description, inputSchema
- Each tool should have required fields properly defined

#### Tool Execution Test
```bash
echo -e '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}\n{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "your_tool", "arguments": {"param": "value"}}}' | timeout 5s ./build/index.js
```

## Comprehensive Testing Checklist

### Pre-Test Setup
- [ ] `npm run build` completes successfully
- [ ] `build/index.js` exists and is executable (`ls -la build/`)
- [ ] No TypeScript compilation errors

### Initialization Tests
- [ ] Server starts without crashing
- [ ] Returns correct protocol version
- [ ] Server info matches package.json name/version
- [ ] Capabilities include tools: {}

### Tool Discovery Tests
- [ ] All expected tools are listed
- [ ] Tool names match case statements in code
- [ ] Descriptions are helpful and accurate
- [ ] Input schemas are properly formatted
- [ ] Required parameters are marked correctly

### Functional Tests
For each tool:
- [ ] Valid inputs produce expected outputs
- [ ] Output format matches MCP content structure
- [ ] Results are accurate and properly formatted
- [ ] Response time is reasonable (< 30 seconds)

### Error Handling Tests
- [ ] Invalid tool names return "Unknown tool" error
- [ ] Missing required parameters trigger validation errors
- [ ] Wrong parameter types are caught by Zod validation
- [ ] Business logic errors (e.g., division by zero) are handled
- [ ] All errors include `isError: true` flag
- [ ] Error messages are user-friendly

### Edge Case Tests
- [ ] Empty parameters object
- [ ] Null/undefined values where not expected
- [ ] Very large numbers or strings
- [ ] Special characters in string inputs
- [ ] Boundary values (e.g., negative numbers for sqrt)

## Sample Test Scripts

### Basic Functionality Test
```bash
#!/bin/bash
# Test script for calculator MCP

echo "Testing MCP Calculator Server..."

# Test 1: Initialization
echo "1. Testing initialization..."
INIT_RESULT=$(echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}' | timeout 5s ./build/index.js)
if [[ $INIT_RESULT == *"calculator-mcp-server"* ]]; then
    echo "✅ Initialization successful"
else
    echo "❌ Initialization failed"
fi

# Test 2: Addition
echo "2. Testing addition..."
ADD_RESULT=$(echo -e '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}\n{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "add", "arguments": {"a": 5, "b": 3}}}' | timeout 5s ./build/index.js)
if [[ $ADD_RESULT == *"5 + 3 = 8"* ]]; then
    echo "✅ Addition working"
else
    echo "❌ Addition failed"
fi

# Test 3: Error handling
echo "3. Testing error handling..."
ERROR_RESULT=$(echo -e '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}\n{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "divide", "arguments": {"a": 10, "b": 0}}}' | timeout 5s ./build/index.js)
if [[ $ERROR_RESULT == *"Cannot divide by zero"* ]]; then
    echo "✅ Error handling working"
else
    echo "❌ Error handling failed"
fi

echo "Testing complete!"
```

### Performance Test
```bash
#!/bin/bash
# Performance test for MCP server

echo "Performance testing..."
start_time=$(date +%s.%3N)

for i in {1..10}; do
    echo -e '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test", "version": "1.0.0"}}}\n{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "add", "arguments": {"a": '$i', "b": '$i'}}}' | timeout 5s ./build/index.js > /dev/null
done

end_time=$(date +%s.%3N)
duration=$(echo "$end_time - $start_time" | bc)
echo "10 operations completed in ${duration}s"
```

## Common Testing Issues

### Server Won't Start
- Check build completed: `npm run build`
- Verify executable permissions: `chmod 755 build/index.js`
- Look for TypeScript errors in build output

### Tools Not Listed
- Check `ListToolsRequestSchema` handler is registered
- Verify tools array is properly formatted
- Ensure no syntax errors in tools definition

### Tool Execution Fails
- Verify tool name in `CallToolRequestSchema` switch statement
- Check Zod schema matches tool inputSchema
- Add console.error() debugging for troubleshooting

### Timeout Issues
- Increase timeout value in commands
- Check for infinite loops in tool logic
- Ensure server doesn't wait for user input

## Integration Testing

### With Claude Code
```bash
# After local testing passes:
# 1. Publish to NPM
npm publish

# 2. Add to Claude Code (in different terminal)
claude mcp add npx your-package-name -s user

# 3. Restart Claude Code
# Ctrl+C twice, then: claude --continue

# 4. Test tools are available in Claude Code
```

### Testing Workflow
1. **Unit test** each tool individually
2. **Integration test** with MCP Inspector
3. **Performance test** with multiple rapid calls
4. **Error test** all edge cases
5. **End-to-end test** with Claude Code

## Best Practices

- **Test early and often** during development
- **Automate testing** with scripts for regression testing
- **Test all error conditions** not just happy path
- **Use realistic data** in tests
- **Document test cases** for future reference
- **Test on clean system** to verify all dependencies included