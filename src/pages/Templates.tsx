import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainNav from "../components/MainNav";
import { BookTemplate } from "lucide-react";

interface Template {
  title: string;
  content: string;
  filename: string;
}

type GlobModule = {
  [key: string]: () => Promise<string>
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const importTemplates = async () => {
      const templateModules = import.meta.glob<string>('../templates/*.md', { 
        query: '?raw',
        import: 'default'
      }) as GlobModule;
      
      const loadedTemplates: Template[] = [];

      for (const path in templateModules) {
        const content = await templateModules[path]();
        const filename = path.split('/').pop()?.replace('.md', '') || '';
        const title = filename
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        loadedTemplates.push({
          title,
          content,
          filename
        });
      }

      setTemplates(loadedTemplates);
    };

    importTemplates();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav title="Template Library" />
      
      <main className="flex-1 p-4">
        <section className="glass-panel p-6 animate-matrix-fade">
          <div className="flex items-center gap-2 mb-6">
            <BookTemplate className="w-6 h-6 text-console-cyan" />
            <h1 className="text-2xl font-code text-console-cyan">Available Templates</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.filename} className="glass-panel border-console-cyan hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-console-cyan">{template.title}</CardTitle>
                  <CardDescription className="text-console-green">
                    Mathematical Framework Template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] w-full rounded-md border border-console-cyan/20 p-4">
                    <pre className="text-sm font-code text-console-text">{template.content}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
