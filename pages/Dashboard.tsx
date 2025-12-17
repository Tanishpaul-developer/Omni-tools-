import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { TOOLS } from '../constants';
import { Card, CardContent } from '../components/ui/Card';
import { cn } from '../lib/utils';
import { ToolCategory } from '../types';

interface DashboardProps {
  filterCategory?: ToolCategory;
}

const Dashboard: React.FC<DashboardProps> = ({ filterCategory }) => {
  const [search, setSearch] = useState('');

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(search.toLowerCase()) || 
                          tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? tool.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (cat: ToolCategory) => {
    switch(cat) {
      case 'video': return 'text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:text-blue-300';
      case 'audio': return 'text-purple-400 bg-purple-500/10 group-hover:bg-purple-500/20 group-hover:text-purple-300';
      case 'pdf': return 'text-red-400 bg-red-500/10 group-hover:bg-red-500/20 group-hover:text-red-300';
      case 'converter': return 'text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:text-emerald-300';
      default: return 'text-zinc-400 bg-zinc-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero / Search Section */}
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <h2 className="text-3xl font-bold tracking-tight text-center text-white sm:text-4xl">
          What would you like to create?
        </h2>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search for tools (e.g. 'Trim video', 'Merge PDF')..." 
            className="w-full rounded-full border border-zinc-800 bg-zinc-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => (
          <Link key={tool.id} to={tool.path}>
            <Card className="group relative h-full overflow-hidden border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-zinc-700 hover:shadow-xl hover:shadow-black/20">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("rounded-xl p-3 transition-colors duration-300", getCategoryColor(tool.category))}>
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-2">
                    {tool.popular && (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20 shadow-sm backdrop-blur-sm">
                        Popular
                      </span>
                    )}
                    {tool.isNew && (
                       <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20 shadow-sm backdrop-blur-sm">
                        New
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-zinc-100 mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                  {tool.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-500">No tools found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;