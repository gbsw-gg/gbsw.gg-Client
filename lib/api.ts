import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL =
  process.env.NEXT_PUBLIC_GBSW_GG_BACKEND_URL ??
  process.env.GBSW_GG_BACKEND_URL ??
  '';

export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data: T;
}

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('access_token', accessToken);
  Cookies.set('refresh_token', refreshToken, { expires: 7, sameSite: 'Strict' });
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  Cookies.remove('refresh_token');
};

const api = axios.create({ baseURL: BASE_URL });

// 요청 인터셉터 — accessToken 자동 첨부
api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 처리 — 큐 방식 자동 토큰 갱신
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const url = originalRequest.url ?? '';
    const isAuthEndpoint = url.includes('/api/auth/');

    if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(error.response?.data ?? error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) throw new Error('no refresh token');

      const res = await axios.post<never, ApiResponse<{ accessToken: string; refreshToken: string }>>(
        `${BASE_URL}/api/auth/refresh`,
        { refreshToken },
      );

      setTokens(res.data.accessToken, res.data.refreshToken);
      processQueue(null, res.data.accessToken);

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${res.data.accessToken}`,
      };
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      if (typeof window !== 'undefined') window.location.replace('/');
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

// 인터셉터가 res.data를 반환하므로 실제 런타임 타입과 맞추기 위한 래퍼
const typedApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    api.get<never, T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.post<never, T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.put<never, T>(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    api.patch<never, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    api.delete<never, T>(url, config),
};

export default typedApi;
