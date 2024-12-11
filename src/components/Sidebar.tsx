import { ChevronDown, ChevronRight, BookTemplate } from "lucide-react";
import { CATEGORIES } from "./constants/domains";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  loadTemplate: (category: keyof typeof CATEGORIES) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, loadTemplate }: SidebarProps) => {
  return (
    <aside className={`glass-panel p-4 md:w-64 animate-matrix-fade ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-console-cyan font-code">Mathematical Frameworks</h2>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden console-button p-1"
        >
          {sidebarOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
      <ul className="space-y-2">
        {Object.keys(CATEGORIES).map((category) => (
          <li key={category}>
            <button 
              className="w-full text-left console-button flex items-center gap-2"
              onClick={() => loadTemplate(category as keyof typeof CATEGORIES)}
            >
              <BookTemplate className="w-4 h-4" />
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;