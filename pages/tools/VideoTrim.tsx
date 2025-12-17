import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Sliders } from 'lucide-react';

const VideoTrim: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("00:00:10");

  const handleProcess = async (files: File[]) => {
    if (files.length === 0) return;
    
    setState({ status: 'processing', progress: 0 });

    try {
      // Validate inputs
      const startParts = startTime.split(':').map(Number);
      const endParts = endTime.split(':').map(Number);
      if (startParts.some(isNaN) || endParts.some(isNaN)) {
        throw new Error("Invalid time format. Please use HH:MM:SS");
      }

      for (let i = 0; i <= 100; i += 10) {
        await delay(300); // Simulate heavy work
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
       <div className="space-y-2">
         <label className="text-sm font-medium text-zinc-300 flex items-center">
            <Sliders className="h-4 w-4 mr-2" /> Trim Range
         </label>
         <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Start Time</label>
              <input 
                type="text" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">End Time</label>
              <input 
                type="text" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
         </div>
         <p className="text-xs text-zinc-500 mt-2">Format: HH:MM:SS</p>
       </div>
    </div>
  );

  const renderPreview = (files: File[]) => {
    const url = URL.createObjectURL(files[0]);
    return (
      <video 
        src={url} 
        controls 
        className="max-h-[350px] w-auto rounded shadow-lg border border-zinc-800" 
      />
    );
  };

  return (
    <ToolShell
      title="Trim Video"
      description="Cut out unwanted parts of your video files locally."
      acceptedTypes="video/*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={renderPreview}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default VideoTrim;
