
# 📌 ML Ease
### An Interactive & Explainable Machine Learning Platform

ML Ease is a beginner-friendly, no-code, explainable machine learning platform that simplifies the ML workflow while maintaining transparency and educational value.

## 📂 Project Structure

```text
├── /                       # Project Root
│   ├── .gitignore          # Version control exclusions
│   ├── index.html          # SPA Entry point
│   ├── index.tsx           # React mounting point
│   ├── App.tsx             # Main application controller
│   ├── types.ts            # Shared TypeScript interfaces
│   ├── constants.tsx       # App-wide constants & icons
│   ├── package.json        # Dependencies & scripts
│   │
│   ├── /components         # UI Components (Frontend)
│   │   ├── Layout.tsx      # Sidebar & Navigation
│   │   ├── DataStep.tsx    # Upload & Analysis
│   │   ├── ModelStep.tsx   # Training & Selection
│   │   ├── ResultsStep.tsx  # Metrics & Visualization
│   │   ├── Simulator.tsx   # Interactive Predictions
│   │   └── Leaderboard.tsx # Model Comparison
│   │
│   ├── /services           # Logic Layer (Mock Backend)
│   │   ├── api.ts          # Unified API Gateway
│   │   ├── geminiService.ts # Google GenAI Integration
│   │   ├── mlLogic.ts      # Core ML Math & Simulations
│   │   └── mockDb.ts       # LocalStorage persistence
│   │
│   └── /backend            # Dedicated Backend (Reference)
│       └── server.ts       # Node.js/Express Implementation
```

## 🚀 Key Features
- **Dataset Readiness Score**: Automated data-centric analysis.
- **AI Mentor Mode**: Algorithm recommendations via Gemini API.
- **Explainable Metrics**: Visual interpretation of Accuracy, R², and F1.
- **Behavior Simulator**: "What-if" analysis for model predictions.
- **AutoML Reports**: Downloadable HTML training summaries.

## 🛠️ Setup
1. **Frontend**: The app runs as a Vite/React application. Ensure your `API_KEY` is set in the environment.
2. **Backend Reference**: The `backend/` folder contains a production-ready Express server script that can be used to port the logic to a real server.

## 📜 License
Private / Educational Use Only.
