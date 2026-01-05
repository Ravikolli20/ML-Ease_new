
export enum ProblemType {
  CLASSIFICATION = 'Classification',
  REGRESSION = 'Regression',
  UNDETECTED = 'Undetected'
}

export enum MLMode {
  BEGINNER = 'Beginner',
  ADVANCED = 'Advanced'
}

export type Theme = 'light' | 'dark';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor: string;
  password?: string; // Only for local mock storage
}

export interface DatasetStats {
  rowCount: number;
  colCount: number;
  features: string[];
  types: Record<string, string>;
  missingValues: Record<string, number>;
  uniqueValues: Record<string, number>;
  readinessScore: number;
  suggestions: string[];
}

export interface AlgorithmRecommendation {
  algorithm: string;
  reason: string;
  suitabilityScore: number;
}

export interface CVFold {
  fold: number;
  score: number;
}

export interface TrainingResult {
  modelName: string;
  metrics: Record<string, number>;
  confusionMatrix?: number[][];
  featureImportance: { name: string; score: number }[];
  cvFolds: CVFold[];
  trainingTime: number;
  params: Record<string, any>;
  explanation: string;
  timestamp: string;
}

export interface AppState {
  dataset: any[] | null;
  stats: DatasetStats | null;
  targetVariable: string | null;
  problemType: ProblemType;
  mode: MLMode;
  selectedAlgorithm: string | null;
  trainingResults: TrainingResult[];
  activeTab: 'data' | 'model' | 'results' | 'simulate' | 'leaderboard';
  theme: Theme;
  user: UserProfile | null;
}
