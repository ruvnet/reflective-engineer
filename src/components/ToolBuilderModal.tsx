import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Tool, ToolCategory } from '../tools/types';
import { saveTemplate } from '../services/storageService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  prompt: z.string().min(1, "Prompt is required"),
  parameters: z.array(z.object({
    name: z.string(),
    type: z.enum(["string", "number", "boolean"]),
    description: z.string()
  }))
});

type ToolBuilderProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tool: Tool) => void;
  initialData?: SavedTemplate;
};

export function ToolBuilderModal({ isOpen, onClose, onSave, initialData }: ToolBuilderProps) {
  const [activeTab, setActiveTab] = useState('config');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    prompt: initialData?.content || '',
    parameters: initialData?.variables || []
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        prompt: initialData.content,
        parameters: initialData.variables
      });
    }
  }, [initialData]);
  const [testResult, setTestResult] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSave = () => {
    try {
      setErrors({}); // Clear previous errors
      
      // Validate form data
      if (!formData.name.trim()) {
        setErrors(prev => ({ ...prev, name: "Name is required" }));
        return;
      }
      if (!formData.description.trim()) {
        setErrors(prev => ({ ...prev, description: "Description is required" }));
        return;
      }
      if (!formData.prompt.trim()) {
        setErrors(prev => ({ ...prev, prompt: "Prompt is required" }));
        return;
      }

      const validatedData = toolSchema.parse(formData);
      const category = "prompt"; // Set default category
      
      // Create Tool object
      // Create and save the tool
      const tool: Tool = {
        id: crypto.randomUUID(),
        name: validatedData.name,
        description: validatedData.description,
        category: 'prompt' as ToolCategory,
        icon: () => null,
        schema: z.object({
          input: z.string(),
          ...validatedData.parameters.reduce((acc, param) => ({
            ...acc,
            [param.name]: param.type === 'string' 
              ? z.string()
              : param.type === 'number'
                ? z.number()
                : z.boolean()
          }), {})
        }),
        execute: async (input) => {
          return {
            result: `Executed ${validatedData.name} with input: ${JSON.stringify(input)}`
          };
        }
      };

      // Also save as a template for display
      const templateData = {
        name: validatedData.name,
        description: validatedData.description,
        category: "Chain Builder",
        content: validatedData.prompt,
        variables: validatedData.parameters.map(p => ({
          name: p.name,
          type: p.type,
          description: p.description
        }))
      };
      saveTemplate(templateData);

      onSave(tool);
      onClose();
    } catch (error) {
      console.error('Validation error:', error);
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to validate tool configuration",
        variant: "destructive"
      });
    }
  };

  const handleTest = async () => {
    try {
      const response = await fetch('/api/test-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      setTestResult(result.output);
    } catch (error) {
      console.error('Test error:', error);
      setTestResult('Error testing tool');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-console-cyan">Create New Tool</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="console-tabs">
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="basic">
                <AccordionTrigger>Basic Information</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Input 
                        placeholder="Tool Name"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className={`console-input ${errors.name ? 'border-red-500' : ''}`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className={`console-input ${errors.description ? 'border-red-500' : ''}`}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="prompt">
                <AccordionTrigger>Prompt Template</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter prompt template..."
                      value={formData.prompt}
                      onChange={e => setFormData({...formData, prompt: e.target.value})}
                      className={`console-input min-h-[200px] ${errors.prompt ? 'border-red-500' : ''}`}
                    />
                    {errors.prompt && (
                      <p className="text-sm text-red-500">{errors.prompt}</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="params">
                <AccordionTrigger>Parameters</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {formData.parameters.map((param, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <Input
                          placeholder="Parameter name"
                          value={param.name}
                          onChange={e => {
                            const newParams = [...formData.parameters];
                            newParams[index].name = e.target.value;
                            setFormData({...formData, parameters: newParams});
                          }}
                          className="flex-1 console-input"
                        />
                        <select
                          value={param.type}
                          onChange={e => {
                            const newParams = [...formData.parameters];
                            newParams[index].type = e.target.value as "string" | "number" | "boolean";
                            setFormData({...formData, parameters: newParams});
                          }}
                          className="console-input w-32"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                        </select>
                        <Input
                          placeholder="Description"
                          value={param.description}
                          onChange={e => {
                            const newParams = [...formData.parameters];
                            newParams[index].description = e.target.value;
                            setFormData({...formData, parameters: newParams});
                          }}
                          className="flex-1 console-input"
                        />
                        <Button 
                          onClick={() => {
                            const newParams = formData.parameters.filter((_, i) => i !== index);
                            setFormData({...formData, parameters: newParams});
                          }}
                          className="console-button bg-red-500/20 hover:bg-red-500/30"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          parameters: [
                            ...formData.parameters,
                            { name: '', type: 'string', description: '' }
                          ]
                        });
                      }}
                      className="console-button w-full"
                    >
                      Add Parameter
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>

          <TabsContent value="test">
            <div className="space-y-4">
              <Button onClick={handleTest} className="console-button">
                Run Test
              </Button>
              <div className="glass-panel p-4 font-mono">
                <pre className="text-console-text">{testResult}</pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} className="console-button">
            Cancel
          </Button>
          <Button onClick={handleSave} className="console-button">
            Save Tool
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
