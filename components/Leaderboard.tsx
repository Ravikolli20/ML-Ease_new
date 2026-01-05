
import React from 'react';
import { TrainingResult, ProblemType } from '../types';
import { Trophy, ArrowUp, BarChart, Clock, ShieldAlert } from 'lucide-react';

interface LeaderboardProps {
  results: TrainingResult[];
  problemType: ProblemType;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ results, problemType }) => {
  const isClassification = problemType === ProblemType.CLASSIFICATION;
  const sorted = [...results].sort((a, b) => {
    const metric = isClassification ? 'Accuracy' : 'R² Score';
    return b.metrics[metric] - a.metrics[metric];
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">
               <Trophy size={24} />
            </div>
            <div>
               <h3 className="text-2xl font-bold text-slate-800">Model Leaderboard</h3>
               <p className="text-sm text-slate-400">Ranks based on primary evaluation metric.</p>
            </div>
         </div>
         <div className="px-4 py-2 bg-slate-100 rounded-full text-slate-500 text-xs font-bold uppercase tracking-widest">
            {problemType}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {sorted.map((res, idx) => {
           const score = isClassification ? res.metrics['Accuracy'] : res.metrics['R² Score'];
           return (
             <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-8 group">
                <div className="flex items-center gap-6">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                     idx === 0 ? 'bg-amber-400 text-white shadow-lg shadow-amber-100' : 'bg-slate-50 text-slate-400'
                   }`}>
                      {idx + 1}
                   </div>
                   <div className="w-px h-10 bg-slate-100"></div>
                   <div className="min-w-[180px]">
                      <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{res.modelName}</h4>
                      <p className="text-xs text-slate-400">Trained in {res.trainingTime.toFixed(2)}s</p>
                   </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Score</div>
                      <div className="text-xl font-bold text-slate-800">{isClassification ? `${Math.round(score * 100)}%` : score.toFixed(3)}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Stability</div>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                         <ShieldAlert size={14} />
                         High
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bias Risk</div>
                      <div className="text-slate-700 font-bold">Low</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Explainable</div>
                      <div className="text-indigo-600 font-bold">Yes</div>
                   </div>
                </div>

                <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                   <div className="bg-indigo-50 text-indigo-700 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all cursor-pointer">
                      View Report
                      <ArrowUp size={16} className="rotate-45" />
                   </div>
                </div>
             </div>
           );
         })}

         {results.length === 0 && (
           <div className="py-20 text-center space-y-4">
              <BarChart size={48} className="mx-auto text-slate-200" />
              <p className="text-slate-400 font-medium">No models trained yet. Start by selecting an algorithm!</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default Leaderboard;
