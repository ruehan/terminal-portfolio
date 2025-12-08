import React, { useState } from 'react';
import { Scene } from './components/Scene';
import { Terminal } from './components/Terminal';
import { BootSequence } from './components/BootSequence';
import { SystemStatus } from './components/SystemStatus';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { CameraTarget } from './types';
import { useLanguage } from './contexts/LanguageContext';

import { soundManager } from './utils/sound';

import { MatrixRain } from './components/MatrixRain';
import { SnakeGame } from './components/SnakeGame';

function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [booted, setBooted] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<CameraTarget>('IDLE');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  if (!hasStarted) {
    return (
      <div 
        className="w-screen h-screen bg-black flex items-center justify-center cursor-pointer"
        onClick={() => {
          soundManager.initialize();
          setHasStarted(true);
        }}
      >
        <div className="text-zinc-500 font-mono animate-pulse tracking-widest">
          [ CLICK TO INITIALIZE SYSTEM ]
        </div>
      </div>
    );
  }

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      {/* Visual Overlays: Scanlines & Flicker */}
      <div className="scanline"></div>
      <div className="flicker"></div>

      {/* Layer 1: 3D Background */}
      <Scene cameraTarget={cameraTarget} />

      {/* Layer 1.5: Visual Effects */}
      {showMatrix && <MatrixRain />}
      {showGame && <SnakeGame onClose={() => setShowGame(false)} />}

      {/* Layer 2: UI Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        {/* Glassmorphism Container */}
        <div className="relative w-full max-w-5xl h-[70vh] md:h-[80vh] bg-black/80 backdrop-blur-md rounded-lg border border-theme shadow-[0_0_60px_rgba(255,255,255,0.05)] flex flex-col overflow-hidden transition-all duration-500 ease-in-out">
          
          {/* Window Header */}
          <div className="h-8 bg-zinc-900 border-b border-theme flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center space-x-2">
               <div className="text-xs text-zinc-500 tracking-widest">
                Z-SHELL :: ROOT ACCESS :: SECURE
               </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle Button */}
              <button 
                onClick={toggleLanguage}
                className="text-[10px] font-bold text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded hover:bg-zinc-800 hover:text-white transition-colors"
              >
                {language === 'ko' ? 'EN' : 'KO'}
              </button>

              {/* Mac-like Window Controls */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div> {/* Red */}
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div> {/* Yellow */}
                <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div> {/* Green */}
              </div>
            </div>
          </div>

          {/* Terminal Content */}
          <Terminal 
            onNavigate={setCameraTarget} 
            onSelectProject={setSelectedProjectId}
            onOpenProfile={() => setShowProfileModal(true)}
            onToggleMatrix={() => setShowMatrix(prev => !prev)}
            onToggleGame={() => setShowGame(prev => !prev)}
          />
          
          {/* System Status Footer */}
          <SystemStatus />
          
          {/* Modal Overlays (Rendered inside the container) */}
          {selectedProjectId && (
            <ProjectDetailModal 
              projectId={selectedProjectId} 
              onClose={() => setSelectedProjectId(null)} 
            />
          )}

          {showProfileModal && (
            <ProfileDetailModal 
              onClose={() => setShowProfileModal(false)}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default App;