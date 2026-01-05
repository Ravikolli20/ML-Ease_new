
import { DatasetStats, ProblemType, TrainingResult, CVFold } from '../types';

export const analyzeDataset = (data: any[]): DatasetStats => {
  if (data.length === 0) throw new Error("Dataset is empty");
  
  const features = Object.keys(data[0]);
  const rowCount = data.length;
  const colCount = features.length;
  
  const types: Record<string, string> = {};
  const missingValues: Record<string, number> = {};
  const uniqueValues: Record<string, number> = {};
  
  features.forEach(feat => {
    const vals = data.map(d => d[feat]);
    const firstVal = vals.find(v => v !== null && v !== undefined);
    types[feat] = typeof firstVal === 'number' ? 'Numerical' : 'Categorical';
    missingValues[feat] = vals.filter(v => v === null || v === undefined || v === '').length;
    uniqueValues[feat] = new Set(vals).size;
  });

  let score = 100;
  const suggestions: string[] = [];

  const totalMissing = Object.values(missingValues).reduce((a: number, b: number) => a + b, 0);
  if (totalMissing > 0) {
    const deduction = Math.min(20, (totalMissing / (rowCount * colCount)) * 100);
    score -= deduction;
    suggestions.push(`Handle ${totalMissing} missing values.`);
  }

  const highCardinality = features.filter(f => types[f] === 'Categorical' && (uniqueValues[f] || 0) > 20);
  if (highCardinality.length > 0) {
    score -= 10;
    suggestions.push(`High cardinality features detected.`);
  }

  if (rowCount < 50) {
    score -= 20;
    suggestions.push("Critically small dataset. Models may be unstable.");
  } else if (rowCount < 200) {
    score -= 10;
    suggestions.push("Small dataset. Consider adding more records.");
  } else {
    suggestions.push("Dataset size is optimal for training.");
  }

  return {
    rowCount,
    colCount,
    features,
    types,
    missingValues,
    uniqueValues,
    readinessScore: Math.max(0, Math.round(score)),
    suggestions
  };
};

export const detectProblemType = (data: any[], target: string): ProblemType => {
  const targetVals = data.map(d => d[target]);
  const uniqueCount = new Set(targetVals).size;
  const isNumeric = typeof targetVals.find(v => v !== null && v !== undefined) === 'number';

  if (uniqueCount < 12 || !isNumeric) {
    return ProblemType.CLASSIFICATION;
  }
  return ProblemType.REGRESSION;
};

export const trainModelMock = async (
  algorithm: string, 
  problemType: ProblemType,
  features: string[],
  customParams: Record<string, any> = {}
): Promise<TrainingResult> => {
  await new Promise(r => setTimeout(r, 1500));

  const isClassification = problemType === ProblemType.CLASSIFICATION;
  const basePerf = 0.65 + Math.random() * 0.25;
  
  const metrics: Record<string, number> = isClassification 
    ? {
        'Accuracy': basePerf,
        'Precision': basePerf - 0.05 + Math.random() * 0.1,
        'Recall': basePerf - 0.05 + Math.random() * 0.1,
        'F1-Score': basePerf - 0.02 + Math.random() * 0.04
      }
    : {
        'R² Score': basePerf,
        'MAE': 5 + Math.random() * 15,
        'MSE': 40 + Math.random() * 200,
        'RMSE': 6 + Math.random() * 10
      };

  const cvFolds: CVFold[] = [1, 2, 3, 4, 5].map(i => ({
    fold: i,
    score: basePerf - 0.05 + Math.random() * 0.1
  }));

  const importanceData = (features.length > 0 ? features : ['Default Feature'])
    .map(f => ({ name: f, score: 5 + Math.random() * 95 }));
  
  const total = importanceData.reduce((acc, curr) => acc + curr.score, 0);
  const featureImportance = importanceData
    .map(f => ({ ...f, score: Math.round((f.score / total) * 100) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    modelName: algorithm,
    metrics,
    featureImportance,
    cvFolds,
    trainingTime: 0.8 + Math.random() * 2,
    params: { 
      'depth': customParams.depth || 5, 
      'iterations': customParams.iterations || 100, 
      'learning_rate': customParams.lr || 0.01,
      'tuning_mode': customParams.tuning || 'Default'
    },
    explanation: "", 
    timestamp: new Date().toLocaleTimeString(),
    confusionMatrix: isClassification ? [
      [Math.floor(40 + Math.random() * 20), Math.floor(Math.random() * 15)],
      [Math.floor(Math.random() * 15), Math.floor(40 + Math.random() * 20)]
    ] : undefined
  };
};
