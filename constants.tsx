
import React from 'react';
import { 
  Database, 
  BrainCircuit, 
  BarChart3, 
  Settings2, 
  Play, 
  FileCheck,
  Zap,
  HelpCircle,
  Trophy
} from 'lucide-react';

export const STEPS = [
  { id: 'data', label: 'Data Analysis', icon: <Database size={18} /> },
  { id: 'model', label: 'Model Setup', icon: <Settings2 size={18} /> },
  { id: 'results', label: 'Results & Visuals', icon: <BarChart3 size={18} /> },
  { id: 'simulate', label: 'Behavior Simulator', icon: <Zap size={18} /> },
  { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
];

export const CLASSIFICATION_ALGS = [
  'Logistic Regression',
  'K-Nearest Neighbors (KNN)',
  'Decision Tree',
  'Random Forest',
  'Support Vector Machine (SVM)',
  'Naive Bayes'
];

export const REGRESSION_ALGS = [
  'Linear Regression',
  'Ridge / Lasso Regression',
  'Decision Tree Regressor',
  'Random Forest Regressor',
  'Support Vector Regressor (SVR)'
];

export const CONCEPT_EXPLAINERS = {
  'Cross-Validation': 'A resampling procedure used to evaluate machine learning models on a limited data sample. It splits data into K sections (folds) to ensure the model generalizes well.',
  'Readiness Score': 'A diagnostic score out of 100 that evaluates if your dataset is clean and prepared enough for machine learning training.',
  'Target Variable': 'The specific column you want the AI to predict. For example, "Price" in housing data or "Survived" in Titanic data.',
  'F1-Score': 'The harmonic mean of precision and recall. It is especially useful when your classes are imbalanced.',
  'Overfitting': 'When a model learns the training data too well, including its noise, making it perform poorly on new, unseen data.'
};
