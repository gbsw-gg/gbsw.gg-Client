export interface JwtPayload {
  userId: string;
  name: string;
  studentId: string;
  grade: number;
  classNum: number;
  number: number;
  role: 'STUDENT' | 'LEADER' | 'ADMIN';
  busNumber?: string;
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

export function getStoredUser(): JwtPayload | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  return decodeToken(token);
}
