import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { GripVertical } from 'lucide-react';

const PdfMerge: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });

  const handleProcess = async (files: File[]) => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }
    
    // Simulation of pdf-lib
    setState({ status: 'processing', progress: 0 });

    try {
      await delay(500);
      setState(prev => ({ ...prev, progress: 30 }));
      await delay(500);
      setState(prev => ({ ...prev, progress: 60 }));
      await delay(500);
      setState(prev => ({ ...prev, progress: 100 }));
      
      setState({ 
        status: 'success', 
        progress: 100, 
        resultUrl: '#' // Placeholder
      });
    } catch (e) {
      setState({ status: 'error', progress: 0, error: getErrorMessage(e) });
    }
  };

  const renderSettings = (files: File[]) => (
    <div className="space-y-4">
       <label className="text-sm font-medium text-zinc-300">File Order</label>
       <div className="space-y-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
          {files.map((file, idx) => (
             <div key={idx} className="flex items-center p-2 bg-zinc-800 rounded text-sm text-zinc-200 cursor-grab active:cursor-grabbing">
               <GripVertical className="h-4 w-4 mr-2 text-zinc-500" />
               <span className="truncate flex-1">{file.name}</span>
               <span className="text-xs text-zinc-500 ml-2">Page 1-{idx + 3}</span>
             </div>
          ))}
       </div>
       <p className="text-xs text-zinc-500">Drag files to reorder (Coming soon in demo)</p>
    </div>
  );

  return (
    <ToolShell
      title="Merge PDF"
      description="Combine multiple PDF documents into a single file."
      acceptedTypes=".pdf"
      maxFiles={10}
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={() => (
        <div className="flex flex-col items-center justify-center space-y-2 text-zinc-500">
           <div className="w-32 h-44 bg-zinc-800 border border-zinc-700 rounded flex items-center justify-center shadow-lg">
             <span className="text-xs">Preview N/A</span>
           </div>
           <p className="text-xs">PDF Previews render client-side</p>
        </div>
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default PdfMerge;
