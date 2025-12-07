import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { TRANSLATIONS } from '../constants';

export const SystemStatus: React.FC = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [cpu, setCpu] = useState(12);
  const [mem, setMem] = useState(45);
  const [netUp, setNetUp] = useState(12);
  const [netDown, setNetDown] = useState(140);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(u => u + 1), 1000);
    const simulator = setInterval(() => {
      setCpu(Math.floor(Math.random() * 30) + 10);
      setMem(Math.floor(Math.random() * 5) + 42);
      setNetUp(Math.floor(Math.random() * 50) + 5);
      setNetDown(Math.floor(Math.random() * 200) + 50);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(simulator);
    };
  }, []);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const Bar = ({ percent }: { percent: number }) => (
    <div className="w-12 sm:w-16 h-1.5 bg-zinc-800 rounded-sm overflow-hidden ml-2">
      <div 
        className="h-full bg-zinc-400 transition-all duration-1000 ease-out shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
        style={{ width: `${percent}%` }}
      />
    </div>
  );

  return (
    <div className="h-8 bg-black/40 border-t border-zinc-800 backdrop-blur-sm flex items-center px-4 justify-between text-[10px] sm:text-xs font-mono text-zinc-500 select-none z-20">
       <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="flex items-center">
            <span className="font-bold text-zinc-400">{t.UI.status.cpu}</span>
            <Bar percent={cpu} />
            <span className="ml-2 w-6 text-right tabular-nums text-zinc-300">{cpu}%</span>
          </div>
          <div className="hidden sm:flex items-center">
            <span className="font-bold text-zinc-400">{t.UI.status.mem}</span>
            <Bar percent={mem} />
            <span className="ml-2 w-6 text-right tabular-nums text-zinc-300">{mem}%</span>
          </div>
       </div>
       
       <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 tabular-nums">
             <span className="font-bold text-zinc-400">{t.UI.status.net}</span>
             <span className="text-zinc-500 flex items-center">
                <span className="text-[8px] mr-0.5">▲</span>{netUp}k
             </span>
             <span className="text-zinc-500 flex items-center">
                <span className="text-[8px] mr-0.5">▼</span>{netDown}k
             </span>
          </div>
          <div className="flex items-center tabular-nums">
            <span className="font-bold text-zinc-400 mr-2">{t.UI.status.uptime}</span>
            <span className="text-zinc-200">{formatTime(uptime)}</span>
          </div>
       </div>
    </div>
  );
};