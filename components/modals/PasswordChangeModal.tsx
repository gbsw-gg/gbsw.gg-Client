"use client";

import { useEffect, useState } from "react";
import api, { ApiResponse } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface PasswordChangeModalProps {
  onClose: () => void;
}

export default function PasswordChangeModal({ onClose }: PasswordChangeModalProps) {
  const { showToast } = useToast();

  const [visible, setVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const tooShort = newPassword.length > 0 && newPassword.trim().length < 4;
  const canSubmit =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length >= 4 &&
    newPassword === confirmPassword &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitError("");
    setLoading(true);
    try {
      const res = await api.patch<ApiResponse>("/api/me/password", {
        currentPassword,
        newPassword,
      });
      if (!res.success) throw res;
      showToast("비밀번호가 변경되었습니다.", "success");
      handleClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : (error as { message?: string })?.message ?? "";

      if (message.includes("현재") || message.toLowerCase().includes("current")) {
        setSubmitError("현재 비밀번호가 올바르지 않습니다.");
      } else if (message.includes("일치") || message.toLowerCase().includes("match")) {
        setSubmitError("새 비밀번호가 일치하지 않습니다.");
      } else {
        setSubmitError(message || "비밀번호 변경에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none' }}
        onClick={handleClose}
      />

      <div
        className="fixed bottom-0 left-1/2 w-full max-w-[402px] z-50 bg-white rounded-t-[28px] px-[25px] pt-[28px] pb-[60px] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-50%) translateY(${visible ? "0%" : "100%"})` }}
      >
        <div className="w-[40px] h-[4px] bg-[#D2D2D2] rounded-full mx-auto mb-[20px]" />

        <div className="flex items-center justify-center mb-[28px]">
          <h2 className="text-[17px] font-bold text-[#3C3C3C]">비밀번호 변경</h2>
        </div>

        <div className="flex flex-col gap-[20px] mb-[28px]">
          <div className="flex flex-col gap-[8px]">
            <label htmlFor="current-password" className="text-[12px] font-medium text-[#474747]">현재 비밀번호</label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setSubmitError(""); }}
              placeholder="현재 비밀번호 입력"
              className="w-full h-[52px] rounded-[14px] border border-[#D2D2D2] px-[16px] text-[14px] text-[#3C3C3C] outline-none focus:border-[#05A787] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label htmlFor="new-password" className="text-[12px] font-medium text-[#474747]">
              새 비밀번호
              <span className="ml-[6px] text-[11px] font-normal text-[#767676]">(최소 4자리)</span>
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setSubmitError(""); }}
              placeholder="새 비밀번호 입력"
              className={`w-full h-[52px] rounded-[14px] border px-[16px] text-[14px] text-[#3C3C3C] outline-none transition-colors ${
                tooShort ? "border-[#EF4444]" : "border-[#D2D2D2] focus:border-[#05A787]"
              }`}
            />
            {tooShort && (
              <p className="text-[11px] text-[#EF4444] font-medium">최소 4자리 이상 입력해 주세요.</p>
            )}
          </div>

          <div className="flex flex-col gap-[8px]">
            <label htmlFor="confirm-password" className="text-[12px] font-medium text-[#474747]">새 비밀번호 확인</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setSubmitError(""); }}
              placeholder="새 비밀번호 재입력"
              className={`w-full h-[52px] rounded-[14px] border px-[16px] text-[14px] text-[#3C3C3C] outline-none transition-colors ${
                mismatch ? "border-[#EF4444]" : "border-[#D2D2D2] focus:border-[#05A787]"
              }`}
            />
            {mismatch && (
              <p className="text-[11px] text-[#EF4444] font-medium">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
        </div>

        {submitError && (
          <p className="text-[12px] text-[#EF4444] font-medium text-center mb-[12px]">{submitError}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full h-[56px] bg-[#05A787] rounded-[14px] text-white font-semibold text-[16px] transition-opacity disabled:opacity-40 active:enabled:opacity-80"
        >
          {loading ? "변경 중..." : "변경하기"}
        </button>
      </div>
    </>
  );
}
