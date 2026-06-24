"use client";

import { useEffect, useState } from "react";
import api, { ApiResponse } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

interface PasswordChangeModalProps {
  onClose: () => void;
  allowStudentReset?: boolean;
}

type PasswordMode = "change" | "studentReset";

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : (error as { message?: string })?.message ?? "";

export default function PasswordChangeModal({ onClose, allowStudentReset = false }: PasswordChangeModalProps) {
  const { showToast } = useToast();

  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<PasswordMode>("change");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [studentResetLoading, setStudentResetLoading] = useState(false);
  const [studentResetError, setStudentResetError] = useState("");
  const [studentResetConfirming, setStudentResetConfirming] = useState(false);

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

  const trimmedStudentNumber = studentNumber.trim();
  const canResetStudentPassword = trimmedStudentNumber.length > 0 && !studentResetLoading;

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
      const message = getErrorMessage(error);

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

  const handleStudentNumberChange = (value: string) => {
    setStudentNumber(value);
    setStudentResetError("");
    setStudentResetConfirming(false);
  };

  const handleStudentResetSubmit = async () => {
    if (!canResetStudentPassword) return;

    if (!studentResetConfirming) {
      setStudentResetError("");
      setStudentResetConfirming(true);
      return;
    }

    setStudentResetError("");
    setStudentResetLoading(true);
    try {
      const res = await api.patch<ApiResponse>(
        `/api/admin/students/${encodeURIComponent(trimmedStudentNumber)}/password/reset`
      );
      if (!res.success) throw res;
      showToast("학생 비밀번호가 초기화되었습니다.", "success");
      handleClose();
    } catch (error) {
      const message = getErrorMessage(error);
      setStudentResetError(message || "학생 비밀번호 초기화에 실패했습니다.");
    } finally {
      setStudentResetLoading(false);
    }
  };

  const handleModeChange = (nextMode: PasswordMode) => {
    setMode(nextMode);
    setSubmitError("");
    setStudentResetError("");
    setStudentResetConfirming(false);
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

        <div className="flex items-center justify-center mb-[18px]">
          <h2 className="text-[17px] font-bold text-[#3C3C3C]">
            {allowStudentReset ? "비밀번호 관리" : "비밀번호 변경"}
          </h2>
        </div>

        {allowStudentReset && (
          <div className="grid grid-cols-2 gap-[6px] rounded-[14px] bg-[#F2F4F3] p-[4px] mb-[22px]">
            <button
              type="button"
              onClick={() => handleModeChange("change")}
              className={`h-[40px] rounded-[10px] text-[13px] font-semibold transition-colors ${
                mode === "change" ? "bg-white text-[#03977A] shadow-sm" : "text-[#747474]"
              }`}
            >
              내 비밀번호 변경
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("studentReset")}
              className={`h-[40px] rounded-[10px] text-[13px] font-semibold transition-colors ${
                mode === "studentReset" ? "bg-white text-[#03977A] shadow-sm" : "text-[#747474]"
              }`}
            >
              학생 비밀번호 초기화
            </button>
          </div>
        )}

        {mode === "change" && (
          <>
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
          </>
        )}

        {allowStudentReset && mode === "studentReset" && (
          <>
            <div className="flex flex-col gap-[8px] mb-[18px]">
              <label htmlFor="student-password-reset-number" className="text-[12px] font-medium text-[#474747]">학생 학번</label>
              <input
                id="student-password-reset-number"
                value={studentNumber}
                onChange={(e) => handleStudentNumberChange(e.target.value)}
                placeholder="초기화할 학생 학번 입력"
                inputMode="numeric"
                className="w-full h-[52px] rounded-[14px] border border-[#D2D2D2] px-[16px] text-[14px] text-[#3C3C3C] outline-none focus:border-[#05A787] transition-colors"
              />
            </div>

            {studentResetConfirming && (
              <div className="rounded-[14px] bg-[#FFF7ED] border border-[#FED7AA] px-[14px] py-[12px] mb-[14px]">
                <p className="text-[13px] font-semibold text-[#9A3412]">학번 {trimmedStudentNumber}</p>
                <p className="text-[12px] font-medium text-[#9A3412] mt-[4px]">
                  이 학생의 비밀번호를 초기화하시겠습니까?
                </p>
              </div>
            )}

            {studentResetError && (
              <p className="text-[12px] text-[#EF4444] font-medium text-center mb-[12px]">{studentResetError}</p>
            )}

            <div className="flex flex-col gap-[10px]">
              <button
                onClick={handleStudentResetSubmit}
                disabled={!canResetStudentPassword}
                className="w-full h-[56px] bg-[#05A787] rounded-[14px] text-white font-semibold text-[16px] transition-opacity disabled:opacity-40 active:enabled:opacity-80"
              >
                {studentResetLoading
                  ? "초기화 중..."
                  : studentResetConfirming
                    ? "확인 후 초기화하기"
                    : "초기화하기"}
              </button>
              {studentResetConfirming && (
                <button
                  onClick={() => setStudentResetConfirming(false)}
                  disabled={studentResetLoading}
                  className="w-full h-[52px] bg-[#F0F0F0] rounded-[14px] text-[#3C3C3C] font-semibold text-[15px] active:opacity-80 transition-opacity disabled:opacity-40"
                >
                  취소하기
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
