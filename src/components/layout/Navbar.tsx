
import { Link, useLocation } from 'react-router-dom';
import { Ticket, History, Plus, Settings, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 mb-0 px-4 pb-4 pt-2 sm:static sm:px-0 sm:py-4">
      <div className="mx-auto max-w-md sm:max-w-lg">
        <div className="glass dark:bg-neutral-800 rounded-full px-2 py-2 shadow-lg">
          <div className="flex items-center justify-around">
            <NavItem to="/" isActive={isActive('/')} icon={<Ticket size={20} />} label="Rifas" />
            <NavItem to="/create" isActive={isActive('/create')} icon={<Plus size={20} />} label="Criar" />
            <NavItem to="/history" isActive={isActive('/history')} icon={<History size={20} />} label="Histórico" />
            <NavItem to="/admin" isActive={location.pathname.startsWith('/admin')} icon={<Settings size={20} />} label="Admin" />
            <button
              onClick={toggleTheme}
              className="flex flex-col items-center justify-center rounded-full px-4 py-2 text-neutral-600 transition-all duration-200 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="mt-1 text-xs font-medium">Tema</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, isActive, icon, label }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center justify-center rounded-full px-4 py-2 transition-all duration-200",
        isActive 
          ? "bg-primary text-primary-foreground dark:bg-primary-400" 
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
      )}
    >
      {icon}
      <span className="mt-1 text-xs font-medium">{label}</span>
    </Link>
  );
};

export default Navbar;
