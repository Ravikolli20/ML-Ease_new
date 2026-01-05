
import React, { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles, Wand2, Info, ChevronRight, Play, Sliders, Target } from 'lucide-react';
import { ProblemType, AlgorithmRecommendation, MLMode } from '../types';
import { CLASSIFICATION_ALGS, REGRESSION_ALGS } from '../constants';
import { getAlgorithmRecommendations } from '../services/geminiService';

interface ModelStepProps {
  stats: any;
  problemType: ProblemType;
  selectedAlgorithm: string | null;
  setSelectedAlgorithm: (alg: string) => void;
  onTrain: (params?: any) => void;
  isTraining: boolean;
  mode: MLMode;
}

const ModelStep: React.FC<ModelStepProps> = ({ stats, problemType, selectedAlgorithm, setSelectedAlgorithm, onTrain, isTraining, mode }) => {
  const [recommendations, setRecommendations] = useState<AlgorithmRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  
  // Advanced Params
  const [depth, setDepth] = useState(5);
  const [lr, setLr] = useState(0.01);
  const [iterations, setIterations] = useState(100);
  const [tuning, setTuning] = useState('Manual');

  useEffect(() => {
    if (stats && problemType !== ProblemType.UNDETECTED) {
      setLoadingRecs(true);
      getAlgorithmRecommendations(stats, problemType)
        .then(setRecommendations)
        .finally(() => setLoadingRecs(false));
    }
  }, [stats, problemType]);

  const algorithms = problemType === ProblemType.CLASSIFICATION ? CLASSIFICATION_ALGS : REGRESSION_ALGS;

  const handleTrainClick = () => {
    onTrain({ depth, lr, iterations, tuning });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* AI Mentor Mode */}
      <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
          <div className="shrink-0">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
               <Sparkles className="text-indigo-300" size={32} />
             </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h3 className="text-2xl font-bold">AI Mentor Mode</h3>
              <p className="text-indigo-200 text-sm">Our AI analyzed your data and suggests these algorithms for best results.</p>
            </div>

            {loadingRecs ? (
              <div className="flex items-center gap-3">
                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                 <span className="text-indigo-200 text-sm">Analyzing dataset characteristics...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map((rec, i) => (
                  <div 
                    key={i} 
                    onClick={() => setSelectedAlgorithm(rec.algorithm)}
                    className={`group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 p-5 rounded-2xl transition-all cursor-pointer ${
                      selectedAlgorithm === rec.algorithm ? 'ring-2 ring-white ring-offset-4 ring-offset-indigo-900 bg-white/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Choice #{i+1}</span>
                       <div className="text-white/40 group-hover:text-white transition-colors"><ChevronRight size={16} /></div>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{rec.algorithm}</h4>
                    <p className="text-xs text-indigo-100 line-clamp-2 leading-relaxed opacity-80">{rec.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Selection Area */}
        <div className="lg:col-span-2 space-y-8">
           <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-slate-800">Select Algorithm</h4>
                <span className="text-xs text-slate-400">{algorithms.length} Algorithms available</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {algorithms.map(alg => (
                  <button
                    key={alg}
                    onClick={() => setSelectedAlgorithm(alg)}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      selectedAlgorithm === alg 
                        ? 'border-indigo-600 bg-white ring-4 ring-indigo-50 shadow-lg' 
                        : 'border-slate-100 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedAlgorithm === alg ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                        <BrainCircuit size={20} />
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-bold ${selectedAlgorithm === alg ? 'text-indigo-900' : 'text-slate-700'}`}>{alg}</div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{problemType}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
           </section>

           {/* Hyperparameters Section (Advanced Only) */}
           {mode === MLMode.ADVANCED && (
             <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <Sliders size={20} />
                   </div>
                   <h4 className="text-lg font-bold text-slate-800">Hyperparameters</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-slate-600">Max Depth</label>
                         <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{depth}</span>
                      </div>
                      <input type="range" min="1" max="20" value={depth} onChange={e => setDepth(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                      
                      <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-slate-600">Learning Rate</label>
                         <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{lr}</span>
                      </div>
                      <input type="range" min="0.001" max="0.5" step="0.005" value={lr} onChange={e => setLr(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <label className="text-sm font-bold text-slate-600">Estimators / Iterations</label>
                         <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{iterations}</span>
                      </div>
                      <input type="range" min="10" max="500" step="10" value={iterations} onChange={e => setIterations(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-600">Optimization Strategy</label>
                        <select value={tuning} onChange={e => setTuning(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none">
                           <option>Manual Tuning</option>
                           <option>Grid Search (Simulated)</option>
                           <option>Random Search (Simulated)</option>
                        </select>
                      </div>
                   </div>
                </div>
             </section>
           )}
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6 sticky top-24">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Wand2 size={18} className="text-indigo-600" />
                Training Preview
              </h4>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Target Var:</span>
                  <span className="font-bold text-slate-800">{stats.targetVariable || 'Not Selected'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Problem:</span>
                  <span className="font-medium text-slate-800">{problemType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Algorithm:</span>
                  <span className="font-bold text-indigo-600">{selectedAlgorithm || 'None'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Mode:</span>
                  <span className="font-medium text-slate-800">{mode}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <button
                  disabled={!selectedAlgorithm || isTraining}
                  onClick={handleTrainClick}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                    !selectedAlgorithm 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'
                  }`}
                >
                  {isTraining ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      Train Model
                    </>
                  )}
                </button>
              </div>
           </div>

           <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 space-y-3">
              <div className="flex items-center gap-2 text-amber-600 font-bold">
                 <Info size={18} />
                 <span>AI Pro Tip</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Increasing <strong>Max Depth</strong> allows the model to capture more complex patterns but also increases the risk of <strong>Overfitting</strong>.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ModelStep;
