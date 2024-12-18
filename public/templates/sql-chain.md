---
title: SQL Chain
domain: langchain
category: Tool-Using Agents
overview: Build a chain that generates and executes SQL queries based on natural language input.
---

# Core Components
1. SQL Generator
2. Query Executor
3. Result Formatter
4. Schema Manager

# Implementation Steps
- Database Setup
  - Configure connection
  - Load schema
  - Set permissions

- Query Generation
  - Parse input
  - Generate SQL
  - Validate query

- Result Processing
  - Execute query
  - Format results
  - Handle errors

# Best Practices
1. Query Validation
2. Input Sanitization
3. Error Handling
4. Result Formatting

# Example Implementation
```typescript
import { OpenAI } from "langchain/llms/openai";
import { SQLDatabaseChain } from "langchain/chains";
import { DataSource } from "typeorm";

// Setup database connection
const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "user",
  password: "password",
  database: "mydb"
});

// Create SQL chain
const chain = new SQLDatabaseChain({
  llm: new OpenAI({ temperature: 0 }),
  database: dataSource,
  prompt: new PromptTemplate({
    template: "Generate SQL for: {input}\nSchema: {schema}",
    inputVariables: ["input", "schema"]
  }),
  verbose: true
});
