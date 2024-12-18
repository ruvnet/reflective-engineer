---
title: Zero-Shot Agent
domain: langchain
category: Conversational Agents
overview: Implement a zero-shot agent capable of handling tasks without prior examples.
---

# Core Components
1. Base Agent Configuration
2. Tool Selection
3. Prompt Construction
4. Output Parsing

# Implementation Steps
- Agent Setup
  - Initialize ZeroShotAgent
  - Configure allowed tools
  - Set temperature and model

- Tool Integration
  - Define tool interfaces
  - Implement tool handlers
  - Set up error handling

- Prompt Engineering
  - Design base prompt
  - Format instructions
  - Include constraints

# Best Practices
1. Clear Tool Descriptions
2. Explicit Instructions
3. Error Recovery
4. Response Validation

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { ZeroShotAgent, AgentExecutor } from "langchain/agents";
import { SerpAPI, Calculator } from "langchain/tools";

// Initialize tools
const tools = [new SerpAPI(), new Calculator()];

// Create agent
const agent = ZeroShotAgent.fromLLMAndTools(
  new OpenAI({ temperature: 0 }),
  tools
);

// Execute tasks
const executor = AgentExecutor.fromAgentAndTools({
  agent,
  tools,
  verbose: true
});
