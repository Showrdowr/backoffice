'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'officer' | 'super_admin' | 'system_admin' | string;
  department?: string;
  major?: string;
  majorSequence?: string;
}

interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, captchaAnswer?: string, captchaToken?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isOfficer: boolean;
  role: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'backoffice_token';
const USER_KEY = 'backoffice_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const userStr = sessionStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as AdminUser;
        
        setTimeout(() => {
          setState({ user, token, isAuthenticated: true, isLoading: false });
        }, 0);

        // Verify token is still valid
        fetch(`${API_BASE}/v1/admin/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            if (!res.ok) throw new Error('Token expired');
            return res.json();
          })
          .then((data) => {
            if (data.success && data.user) {
              const verifiedUser: AdminUser = {
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                role: data.user.role,
                department: data.user.department,
                major: data.user.major,
                majorSequence: data.user.majorSequence,
              };
              sessionStorage.setItem(USER_KEY, JSON.stringify(verifiedUser));
              setTimeout(() => {
                setState({ user: verifiedUser, token, isAuthenticated: true, isLoading: false });
              }, 0);
            }
          })
          .catch(() => {
            // Token is invalid, clear everything
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
            setTimeout(() => {
              setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
            }, 0);
          });
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
        setTimeout(() => {
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }, 0);
      }
    } else {
      setTimeout(() => {
        setState((prev) => ({ ...prev, isLoading: false }));
      }, 0);
    }
  }, []);

  const login = useCallback(async (email: string, password: string, captchaAnswer?: string, captchaToken?: string) => {
    const res = await fetch(`${API_BASE}/v1/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, captchaAnswer, captchaToken }),
    });

    const data = await res.json();
    console.log('DEBUG: Auth API response:', { status: res.status, ok: res.ok, data });

    if (!res.ok || !data.success) {
      const err = new Error(data.error || data.message || 'เข้าสู่ระบบล้มเหลว');
      // Pass along additional fields from API error
      Object.assign(err, { 
        field: data.field || null,
        requiresCaptcha: data.requiresCaptcha || false 
      });
      console.log('DEBUG: Error object created:', { 
        message: err.message, 
        requiresCaptcha: (err as Error & { requiresCaptcha?: boolean }).requiresCaptcha 
      });
      throw err;
    }

    const user: AdminUser = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      role: data.user.role,
      department: data.user.department,
      major: data.user.major,
      majorSequence: data.user.majorSequence,
    };

    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    setState({ user, token: data.token, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    router.push('/login');
  }, [router]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    isAdmin: state.user?.role === 'admin' || state.user?.role === 'super_admin',
    isOfficer: state.user?.role === 'officer' || state.user?.role === 'system_admin',
    role: state.user?.role || null,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
