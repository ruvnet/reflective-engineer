import { z } from "zod";
import { Tool, ToolCategory } from "./types";

export const toolRegistry = new Map<string, Tool>();

export function registerTool(tool: Tool) {
  toolRegistry.set(tool.id, tool);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return Array.from(toolRegistry.values())
    .filter(tool => tool.category === category);
}
