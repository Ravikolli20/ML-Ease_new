
import React, { useState } from 'react';
import { X, User, Shield, Palette, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Your Profile</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="text-slate-400" size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl"
              style={{ backgroundColor: formData.avatarColor }}
            >
              {formData.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avatar Preview</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <User size={16} /> Display Name
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Shield size={16} /> Your Role
              </label>
              <select 
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option>Student</option>
                <option>Researcher</option>
                <option>Educator</option>
                <option>Developer</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Palette size={16} /> Profile Theme
              </label>
              <div className="flex gap-3 flex-wrap">
                {COLORS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setFormData({ ...formData, avatarColor: c })}
                    className={`w-10 h-10 rounded-full transition-all ring-offset-2 dark:ring-offset-slate-900 ${formData.avatarColor === c ? 'ring-2 ring-indigo-500 scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => { onSave(formData); onClose(); }}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
