'use client';

import { ChevronLeft } from 'lucide-react';

interface Props {
  busId: number;
  onBack: () => void;
}

export default function BusDetail({ busId, onBack }: Props) {
  // 추후 API 연동
  const mock = [
    { name: '홍길동', num: '3학년 2반', status: '탑승 완료' },
    { name: '김철수', num: '2학년 1반', status: '미확인' },
    { name: '이영희', num: '1학년 3반', status: '사전 미탑승' },
  ];

  const statusColor: Record<string, string> = {
    '탑승 완료': 'text-[#10B981]',
    '사전 미탑승': 'text-[#FACC15]',
    '미확인': 'text-[#3c3c3c]'
  };

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="flex flex-row items-center gap-2 cursor-pointer" onClick={onBack}>
        <ChevronLeft size={20} color="#3c3c3c" />
      </div>

      <div className="w-full h-auto px-6.25 py-5 bg-white flex flex-col rounded-[20px] shadow-sm">
        <p className="text-[#3c3c3c] text-[24px] font-bold">{busId}호차</p>
        <p className="text-[12px] text-[#747474] font-medium mt-1">대표자: LEADER_NAME</p>

        <div className="w-full h-px bg-[#d2d2d2] my-5" />

        <div className="w-full h-auto flex flex-row justify-between">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-black">전체 인원</p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#10B981]">탑승 완료</p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
        </div>

        <div className="w-full h-auto flex flex-row justify-between mt-6.25">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#FACC15]">사전 미탑승</p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#EF4444]">미확인</p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
        </div>
      </div>

      <div className="w-full h-auto flex flex-row justify-between items-center my-5 px-1">
        <p className="text-[#3c3c3c] text-[24px] font-bold">학생 명단</p>
        <p className="text-[12px] font-medium text-[#3c3c3c]">3명</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        {mock.map((p, i) => (
          <div key={i} className="w-full flex flex-row justify-between items-center py-3 px-4 rounded-xl bg-white shadow-sm">
            <div className="w-auto h-full justify-between">
              <p className="text-[14px] font-bold text-[#3c3c3c]">{p.name}</p>
              <p className='text-[12px] font medium text-[#3c3c3c]'>{p.num}</p>
            </div>
            <p className={`text-[12px] font-bold ${statusColor[p.status]}`}>{p.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
