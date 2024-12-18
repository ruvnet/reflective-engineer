---
title: Time-Weighted Memory
domain: langchain
category: Memory Systems
overview: Create a memory system that weights information based on temporal relevance.
---

# Core Components
1. Time Tracker
2. Weight Calculator
3. Memory Store
4. Decay System

# Implementation Steps
- Memory Setup
  - Configure weights
  - Set decay rates
  - Initialize store

- Weight Management
  - Calculate weights
  - Apply decay
  - Update values

- Integration Layer
  - Time tracking
  - Weight updates
  - Memory access

# Best Practices
1. Decay Functions
2. Weight Calculation
3. Time Resolution
4. Update Frequency

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { TimeWeightedMemory } from "langchain/memory";
import { exponentialDecay } from "langchain/utils";

// Initialize time-weighted memory
const memory = new TimeWeightedMemory({
  decayRate: 0.01,
  k: 10,
  returnMessages: true,
  weightFunction: exponentialDecay,
  maxTokens: 2000
});

// Add memory with timestamp
await memory.saveContext(
  { input: "User message" },
  { output: "AI response" },
  Date.now()
);
