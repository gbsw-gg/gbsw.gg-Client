"use client";

import { useState } from "react";
import StudentHeader from "@/components/StudentHeader";
import BusInfoCard from "@/components/BusInfoCard";
import StatusCard from "@/components/StatusCard";
import ActionButtons from "@/components/ActionButtons";
import Notice from "@/components/Notice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import BusChangeModal from "@/components/modals/BusChangeModal";

type StatusType = "미확인" | "탑승 완료" | "미탑승";
type ModalType = "checkin" | "absent" | null;

export default function StudentPage() {
  const [status, setStatus] = useState<StatusType>("미확인");
  const [timestamp, setTimestamp] = useState<string | undefined>(undefined);
  const [modal, setModal] = useState<ModalType>(null);
  const [absentReason, setAbsentReason] = useState<string | undefined>(undefined);
  const [busChangeOpen, setBusChangeOpen] = useState(false);

  const isConfirmed = status === "탑승 완료" || status === "미탑승";

  const handleConfirm = (reason?: string) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (modal === "checkin") {
      setStatus("탑승 완료");
    } else if (modal === "absent") {
      setStatus("미탑승");
      setAbsentReason(reason);
    }

    setTimestamp(formatted);
    setModal(null);
  };

  return (
    <>
      <div className="min-h-full flex flex-col">
        <div className="bg-[#05A787] pb-[80px]">
          <StudentHeader name="이현석" grade={3} classNum={2} number={16} />
        </div>

        <div className="flex flex-col mt-[-60px]">
          <BusInfoCard
            busNumber="4호차"
            week="2026년 3월 2주차 귀가"
            departureDate="2026-03-20"
            departureTime="14:30"
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
