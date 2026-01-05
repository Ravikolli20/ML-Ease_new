
/**
 * ML EASE - PROFESSIONAL BACKEND (Express Implementation)
 * 
 * This file serves as the blueprint for moving logic from the browser to a server.
 */

import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
// Fix for line 14: Cast the middleware to express.RequestHandler to resolve type mismatch with PathParams overload
app.use(express.json({ limit: '50mb' }) as express.RequestHandler);

// Correctly initialize GoogleGenAI using process.env.API_KEY without fallback values
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- ROUTES ---

// 1. Dataset Analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { data } = req.body;
    // Call analysis logic (ported from services/mlLogic.ts)
    res.json({ message: "Analysis complete", stats: {} });
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze data" });
  }
});

// 2. Model Training
app.post('/api/train', async (req, res) => {
  try {
    const { algorithm, problemType, features, params } = req.body;
    // Perform training simulation or call real Scikit-learn/Tensorflow
    res.json({ message: "Model trained", results: {} });
  } catch (err) {
    res.status(500).json({ error: "Training failed" });
  }
});

// 3. AI Explanation
app.post('/api/explain', async (req, res) => {
  const { modelName, metrics } = req.body;
  // Use ai.models.generateContent to query GenAI with both the model name and prompt
  const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await aiInstance.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain these metrics for ${modelName}: ${JSON.stringify(metrics)}`,
  });
  // Use the .text property directly as it is not a method
  res.json({ explanation: response.text });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 ML Ease Backend active!
  📡 Endpoint: http://localhost:${PORT}
  🛠️ Mode: Development
  `);
});
