import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Volume2 } from 'lucide-react';

const AudioVolume: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [volume, setVolume] = useState(100);

  const handleProcess = async (files: File[]) => {
    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate FFmpeg volume filter
        await delay(1500);
        setState(prev => ({ ...prev, progress: 100 }));
        
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
         <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-zinc-300 flex items-center">
                <Volume2 className="h-4 w-4 mr-2" /> Volume Level
            </label>
            <span className="text-sm font-bold text-primary">{volume}%</span>
         </div>
         <input 
            type="range" 
            min="0" 
            max="200" 
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
         />
         <div className="flex justify-between text-xs text-zinc-500">
           <span>Mute (0%)</span>
           <span>Original (100%)</span>
           <span>Boost (200%)</span>
         </div>
       </div>
    </div>
  );

  return (
    <ToolShell
      title="Change Volume"
      description="Increase or decrease the volume of MP3 and other audio files."
      acceptedTypes="audio/*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={(files) => (
        <audio controls src={URL.createObjectURL(files[0])} className="w-[80%]" />
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default AudioVolume;
