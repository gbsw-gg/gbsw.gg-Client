'use client';

import { Trash2 } from 'lucide-react';

interface RoundCardProps {
  title: string;
  type: string;
  startTime: string;
  active: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export default function RoundCard({ title, type, startTime, active, onToggle, onDelete }: RoundCardProps) {
  const handleToggle = () => {
    if (window.confirm(`해당 회차를 ${active ? '비활성화' : '활성화'} 하시겠습니까?`)) onToggle();
  };

  const handleDelete = () => {
    if (window.confirm('해당 회차를 삭제하시겠습니까?')) onDelete();
  };

  return (
    <div className="w-full h-auto p-5 bg-white rounded-[20px] shadow-sm flex flex-col gap-1 mt-5">
      <div className="w-full h-auto flex flex-row items-center gap-2.5">
        <p className="text-[20px] text-[#3c3c3c] font-bold">{title}</p>
        {active && <p className="text-[12px] font-bold text-[#10B981]">활성됨</p>}
      </div>
      <p className="text-[12px] text-[#3c3c3c] font-medium">{type}</p>
      <p className="text-[12px] text-[#747474] font-medium">{startTime}</p>

      <div className="w-full h-7.5 flex flex-row justify-center gap-3 mt-4">
        <div onClick={handleToggle} className={`w-62.5 h-full rounded-lg flex justify-center items-center cursor-pointer duration-200 ${active ? 'bg-[#f1f1f1] hover:bg-[#d2d2d2]' : 'bg-[#02AB87] hover:bg-[#049173]'}`}>
          <p className={`text-[10px] font-bold select-none ${active ? 'text-[#474747]' : 'text-white'}`}>{active ? '비활성화' : '활성화'}</p>
        </div>
        <div onClick={handleDelete} className="w-12.5 h-full bg-[#f1f1f1] flex justify-center items-center rounded-lg cursor-pointer duration-200 hover:bg-[#d2d2d2]">
          <Trash2 size={16} color="#474747" />
        </div>
      </div>
    </div>
  );
}
