'use client';

import api, { ApiResponse } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

export type BusChangeStatus = 'PENDING' | 'APPROVED' | 'CANCELED';
export type BusChangeType = 'OUTBOUND' | 'INBOUND';

export interface BusChangeRequest {
  id: number;
  studentId: number;
  studentNumber: string;
  studentName: string;
  grade: number;
  classNum: number;
  originalBusId: number;
  originalBusNumber: number;
  originalStation: string;
  requestedBusId: number;
  requestedBusNumber: number;
  requestedStation: string;
  reason: string;
  type: BusChangeType;
  status: BusChangeStatus;
  effectiveWeekStart: string;
  requestedAt: string;
  approvedAt: string;
  canceledAt: string;
  approvedByName: string;
}

export function useBusChangeRequest() {
  const { showToast } = useToast();

  const getMyRequests = async (): Promise<BusChangeRequest[]> => {
    try {
      const res = await api.get<ApiResponse<BusChangeRequest[]>>('/api/bus-change-requests/me');
      if (!res.success) return [];
      return res.data;
    } catch {
      return [];
    }
  };

  const cancelRequest = async (requestId: number): Promise<boolean> => {
    try {
      const res = await api.delete<ApiResponse>(`/api/bus-change-requests/${requestId}`);
      if (!res.success) throw new Error(res.message);
      showToast('신청이 취소되었습니다.', 'success');
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : '신청 취소에 실패했습니다.';
      showToast(message, 'error');
      return false;
    }
  };

  return { getMyRequests, cancelRequest };
}
