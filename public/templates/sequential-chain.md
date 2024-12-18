---
title: Sequential Chain
domain: langchain
category: Tool-Using Agents
overview: Build a sequential chain that processes inputs through a series of predefined steps.
---

# Core Components
1. Chain Steps
2. Input/Output Schema
3. Step Configuration
4. Error Handling

# Implementation Steps
- Chain Setup
  - Define step sequence
  - Configure input/output
  - Set dependencies

- Step Configuration
  - Input processing
  - Output formatting
  - Error handling

- Integration Layer
  - Chain execution
  - Result handling
  - State management

# Best Practices
1. Clear Step Definition
2. Input Validation
3. Error Recovery
4. Output Verification

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { SequentialChain, LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";

// Define chain steps
const firstChain = new LLMChain({
  llm: new OpenAI({ temperature: 0 }),
  prompt: new PromptTemplate({
    template: "Process this: {input}",
    inputVariables: ["input"]
  })
});

const secondChain = new LLMChain({
  llm: new OpenAI({ temperature: 0 }),
  prompt: new PromptTemplate({
    template: "Enhance this: {intermediate}",
    inputVariables: ["intermediate"]
  })
});

// Create sequential chain
const chain = new SequentialChain({
  chains: [firstChain, secondChain],
  inputVariables: ["input"],
  outputVariables: ["output"]
});
