'use client';

import api, { ApiResponse } from '@/lib/api';

export type MemberStatus = 'BOARDING' | 'PRE_ABSENT' | 'ABSENT';

export interface BusMember {
  studentId: number;
  name: string;
  grade: number;
  classNum: number;
  phone?: string;
  status: MemberStatus;
  checkTime: string;
  reason: string;
}

export interface Bus {
  id: number;
  busNumber: number;
  name: string;
  leaderName: string;
}

export interface BusStatus {
  busNumber: number;
  scheduleId: number;
  total: number;
  boarding: number;
  preAbsent: number;
  absent: number;
}

export function useBus() {
  /** 전체 버스 목록 */
  const getBuses = async (): Promise<Bus[]> => {
    try {
      const res = await api.get<ApiResponse<Bus[]>>('/api/buses');
      if (!res.success) return [];
      return res.data;
    } catch {
      return [];
    }
  };

  /** 내 버스 학생 명단 */
  const getMyBusMembers = async (): Promise<BusMember[]> => {
    try {
      const res = await api.get<ApiResponse<BusMember[]>>('/api/buses/my/members');
      if (!res.success) return [];
      return res.data;
    } catch {
      return [];
    }
  };

  /** 내 버스 통계 (학생/도우미 공용) */
  const getMyBusStatus = async (): Promise<BusStatus | null> => {
    try {
      const res = await api.get<ApiResponse<BusStatus>>('/api/buses/my/status');
      if (!res.success) return null;
      return res.data;
    } catch {
      return null;
    }
  };

  return { getBuses, getMyBusMembers, getMyBusStatus };
}
