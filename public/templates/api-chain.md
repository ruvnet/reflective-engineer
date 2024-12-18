---
title: API Chain
domain: langchain
category: Tool-Using Agents
overview: Create a chain that interacts with external APIs and processes their responses.
---

# Core Components
1. API Configuration
2. Request Builder
3. Response Parser
4. Error Handler

# Implementation Steps
- API Setup
  - Configure endpoints
  - Set authentication
  - Define headers

- Request Management
  - Build requests
  - Handle parameters
  - Validate inputs

- Response Processing
  - Parse responses
  - Transform data
  - Handle errors

# Best Practices
1. API Authentication
2. Rate Limiting
3. Error Handling
4. Response Validation

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { APIChain } from "langchain/chains";
import { APIRequestTemplate } from "langchain/prompts";

// Define API configuration
const apiConfig = {
  baseURL: "https://api.example.com",
  headers: {
    Authorization: "Bearer ${API_KEY}",
    "Content-Type": "application/json"
  }
};

// Create API chain
const chain = new APIChain({
  llm: new OpenAI({ temperature: 0 }),
  apiConfig,
  requestTemplate: new APIRequestTemplate({
    method: "POST",
    path: "/endpoint",
    template: JSON.stringify({
      query: "{input}"
    }),
    inputVariables: ["input"]
  }),
  responseParser: (response) => {
    return JSON.parse(response).data;
  }
});
