import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine, LineType, CameraTarget } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateAIResponse } from '../services/geminiService';
import { ProjectListWidget, ProfileWidget, ContactWidget, ThemeSelector } from './GuiWidgets';
import { useLanguage } from '../contexts/LanguageContext';

import { soundManager } from '../utils/sound';

import { useTheme, Theme } from '../contexts/ThemeContext';

interface TerminalProps {
  onNavigate: (target: CameraTarget) => void;
  onSelectProject: (id: string) => void;
  onOpenProfile: () => void;
  onToggleMatrix: () => void;
  onToggleGame: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onNavigate, onSelectProject, onOpenProfile, onToggleMatrix, onToggleGame }) => {
  const { language } = useLanguage();
  const { theme, setTheme, availableThemes } = useTheme();
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
    } else if (lowerCmd === 'game' || lowerCmd === 'snake') {
      // Mini Game: Snake
      onToggleGame();
      addToHistory("Launching Snake Game...", LineType.SYSTEM);
    } else if (lowerCmd === 'tip' || lowerCmd === 'hint') {
      // Tip Command
      const tipIndex = Math.floor(Math.random() * t.UI.tips.length);
      addToHistory(<LocalizedText selector={t => t.UI.tips[tipIndex]} />, LineType.SYSTEM);
    } else if (lowerCmd.startsWith('theme')) {
      // Theme Command
      const args = lowerCmd.split(' ');
      if (args.length === 1 || args[1] === 'list') {
        addToHistory(<ThemeSelector />, LineType.SYSTEM);
      } else {
        const targetTheme = args[1] as Theme;
        if (availableThemes.includes(targetTheme)) {
          setTheme(targetTheme);
          addToHistory(`Theme changed to: ${targetTheme}`, LineType.SYSTEM);
        } else {
          addToHistory(`Theme '${targetTheme}' not found. Type 'theme list' for options.`, LineType.ERROR);
        }
      }
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

    // History & Autocomplete State
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const handleKeyDown = (e: React.KeyboardEvent) => {
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
      soundManager.playKeystroke();
      if (input.trim()) {
        setCommandHistory(prev => [...prev, input]);
        setHistoryIndex(-1);
      }
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cmds = Object.values(t.UI.commands);
      const match = cmds.find(c => c.startsWith(input.toLowerCase()));
      if (match) {
        setInput(match);
      }
    } else {
        soundManager.playKeystroke();
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
          line.type === LineType.INPUT ? (
          <div key={line.id} className="flex flex-row items-start">
            <span className={`mr-2 opacity-90 shrink-0 ${isAiMode ? 'text-theme-highlight' : 'text-theme-primary'}`}>{isAiMode ? t.UI.ai_prefix : t.UI.user_prefix}</span>
            <div className="w-full break-words leading-relaxed font-inherit text-theme-primary">
              {typeof line.content === 'string' ? (
                <pre className="whitespace-pre-wrap font-inherit max-w-full">{line.content}</pre>
              ) : (
                line.content
              )}
            </div>
          </div>
        ) : line.type === LineType.OUTPUT ? (
          <div key={line.id} className="text-theme-dim whitespace-pre-wrap mb-2 leading-relaxed">
            {line.content}
          </div>
        ) : line.type === LineType.SYSTEM ? (
          <div key={line.id} className="text-theme-highlight font-mono text-sm mb-2 opacity-80">
            {line.content}
          </div>
        ) : line.type === LineType.ERROR ? (
          <div key={line.id} className="text-theme-error font-bold mb-2">
            {line.content}
          </div>
        ) : line.type === LineType.AI ? (
           <div key={line.id} className="flex mb-4 animate-fade-in">
            <div className="flex-shrink-0 mr-3 mt-1 text-theme-highlight">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1 bg-zinc-900/50 p-3 rounded border border-theme text-theme-primary leading-relaxed whitespace-pre-wrap">
               <strong className="block text-xs text-theme-dim mb-1 border-b border-zinc-700 pb-1">{t.UI.ai_prefix}</strong>
               {line.content}
            </div>
          </div>
        ) : null
        ))}
        {isProcessing && (
           <div className="animate-pulse text-zinc-500 opacity-50">{t.UI.processing}</div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="flex items-center text-theme-primary pt-2 border-t border-zinc-800/50 mt-2">
        <span className="font-bold mr-2 animate-pulse">
          {isAiMode ? t.UI.ai_prefix : t.UI.user_prefix}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none text-theme-primary placeholder-zinc-600 font-inherit"
          placeholder={isAiMode ? t.UI.ai_input_placeholder : t.UI.input_placeholder}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[t.UI.commands.help, t.UI.commands.projects, t.UI.commands.about, t.UI.commands.contact, t.UI.commands.tip, t.UI.commands.game, t.UI.commands.theme].map(cmd => (
          <button
            key={cmd}
            onClick={(e) => { e.stopPropagation(); handleCommand(cmd); }}
            className="px-3 py-1 text-xs border border-theme text-theme-dim hover:bg-theme-bg hover:text-theme-highlight transition-colors rounded opacity-70 hover:opacity-100"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};