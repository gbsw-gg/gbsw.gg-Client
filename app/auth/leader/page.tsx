"use client";

import { useState } from "react";
import StudentHeader from "@/components/StudentHeader";
import BusInfoCard from "@/components/BusInfoCard";
import StatusCard from "@/components/StatusCard";
import ActionButtons from "@/components/ActionButtons";
import Notice from "@/components/Notice";
import ConfirmModal from "@/components/modals/ConfirmModal";

type StatusType = "미확인" | "탑승 완료" | "미탑승";
type ModalType = "checkin" | "absent" | null;
type StudentStatus = "사전 미탑승" | "탑승 완료" | "미확인";

interface Student {
  name: string;
  grade: number;
  classNum: number;
  status: StudentStatus;
}

const STATUS_COLOR: Record<StudentStatus, string> = {
  "사전 미탑승": "#F59E0B",
  "탑승 완료": "#02AB87",
  "미확인": "#B0B0B0",
};

const mockStudents: Student[] = [
  { name: "이현석", grade: 3, classNum: 2, status: "사전 미탑승" },
  { name: "김구현", grade: 3, classNum: 1, status: "탑승 완료" },
  { name: "양선민", grade: 3, classNum: 2, status: "미확인" },
  { name: "이현석", grade: 3, classNum: 2, status: "사전 미탑승" },
  { name: "김구현", grade: 3, classNum: 1, status: "탑승 완료" },
  { name: "양선민", grade: 3, classNum: 2, status: "미확인" },
];

export default function LeaderPage() {
  const [status, setStatus] = useState<StatusType>("미확인");
  const [timestamp, setTimestamp] = useState<string | undefined>(undefined);
  const [modal, setModal] = useState<ModalType>(null);
  const [absentReason, setAbsentReason] = useState<string | undefined>(undefined);

  const isConfirmed = status === "탑승 완료" || status === "미탑승";
  const showDashboard = status === "탑승 완료";

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

  const total = mockStudents.length;
  const boarded = mockStudents.filter((s) => s.status === "탑승 완료").length;
  const absentCount = mockStudents.filter((s) => s.status === "사전 미탑승").length;
  const unchecked = mockStudents.filter((s) => s.status === "미확인").length;

  return (
    <>
      {!showDashboard ? (
        /* ── Phase 1: 본인 탑승 체크 ── */
        <div className="min-h-full flex flex-col">
          <div className="bg-[#05A787] pb-[80px]">
            <StudentHeader name="김환성 (도우미)" grade={3} classNum={1} number={16} />
          </div>
          <div className="flex flex-col mt-[-60px]">
            <BusInfoCard
              busNumber="4호차"
              week="2026년 3월 2주차 귀가"
              departureDate="2026-03-20"
              departureTime="14:30"
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
      ) : (
        /* ── Phase 2: 도우미 대시보드 ── */
        <div className="min-h-full flex flex-col">
          <div className="bg-[#05A787] pb-[80px]">
            <StudentHeader name="김환성 (도우미)" grade={3} classNum={1} number={16} />
          </div>

          <div className="flex flex-col mt-[-60px]">
            {/* 담당 버스 + 통계 카드 */}
            <div className="mx-[25px] mt-[20px] bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.15)]">
              <div className="mx-[25px] py-[20px]">
                <div className="pb-[12px] border-b border-[#D2D2D2]">
                  <p className="text-[12px] font-medium text-[#474747]">담당 버스</p>
                  <h2 className="text-[24px] font-bold text-[#3C3C3C] mt-[2px]">4호차</h2>
                </div>
                <div className="grid grid-cols-2 gap-y-[18px] mt-[16px]">
                  <div>
                    <p className="text-[12px] font-medium text-[#474747]">전체 인원</p>
                    <p className="text-[22px] font-bold text-[#3C3C3C] mt-[2px]">{total}명</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-[#474747]">탑승 완료</p>
                    <p className="text-[22px] font-bold text-[#02AB87] mt-[2px]">{boarded}명</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-[#474747]">사전 미탑승</p>
                    <p className="text-[22px] font-bold text-[#F59E0B] mt-[2px]">{absentCount}명</p>
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-[#474747]">미확인</p>
                    <p className="text-[22px] font-bold text-[#EF4444] mt-[2px]">{unchecked}명</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 학생 명단 */}
            <div className="mx-[25px] mt-[24px] mb-[30px]">
              <div className="flex justify-between items-center mb-[14px]">
                <h2 className="text-[18px] font-bold text-[#3C3C3C]">학생 명단</h2>
                <span className="text-[13px] font-medium text-[#B0B0B0]">{total}명</span>
              </div>
              <div className="bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.15)] overflow-hidden">
                {mockStudents.map((student, index) => (
                  <div
                    key={index}
                    className={`px-[20px] py-[16px] flex justify-between items-center ${
                      index !== mockStudents.length - 1
                        ? "border-b border-[#F0F0F0]"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-[3px]">
                      <p className="text-[15px] font-bold text-[#3C3C3C]">{student.name}</p>
                      <p className="text-[12px] font-medium text-[#B0B0B0]">
                        {student.grade}학년 {student.classNum}반
                      </p>
                    </div>
                    <p
                      className="text-[13px] font-semibold"
                      style={{ color: STATUS_COLOR[student.status] }}
                    >
                      {student.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <ConfirmModal
          type={modal}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
