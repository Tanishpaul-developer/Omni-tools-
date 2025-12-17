import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Eraser, Eye } from 'lucide-react';

const RemoveLogo: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  
  // Region in percentages to be responsive
  const [region, setRegion] = useState({ x: 10, y: 10, width: 20, height: 15 });
  const [blurStrength, setBlurStrength] = useState(5);

  const handleProcess = async (files: File[]) => {
    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate Processing
        for (let i = 0; i <= 100; i += 4) {
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
            <Eraser className="h-4 w-4 mr-2" /> Region Settings
         </label>
         
         <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 flex justify-between">
                <span>Horizontal Position (X)</span>
                <span>{region.x}%</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={region.x} 
                onChange={(e) => setRegion({...region, x: Number(e.target.value)})}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 flex justify-between">
                <span>Vertical Position (Y)</span>
                <span>{region.y}%</span>
              </label>
              <input 
                type="range" min="0" max="100" 
                value={region.y} 
                onChange={(e) => setRegion({...region, y: Number(e.target.value)})}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500 flex justify-between">
                <span>Width</span>
                <span>{region.width}%</span>
              </label>
              <input 
                type="range" min="1" max="50" 
                value={region.width} 
                onChange={(e) => setRegion({...region, width: Number(e.target.value)})}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-zinc-500 flex justify-between">
                <span>Height</span>
                <span>{region.height}%</span>
              </label>
              <input 
                type="range" min="1" max="50" 
                value={region.height} 
                onChange={(e) => setRegion({...region, height: Number(e.target.value)})}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-2">
               <label className="text-xs text-zinc-500 flex justify-between">
                 <span>Blur Strength</span>
                 <span>{blurStrength}</span>
               </label>
               <input 
                 type="range" min="1" max="20" 
                 value={blurStrength} 
                 onChange={(e) => setBlurStrength(Number(e.target.value))}
                 className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
               />
            </div>
         </div>
       </div>
    </div>
  );

  const renderPreview = (files: File[]) => {
    return (
      <div className="relative w-full max-w-[600px] aspect-video bg-black rounded overflow-hidden shadow-xl group">
        <video 
           src={URL.createObjectURL(files[0])} 
           className="w-full h-full object-contain"
           controls={false} // Hide native controls to avoid conflict with overlay
           autoPlay
           loop
           muted
        />
        
        {/* Region Overlay */}
        <div 
          className="absolute border-2 border-red-500 bg-red-500/20 backdrop-blur-[2px] cursor-move transition-all duration-75"
          style={{
            left: `${region.x}%`,
            top: `${region.y}%`,
            width: `${region.width}%`,
            height: `${region.height}%`,
          }}
        >
          <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] px-1 rounded font-bold">
            BLUR AREA
          </div>
          {/* Visual Handles */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white -mb-1 -mr-1"></div>
        </div>

        <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white flex items-center gap-2">
           <Eye className="h-3 w-3" /> Preview
        </div>
      </div>
    );
  };

  return (
    <ToolShell
      title="Remove Logo / Watermark"
      description="Blur specific areas of your video to hide unwanted logos or text."
      acceptedTypes="video/*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={renderPreview}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default RemoveLogo;
