import { ChatOpenAI } from "@langchain/openai";
import { loadSettings } from "./settingsService";
import { AgentExecutor, initializeAgentExecutorWithOptions } from "langchain/agents";
import { Tool } from "@langchain/core/tools";
import { BufferMemory } from "langchain/memory";

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

type SupportedAgentType = "chat-zero-shot-react-description";

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
    // For now, always use buffer memory until we properly set up vector store
    return new BufferMemory();
  }

  async deployAgent(agent: Omit<Agent, 'id' | 'status'>): Promise<Agent> {
    const settings = loadSettings();
    if (!settings?.apiKey) {
      throw new Error("API key not configured");
    }

    const id = Date.now().toString();
    
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080';
      
      const llm = new ChatOpenAI({
        modelName: agent.config.model.name,
        temperature: agent.config.model.temperature,
        maxTokens: agent.config.model.maxTokens,
        streaming: agent.config.streaming,
        openAIApiKey: settings.apiKey,
        configuration: {
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": origin,
            "X-Title": "Reflective Engineer",
            "Origin": origin
          }
        }
      });

      const selectedTools = agent.config.tools
        .map(toolId => this.tools.get(toolId))
        .filter(tool => tool) as Tool[];

      const memory = await this.createMemory(agent.config.memory);

      // Map the agent type to a supported type
      const agentType = this.mapAgentType(agent.config.type);

      const executor = await initializeAgentExecutorWithOptions(
        selectedTools,
        llm,
        {
          agentType,
          memory,
          verbose: agent.config.verbose,
          prefix: agent.config.systemPrompt // Using prefix instead of systemMessage
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

  private mapAgentType(_type: string): SupportedAgentType {
    // For now, always return chat-zero-shot-react-description as it's the most compatible
    return "chat-zero-shot-react-description";
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
    // Clean up the agent
    this.agents.delete(id);
  }

  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  deleteAgent(id: string): void {
    const agent = this.agents.get(id);
    if (!agent) throw new Error('Agent not found');
    
    // Stop the agent if it's running
    if (agent.status === "running") {
      this.stopAgent(id);
    }
    
    this.agents.delete(id);
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
