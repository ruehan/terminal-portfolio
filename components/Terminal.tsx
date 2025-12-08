import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine, LineType, CameraTarget } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateAIResponse } from '../services/geminiService';
import { ProjectListWidget, ProfileWidget, ContactWidget } from './GuiWidgets';
import { useLanguage } from '../contexts/LanguageContext';

import { soundManager } from '../utils/sound';

interface TerminalProps {
  onNavigate: (target: CameraTarget) => void;
  onSelectProject: (id: string) => void;
  onOpenProfile: () => void;
  onToggleMatrix: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onNavigate, onSelectProject, onOpenProfile, onToggleMatrix }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiMode, setIsAiMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const konamiRef = useRef<string[]>([]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep focus on input
  const focusInput = () => inputRef.current?.focus();

  // Refocus when processing ends or history changes
  useEffect(() => {
    if (!isProcessing) {
      focusInput();
    }
  }, [isProcessing, history]);

  // Helper for dynamic text
  const LocalizedText = ({ selector }: { selector: (t: typeof TRANSLATIONS['en']) => string }) => {
    const { language } = useLanguage();
    return <pre className="whitespace-pre-wrap font-inherit max-w-full">{selector(TRANSLATIONS[language])}</pre>;
  };

  // Initial Welcome Message
  useEffect(() => {
    soundManager.playSuccess();
    const welcomeId = Date.now().toString();
    setHistory([
      {
        id: welcomeId,
        type: LineType.SYSTEM,
        content: <LocalizedText selector={t => t.WELCOME} />,
        timestamp: new Date()
      }
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const addToHistory = (content: React.ReactNode, type: LineType) => {
    setHistory(prev => [
      ...prev,
      { id: Date.now().toString() + Math.random(), type, content, timestamp: new Date() }
    ]);
  };

  const handleAiQuery = async (query: string) => {
    const loadingId = 'loading-' + Date.now();
    setHistory(prev => [...prev, { id: loadingId, type: LineType.SYSTEM, content: <LocalizedText selector={t => t.UI.searching} />, timestamp: new Date() }]);

    try {
      const aiResponse = await generateAIResponse(query, language);
      setHistory(prev => prev.filter(line => line.id !== loadingId));
      addToHistory(aiResponse, LineType.AI);
    } catch (e) {
      soundManager.playBeep();
      setHistory(prev => prev.filter(line => line.id !== loadingId));
      addToHistory(<LocalizedText selector={t => t.UI.system_error} />, LineType.ERROR);
    }
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    // In AI Mode, input is always AI query unless 'exit'
    if (isAiMode) {
      addToHistory(trimmed, LineType.INPUT);
      setInput('');
      
      if (trimmed.toLowerCase() === 'exit') {
        setIsAiMode(false);
        addToHistory(<LocalizedText selector={t => t.UI.ai_mode_exit} />, LineType.SYSTEM);
      } else {
        setIsProcessing(true);
        await handleAiQuery(trimmed);
        setIsProcessing(false);
      }
      return;
    }

    addToHistory(trimmed, LineType.INPUT);
    setInput('');
    setIsProcessing(true);

    const lowerCmd = trimmed.toLowerCase();

    // 1. Direct Parsing with GUI Widgets
    if (lowerCmd === 'help') {
      addToHistory(<LocalizedText selector={t => t.HELP_TEXT} />, LineType.OUTPUT);
      onNavigate('IDLE');
    } else if (lowerCmd === 'clear' || lowerCmd === 'cls') {
      setHistory([]);
      onNavigate('IDLE');
    } else if (lowerCmd === 'mute') {
      const isMuted = soundManager.toggleMute();
      addToHistory(isMuted ? "Audio Output: MUTED" : "Audio Output: ENABLED", LineType.SYSTEM);
    } else if (lowerCmd === 'about' || lowerCmd === 'whoami') {
      addToHistory(<ProfileWidget onOpenProfile={onOpenProfile} />, LineType.OUTPUT);
      onNavigate('ABOUT');
    } else if (lowerCmd === 'projects' || lowerCmd === 'ls') {
      addToHistory(<ProjectListWidget onSelectProject={onSelectProject} />, LineType.OUTPUT);
      onNavigate('PROJECTS');
    } else if (lowerCmd === 'contact') {
      addToHistory(<ContactWidget />, LineType.OUTPUT);
      onNavigate('CONTACT');
    } else if (lowerCmd === 'ai') {
      // Enter AI Mode
      setIsAiMode(true);
      addToHistory(<LocalizedText selector={t => t.UI.ai_mode_welcome} />, LineType.SYSTEM);
    } else if (lowerCmd.startsWith('ai ')) {
      // One-off AI query
      const query = trimmed.slice(3);
      await handleAiQuery(query);
    } else if (lowerCmd.startsWith('sudo')) {
      // Easter Egg: Sudo
      soundManager.playBeep();
      addToHistory(<LocalizedText selector={t => t.UI.sudo_message} />, LineType.ERROR);
    } else if (lowerCmd === 'matrix') {
      // Easter Egg: Matrix
      onToggleMatrix();
      addToHistory(<LocalizedText selector={t => t.UI.matrix_message} />, LineType.SYSTEM);
    } else if (lowerCmd === 'tip' || lowerCmd === 'hint') {
      // Tip Command
      const randomTip = t.UI.tips[Math.floor(Math.random() * t.UI.tips.length)];
      addToHistory(randomTip, LineType.SYSTEM);
    } else {
      // Unknown Command
      soundManager.playBeep();
      addToHistory(
        <span>
          <LocalizedText selector={t => t.UI.command_not_found} />
          {trimmed}
        </span>, 
        LineType.ERROR
      );
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    soundManager.playKeystroke();

    // Konami Code Logic
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    konamiRef.current.push(e.key);
    if (konamiRef.current.length > konamiCode.length) {
      konamiRef.current.shift();
    }
    if (JSON.stringify(konamiRef.current) === JSON.stringify(konamiCode)) {
      soundManager.playUnlock();
      addToHistory(<LocalizedText selector={t => t.UI.konami_message} />, LineType.SYSTEM);
      konamiRef.current = [];
    }

    if (e.key === 'Enter' && !isProcessing) {
      handleCommand(input);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col p-4 sm:p-6 font-mono text-sm sm:text-base overflow-hidden" 
      onClick={focusInput}
    >
      {/* Output Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2 pr-2">
        {history.map((line) => (
          <div key={line.id} className={`${line.type === LineType.AI ? 'text-zinc-200' : line.type === LineType.ERROR ? 'text-red-500' : 'text-zinc-400'}`}>
            <div className="flex flex-row items-start">
               {line.type === LineType.INPUT && <span className={`mr-2 opacity-90 shrink-0 ${isAiMode ? 'text-cyan-400' : 'text-white'}`}>{isAiMode ? t.UI.ai_prefix : t.UI.user_prefix}</span>}
               {line.type === LineType.AI && <span className="mr-2 text-zinc-300 opacity-90 shrink-0">{t.UI.ai_prefix}</span>}
               {line.type === LineType.SYSTEM && <span className="mr-2 text-zinc-500 opacity-70 shrink-0">{t.UI.system_name}</span>}
               
               <div className="w-full break-words leading-relaxed font-inherit">
                 {typeof line.content === 'string' ? (
                   <pre className="whitespace-pre-wrap font-inherit max-w-full">{line.content}</pre>
                 ) : (
                   line.content
                 )}
               </div>
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="animate-pulse text-zinc-500 opacity-50">{t.UI.processing}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className={`flex items-center border-t pt-4 bg-black/40 backdrop-blur-sm transition-colors duration-300 ${isAiMode ? 'border-cyan-900/50' : 'border-zinc-800'}`}>
        <span className={`mr-2 shrink-0 transition-colors duration-300 ${isAiMode ? 'text-cyan-400' : 'text-white'}`}>{isAiMode ? t.UI.ai_prefix : t.UI.user_prefix}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className={`flex-1 bg-transparent border-none outline-none placeholder-zinc-700 transition-colors duration-300 ${isAiMode ? 'text-cyan-100' : 'text-zinc-300'}`}
          placeholder={isAiMode ? t.UI.ai_input_placeholder : t.UI.input_placeholder}
          autoComplete="off"
          disabled={isProcessing}
        />
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[t.UI.commands.help, t.UI.commands.projects, t.UI.commands.about, t.UI.commands.contact].map(cmd => (
          <button
            key={cmd}
            onClick={(e) => { e.stopPropagation(); handleCommand(cmd); }}
            className="px-3 py-1 border border-zinc-700 text-zinc-500 text-xs hover:bg-zinc-800 hover:text-white transition-colors uppercase tracking-wider"
          >
            [{cmd}]
          </button>
        ))}
      </div>
    </div>
  );
};