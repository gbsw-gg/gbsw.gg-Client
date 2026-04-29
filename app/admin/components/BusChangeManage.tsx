'use client';

import { useEffect, useState, useCallback } from 'react';
import api, { ApiResponse } from '@/lib/api';

interface BusChangeRequest {
  id: number;
  studentName: string;
  grade: number;
  classNum: number;
  originalBusNumber: number;
  requestedBusNumber: number;
  reason: string;
  type: 'OUTBOUND' | 'INBOUND';
  status: 'PENDING' | 'APPROVED' | 'CANCELED';
  requestedAt: string;
  approvedByName: string | null;
}

type FilterStatus = 'PENDING' | 'APPROVED' | 'CANCELED';

const TYPE_LABEL: Record<string, string> = {
  OUTBOUND: '귀가',
  INBOUND: '귀교',
};

const TABS: { label: string; value: FilterStatus }[] = [
  { label: '대기 중', value: 'PENDING' },
  { label: '승인됨', value: 'APPROVED' },
  { label: '취소됨', value: 'CANCELED' },
];

export default function BusChangeManage() {
  const [filter, setFilter] = useState<FilterStatus>('PENDING');
  const [requests, setRequests] = useState<BusChangeRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchRequests = useCallback((status: FilterStatus) => {
    setLoaded(false);
    api.get<ApiResponse<BusChangeRequest[]>>(`/api/admin/bus-change-requests?status=${status}`)
      .then(res => { if (res.success) setRequests(res.data); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => { fetchRequests(filter); }, [filter, fetchRequests]);

  const handleApprove = async (id: number) => {
    await api.patch<ApiResponse>(`/api/admin/bus-change-requests/${id}/approve`).catch(() => {});
    fetchRequests(filter);
  };

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <p className="text-[20px] font-bold text-[#3c3c3c]">호차 변경 신청</p>

      <div className="w-full h-10 flex flex-row gap-2 mt-4">
        {TABS.map(tab => (
          <div
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 h-full flex items-center rounded-lg text-[12px] font-medium cursor-pointer duration-200 ${
              filter === tab.value ? 'bg-[#02AB87] text-white font-bold' : 'bg-[#f1f1f1] text-[#3c3c3c]'
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-4 mt-5">
        {loaded && requests.length === 0 && (
          <p className="text-[14px] font-medium text-[#747474] text-center mt-10">신청 내역이 없습니다</p>
        )}

        {requests.map(req => (
          <div key={req.id} className="w-full flex flex-col p-5 rounded-[20px] shadow-sm bg-white gap-2">
            <div className="w-full flex flex-row justify-between items-center">
              <div>
                <p className="text-[16px] font-bold text-[#3c3c3c]">{req.studentName}</p>
                <p className="text-[12px] font-medium text-[#747474]">{req.grade}학년 {req.classNum}반 · {TYPE_LABEL[req.type]}</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <p className="text-[16px] font-bold text-[#3c3c3c]">{req.originalBusNumber}호차</p>
                <p className="text-[12px] text-[#747474]">→</p>
                <p className="text-[16px] font-bold text-[#02AB87]">{req.requestedBusNumber}호차</p>
              </div>
            </div>

            <div className="w-full h-px bg-[#f1f1f1]" />

            <p className="text-[12px] text-[#3c3c3c] font-medium">사유: {req.reason}</p>
            <p className="text-[11px] text-[#747474]">신청일: {req.requestedAt.replace('T', ' ').slice(0, 16)}</p>

            {req.status === 'APPROVED' && req.approvedByName && (
              <p className="text-[11px] text-[#10B981]">승인자: {req.approvedByName}</p>
            )}

            {req.status === 'PENDING' && (
              <div
                onClick={() => handleApprove(req.id)}
                className="w-full h-9 mt-1 flex justify-center items-center bg-[#02AB87] rounded-lg text-white text-[12px] font-bold cursor-pointer duration-200 hover:bg-[#049173]"
              >
                승인
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
