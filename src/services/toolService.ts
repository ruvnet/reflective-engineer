import { Tool } from '../tools/types';
import { z } from 'zod';

class ToolService {
  private tools: Map<string, Tool> = new Map();

  addTool(tool: Tool) {
    this.tools.set(tool.id, tool);
    // Dispatch event to notify components
    window.dispatchEvent(new CustomEvent('toolsChanged'));
  }

  getTool(id: string): Tool | undefined {
    return this.tools.get(id);
  }

  getAllTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getToolsByCategory(category: string): Tool[] {
    return this.getAllTools().filter(tool => tool.category === category);
  }

  async executeTool(toolId: string, input: any) {
    const tool = this.getTool(toolId);
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }

    try {
      if (tool.schema) {
        input = tool.schema.parse(input);
      }
      return await tool.execute(input);
    } catch (error) {
      console.error(`Error executing tool ${toolId}:`, error);
      throw error;
    }
  }

  deleteTool(id: string) {
    const deleted = this.tools.delete(id);
    if (deleted) {
      window.dispatchEvent(new CustomEvent('toolsChanged'));
    }
    return deleted;
  }
}

export const toolService = new ToolService();
