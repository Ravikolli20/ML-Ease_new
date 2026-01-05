
import React, { useState } from 'react';
import { Brain, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { mockDb } from '../services/mockDb';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = mockDb.login(email, password);
      if (user) {
        onAuthSuccess(user);
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!name || !email || !password) {
        setError('All fields are required');
        return;
      }
      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role: 'Student',
        avatarColor: '#6366f1'
      };
      if (mockDb.register(newUser)) {
        onAuthSuccess(newUser);
      } else {
        setError('Email already exists');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Left: Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative p-16 flex-col justify-between text-white">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <Brain size={32} />
          </div>
          <span className="text-2xl font-black tracking-tight">ML Ease</span>
        </div>

        <div className="relative z-10 space-y-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-black leading-tight">
              Master ML <br />
              <span className="text-indigo-200">Without Code.</span>
            </h1>
            <p className="text-xl text-indigo-100 max-w-md leading-relaxed">
              The world's most intuitive platform for learning machine learning through AI-guided experimentation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <Sparkles className="text-indigo-200" size={24} />
              </div>
              <h4 className="font-bold">AI Mentor</h4>
              <p className="text-sm text-indigo-100/60">Guided algorithm suggestions for your specific datasets.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                <ShieldCheck className="text-indigo-200" size={24} />
              </div>
              <h4 className="font-bold">Explainability</h4>
              <p className="text-sm text-indigo-100/60">Every result comes with a clear, plain-english interpretation.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-indigo-200">
          <Cpu size={18} />
          <span>Powered by Gemini 3.0 Pro & Neural Simulation</span>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {isLogin ? 'Log in to access your projects' : 'Start your ML journey today'}
            </p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex transition-all">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isLogin ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isLogin ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <User size={16} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-rose-500 text-sm font-bold bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-100 dark:border-rose-900/30">{error}</p>}

            <button 
              type="submit" 
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 dark:shadow-none transition-all hover:scale-[1.02]"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="text-center text-xs text-slate-400">
            By continuing, you agree to our Terms of Service <br /> and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
