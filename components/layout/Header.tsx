import React from 'react';
import { Menu, Github, Bell } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm lg:px-8">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="mr-4 rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-sm font-medium text-zinc-400 hidden sm:block">
          The Ultimate Client-Side Media Suite
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <a 
          href="#"
          className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          <Github className="h-5 w-5" />
        </a>
        <button className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 ring-2 ring-zinc-800"></div>
      </div>
    </header>
  );
};

export default Header;
