import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Templates", path: "/templates" },
  { name: "Documentation", path: "/docs" },
  { name: "Settings", path: "/settings" },
  { name: "About", path: "/about" }
];

interface MainNavProps {
  title: string;
}

const MainNav = ({ title }: MainNavProps) => {
  return (
    <header className="glass-panel p-6 m-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Terminal className="w-6 h-6 text-console-cyan" />
        <h1 className="typing-container font-code text-xl">
          {title}
        </h1>
      </div>
      <nav className="hidden md:flex space-x-6">
        {navItems.map((item) => (
          <Link 
            key={item.name}
            to={item.path}
            className="console-button"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default MainNav;
