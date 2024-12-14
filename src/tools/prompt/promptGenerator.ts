import { z } from "zod";
import { Tool } from "../types";
import { Brain } from "lucide-react";

export const promptGeneratorTool: Tool = {
  id: 'prompt-generator',
  name: 'Prompt Generator',
  description: 'Generate structured prompts using templates',
  category: 'prompt',
  icon: Brain,
  schema: z.object({
    domain: z.string(),
    context: z.string(),
    output: z.string()
  }),
  execute: async (input) => {
    // Implementation
    return input;
  }
};
