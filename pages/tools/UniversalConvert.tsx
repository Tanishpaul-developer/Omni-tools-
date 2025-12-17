import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Zap, ArrowRight } from 'lucide-react';

const UniversalConvert: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [targetFormat, setTargetFormat] = useState("");

  const getAvailableFormats = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'png', 'webp', 'jpeg'].includes(ext || '')) {
      return ['png', 'jpg', 'webp', 'pdf'];
    }
    if (['mp4', 'mov', 'avi'].includes(ext || '')) {
      return ['mp3', 'gif', 'webm', 'mp4'];
    }
    if (['mp3', 'wav', 'm4a'].includes(ext || '')) {
      return ['wav', 'mp3', 'aac'];
    }
    if (['doc', 'docx', 'txt'].includes(ext || '')) {
      return ['pdf', 'txt'];
    }
    return ['zip'];
  };

  const handleProcess = async (files: File[]) => {
    if (!targetFormat) {
       alert("Please select a target format.");
       return;
    }
    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate generic conversion
        for (let i = 0; i <= 100; i += 5) {
            await delay(100);
            setState(prev => ({ ...prev, progress: i }));
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

  const renderSettings = (files: File[]) => {
    const formats = getAvailableFormats(files[0].name);
    
    // Auto-select first if not set
    if (!targetFormat && formats.length > 0) {
      setTargetFormat(formats[0]);
    }

    return (
      <div className="space-y-6">
         <div className="space-y-4">
           <label className="text-sm font-medium text-zinc-300 flex items-center">
              <Zap className="h-4 w-4 mr-2" /> Convert To
           </label>
           
           <div className="flex items-center space-x-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
             <div className="px-3 py-1 bg-zinc-800 rounded text-sm text-zinc-400 font-mono">
               {files[0].name.split('.').pop()?.toUpperCase() || 'FILE'}
             </div>
             <ArrowRight className="h-4 w-4 text-zinc-600" />
             <select 
               value={targetFormat}
               onChange={(e) => setTargetFormat(e.target.value)}
               className="bg-primary/20 border border-primary text-primary rounded px-3 py-1 text-sm font-medium outline-none cursor-pointer"
             >
               {formats.map(f => (
                 <option key={f} value={f} className="bg-zinc-900 text-white">
                   {f.toUpperCase()}
                 </option>
               ))}
             </select>
           </div>
         </div>
      </div>
    );
  };

  return (
    <ToolShell
      title="Universal Converter"
      description="Convert almost any file type to another format."
      acceptedTypes="*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={(files) => (
         <div className="flex flex-col items-center justify-center text-zinc-500">
           <div className="h-20 w-20 bg-zinc-800 rounded flex items-center justify-center mb-2">
              <span className="text-2xl font-bold text-zinc-600">
                {files[0].name.split('.').pop()?.toUpperCase()}
              </span>
           </div>
           <p className="text-sm">{files[0].name}</p>
         </div>
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default UniversalConvert;
