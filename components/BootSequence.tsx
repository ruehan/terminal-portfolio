import React, { useEffect, useState } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "BIOS CHECK... OK",
  "LOADING Z-SHELL KERNEL...",
  "MOUNTING FILE SYSTEM /dev/sda1...",
  "CONNECTING TO RUEHAN'S NETWORK...",
  "ESTABLISHING SECURE LINK...",
  "INITIALIZING 3D ENGINE (WEBGL)...",
  "ACCESS GRANTED."
];

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    let delay = 0;
    
    BOOT_LOGS.forEach((log, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (index === BOOT_LOGS.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-8 font-mono text-zinc-300">
      <div className="w-full max-w-lg">
        {logs.map((log, i) => (
          <div key={i} className="mb-1">
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        <div className="mt-4 animate-pulse text-white">_</div>
      </div>
    </div>
  );
};