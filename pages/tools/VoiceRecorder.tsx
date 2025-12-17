import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { cn } from '../../lib/utils';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Visualizer Setup
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      drawVisualizer();

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        cancelAnimationFrame(animationFrameRef.current!);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError(null);
      
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error(err);
      let errorMessage = "Could not access microphone.";
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = "Microphone permission denied. Please allow access in your browser settings.";
        } else if (err.name === 'NotFoundError') {
            errorMessage = "No microphone device found on this system.";
        } else if (err.name === 'NotReadableError') {
            errorMessage = "Microphone is already in use by another application.";
        }
      }
      setError(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#18181b'; // card bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        ctx.fillStyle = `rgb(${barHeight + 59}, 130, 246)`; // primary colorish
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    };
    draw();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Voice Recorder</h2>
        <p className="text-zinc-400">Record high-quality audio directly from your browser.</p>
      </div>

      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-8 relative overflow-hidden">
        {error ? (
           <div className="text-center space-y-4">
             <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
             <p className="text-red-400 max-w-sm mx-auto">{error}</p>
             <Button onClick={() => setError(null)}>Try Again</Button>
           </div>
        ) : !audioBlob ? (
          <>
            <div className="relative">
              <div className={cn(
                "h-40 w-40 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                isRecording ? "border-red-500 bg-red-500/10 animate-pulse" : "border-zinc-700 bg-zinc-800"
              )}>
                {isRecording ? (
                   <div className="text-center">
                      <div className="text-3xl font-mono font-bold text-red-500 mb-1">{formatTime(recordingTime)}</div>
                      <span className="text-xs text-red-400 uppercase tracking-wider">Recording</span>
                   </div>
                ) : (
                   <Mic className="h-16 w-16 text-zinc-400" />
                )}
              </div>
            </div>

            {/* Visualizer Canvas */}
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={100} 
              className={cn("w-full h-24 rounded opacity-0 transition-opacity", isRecording && "opacity-100")}
            />

            <div className="flex gap-4">
              {!isRecording ? (
                <Button size="lg" onClick={startRecording} className="w-32 rounded-full">
                   Record
                </Button>
              ) : (
                <Button size="lg" variant="danger" onClick={stopRecording} className="w-32 rounded-full">
                   <Square className="h-4 w-4 mr-2 fill-current" /> Stop
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="w-full max-w-md space-y-6 animate-in zoom-in duration-300">
            <div className="text-center space-y-2">
               <h3 className="text-xl font-medium text-white">Recording Finished</h3>
               <p className="text-zinc-400">{formatTime(recordingTime)}</p>
            </div>
            
            <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
            
            <div className="grid grid-cols-2 gap-4">
               <Button variant="outline" onClick={reset}>
                 <RefreshCw className="h-4 w-4 mr-2" /> New Recording
               </Button>
               <a href={URL.createObjectURL(audioBlob)} download={`recording_${new Date().getTime()}.webm`} className="w-full">
                 <Button className="w-full">
                   <Download className="h-4 w-4 mr-2" /> Download
                 </Button>
               </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default VoiceRecorder;
