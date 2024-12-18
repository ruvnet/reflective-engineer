---
title: Plan-and-Execute Agent
domain: langchain
category: Conversational Agents
overview: Design an agent that plans complex tasks and executes them step by step.
---

# Core Components
1. Planning System
2. Execution Engine
3. Progress Tracking
4. Error Recovery

# Implementation Steps
- Planner Setup
  - Task decomposition
  - Step sequencing
  - Dependency mapping

- Executor Configuration
  - Step execution
  - Result validation
  - Progress monitoring

- Integration Layer
  - Plan-execute coordination
  - State management
  - Error handling

# Best Practices
1. Clear Task Breakdown
2. Progress Monitoring
3. Failure Recovery
4. Result Validation

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { PlanAndExecuteAgent } from "langchain/agents";
import { DynamicTool } from "langchain/tools";

// Define custom tools
const tools = [
  new DynamicTool({
    name: "task-executor",
    description: "Executes a specific task step",
    func: async (step: string) => {
      // Implementation
      return "Step executed";
    },
  }),
];

// Create planner
const agent = PlanAndExecuteAgent.fromLLMAndTools(
  new OpenAI({ temperature: 0 }),
  tools
);
