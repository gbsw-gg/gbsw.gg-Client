"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAttendance } from "@/hooks/useAttendance";
import { useUser } from "@/context/UserContext";
import { useRequireRole } from "@/hooks/useRequireRole";
import StudentHeader from "@/components/StudentHeader";
import BusInfoCard from "@/components/BusInfoCard";
import StatusCard from "@/components/StatusCard";
import ActionButtons from "@/components/ActionButtons";
import Notice from "@/components/Notice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import BusChangeModal from "@/components/modals/BusChangeModal";

type StatusType = "미확인" | "탑승 완료" | "미탑승";
type ModalType = "checkin" | "absent" | null;

// TODO: 활성 회차 API 연동 후 아래 값을 대체
const MOCK_SCHEDULE = {
  scheduleId: "schedule-1",
  busNumber: "4호차",
  week: "2026년 3월 2주차 귀가",
  departureDate: "2026-03-20",
  departureTime: "14:30",
};

export default function StudentPage() {
  const { logout } = useAuth();
  const { checkBoarding, requestAbsent } = useAttendance();
  const { user } = useUser();
  const { isChecking } = useRequireRole(['STUDENT']);

  const [status, setStatus] = useState<StatusType>("미확인");
  const [timestamp, setTimestamp] = useState<string | undefined>(undefined);
  const [modal, setModal] = useState<ModalType>(null);
  const [absentReason, setAbsentReason] = useState<string | undefined>(undefined);
  const [busChangeOpen, setBusChangeOpen] = useState(false);

  const name = user?.name ?? "이름 없음";
  const grade = user?.grade ?? 0;
  const classNum = user?.classNum ?? 0;
  const userId = String(user?.id ?? "");

  const isConfirmed = status === "탑승 완료" || status === "미탑승";

  const formatTimestamp = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  };

  const handleConfirm = async (reason?: string) => {
    try {
      if (modal === "checkin") {
        await checkBoarding(userId, MOCK_SCHEDULE.busNumber, MOCK_SCHEDULE.scheduleId);
        setStatus("탑승 완료");
      } else if (modal === "absent") {
        await requestAbsent(userId, MOCK_SCHEDULE.busNumber, MOCK_SCHEDULE.scheduleId, reason ?? "");
        setStatus("미탑승");
        setAbsentReason(reason);
      }
      setTimestamp(formatTimestamp());
    } catch {
      // 에러 토스트는 useAttendance 내부에서 처리
    } finally {
      setModal(null);
    }
  };

  if (isChecking) return null;

  return (
    <>
      <div className="min-h-full flex flex-col">
        <div className="bg-[#05A787] pb-[80px]">
          <StudentHeader
            name={name}
            grade={grade}
            classNum={classNum}
            number={0}
            onLogout={logout}
          />
        </div>

        <div className="flex flex-col mt-[-60px]">
          <BusInfoCard
            busNumber={MOCK_SCHEDULE.busNumber}
            week={MOCK_SCHEDULE.week}
            departureDate={MOCK_SCHEDULE.departureDate}
            departureTime={MOCK_SCHEDULE.departureTime}
            onChangeBus={() => setBusChangeOpen(true)}
          />
          <StatusCard status={status} timestamp={timestamp} reason={absentReason} />
          {!isConfirmed && (
            <ActionButtons
              onCheckIn={() => setModal("checkin")}
              onAbsent={() => setModal("absent")}
            />
          )}
          <Notice />
        </div>
      </div>

      {modal && (
        <ConfirmModal
          type={modal}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      {busChangeOpen && (
        <BusChangeModal onClose={() => setBusChangeOpen(false)} />
      )}
    </>
  );
}
