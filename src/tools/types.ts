import { z } from "zod";

export type ToolCategory = 'prompt' | 'analysis' | 'utilities';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: React.ComponentType;
  schema?: z.ZodType<any>;
  execute: (input: any) => Promise<any>;
}
