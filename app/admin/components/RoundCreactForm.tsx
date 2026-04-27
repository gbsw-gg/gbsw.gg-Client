'use client';

import { useState, useEffect } from 'react';

interface Props {
  onClose: () => void;
}

export default function RoundCreateForm({ onClose }: Props) {
  const [type, setType] = useState<'귀가' | '귀교'>('귀가');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className={`absolute inset-0 z-50 flex flex-col justify-end transition-colors duration-300 ${visible ? 'bg-black/40' : 'bg-transparent'}`} onClick={close}>
      <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className={`w-full h-auto bg-white rounded-t-[30px] p-7.5 flex flex-col gap-7.5 transition-transform duration-300 ease-out ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
        <p className="text-[20px] text-[#3c3c3c] font-bold">회차 생성</p>

        <div className="w-full h-auto flex flex-col gap-1">
          <p className="text-[12px] font-medium text-[#474747]">
            회차 이름 <span className="text-[#EF4444]">*</span>
          </p>
          <input type="text" placeholder="예: 2026년 3월 2주차 귀가" className="w-full h-10 bg-white border border-[#d2d2d2] rounded-lg outline-none px-2.5 text-[#474747] text-[14px] placeholder:text-[14px]" />
        </div>

        <div className="w-full h-auto flex flex-col gap-1">
          <p className="text-[12px] font-medium text-[#474747]">
            구분 <span className="text-[#EF4444]">*</span>
          </p>
          <div className="w-full h-10 flex flex-row justify-between">
            <div onClick={() => setType('귀가')} className={`min-w-40 h-10 flex justify-center items-center text-[12px] rounded-lg cursor-pointer ${type === '귀가' ? 'bg-[#02AB87] text-white font-bold' : 'bg-[#f1f1f1] text-[#3c3c3c] font-medium'}`}>귀가</div>
            <div onClick={() => setType('귀교')} className={`min-w-40 h-10 flex justify-center items-center text-[12px] rounded-lg cursor-pointer ${type === '귀교' ? 'bg-[#02AB87] text-white font-bold' : 'bg-[#f1f1f1] text-[#3c3c3c] font-medium'}`}>귀교</div>
          </div>
        </div>

        <div className="w-full h-auto flex flex-col gap-1">
          <p className="text-[12px] font-medium text-[#474747]">
            출발 날짜 <span className="text-[#EF4444]">*</span>
          </p>
          <input type="date" className="w-full h-10 bg-white border border-[#d2d2d2] rounded-lg outline-none px-2.5 text-[#474747] text-[14px]" />
        </div>

        <div className="w-full h-auto flex flex-col gap-1">
          <p className="text-[12px] font-medium text-[#474747]">
            출발 시간 <span className="text-[#EF4444]">*</span>
          </p>
          <input type="time" className="w-full h-10 bg-white border border-[#d2d2d2] rounded-lg outline-none px-2.5 text-[#474747] text-[14px]" />
        </div>

        <div className='w-full h-10 flex flex-row justify-between'>
          <button type="button" onClick={close} className='min-w-40 h-10 flex justify-center items-center text-[12px] rounded-lg bg-[#f1f1f1] text-[#3c3c3c] cursor-pointer duration-200 hover:bg-[#d2d2d2]'>취소</button>
          <button className='min-w-40 h-10 flex justify-center items-center text-[12px] rounded-lg bg-[#02AB87] text-[#ffffff] cursor-pointer duration-200 hover:bg-[#049173]'>생성하기</button>
        </div>
      </form>
    </div>
  );
}
