import React from 'react';
import { Terminal, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Settings', path: '/settings' },
  { label: 'Documentation', path: '/documentation' },
  { label: 'About', path: '/about' },
];

interface MainNavProps {
  title: string;
}

const MainNav = ({ title }: MainNavProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="glass-panel p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <Terminal className="w-6 h-6 text-console-cyan flex-shrink-0" />
          <h1 className="typing-container font-code text-xl truncate">
            {title}
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden console-button p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="console-button px-4 py-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="console-button block px-4 py-2 w-full text-left"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default MainNav;