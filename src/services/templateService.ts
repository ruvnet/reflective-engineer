import { useQuery } from "@tanstack/react-query";

export interface Template {
  title: string;
  domain: string;
  category: string;
  overview: string;
  content: string;
}

export const useTemplate = (templateId: string) => {
  return useQuery({
    queryKey: ["template", templateId],
    queryFn: async () => {
      if (!templateId) return null;
      
      const response = await fetch(`/public/templates/${templateId}.md`);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }
      const text = await response.text();
      const [frontmatter, ...contentParts] = text.split('---\n').filter(Boolean);
      
      const metadata = Object.fromEntries(
        frontmatter.split('\n')
          .filter(Boolean)
          .map(line => line.split(': ').map(part => part.trim()))
      );

      console.log("Loaded template:", {
        templateId,
        metadata,
        content: contentParts.join('---\n')
      });

      return {
        ...metadata,
        content: contentParts.join('---\n')
      } as Template;
    },
    enabled: Boolean(templateId)
  });
};
