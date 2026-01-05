
import { trainModelMock, analyzeDataset } from './mlLogic';
import { getAlgorithmRecommendations, getModelExplanation, simulatePrediction } from './geminiService';
import { mockDb, Project } from './mockDb';
import { supabase } from './supabaseClient';
import { ProblemType, TrainingResult } from '../types';

/**
 * ML Ease API Gateway (Public-Ready Version)
 */
export const api = {
  // Data Operations (Local Processing for Speed)
  processUpload: async (data: any[]) => {
    return analyzeDataset(data);
  },

  // ML Operations (Simulated for this demo)
  trainModel: async (algorithm: string, problemType: ProblemType, features: string[], params: any) => {
    const result = await trainModelMock(algorithm, problemType, features, params);
    const explanation = await getModelExplanation(result.modelName, result.metrics, problemType);
    return { ...result, explanation };
  },

  // AI Operations
  getRecommendations: async (stats: any, problemType: ProblemType) => {
    return getAlgorithmRecommendations(stats, problemType);
  },

  getSimulation: async (modelName: string, inputs: any, problemType: ProblemType) => {
    return simulatePrediction(modelName, inputs, problemType);
  },

  // Persistence Operations (Cloud + Local Fallback)
  saveProject: async (userId: string, project: Project) => {
    // 1. Save to Cloud (Supabase)
    const { error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', project.id);
    
    if (error) console.error("Cloud save failed, falling back to local:", error);

    // 2. Local Fallback
    mockDb.saveProject(userId, project);
  },

  getProjects: async (userId: string) => {
    // 1. Try Cloud
    const { data, error } = await supabase
      .from('projects')
      .select()
      .eq('user_id', userId);
    
    if (!error && data && data.length > 0) return data as Project[];

    // 2. Fallback to Local
    return mockDb.getProjects(userId);
  },

  deleteProject: async (userId: string, id: string) => {
    await supabase.from('projects').delete().eq('id', id);
    mockDb.deleteProject(userId, id);
  }
};
