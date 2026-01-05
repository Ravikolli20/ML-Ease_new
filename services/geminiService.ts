
import { GoogleGenAI, Type } from "@google/genai";
import { DatasetStats, ProblemType, AlgorithmRecommendation } from '../types';

/**
 * Clean the response text from the model to handle potential markdown formatting.
 */
const cleanJsonResponse = (text: string): string => {
  return text.replace(/```json\n?|```/g, '').trim();
};

export const getAlgorithmRecommendations = async (
  stats: DatasetStats, 
  problemType: ProblemType
): Promise<AlgorithmRecommendation[]> => {
  // Always initialize right before use to catch the latest injected API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `
    Act as an AI ML Mentor. Based on the following dataset statistics, recommend the top 3 ${problemType} algorithms.
    Dataset Stats:
    - Rows: ${stats.rowCount}
    - Features: ${stats.features.join(', ')}
    - Target: ${stats.features[stats.features.length - 1]}
    - Missing Values: ${JSON.stringify(stats.missingValues)}

    Return exactly 3 recommendations in JSON format:
    [{ "algorithm": "string", "reason": "string", "suitabilityScore": number }]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              algorithm: { type: Type.STRING },
              reason: { type: Type.STRING },
              suitabilityScore: { type: Type.NUMBER }
            },
            required: ['algorithm', 'reason', 'suitabilityScore']
          }
        }
      }
    });
    const cleaned = cleanJsonResponse(response.text || '[]');
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Recommendation failed:", error);
    return [];
  }
};

export const getModelExplanation = async (
  modelName: string,
  metrics: Record<string, number>,
  problemType: ProblemType
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `
    Explain the performance of a ${modelName} model for a ${problemType} task. 
    Metrics: ${JSON.stringify(metrics)}.
    Provide a clear, brief, 3-paragraph beginner-friendly explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    return "Analysis currently unavailable.";
  }
};

export const simulatePrediction = async (
  modelName: string,
  featureValues: Record<string, any>,
  problemType: ProblemType
): Promise<{ prediction: string | number; reasoning: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `
    Act as a trained ${modelName} model. 
    Task: ${problemType}
    Inputs: ${JSON.stringify(featureValues)}
    
    Predict the most likely outcome based on these inputs.
    Explain your reasoning briefly (under 100 words).
    Return strictly JSON: { "prediction": "value", "reasoning": "string" }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ['prediction', 'reasoning']
        }
      }
    });
    const cleaned = cleanJsonResponse(response.text || '{"prediction": "Unknown", "reasoning": "Invalid response"}');
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Simulation failed:", error);
    return { prediction: "Error", reasoning: "Could not simulate result. Check API key or inputs." };
  }
};
