import React from 'react';
import { TRANSLATIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// --- Shared Styles ---
const CARD_BASE = "bg-zinc-900/50 border border-zinc-700 backdrop-blur-md rounded p-4 mb-2 transition-all duration-300 hover:bg-zinc-800/80 hover:border-zinc-400 group relative overflow-hidden cursor-pointer";
const GLOW_ACCENT = "absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/0 to-white/5 rounded-bl-full pointer-events-none";

// --- Components ---

interface ProjectListProps {
  onSelectProject?: (id: string) => void;
}

export const ProjectListWidget: React.FC<ProjectListProps> = ({ onSelectProject }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 mb-4 w-full max-w-4xl">
      {t.PROJECTS.map((p) => (
        <div 
          key={p.id} 
          className={CARD_BASE}
          onClick={() => onSelectProject && onSelectProject(p.id)}
        >
          <div className={GLOW_ACCENT} />
          
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-zinc-200 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
              {p.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded border ${
              p.status === 'Deployed' || p.status === '배포 완료'
                ? 'border-zinc-500 text-zinc-300 bg-zinc-800' 
                : 'border-zinc-700 text-zinc-500 bg-zinc-900'
            }`}>
              {p.status}
            </span>
          </div>
          
          <p className="text-sm text-zinc-400 mb-3 h-10 overflow-hidden text-ellipsis">
            {p.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {p.techStack.map((tech) => (
              <span key={tech} className="text-xs font-mono text-zinc-300 bg-zinc-800 px-2 py-1 rounded">
                #{tech}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-2 border-t border-zinc-700 flex justify-between items-center opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">ID: {p.id}</span>
            <button 
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject && onSelectProject(p.id);
              }}
            >
              {t.UI.start_demo}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ProfileWidgetProps {
    onOpenProfile?: () => void;
}

export const ProfileWidget: React.FC<ProfileWidgetProps> = ({ onOpenProfile }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const skills = [
    { name: 'Frontend (React/Three.js)', level: 92 },
    { name: 'Backend (Node/Go)', level: 85 },
    { name: 'DevOps (AWS/Docker)', level: 78 },
    { name: 'Security', level: 65 },
  ];

  return (
    <div 
        className={`${CARD_BASE} max-w-2xl`}
        onClick={onOpenProfile}
    >
      <div className={GLOW_ACCENT} />
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Placeholder */}
        <div className="shrink-0 flex flex-col items-center justify-center space-y-2">
          <div className="w-24 h-24 border-2 border-zinc-200 rounded-full flex items-center justify-center bg-black overflow-hidden relative shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:border-purple-400 transition-colors">
            {t.PROFILE?.avatarUrl ? (
                <img src={t.PROFILE.avatarUrl} alt="Avatar" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
                <>
                <div className="absolute inset-0 bg-zinc-800/20 animate-pulse" />
                <span className="text-2xl font-bold text-white">DEV</span>
                </>
            )}
          </div>
          <div className="text-center">
             <div className="text-xs text-zinc-500">{t.UI.class}</div>
             <div className="text-xs text-zinc-500">{t.UI.level}</div>
          </div>
        </div>

        {/* Info & Stats */}
        <div className="flex-1 w-full space-y-4">
           <div className="flex justify-between items-start">
             <div>
                <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">{t.PROFILE.name}</h2>
             </div>
             <span className="text-[10px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded border border-purple-800/50 uppercase tracking-wider">
                View Profile
             </span>
           </div>
           
           <div className="space-y-2">
             {skills.map(s => (
               <div key={s.name} className="w-full">
                 <div className="flex justify-between text-xs mb-1 text-zinc-300">
                   <span>{s.name}</span>
                   <span>{s.level}%</span>
                 </div>
                 <div className="w-full h-2 bg-zinc-800 rounded overflow-hidden">
                   <div 
                     className="h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                     style={{ width: `${s.level}%` }}
                   />
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export const ContactWidget: React.FC = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const contacts = [
    { type: t.UI.email, value: 'ruehan98@gmail.com', icon: '✉' },
    { type: t.UI.github, value: 'github.com/ruehan', icon: '⌘' },
    // { type: t.UI.linkedin, value: 'linkedin.com/in/unknown_dev', icon: '∞' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mt-2 mb-4">
      {contacts.map((c) => (
        <a 
          key={c.type}
          href="#"
          className="flex flex-col items-center justify-center p-4 bg-zinc-900/50 border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-400 transition-all rounded group cursor-pointer"
        >
          <div className="text-2xl mb-2 text-zinc-400 group-hover:text-white transition-colors">{c.icon}</div>
          <div className="font-bold text-sm text-zinc-300">{c.type}</div>
          <div className="text-xs text-zinc-500 group-hover:text-zinc-300 truncate max-w-full">{c.value}</div>
        </a>
      ))}
    </div>
  );
};

export const ThemeSelector: React.FC = () => {
  const { language } = useLanguage();
  const { theme, setTheme, availableThemes } = useTheme();
  const t = TRANSLATIONS[language];

  return (
    <div className="mt-2 mb-2">
      <div className="mb-2 font-bold text-theme-highlight">{t.UI.theme_selection.title}</div>
      <div className="grid grid-cols-2 gap-2 max-w-xs">
        {availableThemes.map(th => (
          <button
            key={th}
            onClick={() => setTheme(th)}
            className={`text-left px-3 py-1 border rounded transition-all ${
              th === theme 
                ? 'border-theme text-theme-highlight bg-theme-bg/50 font-bold' 
                : 'border-zinc-700 text-zinc-500 hover:border-theme hover:text-theme-primary'
            }`}
          >
            {th === theme ? '> ' : '  '}
            {t.UI.theme_selection.themes[th] || th}
          </button>
        ))}
      </div>
      <div className="mt-2 text-xs text-theme-dim opacity-70">
        {t.UI.theme_selection.usage}
      </div>
    </div>
  );
};