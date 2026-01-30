import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthResponse, UserRole } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
<<<<<<< HEAD
  signup: (data: any) => Promise<void>;
=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authAPI.login(username, password);
    const data: AuthResponse = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  }, []);

<<<<<<< HEAD
  const signup = useCallback(async (signupData: any) => {
    const response = await authAPI.signup(signupData);
    const data: AuthResponse = response.data;
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  }, []);

=======
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, hasRole }}>
=======
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, hasRole }}>
>>>>>>> f2da93b09fa8fe3e6357df2319d518e4d3e61f56
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
