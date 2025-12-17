import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Video, 
  Music, 
  FileText, 
  Zap, 
  LayoutGrid, 
  Settings,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ToolCategory } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/' },
    { name: 'Video Tools', icon: Video, path: '/video', category: 'video' as ToolCategory },
    { name: 'Audio Tools', icon: Music, path: '/audio', category: 'audio' as ToolCategory },
    { name: 'PDF Tools', icon: FileText, path: '/pdf', category: 'pdf' as ToolCategory },
    { name: 'Converters', icon: Zap, path: '/converter', category: 'converter' as ToolCategory },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-background transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {isOpen ? (
          <div className="flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span>MediaMaster</span>
          </div>
        ) : (
          <div className="mx-auto h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
             <Zap className="h-5 w-5 text-primary" />
          </div>
        )}
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col space-y-1 p-3 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0", isOpen ? "mr-3" : "mx-auto")} />
              {isOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="rounded-xl bg-zinc-900 p-4 border border-zinc-800">
            <h4 className="text-sm font-semibold text-white mb-1">Pro Features</h4>
            <p className="text-xs text-zinc-500 mb-3">Get faster processing and unlimited file sizes.</p>
            <button className="w-full rounded-lg bg-zinc-800 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700">
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
