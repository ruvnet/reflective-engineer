---
title: Router Chain
domain: langchain
category: Tool-Using Agents
overview: Implement a router chain that directs inputs to appropriate specialized chains.
---

# Core Components
1. Router Logic
2. Chain Registry
3. Selection Criteria
4. Result Aggregation

# Implementation Steps
- Router Setup
  - Define routing logic
  - Register chains
  - Configure defaults

- Chain Management
  - Chain registration
  - Selection rules
  - Result handling

- Integration Layer
  - Input processing
  - Chain selection
  - Output formatting

# Best Practices
1. Clear Routing Rules
2. Chain Validation
3. Error Handling
4. Result Verification

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { RouterChain, LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

// Define specialized chains
const chains = {
  math: new LLMChain({
    llm: new OpenAI({ temperature: 0 }),
    prompt: new PromptTemplate({
      template: "Solve: {input}",
      inputVariables: ["input"]
    })
  }),
  text: new LLMChain({
    llm: new OpenAI({ temperature: 0.7 }),
    prompt: new PromptTemplate({
      template: "Process: {input}",
      inputVariables: ["input"]
    })
  })
};

// Create router chain
const router = new RouterChain({
  chains,
  defaultChain: "text",
  routingFn: (input) => {
    // Implement routing logic
    return input.includes("calculate") ? "math" : "text";
  }
});
