'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from 'react';
import api, { ApiResponse } from '@/lib/api';

export type UserRole = 'STUDENT' | 'LEADER' | 'ADMIN';

export interface User {
  id: number;
  studentId: string;
  name: string;
  grade: number;
  classNum: number;
  role: UserRole;
  phone: string;
}

interface UserContextValue {
  user: User | null;
  loadUser: () => Promise<User | null>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await api.get<ApiResponse<User>>('/api/me');
      if (!res.success) return null;
      setUser(res.data);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  const clearUser = useCallback(() => setUser(null), []);

  return (
    <UserContext.Provider value={{ user, loadUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser는 UserProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}
