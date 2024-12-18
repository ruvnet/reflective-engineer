---
title: ReAct Agent
domain: langchain
category: Conversational Agents
overview: Build a Reasoning and Acting (ReAct) agent for complex task decomposition and execution.
---

# Core Components
1. Reasoning System
2. Action Framework
3. Observation Handler
4. Decision Loop

# Implementation Steps
- Agent Configuration
  - Setup ReAct framework
  - Define thought process
  - Configure action space

- Reasoning Pipeline
  - Implement thought generation
  - Action selection logic
  - Observation processing

- Integration Points
  - Tool connection
  - Memory systems
  - Output formatting

# Best Practices
1. Clear Reasoning Steps
2. Action Validation
3. Observation Processing
4. Error Handling

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { ReActAgent, AgentExecutor } from "langchain/agents";
import { WebBrowser } from "langchain/tools";

// Setup tools
const tools = [new WebBrowser()];

// Initialize ReAct agent
const agent = ReActAgent.fromLLMAndTools(
  new OpenAI({ temperature: 0.7 }),
  tools,
  {
    maxIterations: 5,
    returnIntermediateSteps: true
  }
);

// Create executor
const executor = AgentExecutor.fromAgentAndTools({
  agent,
  tools,
  verbose: true
});
