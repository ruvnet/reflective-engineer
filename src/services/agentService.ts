import { OpenAI } from "@langchain/openai";
import { loadSettings } from "./settingsService";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { Tool } from "@langchain/core/tools";
import { BufferMemory } from "langchain/memory";
import { VectorStoreMemory } from "@langchain/community/memory/vector_store";

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "running" | "stopped";
  config: AgentConfig;
  executor?: AgentExecutor;
}

export interface AgentConfig {
  type: string;
  model: {
    name: string;
    temperature: number;
    maxTokens: number;
  };
  memory: string;
  tools: string[];
  chainType: string;
  systemPrompt: string;
  streaming: boolean;
  verbose: boolean;
}

class AgentService {
  private agents: Map<string, Agent> = new Map();
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.initializeTools();
  }

  private initializeTools() {
    // Add tool initialization here
    // Example:
    // this.tools.set("web-browser", new WebBrowser());
  }

  private async createMemory(type: string) {
    switch (type) {
      case "buffer":
        return new BufferMemory();
      case "vector":
        return new VectorStoreMemory();
      default:
        return new BufferMemory();
    }
  }

  async deployAgent(agent: Omit<Agent, 'id' | 'status'>): Promise<Agent> {
    const settings = loadSettings();
    if (!settings?.apiKey) {
      throw new Error("API key not configured");
    }

    const id = Date.now().toString();
    
    try {
      const llm = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        modelName: agent.config.model.name,
        temperature: agent.config.model.temperature,
        maxTokens: agent.config.model.maxTokens,
        streaming: agent.config.streaming,
        configuration: {
          baseHeaders: {
            "HTTP-Referer": window.location.href,
            "X-Title": "Reflective Engineer"
          }
        }
      });

      const selectedTools = agent.config.tools
        .map(toolId => this.tools.get(toolId))
        .filter(tool => tool) as Tool[];

      const memory = await this.createMemory(agent.config.memory);

      const executor = await initializeAgentExecutorWithOptions(
        selectedTools,
        llm,
        {
          agentType: agent.config.type,
          memory,
          verbose: agent.config.verbose,
          systemMessage: agent.config.systemPrompt,
        }
      );

      const newAgent: Agent = {
        ...agent,
        id,
        status: "stopped",
        executor
      };

      this.agents.set(id, newAgent);
      return newAgent;
    } catch (error) {
      console.error('Failed to deploy agent:', error);
      throw new Error('Failed to deploy agent');
    }
  }

  async startAgent(id: string): Promise<void> {
    const agent = this.agents.get(id);
    if (!agent) throw new Error('Agent not found');
    
    agent.status = "running";
    this.agents.set(id, agent);
  }

  async stopAgent(id: string): Promise<void> {
    const agent = this.agents.get(id);
    if (!agent) throw new Error('Agent not found');
    
    agent.status = "stopped";
    this.agents.set(id, agent);
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  async executeAgent(id: string, input: string): Promise<string> {
    const agent = this.agents.get(id);
    if (!agent || !agent.executor) throw new Error('Agent not found or not initialized');
    if (agent.status !== "running") throw new Error('Agent is not running');

    try {
      const result = await agent.executor.call({ input });
      return result.output;
    } catch (error) {
      console.error('Agent execution failed:', error);
      throw new Error('Agent execution failed');
    }
  }
}

export const agentService = new AgentService();
