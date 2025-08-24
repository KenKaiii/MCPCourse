#!/usr/bin/env node

// Import statements - bring in external libraries
import { Server } from "@modelcontextprotocol/sdk/server/index.js"; // Main MCP server class
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"; // Communication transport
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"; // Message type definitions
import { z } from "zod"; // Input validation library

// Create server instance - this is the main MCP server object
const server = new Server(
  {
    name: "calculator-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Function: Register tool list handler - tells clients what tools are available
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "subtract",
        description: "Subtract second number from first number", 
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "multiply",
        description: "Multiply two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "divide",
        description: "Divide first number by second number",
        inputSchema: {
          type: "object",
          properties: {
            a: { type: "number", description: "Dividend (number to be divided)" },
            b: { type: "number", description: "Divisor (number to divide by)" },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "power",
        description: "Raise first number to the power of second number",
        inputSchema: {
          type: "object",
          properties: {
            base: { type: "number", description: "Base number" },
            exponent: { type: "number", description: "Power to raise to" },
          },
          required: ["base", "exponent"],
        },
      },
      {
        name: "sqrt",
        description: "Calculate square root of a number",
        inputSchema: {
          type: "object",
          properties: {
            number: { type: "number", description: "Number to find square root of" },
          },
          required: ["number"],
        },
      },
      {
        name: "percentage",
        description: "Calculate percentage of a number",
        inputSchema: {
          type: "object",
          properties: {
            number: { type: "number", description: "Base number" },
            percent: { type: "number", description: "Percentage to calculate" },
          },
          required: ["number", "percent"],
        },
      },
    ],
  };
});

// Function: Register tool execution handler - runs the actual calculator operations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params; // Extract tool name and parameters

  try {
    switch (name) { // Switch statement to handle different calculator operations
      case "add": {
        // Zod validation schema - ensures inputs are correct type (numbers)
        const schema = z.object({
          a: z.number(),
          b: z.number(),
        });
        const { a, b } = schema.parse(args);
        
        const result = a + b; // Perform the addition calculation
        return { // Return result in MCP format
          content: [
            {
              type: "text",
              text: `➕ **Addition Result**\n${a} + ${b} = **${result}**`,
            },
          ],
        };
      }

      case "subtract": {
        const schema = z.object({
          a: z.number(),
          b: z.number(),
        });
        const { a, b } = schema.parse(args);
        
        const result = a - b; // Perform subtraction calculation
        return {
          content: [
            {
              type: "text", 
              text: `➖ **Subtraction Result**\n${a} - ${b} = **${result}**`,
            },
          ],
        };
      }

      case "multiply": {
        const schema = z.object({
          a: z.number(),
          b: z.number(),
        });
        const { a, b } = schema.parse(args);
        
        const result = a * b; // Perform multiplication calculation
        return {
          content: [
            {
              type: "text",
              text: `✖️ **Multiplication Result**\n${a} × ${b} = **${result}**`,
            },
          ],
        };
      }

      case "divide": {
        const schema = z.object({
          a: z.number(),
          b: z.number(),
        });
        const { a, b } = schema.parse(args);
        
        // Error handling: prevent division by zero
        if (b === 0) {
          throw new Error("Division by zero is not allowed");
        }
        
        const result = a / b; // Perform division calculation
        return {
          content: [
            {
              type: "text",
              text: `➗ **Division Result**\n${a} ÷ ${b} = **${result}**`,
            },
          ],
        };
      }

      case "power": {
        const schema = z.object({
          base: z.number(),
          exponent: z.number(),
        });
        const { base, exponent } = schema.parse(args);
        
        const result = Math.pow(base, exponent); // Use Math.pow() built-in function
        return {
          content: [
            {
              type: "text",
              text: `🔢 **Power Result**\n${base}^${exponent} = **${result}**`,
            },
          ],
        };
      }

      case "sqrt": {
        const schema = z.object({
          number: z.number(),
        });
        const { number } = schema.parse(args);
        
        // Error handling: prevent square root of negative numbers
        if (number < 0) {
          throw new Error("Square root of negative numbers is not supported");
        }
        
        const result = Math.sqrt(number); // Use Math.sqrt() built-in function
        return {
          content: [
            {
              type: "text",
              text: `√ **Square Root Result**\n√${number} = **${result}**`,
            },
          ],
        };
      }

      case "percentage": {
        const schema = z.object({
          number: z.number(),
          percent: z.number(),
        });
        const { number, percent } = schema.parse(args);
        
        const result = (number * percent) / 100; // Calculate percentage formula
        return {
          content: [
            {
              type: "text",
              text: `📊 **Percentage Result**\n${percent}% of ${number} = **${result}**`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    // Error handling: catch validation errors and return user-friendly messages
    let cleanMessage = "An unexpected error occurred";
    
    if (error instanceof Error) {
      // Clean up Zod validation errors to be more user-friendly
      if (error.message.includes("Expected number, received string")) {
        cleanMessage = "Please provide valid numbers for all parameters";
      } else if (error.message.includes("Required")) {
        cleanMessage = "Missing required parameter - please check your input";
      } else if (error.message.includes("Invalid")) {
        cleanMessage = "Invalid input provided - please check your parameters";
      } else {
        cleanMessage = error.message;
      }
    }
    
    return {
      content: [
        {
          type: "text",
          text: `❌ **Error**\n${cleanMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Function: Main server startup function - connects server to stdio transport
async function main() {
  const transport = new StdioServerTransport(); // Creates stdio communication channel
  await server.connect(transport); // Connects server to transport
  console.error("Calculator MCP server running on stdio"); // Log to stderr (not stdout)
}

// Start the server and handle any startup errors
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1); // Exit with error code if startup fails
});