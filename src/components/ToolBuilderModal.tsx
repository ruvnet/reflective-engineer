import { useState } from 'react';
import { z } from 'zod';
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
  onSave: (tool: z.infer<typeof toolSchema>) => void;
};

export function ToolBuilderModal({ isOpen, onClose, onSave }: ToolBuilderProps) {
  const [activeTab, setActiveTab] = useState('config');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    parameters: []
  });
  const [testResult, setTestResult] = useState('');

  const handleSave = () => {
    try {
      const validatedData = toolSchema.parse(formData);
      onSave(validatedData);
      onClose();
    } catch (error) {
      console.error('Validation error:', error);
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
                    <Input 
                      placeholder="Tool Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="console-input"
                    />
                    <Textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="console-input"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="prompt">
                <AccordionTrigger>Prompt Template</AccordionTrigger>
                <AccordionContent>
                  <Textarea
                    placeholder="Enter prompt template..."
                    value={formData.prompt}
                    onChange={e => setFormData({...formData, prompt: e.target.value})}
                    className="console-input min-h-[200px]"
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="params">
                <AccordionTrigger>Parameters</AccordionTrigger>
                <AccordionContent>
                  <div className="text-console-text">
                    Parameter configuration coming soon...
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
