
import React from 'react';
import { STEPS } from '../constants';
import { MLMode, Theme, UserProfile } from '../types';
import { Brain, ChevronRight, RotateCcw, Download, History, FileText, Moon, Sun, LogOut } from 'lucide-react';
import { Project } from '../services/mockDb';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  mode: MLMode;
  setMode: (mode: MLMode) => void;
  isDataLoaded: boolean;
  theme: Theme;
  toggleTheme: () => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  onSave?: () => void;
  onReset?: () => void;
  history?: Project[];
  onLoadProject?: (project: Project) => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  mode, 
  setMode, 
  isDataLoaded,
  theme,
  toggleTheme,
  profile,
  onOpenProfile,
  onSave,
  onReset,
  history = [],
  onLoadProject,
  onLogout
}) => {
  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden`}>
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-100 dark:shadow-none">
              <Brain size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800 dark:text-white">ML Ease</h1>
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all" title="Logout">
            <LogOut size={18} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto custom-scroll">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Pipeline</div>
            <div className="space-y-1">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  disabled={!isDataLoaded && step.id !== 'data'}
                  onClick={() => setActiveTab(step.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                    activeTab === step.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white'
                  } ${(!isDataLoaded && step.id !== 'data') ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    {step.icon}
                    <span>{step.label}</span>
                  </div>
                  {activeTab === step.id && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 flex items-center gap-2">
                <History size={12} />
                Recent Projects
              </div>
              <div className="space-y-1">
                {history.slice(0, 5).map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onLoadProject?.(project)}
                    className="w-full flex flex-col p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                      <FileText size={14} className="text-slate-400" />
                      <span className="truncate">{project.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 pl-5">
                      {new Date(project.createdAt).toLocaleDateString()} • {project.results.length} Models
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50 transition-colors duration-300">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Learning Mode</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                mode === MLMode.BEGINNER ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
              }`}>
                {mode}
              </span>
            </div>
            <div className="flex p-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
              <button 
                onClick={() => setMode(MLMode.BEGINNER)}
                className={`flex-1 text-xs py-1.5 rounded-md transition-all ${mode === MLMode.BEGINNER ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Beginner
              </button>
              <button 
                onClick={() => setMode(MLMode.ADVANCED)}
                className={`flex-1 text-xs py-1.5 rounded-md transition-all ${mode === MLMode.ADVANCED ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}
              >
                Advanced
              </button>
            </div>
          </div>
          
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-3 px-2 py-1 cursor-pointer group hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{profile.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">{profile.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between transition-colors duration-300">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
              {STEPS.find(s => s.id === activeTab)?.label}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {activeTab === 'data' && 'Upload and analyze your dataset features.'}
              {activeTab === 'model' && 'Configure and select the best algorithm.'}
              {activeTab === 'results' && 'Deep dive into performance metrics.'}
              {activeTab === 'simulate' && 'Interact with your model in real-time.'}
              {activeTab === 'leaderboard' && 'Compare models and learn trade-offs.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={toggleTheme}
               className="p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
               title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
             >
               {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
             </button>
             <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
             <button 
               onClick={onReset}
               title="New Project"
               className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
             >
               <RotateCcw size={20} />
             </button>
             <button 
               onClick={onSave}
               disabled={!isDataLoaded}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                 isDataLoaded 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 dark:shadow-none' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
               }`}
             >
               <Download size={16} />
               Save Project
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-6xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
