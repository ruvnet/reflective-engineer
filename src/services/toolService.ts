import { Tool } from '../tools/types';

export class ToolService {
  async executeTool(tool: Tool, input: any) {
    try {
      if (tool.schema) {
        input = tool.schema.parse(input);
      }
      return await tool.execute(input);
    } catch (error) {
      console.error(`Error executing tool ${tool.id}:`, error);
      throw error;
    }
  }
}

export const toolService = new ToolService();
