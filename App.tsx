import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';

// Tools
import VideoTrim from './pages/tools/VideoTrim';
import VideoCrop from './pages/tools/VideoCrop';
import VideoMerge from './pages/tools/VideoMerge';
import RemoveLogo from './pages/tools/RemoveLogo';
import ExtractFrames from './pages/tools/ExtractFrames';
import AudioConvert from './pages/tools/AudioConvert';
import AudioVolume from './pages/tools/AudioVolume';
import VoiceRecorder from './pages/tools/VoiceRecorder';
import PdfMerge from './pages/tools/PdfMerge';
import PdfCompress from './pages/tools/PdfCompress';
import PdfProtect from './pages/tools/PdfProtect';
import ImageConvert from './pages/tools/ImageConvert';
import UniversalConvert from './pages/tools/UniversalConvert';

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Category Pages */}
          <Route path="/video" element={<Dashboard filterCategory="video" />} />
          <Route path="/audio" element={<Dashboard filterCategory="audio" />} />
          <Route path="/pdf" element={<Dashboard filterCategory="pdf" />} />
          <Route path="/converter" element={<Dashboard filterCategory="converter" />} />

          {/* Video Tools */}
          <Route path="/video/trim" element={<VideoTrim />} />
          <Route path="/video/crop" element={<VideoCrop />} />
          <Route path="/video/merge" element={<VideoMerge />} />
          <Route path="/video/remove-logo" element={<RemoveLogo />} />
          <Route path="/video/extract-frames" element={<ExtractFrames />} />

          {/* Audio Tools */}
          <Route path="/audio/convert" element={<AudioConvert />} />
          <Route path="/audio/volume" element={<AudioVolume />} />
          <Route path="/audio/recorder" element={<VoiceRecorder />} />

          {/* PDF Tools */}
          <Route path="/pdf/merge" element={<PdfMerge />} />
          <Route path="/pdf/compress" element={<PdfCompress />} />
          <Route path="/pdf/protect" element={<PdfProtect />} />

          {/* Converter Tools */}
          <Route path="/converter/image" element={<ImageConvert />} />
          <Route path="/converter/universal" element={<UniversalConvert />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </Router>
  );
};

export default App;
