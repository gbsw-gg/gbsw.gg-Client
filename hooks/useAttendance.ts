'use client';

import api, { ApiResponse } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export type BoardingStatus = 'BOARDING' | 'PRE_ABSENT' | 'ABSENT';

export interface BoardingRecord {
  scheduleId: number;
  status: BoardingStatus;
  checkTime: string;
  reason: string;
}

export function useAttendance() {
  const { showToast } = useToast();

  /** 내 탑승 현황 조회 — 미등록이면 null 반환 */
  const getMyBoarding = async (): Promise<BoardingRecord | null> => {
    try {
      const res = await api.get<ApiResponse<BoardingRecord>>('/api/boarding/me');
      if (!res.success) return null;
      return res.data;
    } catch {
      return null;
    }
  };

  /** 탑승 확인 */
  const checkBoarding = async (scheduleId: number) => {
    try {
      const res = await api.post<ApiResponse<BoardingRecord>>('/api/boarding/check', {
        scheduleId,
      });
      if (!res.success) throw new Error(res.message);
      showToast('탑승 확인이 완료되었습니다.', 'success');
      return res.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '탑승 확인에 실패했습니다.';
      showToast(message, 'error');
      throw error;
    }
  };

  /** 사전 미탑승 신청 */
  const requestAbsent = async (scheduleId: number, reason: string) => {
    try {
      const res = await api.post<ApiResponse<BoardingRecord>>('/api/boarding/pre-absent', {
        scheduleId,
        reason,
      });
      if (!res.success) throw new Error(res.message);
      showToast('미탑승 신청이 완료되었습니다.', 'success');
      return res.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '미탑승 신청에 실패했습니다.';
      showToast(message, 'error');
      throw error;
    }
  };

  return { getMyBoarding, checkBoarding, requestAbsent };
}
