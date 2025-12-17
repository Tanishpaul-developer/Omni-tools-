import React, { useRef, useState } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle, Download, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { cn, formatBytes } from '../../lib/utils';
import { ProcessingState } from '../../types';

interface ToolShellProps {
  title: string;
  description: string;
  acceptedTypes: string; // e.g. "video/*" or ".pdf"
  maxFiles?: number;
  onProcess: (files: File[]) => Promise<void>;
  processingState: ProcessingState;
  renderSettings?: (files: File[]) => React.ReactNode;
  renderPreview?: (files: File[]) => React.ReactNode;
  onResetError?: () => void;
}

const ToolShell: React.FC<ToolShellProps> = ({
  title,
  description,
  acceptedTypes,
  maxFiles = 1,
  onProcess,
  processingState,
  renderSettings,
  renderPreview,
  onResetError
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      setFiles(newFiles);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(0, maxFiles);
      setFiles(newFiles);
    }
  };

  const resetTool = () => {
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onResetError) onResetError();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        <p className="text-zinc-400">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-[500px]">
        {/* Left Column: Input / Preview */}
        <div className="lg:col-span-2 space-y-4">
          <Card className={cn(
            "h-full min-h-[400px] flex flex-col items-center justify-center p-8 border-2 border-dashed transition-all",
            isDragging ? "border-primary bg-primary/5" : "border-zinc-800 bg-zinc-900/50",
            files.length > 0 ? "border-solid border-zinc-700 justify-start" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center">
                  <UploadCloud className="h-8 w-8 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-white">Drop your files here</h3>
                  <p className="text-sm text-zinc-400">or click to browse from your device</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept={acceptedTypes}
                  multiple={maxFiles > 1}
                  onChange={handleFileSelect}
                />
                <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
                  Select Files
                </Button>
                <p className="text-xs text-zinc-500 pt-4">Max file size: 2GB (Client-side)</p>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col">
                {/* File Header */}
                <div className="flex items-center justify-between w-full pb-4 border-b border-zinc-800 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white truncate max-w-[200px]">{files[0].name}</p>
                      <p className="text-xs text-zinc-500">{formatBytes(files[0].size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={resetTool} disabled={processingState.status === 'processing'}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Preview Area */}
                <div className="flex-1 w-full bg-black/40 rounded-lg overflow-hidden flex items-center justify-center relative">
                   {renderPreview ? renderPreview(files) : (
                      <div className="text-zinc-500 flex flex-col items-center">
                        <FileIcon className="h-12 w-12 mb-2 opacity-20" />
                        <span>No Preview Available</span>
                      </div>
                   )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Settings & Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="h-full p-6 flex flex-col">
            <h3 className="font-semibold text-lg mb-6 text-white">Tool Settings</h3>
            
            <div className="flex-1">
               {files.length > 0 && processingState.status === 'idle' && renderSettings && renderSettings(files)}
               
               {files.length === 0 && (
                 <div className="text-zinc-500 text-sm italic">Upload a file to configure settings.</div>
               )}

               {/* Processing Status UI */}
               {processingState.status === 'processing' && (
                 <div className="space-y-4 py-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-400">
                        <span>Processing...</span>
                        <span>{processingState.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300 ease-out"
                          style={{ width: `${processingState.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-zinc-400 animate-pulse">
                      Do not close this tab. Processing is happening locally on your device.
                    </p>
                 </div>
               )}

               {/* Success UI */}
               {processingState.status === 'success' && (
                 <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-white font-medium">Done!</h4>
                      <p className="text-sm text-zinc-400">Your file is ready.</p>
                    </div>
                    {processingState.resultUrl && (
                      <a href={processingState.resultUrl} download={`processed_${files[0]?.name}`} className="w-full">
                         <Button className="w-full">
                           <Download className="mr-2 h-4 w-4" /> Download File
                         </Button>
                      </a>
                    )}
                 </div>
               )}

                {/* Error UI */}
               {processingState.status === 'error' && (
                 <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                      <AlertCircle className="h-8 w-8" />
                    </div>
                    <div className="text-center">
                      <h4 className="text-white font-medium">Error</h4>
                      <p className="text-sm text-red-400">{processingState.error || "Something went wrong."}</p>
                    </div>
                    <Button 
                      variant="secondary" 
                      onClick={onResetError ? onResetError : () => window.location.reload()}
                    >
                      Try Again
                    </Button>
                 </div>
               )}
            </div>

            {/* Action Button */}
            {processingState.status === 'idle' && (
              <Button 
                className="w-full mt-6" 
                size="lg" 
                onClick={() => onProcess(files)}
                disabled={files.length === 0}
              >
                Start Processing
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToolShell;
