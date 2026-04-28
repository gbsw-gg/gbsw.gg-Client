'use client';

import api, { ApiResponse } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export function useAttendance() {
  const { showToast } = useToast();

  const checkBoarding = async (
    userId: string,
    busNumber: string,
    scheduleId: string,
  ) => {
    try {
      const now = new Date().toISOString();
      const res = await api.post<ApiResponse>('/api/attendance', {
        userId,
        busNumber,
        scheduleId,
        status: 'BOARDING',
        checkTime: now,
      });
      if (!res.success) throw new Error(res.message);
      showToast('탑승 확인이 완료되었습니다.', 'success');
      return res;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '탑승 확인에 실패했습니다.';
      showToast(message, 'error');
      throw error;
    }
  };

  const requestAbsent = async (
    userId: string,
    busNumber: string,
    scheduleId: string,
    reason: string,
  ) => {
    try {
      const res = await api.post<ApiResponse>('/api/attendance', {
        userId,
        busNumber,
        scheduleId,
        status: 'PRE_ABSENT',
        reason,
      });
      if (!res.success) throw new Error(res.message);
      showToast('미탑승 신청이 완료되었습니다.', 'success');
      return res;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '미탑승 신청에 실패했습니다.';
      showToast(message, 'error');
      throw error;
    }
  };

  return { checkBoarding, requestAbsent };
}
