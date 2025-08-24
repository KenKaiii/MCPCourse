# MCP Calculator Server

A simple calculator MCP (Model Context Protocol) server that provides basic mathematical operations. This project demonstrates how to build and publish an MCP server to NPM.

## Features

### Basic Operations
- **Add** - Add two numbers together
- **Subtract** - Subtract second number from first
- **Multiply** - Multiply two numbers together  
- **Divide** - Divide first number by second (with zero-division protection)

### Advanced Operations
- **Power** - Raise number to a power
- **Square Root** - Calculate square root (with negative number protection)
- **Percentage** - Calculate percentage of a number

## Installation

### From NPM
```bash
npm install -g mcp-calculator-server
```

### From Source
```bash
git clone <repository-url>
cd mcp-calculator
npm install
npm run build
```

## Usage

### With Claude Code (Recommended)
```bash
# Add the MCP server to Claude Code
claude mcp add npx mcp-calculator-server -s user

# IMPORTANT: After adding, restart Claude Code for changes to take effect:
# 1. Press Ctrl+C twice to stop Claude Code
# 2. Run: claude --continue to restart
```

### With MCP Inspector (for testing)
```bash
npx @modelcontextprotocol/inspector mcp-calculator
```

### With Claude Desktop
Add to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "calculator": {
      "command": "mcp-calculator"
    }
  }
}
```

### Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `add` | Add two numbers | `a: number, b: number` |
| `subtract` | Subtract numbers | `a: number, b: number` |
| `multiply` | Multiply numbers | `a: number, b: number` |
| `divide` | Divide numbers | `a: number, b: number` |
| `power` | Raise to power | `base: number, exponent: number` |
| `sqrt` | Square root | `number: number` |
| `percentage` | Calculate percentage | `number: number, percent: number` |

## Example Usage

```typescript
// Add two numbers
{ "name": "add", "arguments": { "a": 5, "b": 3 } }
// Result: ➕ **Addition Result**
//         5 + 3 = **8**

// Calculate percentage  
{ "name": "percentage", "arguments": { "number": 200, "percent": 15 } }
// Result: 📊 **Percentage Result**
//         15% of 200 = **30**

// Square root calculation
{ "name": "sqrt", "arguments": { "number": 64 } }
// Result: √ **Square Root Result**
//         √64 = **8**

// Error handling example
{ "name": "divide", "arguments": { "a": 10, "b": 0 } }
// Result: ❌ **Error**
//         Division by zero is not allowed
```

## Response Format

This calculator provides **beautifully formatted responses** with emojis and clear structure. See [RESPONSE_FORMATTING.md](./RESPONSE_FORMATTING.md) for best practices on creating user-friendly MCP tool outputs.

## Development

### Build
```bash
npm run build
```

### Watch mode
```bash
npm run watch
```

### Test with Inspector
```bash
npm run inspector
```

## Project Structure & Files

Understanding what each file does in this MCP project:

```
mcp-calculator/
├── src/
│   └── index.ts          # Main server code with calculator functions
├── build/                # Compiled JavaScript (auto-generated)
├── node_modules/         # Downloaded dependencies (auto-generated)
├── package.json          # Project configuration & NPM settings
├── package-lock.json     # Exact dependency versions (auto-generated)
├── tsconfig.json         # TypeScript compiler settings
├── .gitignore           # Files to ignore in git
└── README.md            # This documentation file
```

### Key Files Explained

**`package.json`** - The project's configuration file
- Tells NPM what this package is and how to install/run it
- Lists dependencies (libraries we need)
- Defines scripts you can run with `npm run`
- Contains metadata for NPM publishing

**`package-lock.json`** - Dependency lockfile (auto-generated)
- Records exact versions of all dependencies
- Ensures everyone gets the same versions when running `npm install`
- Don't edit this manually - NPM manages it

**`tsconfig.json`** - TypeScript configuration
- Tells the TypeScript compiler how to convert our `.ts` files to `.js`
- Sets compilation options like where to put output files
- Defines which files to include/exclude from compilation

**`src/index.ts`** - Main application code
- Contains the MCP server setup and all calculator functions
- Written in TypeScript for better error checking
- Gets compiled to JavaScript in the `build/` folder

**`build/`** - Compiled output (auto-generated)
- Contains the JavaScript version of our TypeScript code
- This is what actually runs when someone uses our MCP server
- Created when you run `npm run build`

## Publishing to NPM

1. Update package details in `package.json`
2. Build the project: `npm run build`
3. Publish: `npm publish`

## License

MIT