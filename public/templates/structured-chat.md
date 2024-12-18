---
title: Structured Chat Agent
domain: langchain
category: Conversational Agents
overview: Create a structured chat agent with defined conversation patterns and response formats.
---

# Core Components
1. Chat Structure
2. Response Templates
3. Flow Control
4. State Management

# Implementation Steps
- Structure Definition
  - Conversation flows
  - Response formats
  - State transitions

- Template Creation
  - Response templates
  - Validation rules
  - Format specifications

- Integration Layer
  - Flow management
  - State tracking
  - Response generation

# Best Practices
1. Clear Structure Definition
2. Template Maintenance
3. State Validation
4. Error Recovery

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { StructuredChatAgent } from "langchain/agents";
import { PromptTemplate } from "langchain/prompts";

// Define chat structure
const chatTemplate = new PromptTemplate({
  template: "Respond to: {input}\nFormat: {format}",
  inputVariables: ["input", "format"]
});

// Create agent
const agent = StructuredChatAgent.fromLLMAndTools(
  new OpenAI({ temperature: 0.7 }),
  [],
  {
    template: chatTemplate,
    inputVariables: ["input", "format"]
  }
);
