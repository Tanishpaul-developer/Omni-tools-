import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Minimize2, Gauge } from 'lucide-react';

const PdfCompress: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [level, setLevel] = useState("medium");

  const handleProcess = async (files: File[]) => {
    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate Compression
        for (let i = 0; i <= 100; i += 5) {
            await delay(150);
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

  const renderSettings = () => (
    <div className="space-y-6">
       <div className="space-y-4">
         <label className="text-sm font-medium text-zinc-300 flex items-center">
            <Gauge className="h-4 w-4 mr-2" /> Compression Level
         </label>
         
         <div className="space-y-3">
           {[
             { id: 'low', name: 'Low Compression', desc: 'High Quality, Larger File' },
             { id: 'medium', name: 'Medium Compression', desc: 'Good Quality, Good Compression' },
             { id: 'high', name: 'High Compression', desc: 'Lower Quality, Smallest File' }
           ].map((opt) => (
             <div 
               key={opt.id}
               onClick={() => setLevel(opt.id)}
               className={`p-3 rounded-lg border cursor-pointer transition-all ${
                 level === opt.id 
                   ? 'bg-primary/10 border-primary' 
                   : 'bg-zinc-900 border-zinc-700 hover:bg-zinc-800'
               }`}
             >
               <div className="flex items-center justify-between">
                 <span className={`text-sm font-medium ${level === opt.id ? 'text-primary' : 'text-zinc-200'}`}>
                   {opt.name}
                 </span>
                 {level === opt.id && <div className="h-2 w-2 rounded-full bg-primary" />}
               </div>
               <p className="text-xs text-zinc-500 mt-1">{opt.desc}</p>
             </div>
           ))}
         </div>
       </div>
    </div>
  );

  return (
    <ToolShell
      title="Compress PDF"
      description="Reduce the file size of your PDF documents maintaining good quality."
      acceptedTypes=".pdf"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={() => (
         <div className="text-zinc-500 flex flex-col items-center">
           <Minimize2 className="h-12 w-12 mb-2 opacity-20" />
           <span>PDF Preview</span>
         </div>
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default PdfCompress;
