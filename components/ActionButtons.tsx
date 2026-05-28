"use client";

import { CheckCircle, XCircle, Lock } from "lucide-react";

interface ActionButtonsProps {
  onCheckIn: () => void;
  onAbsent: () => void;
  absentExpired?: boolean;
  checkStarted?: boolean;
}

export default function ActionButtons({
  onCheckIn,
  onAbsent,
  absentExpired = false,
  checkStarted = false,
}: ActionButtonsProps) {
  return (
    <div className="mx-[25px] mt-[20px] flex flex-col gap-[12px]">
      {checkStarted ? (
        <button
          onClick={onCheckIn}
          className="w-full h-[56px] bg-[#02AB87] rounded-[14px] flex items-center justify-center gap-[8px] active:opacity-80 transition-opacity"
        >
          <CheckCircle size={20} color="white" />
          <span className="text-white font-semibold text-[16px]">탑승 체크하기</span>
        </button>
      ) : (
        <button
          disabled
          className="w-full h-[56px] bg-[#B0B0B0] rounded-[14px] flex items-center justify-center gap-[8px]"
        >
          <Lock size={20} color="white" />
          <span className="text-white font-semibold text-[16px]">탑승 체크 시작 전</span>
        </button>
      )}
      {absentExpired ? (
        <p className="text-center text-[13px] font-medium text-[#767676]">
          미탑승 신청 기간이 다 지났습니다.
        </p>
      ) : (
        <button
          onClick={onAbsent}
          className="w-full h-[56px] bg-[#737373] rounded-[14px] flex items-center justify-center gap-[8px] active:opacity-80 transition-opacity"
        >
          <XCircle size={20} color="white" />
          <span className="text-white font-semibold text-[16px]">미탑승 신청하기</span>
        </button>
      )}
    </div>
  );
}
