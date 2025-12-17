import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Crop, Monitor } from 'lucide-react';

const VideoCrop: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);

  const handleProcess = async (files: File[]) => {
    setState({ status: 'processing', progress: 0 });
    try {
        if (aspectRatio === 'custom' && (customWidth <= 0 || customHeight <= 0)) {
            throw new Error("Invalid dimensions. Width and height must be positive.");
        }

        // Simulation of FFmpeg crop filter
        for (let i = 0; i <= 100; i += 5) {
        await delay(200);
        setState(prev => ({ ...prev, progress: i }));
        }
        setState({ 
            status: 'success', 
            progress: 100, 
            resultUrl: URL.createObjectURL(files[0]) 
        });
    } catch (e) {
        setState({ status: 'error', progress: 0, error: getErrorMessage(e) });
    }
  };

  const renderSettings = () => (
    <div className="space-y-6">
       <div className="space-y-4">
         <label className="text-sm font-medium text-zinc-300 flex items-center">
            <Crop className="h-4 w-4 mr-2" /> Aspect Ratio
         </label>
         <div className="grid grid-cols-2 gap-2">
           {['16:9', '4:3', '1:1', '9:16'].map((ratio) => (
             <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                  aspectRatio === ratio 
                    ? 'bg-primary/20 border-primary text-primary' 
                    : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                }`}
             >
               {ratio}
             </button>
           ))}
           <button
              onClick={() => setAspectRatio("custom")}
              className={`col-span-2 px-3 py-2 rounded-md text-sm font-medium border transition-colors ${
                aspectRatio === "custom" 
                  ? 'bg-primary/20 border-primary text-primary' 
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
              }`}
           >
             Custom
           </button>
         </div>

         {aspectRatio === 'custom' && (
           <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
             <div>
               <label className="text-xs text-zinc-500 mb-1 block">Width</label>
               <input 
                 type="number" 
                 value={customWidth}
                 onChange={(e) => setCustomWidth(Number(e.target.value))}
                 className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent"
               />
             </div>
             <div>
               <label className="text-xs text-zinc-500 mb-1 block">Height</label>
               <input 
                 type="number" 
                 value={customHeight}
                 onChange={(e) => setCustomHeight(Number(e.target.value))}
                 className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent"
               />
             </div>
           </div>
         )}
         
         <div className="p-3 bg-zinc-900/50 rounded border border-zinc-800 text-xs text-zinc-400">
            <Monitor className="h-3 w-3 inline mr-1" />
            Output will be resized to fit the selection.
         </div>
       </div>
    </div>
  );

  return (
    <ToolShell
      title="Crop Video"
      description="Resize or change the aspect ratio of your video clips."
      acceptedTypes="video/*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={(files) => (
        <video controls src={URL.createObjectURL(files[0])} className="max-h-[350px] w-auto rounded border border-zinc-800" />
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default VideoCrop;
