import { BookTemplate } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { SECTIONS } from './constants/domains';

interface PromptLibraryProps {
  onSelectTemplate: (category: string) => void;
}

export const PromptLibrary = ({ onSelectTemplate }: PromptLibraryProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-console-cyan font-code mb-4">Prompt Library</h3>
      <Accordion type="multiple" className="space-y-2">
        {Object.entries(SECTIONS).map(([section, categories]) => (
          <AccordionItem key={section} value={section} className="border-none">
            <AccordionTrigger className="text-console-cyan hover:no-underline py-2 px-3 rounded-md hover:bg-gray-800/50 text-left">
              {section}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 ml-2">
                {categories.map((category) => (
                  <li key={category}>
                    <button 
                      className="w-full text-left console-button flex items-center gap-2 py-1 px-2"
                      onClick={() => onSelectTemplate(category)}
                    >
                      <BookTemplate className="w-4 h-4" />
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
