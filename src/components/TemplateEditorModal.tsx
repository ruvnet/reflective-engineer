import { useState } from 'react';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { HelpCircle, Save, Wand2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from './ui/use-toast';
import { CATEGORIES, OUTPUT_TYPES, DOMAINS } from './constants/domains';

const templateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  domain: z.string().optional(),
  content: z.string().min(1, "Template content is required"),
  variables: z.array(z.object({
    name: z.string(),
    type: z.enum(["string", "number", "boolean"]),
    description: z.string(),
    defaultValue: z.string().optional()
  }))
});

type TemplateEditorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: z.infer<typeof templateSchema>) => void;
  initialData?: z.infer<typeof templateSchema>;
};

const InfoTooltip = ({ content }: { content: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function TemplateEditorModal({ isOpen, onClose, onSave, initialData }: TemplateEditorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    category: '',
    domain: '',
    content: '',
    variables: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof templateSchema>, string>>>({});

  const validateForm = (): boolean => {
    try {
      templateSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof typeof errors;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
      toast({
        title: "Success",
        description: "Template saved successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Please fix the validation errors",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-console-cyan">
            {initialData ? 'Edit Template' : 'Create Template'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="console-tabs">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="variables">Variables</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <label>Template Name</label>
                  <InfoTooltip content="A unique name for your template" />
                </div>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <label>Description</label>
                  <InfoTooltip content="Brief description of the template's purpose" />
                </div>
                <Textarea
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <label>Category</label>
                  <InfoTooltip content="Template category" />
                </div>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORIES).map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <label>Domain (Optional)</label>
                  <InfoTooltip content="Specific domain for the template" />
                </div>
                <Select
                  value={formData.domain}
                  onValueChange={(value) => setFormData({...formData, domain: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOMAINS).flatMap(([_, domains]) => 
                      domains.map(domain => (
                        <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label>Template Content</label>
                  <InfoTooltip content="The main content of your template. Use {{variableName}} for variables." />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Add template formatting logic here
                    toast({
                      title: "Format Applied",
                      description: "Template has been formatted",
                    });
                  }}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Format
                </Button>
              </div>
              <Textarea
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                className={`min-h-[300px] font-mono ${errors.content ? "border-red-500" : ""}`}
                placeholder="Enter template content..."
              />
              {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
            </div>
          </TabsContent>

          <TabsContent value="variables">
            <div className="space-y-4">
              {formData.variables.map((variable, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="Variable name"
                    value={variable.name}
                    onChange={e => {
                      const newVariables = [...formData.variables];
                      newVariables[index].name = e.target.value;
                      setFormData({...formData, variables: newVariables});
                    }}
                    className="flex-1"
                  />
                  <Select
                    value={variable.type}
                    onValueChange={value => {
                      const newVariables = [...formData.variables];
                      newVariables[index].type = value as "string" | "number" | "boolean";
                      setFormData({...formData, variables: newVariables});
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Description"
                    value={variable.description}
                    onChange={e => {
                      const newVariables = [...formData.variables];
                      newVariables[index].description = e.target.value;
                      setFormData({...formData, variables: newVariables});
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const newVariables = formData.variables.filter((_, i) => i !== index);
                      setFormData({...formData, variables: newVariables});
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => {
                  setFormData({
                    ...formData,
                    variables: [
                      ...formData.variables,
                      { name: '', type: 'string', description: '' }
                    ]
                  });
                }}
                className="w-full"
              >
                Add Variable
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
