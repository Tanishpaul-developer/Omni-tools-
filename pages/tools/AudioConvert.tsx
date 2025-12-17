import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { FileAudio, Settings } from 'lucide-react';

const AudioConvert: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [format, setFormat] = useState("mp3");
  const [quality, setQuality] = useState("192k");

  const handleProcess = async (files: File[]) => {
    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate FFmpeg conversion
        for (let i = 0; i <= 100; i += 10) {
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
            <Settings className="h-4 w-4 mr-2" /> Conversion Settings
         </label>
         
         <div className="space-y-3">
            <div>
               <label className="text-xs text-zinc-500 mb-1 block">Output Format</label>
               <select 
                 value={format}
                 onChange={(e) => setFormat(e.target.value)}
                 className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
               >
                 <option value="mp3">MP3</option>
                 <option value="wav">WAV</option>
                 <option value="m4a">M4A (AAC)</option>
                 <option value="ogg">OGG</option>
                 <option value="flac">FLAC</option>
               </select>
            </div>

            <div>
               <label className="text-xs text-zinc-500 mb-1 block">Bitrate / Quality</label>
               <select 
                 value={quality}
                 onChange={(e) => setQuality(e.target.value)}
                 className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
               >
                 <option value="320k">320 kbps (High)</option>
                 <option value="256k">256 kbps</option>
                 <option value="192k">192 kbps (Standard)</option>
                 <option value="128k">128 kbps</option>
                 <option value="64k">64 kbps (Low)</option>
               </select>
            </div>
         </div>
       </div>
    </div>
  );

  return (
    <ToolShell
      title="Audio Converter"
      description="Convert audio files between different formats easily."
      acceptedTypes="audio/*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={(files) => (
        <div className="flex flex-col items-center justify-center text-zinc-400">
           <FileAudio className="h-16 w-16 mb-4 opacity-50" />
           <p className="text-lg font-medium">{files[0].name}</p>
        </div>
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default AudioConvert;
