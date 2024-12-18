---
title: Summary Memory
domain: langchain
category: Memory Systems
overview: Create a memory system that maintains summarized versions of past interactions.
---

# Core Components
1. Summarization Engine
2. Memory Store
3. Update System
4. Retrieval Logic

# Implementation Steps
- Summary Setup
  - Configure summarizer
  - Set parameters
  - Define triggers

- Memory Management
  - Generate summaries
  - Store results
  - Update existing

- Integration Layer
  - Summary generation
  - Memory updates
  - Data retrieval

# Best Practices
1. Summary Length
2. Update Frequency
3. Retention Policy
4. Access Patterns

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { SummaryMemory } from "langchain/memory";
import { PromptTemplate } from "langchain/prompts";

// Initialize summary memory
const memory = new SummaryMemory({
  llm: new OpenAI({ temperature: 0 }),
  prompt: new PromptTemplate({
    template: "Summarize: {input}",
    inputVariables: ["input"]
  }),
  maxTokens: 100,
  returnMessages: true
});

// Add to memory
await memory.saveContext(
  { input: "User message" },
  { output: "AI response" }
);
