
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, HelpCircle, Target } from 'lucide-react';
import { DatasetStats, ProblemType } from '../types';
import { CONCEPT_EXPLAINERS } from '../constants';

interface DataStepProps {
  stats: DatasetStats | null;
  onUpload: (data: any[]) => void;
  onTargetSelect: (target: string) => void;
  targetVariable: string | null;
  problemType: ProblemType;
}

const DataStep: React.FC<DataStepProps> = ({ stats, onUpload, onTargetSelect, targetVariable, problemType }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split('\n').filter(r => r.trim());
      if (rows.length < 1) return;
      const headers = rows[0].split(',');
      const data = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((obj, header, i) => {
          const val = values[i];
          const trimmedHeader = header.trim();
          obj[trimmedHeader] = (val !== undefined && val !== '' && !isNaN(Number(val))) ? Number(val) : val;
          return obj;
        }, {} as any);
      });
      onUpload(data);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Upload Box */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        className={`relative border-2 border-dashed rounded-[2.5rem] p-12 transition-all duration-300 text-center ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.01]' 
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700'
        }`}
      >
        <input 
          type="file" 
          accept=".csv"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="max-w-xs mx-auto space-y-4">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Upload Dataset</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Drag and drop your CSV file here or click to browse files</p>
          </div>
          <div className="pt-2">
            <span className="text-[10px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg font-bold uppercase tracking-wider">CSV only</span>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Readiness Score */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-6">
             <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                  <circle 
                    cx="64" cy="64" r="54" 
                    stroke="currentColor" 
                    strokeWidth="10" 
                    fill="transparent" 
                    strokeDasharray={339.29} 
                    strokeDashoffset={339.29 - (339.29 * stats.readinessScore / 100)} 
                    strokeLinecap="round"
                    className="text-indigo-600 transition-all duration-1000 ease-out" 
                  />
                </svg>
                <div className="absolute text-center">
                   <span className="text-4xl font-black text-slate-800 dark:text-white">{stats.readinessScore}</span>
                   <span className="text-xs block text-slate-400 font-bold uppercase tracking-widest mt-0.5">/ 100</span>
                </div>
             </div>
             <div>
                <div className="flex items-center justify-center gap-1.5 text-slate-800 dark:text-white font-bold mb-1">
                   <span>Dataset Readiness</span>
                   <span title={CONCEPT_EXPLAINERS['Readiness Score']} className="cursor-help flex items-center group">
                      <HelpCircle size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                   </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Overall data quality evaluation</p>
             </div>
             <div className="w-full space-y-3 pt-2 text-left bg-slate-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100/50 dark:border-slate-700/50">
                {stats.suggestions.map((s, idx) => (
                   <div key={idx} className="flex gap-3 text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                      <AlertCircle size={14} className="text-amber-500 shrink-0" />
                      <span>{s}</span>
                   </div>
                ))}
             </div>
          </div>

          {/* Stats Summary */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm space-y-8 flex flex-col">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
               <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Rows</div>
                  <div className="text-2xl font-black text-slate-800 dark:text-white">{stats.rowCount.toLocaleString()}</div>
               </div>
               <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Features</div>
                  <div className="text-2xl font-black text-slate-800 dark:text-white">{stats.colCount}</div>
               </div>
               <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Missing</div>
                  <div className="text-2xl font-black text-amber-500">
                    {Object.values(stats.missingValues).reduce((a: number, b: number) => a + b, 0)}
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Problem</div>
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{problemType === ProblemType.UNDETECTED ? 'Auto' : problemType}</div>
               </div>
            </div>

            <div className="space-y-4 flex-1">
               <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 dark:text-white text-lg">Feature Selection</h4>
                  <span className="text-xs font-medium text-slate-400">Select your target variable</span>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-2 custom-scroll">
                  {stats.features.map(f => (
                    <button
                      key={f}
                      onClick={() => onTargetSelect(f)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                        targetVariable === f 
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 ring-4 ring-indigo-50 dark:ring-indigo-900/20 shadow-sm' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl transition-colors ${targetVariable === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                           {stats.types[f] === 'Numerical' ? <Target size={16} /> : <FileText size={16} />}
                         </div>
                         <div className="text-left">
                            <span className="text-sm font-bold truncate block max-w-[120px]">{f}</span>
                            <span className="text-[9px] uppercase tracking-wider font-bold opacity-50">{stats.types[f]}</span>
                         </div>
                      </div>
                      {targetVariable === f && <CheckCircle2 size={18} className="text-indigo-600 animate-in zoom-in" />}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataStep;
