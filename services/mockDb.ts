
import { AppState, TrainingResult, DatasetStats, ProblemType, MLMode, Theme, UserProfile } from '../types';

const USERS_KEY = 'ml_ease_users';
const PROJECTS_KEY = 'ml_ease_projects_'; // Suffix with userId
const SETTINGS_KEY = 'ml_ease_settings_'; // Suffix with userId

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  stats: DatasetStats | null;
  targetVariable: string | null;
  problemType: ProblemType;
  results: TrainingResult[];
  dataset: any[] | null;
}

export const mockDb = {
  // Auth Operations
  getUsers: (): UserProfile[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  register: (user: UserProfile): boolean => {
    const users = mockDb.getUsers();
    if (users.find(u => u.email === user.email)) return false;
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  },

  login: (email: string, pass: string): UserProfile | null => {
    const users = mockDb.getUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser as UserProfile;
  },

  // Project Operations (Scoped to User)
  saveProject: (userId: string, project: Project): void => {
    const key = PROJECTS_KEY + userId;
    const projects = mockDb.getProjects(userId);
    const index = projects.findIndex(p => p.id === project.id);
    if (index > -1) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(key, JSON.stringify(projects));
  },

  getProjects: (userId: string): Project[] => {
    const key = PROJECTS_KEY + userId;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Delete a project from local storage.
   */
  deleteProject: (userId: string, id: string): void => {
    const key = PROJECTS_KEY + userId;
    const projects = mockDb.getProjects(userId);
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(key, JSON.stringify(filtered));
  },

  // Settings
  saveSettings: (userId: string, settings: any): void => {
    localStorage.setItem(SETTINGS_KEY + userId, JSON.stringify(settings));
  },

  getSettings: (userId: string): any => {
    const data = localStorage.getItem(SETTINGS_KEY + userId);
    return data ? JSON.parse(data) : { theme: 'light' };
  }
};
