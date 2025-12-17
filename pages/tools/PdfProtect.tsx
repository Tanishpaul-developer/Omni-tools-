import React, { useState } from 'react';
import ToolShell from '../../components/shared/ToolShell';
import { ProcessingState } from '../../types';
import { delay, getErrorMessage } from '../../lib/utils';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PdfProtect: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'idle', progress: 0 });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleProcess = async (files: File[]) => {
    if (password.length < 1) {
      alert("Please enter a password.");
      return;
    }
    setState({ status: 'processing', progress: 0 });
    
    try {
        // Simulate Encryption
        await delay(1000);
        setState(prev => ({ ...prev, progress: 50 }));
        await delay(1000);
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
            <Lock className="h-4 w-4 mr-2" /> Security Settings
         </label>
         
         <div>
            <label className="text-xs text-zinc-500 mb-1 block">Set Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter strong password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary outline-none pr-10"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              This password will be required to open the document.
            </p>
         </div>
       </div>
    </div>
  );

  return (
    <ToolShell
      title="Protect PDF"
      description="Encrypt your PDF files with a password."
      acceptedTypes=".pdf"
      onProcess={handleProcess}
      processingState={state}
      renderSettings={renderSettings}
      onResetError={() => setState({ status: 'idle', progress: 0, error: undefined })}
    />
  );
};

export default PdfProtect;
