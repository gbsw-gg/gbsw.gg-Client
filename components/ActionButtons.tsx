"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface ActionButtonsProps {
  onCheckIn: () => void;
  onAbsent: () => void;
}

export default function ActionButtons({
  onCheckIn,
  onAbsent,
}: ActionButtonsProps) {
  return (
    <div className="mx-[25px] mt-[20px] flex flex-col gap-[12px]">
      <button
        onClick={onCheckIn}
        className="w-full h-[56px] bg-[#02AB87] rounded-[14px] flex items-center justify-center gap-[8px] active:opacity-80 transition-opacity"
      >
        <CheckCircle size={20} color="white" />
        <span className="text-white font-semibold text-[16px]">
          탑승 체크하기
        </span>
      </button>
      <button
        onClick={onAbsent}
        className="w-full h-[56px] bg-[#737373] rounded-[14px] flex items-center justify-center gap-[8px] active:opacity-80 transition-opacity"
      >
        <XCircle size={20} color="white" />
        <span className="text-white font-semibold text-[16px]">
          미탑승 신청하기
        </span>
      </button>
    </div>
  );
}
