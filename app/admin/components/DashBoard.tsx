'use client';

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import api, { ApiResponse } from "@/lib/api";

interface BusSummary {
  busNumber: number;
  leaderName: string;
}

interface DashboardData {
  schedule: { id: number; name: string; departAt: string } | null;
  buses: BusSummary[];
}

interface StudentRecord {
  busNumber: number;
  status: 'BOARDING' | 'PRE_ABSENT' | 'ABSENT';
}

interface Props {
  onSelectBus: (busId: number, leaderName: string) => void;
}

function calcCounts(records: StudentRecord[], busNumber?: number) {
  const filtered = busNumber !== undefined
    ? records.filter(r => r.busNumber === busNumber)
    : records;
  return {
    total: filtered.length,
    boarding: filtered.filter(r => r.status === 'BOARDING').length,
    preAbsent: filtered.filter(r => r.status === 'PRE_ABSENT').length,
    absent: filtered.filter(r => r.status === 'ABSENT').length,
  };
}

export default function DashBoard({ onSelectBus }: Props) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [records, setRecords] = useState<StudentRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<ApiResponse<DashboardData>>('/api/admin/dashboard').catch(() => null),
      api.get<ApiResponse<StudentRecord[]>>('/api/admin/records').catch(() => null),
    ]).then(([dashRes, recRes]) => {
      if (dashRes?.success) setData(dashRes.data);
      if (recRes?.success) setRecords(recRes.data);
      setLoaded(true);
    });
  }, []);

  const buses = (data?.buses ?? []).slice().sort((a, b) => a.busNumber - b.busNumber);
  const overall = calcCounts(records);

  if (loaded && !data) {
    return (
      <div className="w-full h-full flex justify-center items-center py-20">
        <p className="text-[14px] font-medium text-[#747474]">활성된 회차가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="w-full h-auto px-6.25 py-5 bg-white flex flex-col rounded-[20px] shadow-sm">
        <p className="text-[#3c3c3c] text-[20px] font-bold">전체 현황</p>
        {data?.schedule && (
          <>
            <p className="text-[14px] text-[#747474] font-medium mt-4">{data.schedule.name}</p>
            <p className="text-[14px] text-[#747474] font-medium">
              출발: {data.schedule.departAt.replace('T', ' ').slice(0, 16)}
            </p>
          </>
        )}

        <div className="w-full h-px bg-[#d2d2d2] my-5" />

        <div className="w-full h-auto flex flex-row justify-between">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-black">전체 인원</p>
            <p className="text-[24px] font-bold text-black">{overall.total}명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#10B981]">탑승 완료</p>
            <p className="text-[24px] font-bold text-black">{overall.boarding}명</p>
          </div>
        </div>

        <div className="w-full h-auto flex flex-row justify-between mt-6.25">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#FACC15]">사전 미탑승</p>
            <p className="text-[24px] font-bold text-black">{overall.preAbsent}명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#EF4444]">미확인</p>
            <p className="text-[24px] font-bold text-black">{overall.absent}명</p>
          </div>
        </div>
      </div>

      <p className="text-[20px] font-bold text-[#3c3c3c] my-5">호차별 현황</p>

      <div className="w-full h-auto flex flex-col gap-5">
        {buses.map((bus) => {
          const counts = calcCounts(records, bus.busNumber);
          return (
            <div key={bus.busNumber} onClick={() => onSelectBus(bus.busNumber, bus.leaderName)} className="w-full h-auto flex flex-col p-5 rounded-[20px] shadow-sm cursor-pointer">
              <div className="w-full flex flex-row justify-between">
                <p className="text-[20px] font-bold text-[#3c3c3c]">{bus.busNumber}호차</p>
                <ChevronRight color="#3c3c3c" />
              </div>
              <p className="text-[12px] text-[#3c3c3c] font-medium">
                대표자: {bus.leaderName}
              </p>

              <div className="w-full h-auto flex flex-row gap-9 mt-4">
                {[
                  { label: '전체', value: counts.total },
                  { label: '사전 미탑승', value: counts.preAbsent },
                  { label: '미확인', value: counts.absent },
                  { label: '탑승 완료', value: counts.boarding },
                ].map((item) => (
                  <div key={item.label} className="w-auto h-auto flex flex-col items-center">
                    <p className="text-[10px] text-black font-medium">{item.label}</p>
                    <p className="text-[14px] text-black font-bold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
