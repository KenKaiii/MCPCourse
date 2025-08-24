# MCP Response Formatting Best Practices

## Overview
Well-formatted responses significantly improve user experience. Users prefer clean, visually appealing output over technical jargon.

## Response Format Guidelines

### 1. Use Branded Headers with Emojis
```typescript
// Good: Clear, branded response
text: `➕ **Addition Result**\n${a} + ${b} = **${result}**`

// Bad: Plain, technical response  
text: `${a} + ${b} = ${result}`
```

### 2. Bold Important Results
```typescript
// Highlight the actual result
text: `📊 **Percentage Result**\n${percent}% of ${number} = **${result}**`
```

### 3. Use Relevant Emojis for Context
- ➕ Addition operations
- ➖ Subtraction operations  
- ✖️ Multiplication operations
- ➗ Division operations
- 🔢 Power/exponential operations
- √ Square root operations
- 📊 Percentage/statistics operations
- ❌ Error messages
- ✅ Success confirmations
- 📁 File operations
- 🌐 Network/API operations
- 🔍 Search operations

### 4. Clean Error Messages
```typescript
// Good: User-friendly error
text: `❌ **Error**\nDivision by zero is not allowed`

// Bad: Technical error dump
text: `Error: [{"code":"invalid_type","expected":"number"...}`
```

### 5. Consistent Formatting Pattern
```typescript
const formatResponse = (emoji: string, title: string, content: string) => {
  return `${emoji} **${title}**\n${content}`;
};

// Usage
return {
  content: [{
    type: "text",
    text: formatResponse("➕", "Addition Result", `${a} + ${b} = **${result}**`)
  }]
};
```

## Error Message Best Practices

### 1. Clean Up Validation Errors
```typescript
let cleanMessage = "An unexpected error occurred";

if (error instanceof Error) {
  if (error.message.includes("Expected number, received string")) {
    cleanMessage = "Please provide valid numbers for all parameters";
  } else if (error.message.includes("Required")) {
    cleanMessage = "Missing required parameter - please check your input";
  } else {
    cleanMessage = error.message;
  }
}

return {
  content: [{
    type: "text",
    text: `❌ **Error**\n${cleanMessage}`
  }],
  isError: true
};
```

### 2. Business Logic Error Examples
```typescript
// Division by zero
"Division by zero is not allowed"

// Square root of negative
"Square root of negative numbers is not supported"

// File not found
"The requested file could not be found"

// Network timeout
"Connection timeout - please try again"
```

## Response Content Types

### 1. Text Responses (Most Common)
```typescript
{
  content: [{
    type: "text",
    text: "Formatted response with emojis and markdown"
  }]
}
```

### 2. Multi-Content Responses
```typescript
{
  content: [
    {
      type: "text",
      text: "📊 **Results Summary**"
    },
    {
      type: "text", 
      text: "• Item 1: **Value 1**\n• Item 2: **Value 2**"
    }
  ]
}
```

## Implementation Tips

### 1. Create Helper Functions
```typescript
const formatSuccess = (emoji: string, title: string, result: string) => 
  `${emoji} **${title}**\n${result}`;

const formatError = (message: string) => 
  `❌ **Error**\n${message}`;
```

### 2. Consistent Result Bolding
Always bold the final calculated result:
```typescript
text: `➕ **Addition Result**\n${a} + ${b} = **${result}**`
//                                              ^^^^^^^^^^^
```

### 3. Use Line Breaks for Structure
```typescript
// Good: Clear structure
`📊 **Statistics Result**\nMean: **${mean}**\nMedian: **${median}**`

// Bad: All on one line
`Mean: ${mean}, Median: ${median}`
```

## Testing Formatted Responses

### Visual Inspection
```bash
# Test with MCP Inspector to see how responses render
npm run inspector
```

### Automated Response Testing
```typescript
// Verify response contains expected formatting
expect(response.content[0].text).toContain("**");
expect(response.content[0].text).toMatch(/^[📊➕➖✖️➗🔢√❌]/);
```

## Common Mistakes to Avoid

1. **Don't use too many emojis** - One per response is sufficient
2. **Don't make responses too long** - Keep them concise
3. **Don't use complex markdown** - Stick to bold and basic formatting  
4. **Don't expose internal errors** - Always clean up technical messages
5. **Don't forget to bold results** - The actual answer should stand out

## User Experience Impact

**Before formatting:**
```
"25.6789"
```

**After formatting:**
```
📊 **Calculation Result**
25.68 (rounded to 2 decimal places)
```

Users are significantly more likely to:
- Understand the results clearly
- Trust the tool's professionalism  
- Continue using the MCP server
- Recommend it to others

Clean, well-formatted responses create a professional impression and improve overall user satisfaction.