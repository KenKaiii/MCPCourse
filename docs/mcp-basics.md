# MCP Development Basics

## Overview
Model Context Protocol (MCP) allows AI assistants to access external tools and data sources through standardized interfaces.

## Core Concepts

### MCP Server Components
1. **Server Instance** - Main MCP server object with metadata
2. **Tools** - Functions that can be called by AI assistants  
3. **Transport** - Communication layer (stdio for command line)
4. **Request Handlers** - Functions that respond to MCP protocol messages

### Essential Request Types
- `ListToolsRequestSchema` - Returns available tools
- `CallToolRequestSchema` - Executes tool with parameters

## MCP Tool Structure
```typescript
{
  name: "tool_name",
  description: "Clear description of what this tool does",
  inputSchema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "Parameter description" },
      param2: { type: "number", description: "Parameter description" }
    },
    required: ["param1", "param2"]
  }
}
```

## Tool Response Format
```typescript
{
  content: [
    {
      type: "text",
      text: "Response text or result"
    }
  ]
}
```

## Error Response Format
```typescript
{
  content: [
    {
      type: "text", 
      text: `Error: ${errorMessage}`
    }
  ],
  isError: true
}
```

## What MCP Can Do
- Execute calculations and data processing
- Read/write files (with proper permissions)
- Make HTTP requests to APIs
- Process text, JSON, and structured data
- Perform system operations
- Connect to databases
- Run shell commands

## What MCP Cannot Do
- Access user's screen directly (use screenshot tools)
- Modify system settings without permission
- Access network resources not explicitly allowed
- Perform operations requiring interactive input
- Access secured APIs without proper authentication

## Key Principles
1. **Keep it simple** - Don't over-engineer tools
2. **Clear descriptions** - AI needs to understand what each tool does
3. **Input validation** - Always validate parameters with Zod
4. **Error handling** - Return user-friendly error messages
5. **Single responsibility** - Each tool should do one thing well