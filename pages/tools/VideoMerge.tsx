import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Layers, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const VideoMerge: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });

  const handleProcess = async (files: File[]) => {
    if (files.length < 2) {
      alert("Please upload at least 2 videos.");
      return;
    }
    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate FFmpeg concat
        for (let i = 0; i <= 100; i += 2) {
            await delay(150);
            setState(prev => ({ ...prev, progress: i }));
        }
        setState({ 
            status: 'success', 
            progress: 100, 
            resultUrl: URL.createObjectURL(files[0]) // Just returning first for demo
        });
    } catch (e) {
        setState({ status: 'error', progress: 0, error: getErrorMessage(e) });
    }
  };

  const renderSettings = (files: File[]) => (
    <div className="space-y-4">
       <label className="text-sm font-medium text-zinc-300 flex items-center">
          <Layers className="h-4 w-4 mr-2" /> Clip Order
       </label>
       <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {files.map((file, idx) => (
             <div key={idx} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg group">
               <div className="flex items-center space-x-3 overflow-hidden">
                 <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                   {idx + 1}
                 </div>
                 <span className="truncate text-sm text-zinc-300 max-w-[120px]">{file.name}</span>
               </div>
               <div className="flex items-center space-x-1 opacity-50 group-hover:opacity-100 transition-opacity">
                 {/* Logic for reordering would go here in a full implementation */}
                 <Button variant="ghost" size="icon" className="h-6 w-6"><ArrowUp className="h-3 w-3" /></Button>
                 <Button variant="ghost" size="icon" className="h-6 w-6"><ArrowDown className="h-3 w-3" /></Button>
               </div>
             </div>
          ))}
       </div>
       <div className="text-xs text-zinc-500 text-center pt-2">
         Videos will be concatenated in the order shown.
       </div>
    </div>
  );

  return (
    <ToolShell
      title="Merge Videos"
      description="Combine multiple video clips into a single continuous movie."
      acceptedTypes="video/*"
      maxFiles={10}
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={() => (
         <div className="text-zinc-500 flex flex-col items-center">
           <Layers className="h-12 w-12 mb-2 opacity-20" />
           <span>Preview not available for multiple files</span>
         </div>
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default VideoMerge;
