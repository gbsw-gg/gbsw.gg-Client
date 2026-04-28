'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import api, { ApiResponse, clearTokens, setTokens } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { useUser } from '@/context/UserContext';

interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export function useAuth() {
  const router = useRouter();
  const { showToast } = useToast();
  const { clearUser } = useUser();

  const login = async (studentId: string, password: string) => {
    try {
      const res = await api.post<ApiResponse<TokenData>>('/api/auth/login', {
        studentId,
        password,
      });
      if (!res.success) throw new Error(res.message);
      setTokens(res.data.accessToken, res.data.refreshToken);
      return res;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '로그인에 실패했습니다.';
      showToast(message, 'error');
      throw error;
    }
  };

  const logout = async () => {
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
      await api
        .post<ApiResponse>('/api/auth/logout', { refreshToken })
        .catch(() => {});
    }
    clearTokens();
    clearUser();
    showToast('로그아웃 되었습니다.', 'success');
    router.push('/');
  };

  const forceLogout = async () => {
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
      await api
        .post<ApiResponse>('/api/auth/logout', { refreshToken })
        .catch(() => {});
    }
    clearTokens();
    clearUser();
    router.replace('/');
  };

  const refresh = async () => {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) throw new Error('리프레시 토큰 없음');
    const res = await api.post<ApiResponse<TokenData>>('/api/auth/refresh', {
      refreshToken,
    });
    if (!res.success) throw new Error(res.message);
    setTokens(res.data.accessToken, res.data.refreshToken);
    return res;
  };

  return { login, logout, forceLogout, refresh };
}
