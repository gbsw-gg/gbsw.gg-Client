'use client';

import { useState } from 'react';
import RoundCard from './RoundCard';
import RoundCreateForm from './RoundCreactForm';


const mock = [
  { id: 1, title: '2026년 3월 2주차 귀가', type: '귀가', startTime: '출발: 2026-03-20 15:00', active: false },
  { id: 2, title: '2026년 3월 2주차 귀교', type: '귀교', startTime: '출발: 2026-03-22 18:00', active: true }
];

export default function RoundManage() {
  const [rounds, setRounds] = useState(mock);
  const [showForm, setShowForm] = useState(false);

  const handleToggle = (id: number) => {
    setRounds(prev => prev.map(r => ({ ...r, active: r.id === id && !r.active })));
  };

  const handleDelete = (id: number) => {
    // 추후 API 연동
  };

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="w-full h-auto flex flex-row justify-between items-center">
        <p className="text-[20px] font-bold text-[#3c3c3c]">회차 목록</p>
        <div onClick={() => setShowForm(true)} className="w-auto h-auto px-4 py-3 flex justify-center items-center text-[14px] font-bold text-white bg-[#02AB87] rounded-[10px] cursor-pointer duration-200 hover:bg-[#049173]">+ 회차 생성</div>
      </div>

      {rounds.map(round => (
        <RoundCard key={round.id} title={round.title} type={round.type} startTime={round.startTime} active={round.active} onToggle={() => handleToggle(round.id)} onDelete={() => handleDelete(round.id)} />
      ))}

      {showForm && <RoundCreateForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
