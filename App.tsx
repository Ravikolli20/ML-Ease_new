
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import DataStep from './components/DataStep';
import ModelStep from './components/ModelStep';
import ResultsStep from './components/ResultsStep';
import Simulator from './components/Simulator';
import Leaderboard from './components/Leaderboard';
import ProfileModal from './components/ProfileModal';
import AuthScreen from './components/AuthScreen';
import { AppState, ProblemType, MLMode, Theme, UserProfile } from './types';
import { api } from './services/api';
import { Project, mockDb } from './services/mockDb';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';

const INITIAL_STATE_VALUES: AppState = {
  dataset: null,
  stats: null,
  targetVariable: null,
  problemType: ProblemType.UNDETECTED,
  mode: MLMode.BEGINNER,
  selectedAlgorithm: null,
  trainingResults: [],
  activeTab: 'data' as const,
  theme: 'light' as Theme,
  user: null
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE_VALUES);
  const [isTraining, setIsTraining] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [projectId, setProjectId] = useState<string>(Math.random().toString(36).substring(7));
  const [projectName, setProjectName] = useState<string>("New Project");
  const [history, setHistory] = useState<Project[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load persistence logic
  useEffect(() => {
    const session = sessionStorage.getItem('ml_ease_session');
    if (session) {
      const user = JSON.parse(session);
      handleAuthSuccess(user);
    }
  }, []);

  const handleAuthSuccess = async (user: UserProfile) => {
    setIsSyncing(true);
    const settings = mockDb.getSettings(user.id);
    const projects = await api.getProjects(user.id);
    
    setState(prev => ({ 
      ...prev, 
      user, 
      theme: settings.theme || 'light',
      activeTab: 'data'
    }));
    setHistory(projects);

    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    sessionStorage.setItem('ml_ease_session', JSON.stringify(user));
    setIsSyncing(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ml_ease_session');
    setState(INITIAL_STATE_VALUES);
    document.documentElement.classList.remove('dark');
  };

  // Sync theme to DOM
  useEffect(() => {
    if (!state.user) return;
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    mockDb.saveSettings(state.user.id, { theme: state.theme, profile: state.user });
  }, [state.theme, state.user]);

  // Auto-save project (Cloud + Local)
  useEffect(() => {
    const sync = async () => {
      if (state.user && state.dataset) {
        setIsSyncing(true);
        const projectData: Project = {
          id: projectId,
          name: projectName,
          createdAt: new Date().toISOString(),
          stats: state.stats,
          targetVariable: state.targetVariable,
          problemType: state.problemType,
          results: state.trainingResults,
          dataset: state.dataset
        };
        
        await api.saveProject(state.user.id, projectData);
        const updatedHistory = await api.getProjects(state.user.id);
        setHistory(updatedHistory);
        setIsSyncing(false);
      }
    };

    const timer = setTimeout(sync, 2000); // Debounce saves
    return () => clearTimeout(timer);
  }, [state.trainingResults, state.targetVariable, state.dataset, projectName]);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const updateProfile = (profile: UserProfile) => {
    setState(prev => ({ ...prev, user: profile }));
    const users = mockDb.getUsers();
    const idx = users.findIndex(u => u.id === profile.id);
    if (idx > -1) {
      users[idx] = { ...users[idx], ...profile };
      localStorage.setItem('ml_ease_users', JSON.stringify(users));
    }
  };

  if (!state.user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const handleUpload = async (data: any[]) => {
    try {
      const stats = await api.processUpload(data);
      setState(prev => ({
        ...prev,
        dataset: data,
        stats,
        targetVariable: null,
        problemType: ProblemType.UNDETECTED,
        trainingResults: [],
        selectedAlgorithm: null,
        activeTab: 'data'
      }));
    } catch (err) {
      alert("Error parsing CSV. Please check formatting.");
    }
  };

  const handleTargetSelect = (target: string) => {
    if (!state.dataset) return;
    const type = (new Set(state.dataset.map(d => d[target])).size < 12) ? ProblemType.CLASSIFICATION : ProblemType.REGRESSION;
    setState(prev => ({
      ...prev,
      targetVariable: target,
      problemType: type,
      selectedAlgorithm: null
    }));
  };

  const handleTrain = async (customParams: any = {}) => {
    if (!state.selectedAlgorithm || !state.stats) return;
    setIsTraining(true);
    try {
      const result = await api.trainModel(state.selectedAlgorithm, state.problemType, state.stats.features, customParams);
      setState(prev => ({
        ...prev,
        trainingResults: [result, ...prev.trainingResults],
        activeTab: 'results'
      }));
    } finally {
      setIsTraining(false);
    }
  };

  const handleLoadProject = (project: Project) => {
    setProjectId(project.id);
    setProjectName(project.name);
    setState(prev => ({
      ...prev,
      dataset: project.dataset,
      stats: project.stats,
      targetVariable: project.targetVariable,
      problemType: project.problemType,
      selectedAlgorithm: project.results[0]?.modelName || null,
      trainingResults: project.results,
      activeTab: 'results'
    }));
  };

  const renderStep = () => {
    switch (state.activeTab) {
      case 'data':
        return (
          <DataStep 
            stats={state.stats} 
            onUpload={handleUpload} 
            onTargetSelect={handleTargetSelect} 
            targetVariable={state.targetVariable}
            problemType={state.problemType}
          />
        );
      case 'model':
        return (
          <ModelStep 
            stats={state.stats}
            problemType={state.problemType}
            selectedAlgorithm={state.selectedAlgorithm}
            setSelectedAlgorithm={(alg) => setState(prev => ({ ...prev, selectedAlgorithm: alg }))}
            onTrain={handleTrain}
            isTraining={isTraining}
            mode={state.mode}
          />
        );
      case 'results':
        return state.trainingResults[0] ? (
          <ResultsStep 
            result={state.trainingResults[0]} 
            problemType={state.problemType} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p>No model results yet. Please setup and train a model first.</p>
          </div>
        );
      case 'simulate':
        return state.trainingResults[0] ? (
          <Simulator 
            result={state.trainingResults[0]} 
            problemType={state.problemType} 
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <p>No active model for simulation. Train a model to use this feature.</p>
          </div>
        );
      case 'leaderboard':
        return (
          <Leaderboard 
            results={state.trainingResults} 
            problemType={state.problemType} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-[100]">
        {isSyncing ? (
          <div className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse text-xs font-bold">
            <Loader2 size={14} className="animate-spin" />
            Cloud Syncing...
          </div>
        ) : (
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold">
            <Cloud size={14} />
            Cloud Connected
          </div>
        )}
      </div>

      <Layout 
        activeTab={state.activeTab} 
        setActiveTab={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
        mode={state.mode}
        setMode={(mode) => setState(prev => ({ ...prev, mode }))}
        isDataLoaded={!!state.dataset}
        theme={state.theme}
        toggleTheme={toggleTheme}
        profile={state.user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onReset={() => {
          if (confirm("Reset current project?")) {
            setProjectId(Math.random().toString(36).substring(7));
            setState(prev => ({ ...prev, dataset: null, stats: null, trainingResults: [], activeTab: 'data' }));
          }
        }}
        history={history}
        onLoadProject={handleLoadProject}
        onLogout={handleLogout}
      >
        {renderStep()}
      </Layout>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={state.user}
        onSave={updateProfile}
      />
    </>
  );
};

export default App;
