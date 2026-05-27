'use client';

import api, { ApiResponse } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export interface Schedule {
  id: number;
  name: string;
  type: 'OUTBOUND' | 'INBOUND';
  departAt: string;
  checkDeadline: string;
  isActive: boolean;
  semester: string;
}

export function parseSchedule(schedule: Schedule) {
  const d = new Date(schedule.departAt);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const typeLabel = schedule.type === 'OUTBOUND' ? '귀가' : '귀교';
  return { date, time, typeLabel };
}

export function useSchedule() {
  const { showToast } = useToast();

  const getSchedule = async (): Promise<Schedule | null> => {
    try {
      const res = await api.get<ApiResponse<Schedule>>('/api/schedules/active');
      if (!res.success) throw new Error(res.message);
      return res.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '일정을 불러오지 못했습니다.';
      showToast(message, 'error');
      return null;
    }
  };

  return { getSchedule };
}
