import { 
  Video, 
  Scissors, 
  Layers, 
  Music, 
  Volume2, 
  FileText, 
  Combine, 
  Image as ImageIcon,
  Zap,
  Mic,
  Repeat,
  Crop,
  Lock,
  FileCheck,
  Eraser,
  Film
} from 'lucide-react';
import { ToolDefinition } from './types';

export const TOOLS: ToolDefinition[] = [
  // Video Tools
  {
    id: 'video-trim',
    name: 'Trim Video',
    description: 'Cut out unwanted parts of your video without re-encoding.',
    category: 'video',
    icon: Scissors,
    path: '/video/trim',
    popular: true
  },
  {
    id: 'video-crop',
    name: 'Crop Video',
    description: 'Crop your video to a custom aspect ratio or size.',
    category: 'video',
    icon: Crop,
    path: '/video/crop'
  },
  {
    id: 'video-extract-frames',
    name: 'Extract Frames',
    description: 'Capture high-quality images from specific video moments.',
    category: 'video',
    icon: Film,
    path: '/video/extract-frames',
    isNew: true
  },
  {
    id: 'video-remove-logo',
    name: 'Remove Logo',
    description: 'Blur specific regions to hide watermarks or logos.',
    category: 'video',
    icon: Eraser,
    path: '/video/remove-logo',
    isNew: true
  },
  {
    id: 'video-merge',
    name: 'Merge Videos',
    description: 'Combine multiple video clips into one single file.',
    category: 'video',
    icon: Layers,
    path: '/video/merge',
    isNew: true
  },
  
  // Audio Tools
  {
    id: 'audio-converter',
    name: 'Audio Converter',
    description: 'Convert audio files to MP3, WAV, M4A, FLAC and more.',
    category: 'audio',
    icon: Music,
    path: '/audio/convert'
  },
  {
    id: 'audio-volume',
    name: 'Change Volume',
    description: 'Increase or decrease the volume of your audio file.',
    category: 'audio',
    icon: Volume2,
    path: '/audio/volume'
  },
  {
    id: 'voice-recorder',
    name: 'Voice Recorder',
    description: 'Record audio directly from your microphone.',
    category: 'audio',
    icon: Mic,
    path: '/audio/recorder',
    isNew: true
  },

  // PDF Tools
  {
    id: 'pdf-merge',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document.',
    category: 'pdf',
    icon: Combine,
    path: '/pdf/merge',
    popular: true
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    description: 'Reduce the file size of your PDF documents.',
    category: 'pdf',
    icon: FileCheck,
    path: '/pdf/compress'
  },
  {
    id: 'pdf-protect',
    name: 'Protect PDF',
    description: 'Add password protection to your PDF files.',
    category: 'pdf',
    icon: Lock,
    path: '/pdf/protect'
  },

  // Converters
  {
    id: 'image-convert',
    name: 'Image Converter',
    description: 'Convert images to JPG, PNG, WEBP, and other formats.',
    category: 'converter',
    icon: ImageIcon,
    path: '/converter/image',
    popular: true
  },
  {
    id: 'universal-convert',
    name: 'Universal Converter',
    description: 'Convert between almost any file format.',
    category: 'converter',
    icon: Zap,
    path: '/converter/universal'
  }
];