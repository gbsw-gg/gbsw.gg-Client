'use client';

import { useState, useEffect, useCallback } from 'react';
import RoundCard from './RoundCard';
import RoundCreateForm from './RoundCreactForm';
import api, { ApiResponse } from '@/lib/api';

interface Schedule {
  id: number;
  name: string;
  type: 'OUTBOUND' | 'INBOUND';
  departAt: string;
  isActive: boolean;
}

const TYPE_LABEL: Record<string, string> = {
  OUTBOUND: '귀가',
  INBOUND: '귀교',
};


export default function RoundManage() {
  const [rounds, setRounds] = useState<Schedule[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchRounds = useCallback(() => {
    api.get<ApiResponse<Schedule[]>>('/api/schedules')
      .then(res => { if (res.success) setRounds(res.data); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => { fetchRounds(); }, [fetchRounds]);

  const handleToggle = async (id: number, isActive: boolean) => {
    if (!isActive) {
      const activeRound = rounds.find(r => r.isActive && r.id !== id);
      if (activeRound) {
        await api.patch<ApiResponse>(`/api/schedules/${activeRound.id}/deactivate`).catch(() => {});
      }
    }
    const action = isActive ? 'deactivate' : 'activate';
    await api.patch<ApiResponse>(`/api/schedules/${id}/${action}`).catch(() => {});
    fetchRounds();
  };

  const handleDelete = async (id: number) => {
    await api.delete<ApiResponse>(`/api/schedules/${id}`).catch(() => {});
    fetchRounds();
  };

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="w-full h-auto flex flex-row justify-between items-center">
        <p className="text-[20px] font-bold text-[#3c3c3c]">회차 목록</p>
        <div onClick={() => setShowForm(true)} className="w-auto h-auto px-4 py-3 flex justify-center items-center text-[14px] font-bold text-white bg-[#02AB87] rounded-[10px] cursor-pointer duration-200 hover:bg-[#049173]">+ 회차 생성</div>
      </div>

      {loaded && rounds.length === 0 && (
        <p className="text-[14px] font-medium text-[#747474] text-center mt-10">회차 목록이 비어있습니다</p>
      )}

      {rounds.map(round => (
        <RoundCard
          key={round.id}
          title={round.name}
          type={TYPE_LABEL[round.type]}
          startTime={`출발: ${round.departAt.replace('T', ' ').slice(0, 16)}`}
          active={round.isActive}
          onToggle={() => handleToggle(round.id, round.isActive)}
          onDelete={() => handleDelete(round.id)}
        />
      ))}

      {showForm && (
        <RoundCreateForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchRounds(); }}
        />
      )}
    </div>
  );
}
