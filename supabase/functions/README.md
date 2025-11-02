# Supabase Edge Functions

These functions run on Deno runtime, not Node.js. The TypeScript errors you see in VS Code are expected and normal:

## Common TypeScript Errors

### ❌ "Cannot find module 'https://deno.land/std@0.168.0/http/server.ts'"
- **Reason**: VS Code's TypeScript compiler doesn't understand Deno imports
- **Solution**: These imports work correctly in Deno runtime
- **Status**: Expected - ignore these errors

### ❌ "Cannot find name 'Deno'"
- **Reason**: `Deno` global is not available in Node.js environment
- **Solution**: Available in Supabase Edge Functions runtime
- **Status**: Expected - ignore these errors

### ❌ "Parameter 'req' implicitly has an 'any' type"
- **Reason**: Deno functions have different type signatures than Node.js
- **Solution**: Functions work correctly despite this warning
- **Status**: Expected - ignore these errors

## VS Code Setup

To resolve TypeScript errors in VS Code:

### 1. Install Deno Extension
```bash
# In VS Code: Ctrl+Shift+P → "Extensions: Install Extension"
# Search for: "Deno - Alan Pierce"
# Install the extension
```

### 2. Reload VS Code
```bash
# Ctrl+Shift+P → "Developer: Reload Window"
```

### 3. Verify Configuration
- Open any `supabase/functions/*.ts` file
- TypeScript errors should be resolved
- IntelliSense should work for Deno APIs

## Deployment

These functions deploy and run correctly on Supabase despite the TypeScript warnings in your IDE. The errors are due to VS Code using Node.js TypeScript configuration instead of Deno.

## Available Functions

- `generate-dynamic-exams`: Creates personalized exams based on user interests
- `generate-dynamic-questions`: Generates fresh questions using Gemini AI
- `generate-exam`: Legacy exam generation (deprecated)
- `submit-exam`: Handles exam submission and scoring