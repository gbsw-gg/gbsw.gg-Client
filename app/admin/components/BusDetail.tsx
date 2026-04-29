'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, Pencil, Check, X } from 'lucide-react';
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
  reason: string | null;
}

interface BusInfo {
  id: number;
  busNumber: number;
  leaderName: string;
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

export default function BusDetail({ busId, leaderName: initialLeaderName, onBack }: Props) {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [busDbId, setBusDbId] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [currentLeaderName, setCurrentLeaderName] = useState(initialLeaderName);
  const [isEditing, setIsEditing] = useState(false);
  const [studentNumber, setStudentNumber] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<ApiResponse<BusInfo[]>>('/api/buses')
      .then(res => {
        if (res.success) {
          const bus = res.data.find(b => b.busNumber === busId);
          if (bus) setBusDbId(bus.id);
        }
      })
      .catch(() => {});

    api.get<ApiResponse<StudentRecord[]>>('/api/admin/records')
      .then(res => {
        if (res.success) setStudents(res.data.filter(r => r.busNumber === busId));
      })
      .catch(() => {});
  }, [busId]);

  const handleLeaderSave = async () => {
    if (!busDbId || !studentNumber.trim()) return;
    setSaving(true);
    try {
      const res = await api.patch<ApiResponse>(
        `/api/admin/buses/${busDbId}/leader?studentNumber=${encodeURIComponent(studentNumber.trim())}`
      );
      if (res.success) {
        const busRes = await api.get<ApiResponse<BusInfo[]>>('/api/buses');
        if (busRes.success) {
          const bus = busRes.data.find(b => b.busNumber === busId);
          if (bus) setCurrentLeaderName(bus.leaderName);
        }
        setIsEditing(false);
        setStudentNumber('');
      }
    } catch {
      // 에러 처리
    } finally {
      setSaving(false);
    }
  };

  const total = students.length;
  const boarded = students.filter(s => s.status === 'BOARDING').length;
  const preAbsent = students.filter(s => s.status === 'PRE_ABSENT').length;
  const unknown = students.filter(s => s.status === 'ABSENT').length;

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="flex flex-row items-center gap-1 cursor-pointer w-fit mb-4" onClick={onBack}>
        <ChevronLeft size={20} color="#3c3c3c" />
        <p className="text-[14px] font-medium text-[#3c3c3c]">뒤로가기</p>
      </div>

      <div className="w-full h-auto px-6.25 py-5 bg-white flex flex-col rounded-[20px] shadow-sm">
        <p className="text-[#3c3c3c] text-[24px] font-bold">{busId}호차</p>

        {isEditing ? (
          <div className="flex flex-row items-center gap-2 mt-1">
            <p className="text-[12px] text-[#747474] font-medium">대표자:</p>
            <input
              autoFocus
              value={studentNumber}
              onChange={e => setStudentNumber(e.target.value)}
              placeholder="학번 입력"
              className="h-7 border-b border-[#d2d2d2] outline-none text-[12px] text-[#3c3c3c] px-1 w-28 focus:border-[#02AB87]"
            />
            <button onClick={handleLeaderSave} disabled={saving} className="cursor-pointer">
              <Check size={16} color="#02AB87" />
            </button>
            <button onClick={() => { setIsEditing(false); setStudentNumber(''); }} className="cursor-pointer">
              <X size={16} color="#747474" />
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-center gap-2 mt-1">
            <p className="text-[12px] text-[#747474] font-medium">대표자: {currentLeaderName}</p>
            <button onClick={() => setIsEditing(true)} className="cursor-pointer">
              <Pencil size={12} color="#747474" />
            </button>
          </div>
        )}

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
          const isPreAbsent = s.status === 'PRE_ABSENT';
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={i}
              onClick={() => isPreAbsent ? setExpandedIndex(isExpanded ? null : i) : undefined}
              className={`w-full flex flex-col py-3 px-4 rounded-xl bg-white shadow-sm ${isPreAbsent ? 'cursor-pointer' : ''}`}
            >
              <div className="w-full flex flex-row justify-between items-center">
                <div className="w-auto justify-between">
                  <p className="text-[14px] font-bold text-[#3c3c3c]">{s.studentName}</p>
                  <p className="text-[12px] font-medium text-[#3c3c3c]">{s.grade}학년 {s.classNum}반</p>
                </div>
                <p className={`text-[12px] font-bold ${STATUS_COLOR[label]}`}>{label}</p>
              </div>
              {isPreAbsent && isExpanded && (
                <div className="mt-2 pt-2 border-t border-[#f1f1f1]">
                  <p className="text-[12px] text-[#747474] font-medium">사유: {s.reason ?? '미입력'}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
