import { LucideIcon } from 'lucide-react';

export type ToolCategory = 'video' | 'audio' | 'pdf' | 'converter';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  path: string;
  popular?: boolean;
  isNew?: boolean;
}

export interface ProcessingState {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number; // 0 to 100
  message?: string;
  error?: string;
  resultUrl?: string;
}

export interface FileWithPreview extends File {
  preview?: string;
}
