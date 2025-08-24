# MCP Project Structure and Patterns

## Standard MCP Project Layout
```
mcp-your-tool-server/
├── src/
│   └── index.ts          # Main server implementation
├── docs/                 # LLM-optimized documentation
├── build/                # Compiled JavaScript (auto-generated)
├── node_modules/         # Dependencies (auto-generated)
├── package.json          # NPM configuration
├── package-lock.json     # Dependency lock (auto-generated)
├── tsconfig.json         # TypeScript configuration
├── .gitignore           # Git ignore rules
└── README.md            # User documentation
```

## Essential Files

### package.json Template
```json
{
  "name": "mcp-your-tool-server", 
  "version": "1.0.0",
  "description": "Brief description of MCP server purpose",
  "main": "build/index.js",
  "type": "module",
  "bin": {
    "your-command": "./build/index.js"
  },
  "files": ["build/", "README.md"],
  "scripts": {
    "build": "tsc && chmod 755 build/index.js",
    "watch": "tsc --watch",
    "inspector": "npx @modelcontextprotocol/inspector build/index.js",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["mcp", "model-context-protocol", "your-domain"],
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "engines": { "node": ">=18.0.0" },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.17.4",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.24",
    "typescript": "^5.3.3"
  }
}
```

### tsconfig.json Template
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16", 
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

### Basic MCP Server Template
```typescript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
  {
    name: "your-mcp-server",
    version: "1.0.0"
  },
  {
    capabilities: { tools: {} }
  }
);

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "your_tool",
      description: "Clear description of what this tool does",
      inputSchema: {
        type: "object",
        properties: {
          param: { type: "string", description: "Parameter description" }
        },
        required: ["param"]
      }
    }
  ]
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case "your_tool": {
        const schema = z.object({ param: z.string() });
        const { param } = schema.parse(args);
        
        // Tool implementation here
        const result = processYourTool(param);
        
        return {
          content: [{ type: "text", text: result }]
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true
    };
  }
});

// Server startup
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

## Development Patterns

### Tool Organization
- **Single file**: For simple servers (< 5 tools)
- **Multiple files**: Split tools into separate modules for complex servers
- **Tool categories**: Group related tools together

### Input Validation Pattern
```typescript
// Always use Zod for validation
const schema = z.object({
  requiredParam: z.string(),
  optionalParam: z.number().optional(),
  enumParam: z.enum(["option1", "option2"])
});
const validatedInput = schema.parse(args);
```

### Error Handling Pattern
```typescript
try {
  // Tool logic
} catch (error) {
  return {
    content: [{ type: "text", text: `Error: ${error.message}` }],
    isError: true
  };
}
```

### Tool Response Patterns
```typescript
// Simple text response
return { content: [{ type: "text", text: "Result" }] };

// Multiple content blocks
return { 
  content: [
    { type: "text", text: "First part" },
    { type: "text", text: "Second part" }
  ]
};
```

## Build and Development Workflow
1. **Development**: `npm run watch` for live compilation
2. **Testing**: `npm run inspector` to test with MCP Inspector
3. **Building**: `npm run build` for production
4. **Publishing**: `npm publish` after build

## File Naming Conventions
- **Server name**: `mcp-{domain}-server` (e.g., `mcp-calendar-server`)
- **Command name**: Match server name or shorter version
- **Tool names**: Use snake_case for consistency
- **File names**: Use kebab-case for all files