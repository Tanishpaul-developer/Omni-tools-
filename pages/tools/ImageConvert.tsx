import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { ImageIcon, Settings } from 'lucide-react';
import { getErrorMessage } from '../../lib/utils';

const ImageConvert: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.9);

  const handleProcess = async (files: File[]) => {
    if (files.length === 0) return;
    setState({ status: 'processing', progress: 0 });

    try {
      const file = files[0];
      const bitmap = await createImageBitmap(file);
      
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context. Your browser might not support this operation.");
      
      // Draw image
      ctx.drawImage(bitmap, 0, 0);
      setState(prev => ({ ...prev, progress: 50 }));

      // Convert
      canvas.toBlob((blob) => {
        if (!blob) {
           setState({ status: 'error', progress: 0, error: 'Failed to encode image to requested format.' });
           return;
        }
        const url = URL.createObjectURL(blob);
        setState({ status: 'success', progress: 100, resultUrl: url });
      }, format, quality);

    } catch (e) {
      console.error(e);
      setState({ status: 'error', progress: 0, error: getErrorMessage(e) });
    }
  };

  const renderSettings = () => (
    <div className="space-y-6">
       <div className="space-y-4">
         <label className="text-sm font-medium text-zinc-300 flex items-center">
            <Settings className="h-4 w-4 mr-2" /> Conversion Settings
         </label>
         
         <div className="space-y-4">
            <div>
               <label className="text-xs text-zinc-500 mb-1 block">Output Format</label>
               <select 
                 value={format}
                 onChange={(e) => setFormat(e.target.value)}
                 className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
               >
                 <option value="image/png">PNG</option>
                 <option value="image/jpeg">JPG / JPEG</option>
                 <option value="image/webp">WEBP</option>
               </select>
            </div>

            {format !== 'image/png' && (
              <div>
                 <div className="flex justify-between mb-1">
                   <label className="text-xs text-zinc-500">Quality</label>
                   <span className="text-xs text-primary font-medium">{Math.round(quality * 100)}%</span>
                 </div>
                 <input 
                   type="range" 
                   min="0.1" 
                   max="1" 
                   step="0.1"
                   value={quality}
                   onChange={(e) => setQuality(Number(e.target.value))}
                   className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                 />
              </div>
            )}
         </div>
       </div>
    </div>
  );

  return (
    <ToolShell
      title="Image Converter"
      description="Convert images to different formats entirely in your browser."
      acceptedTypes="image/*"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      renderPreview={(files) => (
         <img src={URL.createObjectURL(files[0])} alt="Preview" className="max-h-[300px] object-contain rounded" />
      )}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default ImageConvert;
