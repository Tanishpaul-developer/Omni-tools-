import React, { useState, useRef, useEffect } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Film, Camera, Clock, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const ExtractFrames: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [format, setFormat] = useState<'png' | 'jpg'>('jpg');
  const [currentTime, setCurrentTime] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Update current time state when video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [videoRef.current]);

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8);
  };

  const addTimestamp = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      if (!timestamps.includes(time)) {
        setTimestamps([...timestamps, time].sort((a, b) => a - b));
      }
    }
  };

  const removeTimestamp = (time: number) => {
    setTimestamps(timestamps.filter(t => t !== time));
  };

  const handleProcess = async (files: File[]) => {
    if (timestamps.length === 0) {
      alert("Please select at least one frame to extract.");
      return;
    }

    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate Frame Extraction
        const total = timestamps.length;
        for (let i = 0; i < total; i++) {
            await delay(500); // Simulate processing time per frame
            setState(prev => ({ 
                ...prev, 
                progress: Math.round(((i + 1) / total) * 100) 
            }));
        }
        
        setState({ 
            status: 'success', 
            progress: 100, 
            resultUrl: '#' 
        });
    } catch (e) {
        setState({ status: 'error', progress: 0, error: getErrorMessage(e) });
    }
  };

  const renderSettings = () => (
    <div className="space-y-6">
       <div className="space-y-4">
         <label className="text-sm font-medium text-zinc-300 flex items-center">
            <Film className="h-4 w-4 mr-2" /> Frame Settings
         </label>

         {/* Format Selection */}
         <div>
            <label className="text-xs text-zinc-500 mb-1 block">Image Format</label>
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
              <button 
                onClick={() => setFormat('jpg')}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${format === 'jpg' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                JPG
              </button>
              <button 
                onClick={() => setFormat('png')}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${format === 'png' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                PNG
              </button>
            </div>
         </div>

         {/* Capture Controls */}
         <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
               <span className="text-xs text-zinc-400 font-mono">
                 {formatTime(currentTime)}
               </span>
               <span className="text-xs text-zinc-500">
                 Current Time
               </span>
            </div>
            <Button onClick={addTimestamp} className="w-full" size="sm">
              <Camera className="h-4 w-4 mr-2" /> Mark Frame
            </Button>
         </div>
         
         {/* Timestamps List */}
         <div className="space-y-2">
           <label className="text-xs text-zinc-500 block">Selected Frames ({timestamps.length})</label>
           <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {timestamps.length === 0 && (
                <div className="text-center py-4 text-xs text-zinc-600 border border-dashed border-zinc-800 rounded">
                  No frames selected
                </div>
              )}
              {timestamps.map((time, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded group">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <span className="text-xs text-zinc-300 font-mono">{formatTime(time)}</span>
                  </div>
                  <button 
                    onClick={() => removeTimestamp(time)}
                    className="text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
           </div>
         </div>

       </div>
    </div>
  );

  const renderPreview = (files: File[]) => {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        <video 
           ref={videoRef}
           src={URL.createObjectURL(files[0])} 
           className="max-h-[350px] w-auto rounded shadow-lg"
           controls
        />
      </div>
    );
  };

  return (
    <ToolShell
      title="Extract Frames"
      description="Save specific video frames as high-quality images."
      acceptedTypes="video/*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={renderPreview}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default ExtractFrames;
