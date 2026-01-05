
import React, { useState } from 'react';
import { Zap, Play, HelpCircle, ArrowRightCircle, AlertCircle } from 'lucide-react';
import { TrainingResult, ProblemType } from '../types';
import { simulatePrediction } from '../services/geminiService';

interface SimulatorProps {
  result: TrainingResult;
  problemType: ProblemType;
}

const Simulator: React.FC<SimulatorProps> = ({ result, problemType }) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    if (Object.keys(inputs).length === 0) {
      setError("Please enter at least one value to simulate.");
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      const res = await simulatePrediction(result.modelName, inputs, problemType);
      setPrediction(res);
    } catch (e) {
      setError("Failed to generate simulation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Input Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <div>
                 <h4 className="font-bold text-slate-800 dark:text-white text-lg">Input Parameters</h4>
                 <p className="text-sm text-slate-400 dark:text-slate-500">Change feature values to see model reasoning.</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400">
                 <Zap size={20} />
              </div>
           </div>

           {error && (
             <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-medium border border-rose-100 dark:border-rose-800">
                <AlertCircle size={14} />
                {error}
             </div>
           )}

           <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
              {result.featureImportance.map(feat => (
                <div key={feat.name} className="space-y-2">
                   <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-600 dark:text-slate-400">{feat.name}</label>
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Impact: {Math.round(feat.score)}%</span>
                   </div>
                   <input 
                      type="text" 
                      placeholder="Enter value..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm dark:text-white transition-all"
                      value={inputs[feat.name] || ''}
                      onChange={(e) => setInputs(prev => ({ ...prev, [feat.name]: e.target.value }))}
                   />
                </div>
              ))}
           </div>

           <button 
              onClick={handleSimulate}
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl ${
                loading 
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none'
              }`}
           >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-400 border-t-transparent"></div>
              ) : (
                <>
                  <Play size={16} fill="white" />
                  Run Prediction
                </>
              )}
           </button>
        </div>

        {/* Prediction Display */}
        <div className="space-y-8">
           <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 dark:shadow-none min-h-[340px] flex flex-col justify-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/50 to-transparent"></div>
              
              {!prediction ? (
                <div className="relative z-10 space-y-4">
                   <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-md">
                      <ArrowRightCircle size={40} className="text-white/40" />
                   </div>
                   <h3 className="text-xl font-bold">Awaiting Inputs</h3>
                   <p className="text-indigo-100 text-sm max-w-xs mx-auto">Fill the feature values on the left and run the simulator to see AI reasoning.</p>
                </div>
              ) : (
                <div className="relative z-10 space-y-6 animate-in zoom-in-95 duration-300">
                   <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">Predicted Result</span>
                   <div className="text-5xl font-black break-words">{prediction.prediction}</div>
                   <div className="h-px bg-white/20 w-12 mx-auto"></div>
                   <div className="max-w-md mx-auto text-sm text-indigo-100 leading-relaxed font-medium">
                      "{prediction.reasoning}"
                   </div>
                </div>
              )}
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-3 text-slate-800 dark:text-white font-bold mb-4">
                 <HelpCircle size={18} className="text-indigo-600 dark:text-indigo-400" />
                 Sensitivity Analysis
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Try varying the values of top-weighted features like <span className="font-bold text-indigo-600 dark:text-indigo-400">{result.featureImportance[0]?.name}</span> to observe how predictions shift.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
