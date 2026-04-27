"use client";

import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalType = "checkin" | "absent";

interface ConfirmModalProps {
  type: ModalType;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

const modalConfig = {
  checkin: {
    icon: <CheckCircle size={36} color="#02AB87" />,
    title: "탑승 체크하기",
    description: "정말 탑승 체크하시겠습니까?\n체크 후에는 수정할 수 없습니다.",
    confirmLabel: "체크하기",
    confirmColor: "bg-[#02AB87]",
  },
  absent: {
    icon: <XCircle size={36} color="#EF4444" />,
    title: "미탑승 신청하기",
    description: "미탑승 사유를 입력해 주세요.",
    confirmLabel: "신청하기",
    confirmColor: "bg-[#EF4444]",
  },
};

export default function ConfirmModal({
  type,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const config = modalConfig[type];
  const [visible, setVisible] = useState(false);
  const [wrapper, setWrapper] = useState<Element | null>(null);
  const [reason, setReason] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const wrapperTimer = setTimeout(() => setWrapper(document.querySelector(".wrapper")), 0);
    const visibleTimer = setTimeout(() => setVisible(true), 10);
    return () => {
      clearTimeout(wrapperTimer);
      clearTimeout(visibleTimer);
    };
  }, []);

  const handleCancel = () => {
    setVisible(false);
    setTimeout(onCancel, 300);
  };

  const handleConfirm = () => {
    if (type === "absent" && reason.trim() === "") return;
    setVisible(false);
    setTimeout(() => onConfirm(type === "absent" ? reason.trim() : undefined), 300);
  };

  if (!wrapper) return null;

  return createPortal(
    <>
      {/* 딤 배경 — wrapper 기준 inset-0 */}
      <div
        className="absolute inset-0 z-40 bg-black/40 rounded-[30px] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleCancel}
      />

      {/* 바텀시트 — wrapper 하단 기준 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] px-[25px] pt-[28px] pb-[60px] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${visible ? "0%" : "100%"})` }}
      >
        {/* 핸들 */}
        <div className="w-[40px] h-[4px] bg-[#D2D2D2] rounded-full mx-auto mb-[24px]" />

        {/* 닫기 버튼 */}
        <button
          onClick={handleCancel}
          className="absolute top-[24px] right-[25px] text-[#B0B0B0]"
        >
          <X size={20} />
        </button>

        {/* 아이콘 + 텍스트 */}
        <div className="flex flex-col items-center gap-[12px] mb-[24px] mt-[12px]">
          {config.icon}
          <h2 className="text-[18px] font-bold text-[#3C3C3C]">
            {config.title}
          </h2>
          <p className="text-[14px] text-[#747474] font-medium text-center whitespace-pre-line leading-[1.6]">
            {config.description}
          </p>
        </div>

        {/* 미탑승 사유 입력 */}
        {type === "absent" && (
          <textarea
            ref={textareaRef}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="사유를 입력하세요"
            className="w-full h-[100px] bg-[#F7F7F7] rounded-[14px] px-[16px] py-[14px] text-[14px] text-[#3C3C3C] font-medium placeholder:text-[#B0B0B0] resize-none outline-none mb-[16px]"
          />
        )}

        {/* 버튼 — 세로 배치 */}
        <div className="flex flex-col gap-[10px]">
          <button
            onClick={handleConfirm}
            disabled={type === "absent" && reason.trim() === ""}
            className={`w-full h-[56px] ${config.confirmColor} rounded-[14px] text-white font-semibold text-[16px] transition-opacity disabled:opacity-40 active:enabled:opacity-80`}
          >
            {config.confirmLabel}
          </button>
          <button
            onClick={handleCancel}
            className="w-full h-[56px] bg-[#F0F0F0] rounded-[14px] text-[#3C3C3C] font-semibold text-[16px] active:opacity-80 transition-opacity"
          >
            취소하기
          </button>
        </div>
      </div>
    </>,
    wrapper,
  );
}
