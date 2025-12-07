import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine, LineType, CameraTarget } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateAIResponse } from '../services/geminiService';
import { ProjectListWidget, ProfileWidget, ContactWidget } from './GuiWidgets';
import { useLanguage } from '../contexts/LanguageContext';

interface TerminalProps {
  onNavigate: (target: CameraTarget) => void;
  onSelectProject: (id: string) => void;
  onOpenProfile: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ onNavigate, onSelectProject, onOpenProfile }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Keep focus on input
  const focusInput = () => inputRef.current?.focus();

  // Helper for dynamic text
  const LocalizedText = ({ selector }: { selector: (t: typeof TRANSLATIONS['en']) => string }) => {
    const { language } = useLanguage();
    return <pre className="whitespace-pre-wrap font-inherit max-w-full">{selector(TRANSLATIONS[language])}</pre>;
  };

  // Initial Welcome Message
  useEffect(() => {
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

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

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
    } else if (lowerCmd === 'about' || lowerCmd === 'whoami') {
      addToHistory(<ProfileWidget onOpenProfile={onOpenProfile} />, LineType.OUTPUT);
      onNavigate('ABOUT');
    } else if (lowerCmd === 'projects' || lowerCmd === 'ls') {
      addToHistory(<ProjectListWidget onSelectProject={onSelectProject} />, LineType.OUTPUT);
      onNavigate('PROJECTS');
    } else if (lowerCmd === 'contact') {
      addToHistory(<ContactWidget />, LineType.OUTPUT);
      onNavigate('CONTACT');
    } else {
      // 2. AI Fallback
      const loadingId = 'loading-' + Date.now();
      setHistory(prev => [...prev, { id: loadingId, type: LineType.SYSTEM, content: <LocalizedText selector={t => t.UI.searching} />, timestamp: new Date() }]);

      try {
        const aiResponse = await generateAIResponse(trimmed, language);
        setHistory(prev => prev.filter(line => line.id !== loadingId));
        addToHistory(aiResponse, LineType.AI);
      } catch (e) {
        setHistory(prev => prev.filter(line => line.id !== loadingId));
        addToHistory(<LocalizedText selector={t => t.UI.system_error} />, LineType.ERROR);
      }
    }

    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
               {line.type === LineType.INPUT && <span className="mr-2 text-white opacity-90 shrink-0">{t.UI.user_prefix}</span>}
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
      <div className="flex items-center border-t border-zinc-800 pt-4 bg-black/40 backdrop-blur-sm">
        <span className="text-white mr-2 shrink-0">{t.UI.user_prefix}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-zinc-300 placeholder-zinc-700"
          placeholder={t.UI.input_placeholder}
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