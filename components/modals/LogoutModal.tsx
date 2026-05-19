"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface LogoutModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export default function LogoutModal({ onConfirm, onClose }: LogoutModalProps) {
  const [visible, setVisible] = useState(false);
  const [wrapper, setWrapper] = useState<Element | null>(null);

  useEffect(() => {
    const wrapperTimer = setTimeout(() => setWrapper(document.querySelector(".wrapper")), 0);
    const visibleTimer = setTimeout(() => setVisible(true), 10);
    return () => {
      clearTimeout(wrapperTimer);
      clearTimeout(visibleTimer);
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    setVisible(false);
    setTimeout(onConfirm, 300);
  };

  if (!wrapper) return null;

  return createPortal(
    <>
      <div
        className="absolute inset-0 z-40 bg-black/40 rounded-[30px] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      <div
        className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] px-[25px] pt-[28px] pb-[60px] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${visible ? "0%" : "100%"})` }}
      >
        <div className="w-[40px] h-[4px] bg-[#D2D2D2] rounded-full mx-auto mb-[20px]" />

        <div className="relative flex items-center justify-center mb-[28px]">
          <h2 className="text-[17px] font-bold text-[#3C3C3C]">로그아웃</h2>
          <button onClick={handleClose} className="absolute right-0 text-[#B0B0B0]">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-[6px] mb-[28px] py-[8px]">
          <p className="text-[16px] font-bold text-[#3C3C3C]">정말 로그아웃 하시겠습니까?</p>
        </div>

        <div className="flex flex-col gap-[10px]">
          <button
            onClick={handleConfirm}
            className="w-full h-[56px] bg-[#EF4444] rounded-[14px] text-white font-semibold text-[16px] active:opacity-80 transition-opacity"
          >
            로그아웃
          </button>
          <button
            onClick={handleClose}
            className="w-full h-[56px] bg-[#F0F0F0] rounded-[14px] text-[#3C3C3C] font-semibold text-[16px] active:opacity-80 transition-opacity"
          >
            취소
          </button>
        </div>
      </div>
    </>,
    wrapper,
  );
}
