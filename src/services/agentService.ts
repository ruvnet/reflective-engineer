import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "running" | "stopped";
  config: string;
}

class AgentService {
  private agents: Agent[] = [];

  async deployAgent(agent: Omit<Agent, 'id' | 'status'>): Promise<Agent> {
    // Create unique ID for the agent
    const id = Date.now().toString();
    
    try {
      // Create agent directory
      await execAsync(`mkdir -p agents/${id}`);
      
      // Write config file
      await execAsync(`echo '${agent.config}' > agents/${id}/config.json`);
      
      // Create startup script
      const startupScript = `#!/bin/bash
cd agents/${id}
# Add agent startup logic here
`;
      await execAsync(`echo '${startupScript}' > agents/${id}/startup.sh`);
      await execAsync(`chmod +x agents/${id}/startup.sh`);

      const newAgent: Agent = {
        ...agent,
        id,
        status: "stopped"
      };

      this.agents.push(newAgent);
      return newAgent;
    } catch (error) {
      console.error('Failed to deploy agent:', error);
      throw new Error('Failed to deploy agent');
    }
  }

  async startAgent(id: string): Promise<void> {
    const agent = this.agents.find(a => a.id === id);
    if (!agent) throw new Error('Agent not found');

    try {
      await execAsync(`./agents/${id}/startup.sh`);
      agent.status = "running";
    } catch (error) {
      console.error('Failed to start agent:', error);
      throw new Error('Failed to start agent');
    }
  }

  async stopAgent(id: string): Promise<void> {
    const agent = this.agents.find(a => a.id === id);
    if (!agent) throw new Error('Agent not found');

    try {
      // Find and kill the agent process
      await execAsync(`pkill -f "agents/${id}/startup.sh"`);
      agent.status = "stopped";
    } catch (error) {
      console.error('Failed to stop agent:', error);
      throw new Error('Failed to stop agent');
    }
  }

  getAgents(): Agent[] {
    return this.agents;
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.find(a => a.id === id);
  }
}

export const agentService = new AgentService();
