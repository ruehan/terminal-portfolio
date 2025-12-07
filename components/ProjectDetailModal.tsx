import React from 'react';
import { TRANSLATIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectDetailModalProps {
  projectId: string;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ projectId, onClose }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const project = t.PROJECTS.find(p => p.id === projectId);

  if (!project) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-zinc-900/90 border border-zinc-600 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="h-10 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">
              MODULE :: {project.name.toUpperCase()}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto font-mono">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 shadow-green-glow">
              {project.name}
            </h1>
            <span className={`px-3 py-1 text-xs rounded border ${
              project.status === 'Deployed' || project.status === '배포 완료'
              ? 'border-green-800 bg-green-900/30 text-green-400'
              : 'border-yellow-800 bg-yellow-900/30 text-yellow-400'
            }`}>
              {project.status}
            </span>
          </div>

          <p className="text-zinc-300 leading-relaxed mb-6 text-sm sm:text-base border-l-2 border-zinc-700 pl-4">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 bg-zinc-800 text-blue-300 text-xs rounded border border-zinc-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-zinc-500 mb-2 uppercase tracking-wider">{t.UI.modal.features}</h3>
            <ul className="space-y-2">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-zinc-300">
                  <span className="text-green-500 mr-2">➜</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-auto pt-6 border-t border-zinc-800">
             <button className="flex-1 bg-zinc-100 text-black hover:bg-white py-2 px-4 rounded font-bold text-sm transition-colors uppercase tracking-wide">
               {t.UI.modal.launch}
             </button>
             <button 
               onClick={onClose}
               className="flex-1 border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 py-2 px-4 rounded text-sm transition-all uppercase tracking-wide"
             >
               {t.UI.modal.close}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};