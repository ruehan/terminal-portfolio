import React from 'react';
import { TRANSLATIONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileDetailModalProps {
  onClose: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const p = t.PROFILE;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="w-full max-w-3xl bg-zinc-900/90 border border-zinc-600 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="h-10 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-300 uppercase tracking-widest">
              AGENT PROFILE :: CLASSIFIED
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
        <div className="p-6 overflow-y-auto font-mono custom-scrollbar">
            
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Left Column: Photo & Stats */}
            <div className="md:w-1/3 shrink-0 flex flex-col items-center">
               {/* Photo Frame */}
               <div className="w-40 h-40 rounded-full border-2 border-purple-500 p-1 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-zinc-950">
                  <img 
                    src={p.avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
               </div>
               
               <div className="text-center w-full mb-6">
                 <h2 className="text-xl font-bold text-white">{p.name}</h2>
                 <p className="text-xs text-purple-400 uppercase tracking-widest mb-1">Senior Full Stack Engineer</p>
                 <div className="flex justify-center space-x-2 mt-2">
                    <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded">Lvl. 25</span>
                 </div>
               </div>

               {/* Skill Tags */}
               <div className="w-full">
                 <h3 className="text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest border-b border-zinc-800 pb-1">{p.skillsTitle}</h3>
                 <div className="flex flex-wrap gap-1.5 justify-center">
                    {p.skills.map(s => (
                        <span key={s} className="text-[10px] bg-zinc-800/80 text-zinc-300 px-2 py-1 rounded border border-zinc-700">{s}</span>
                    ))}
                 </div>
               </div>
            </div>

            {/* Right Column: Bio & History */}
            <div className="md:w-2/3 space-y-6">
                
                {/* Bio */}
                <div>
                   <h1 className="text-2xl font-bold text-white mb-2">BIO_DATA</h1>
                   <p className="text-zinc-300 text-sm leading-relaxed border-l-2 border-purple-500 pl-4 bg-zinc-800/20 p-2 rounded-r">
                     {p.bioDetail}
                   </p>
                </div>

                {/* Experience */}
                <div>
                   <h3 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-widest flex items-center">
                     <span className="w-2 h-2 bg-zinc-600 mr-2 rounded-sm"></span>
                     {p.expTitle}
                   </h3>
                   <div className="space-y-4">
                      {p.experience.map((exp, i) => (
                          <div key={i} className="relative pl-4 border-l border-zinc-700">
                             <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-zinc-900 border border-zinc-500 rounded-full"></div>
                             <div className="flex justify-between items-start mb-1">
                                <span className="text-white font-bold text-sm">{exp.role}</span>
                                <span className="text-xs text-zinc-500 font-mono">{exp.period}</span>
                             </div>
                             <div className="text-purple-400 text-xs mb-1">{exp.company}</div>
                             <p className="text-zinc-400 text-xs leading-relaxed">{exp.description}</p>
                          </div>
                      ))}
                   </div>
                </div>

                {/* Education */}
                <div>
                   <h3 className="text-sm font-bold text-zinc-500 mb-3 uppercase tracking-widest flex items-center">
                     <span className="w-2 h-2 bg-zinc-600 mr-2 rounded-sm"></span>
                     {p.eduTitle}
                   </h3>
                   <div className="space-y-3">
                      {p.education.map((edu, i) => (
                          <div key={i} className="flex justify-between items-center bg-zinc-800/40 p-3 rounded border border-zinc-700/50">
                             <div>
                                <div className="text-white text-sm font-bold">{edu.degree}</div>
                                <div className="text-zinc-500 text-xs">{edu.school}</div>
                             </div>
                             <span className="text-xs text-zinc-500">{edu.period}</span>
                          </div>
                      ))}
                   </div>
                </div>



            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-8 pt-4 border-t border-zinc-800 flex justify-end">
             <button 
               onClick={onClose}
               className="border border-zinc-600 text-zinc-400 hover:text-white hover:border-zinc-400 hover:bg-zinc-800 py-2 px-6 rounded text-sm transition-all uppercase tracking-wide"
             >
               {t.UI.modal.close}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};