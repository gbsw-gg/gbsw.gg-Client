'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import api, { ApiResponse } from '@/lib/api';

interface Props {
  busId: number;
  leaderName: string;
  onBack: () => void;
}

interface StudentRecord {
  busNumber: number;
  studentName: string;
  grade: number;
  classNum: number;
  status: 'BOARDING' | 'PRE_ABSENT' | 'ABSENT';
}

const STATUS_LABEL: Record<string, string> = {
  BOARDING: '탑승 완료',
  PRE_ABSENT: '사전 미탑승',
  ABSENT: '미확인',
};

const STATUS_COLOR: Record<string, string> = {
  '탑승 완료': 'text-[#10B981]',
  '사전 미탑승': 'text-[#FACC15]',
  '미확인': 'text-[#3c3c3c]',
};

export default function BusDetail({ busId, leaderName, onBack }: Props) {
  const [students, setStudents] = useState<StudentRecord[]>([]);

  useEffect(() => {
    api.get<ApiResponse<StudentRecord[]>>('/api/admin/records')
      .then(res => {
        if (res.success) setStudents(res.data.filter(r => r.busNumber === busId));
      })
      .catch(() => {});
  }, [busId]);

  const total = students.length;
  const boarded = students.filter(s => s.status === 'BOARDING').length;
  const preAbsent = students.filter(s => s.status === 'PRE_ABSENT').length;
  const unknown = students.filter(s => s.status === 'ABSENT').length;

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={onBack}>
        <ChevronLeft size={20} color="#3c3c3c" />
      </div>

      <div className="w-full h-auto px-6.25 py-5 bg-white flex flex-col rounded-[20px] shadow-sm">
        <p className="text-[#3c3c3c] text-[24px] font-bold">{busId}호차</p>
        <p className="text-[12px] text-[#747474] font-medium mt-1">대표자: {leaderName}</p>

        <div className="w-full h-px bg-[#d2d2d2] my-5" />

        <div className="w-full h-auto flex flex-row justify-between">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-black">전체 인원</p>
            <p className="text-[24px] font-bold text-black">{total}명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#10B981]">탑승 완료</p>
            <p className="text-[24px] font-bold text-black">{boarded}명</p>
          </div>
        </div>

        <div className="w-full h-auto flex flex-row justify-between mt-6.25">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#FACC15]">사전 미탑승</p>
            <p className="text-[24px] font-bold text-black">{preAbsent}명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#EF4444]">미확인</p>
            <p className="text-[24px] font-bold text-black">{unknown}명</p>
          </div>
        </div>
      </div>

      <div className="w-full h-auto flex flex-row justify-between items-center my-5 px-1">
        <p className="text-[#3c3c3c] text-[24px] font-bold">학생 명단</p>
        <p className="text-[12px] font-medium text-[#3c3c3c]">{total}명</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {students.map((s, i) => {
          const label = STATUS_LABEL[s.status];
          return (
            <div key={i} className="w-full flex flex-row justify-between items-center py-3 px-4 rounded-xl bg-white shadow-sm">
              <div className="w-auto h-full justify-between">
                <p className="text-[14px] font-bold text-[#3c3c3c]">{s.studentName}</p>
                <p className="text-[12px] font-medium text-[#3c3c3c]">{s.grade}학년 {s.classNum}반</p>
              </div>
              <p className={`text-[12px] font-bold ${STATUS_COLOR[label]}`}>{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
