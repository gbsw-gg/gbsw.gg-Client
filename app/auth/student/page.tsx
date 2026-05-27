"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAttendance } from "@/hooks/useAttendance";
import { useSchedule, Schedule, parseSchedule } from "@/hooks/useSchedule";
import { useBus } from "@/hooks/useBus";
import { useBusChangeRequest, BusChangeRequest } from "@/hooks/useBusChangeRequest";
import { useUser } from "@/context/UserContext";
import { useRequireRole } from "@/hooks/useRequireRole";
import StudentHeader from "@/components/StudentHeader";
import BusInfoCard from "@/components/BusInfoCard";
import StatusCard from "@/components/StatusCard";
import ActionButtons from "@/components/ActionButtons";
import Notice from "@/components/Notice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import BusChangeModal from "@/components/modals/BusChangeModal";
import PasswordChangeModal from "@/components/modals/PasswordChangeModal";
import LogoutModal from "@/components/modals/LogoutModal";

type StatusType = "미확인" | "탑승 완료" | "미탑승";
type ModalType = "checkin" | "absent" | null;

const REQUEST_STATUS_LABEL: Record<string, string> = {
  PENDING: "대기 중",
  APPROVED: "승인됨",
  CANCELED: "취소됨",
};
const REQUEST_STATUS_COLOR: Record<string, string> = {
  PENDING: "#F59E0B",
  APPROVED: "#02AB87",
  CANCELED: "#B0B0B0",
};
const TYPE_LABEL: Record<string, string> = {
  OUTBOUND: "귀가",
  INBOUND: "귀교",
};

export default function StudentPage() {
  const { logout } = useAuth();
  const { getMyBoarding, checkBoarding, requestAbsent } = useAttendance();
  const { getSchedule } = useSchedule();
  const { getMyBusStatus } = useBus();
  const { getMyRequests, cancelRequest } = useBusChangeRequest();
  const { user } = useUser();
  const { isChecking } = useRequireRole(['STUDENT']);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [busLabel, setBusLabel] = useState<string>("-");
  const [currentBusNumber, setCurrentBusNumber] = useState<number | null>(null);
  const [status, setStatus] = useState<StatusType>("미확인");
  const [timestamp, setTimestamp] = useState<string | undefined>(undefined);
  const [absentReason, setAbsentReason] = useState<string | undefined>(undefined);
  const [modal, setModal] = useState<ModalType>(null);
  const [busChangeOpen, setBusChangeOpen] = useState(false);
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [requests, setRequests] = useState<BusChangeRequest[]>([]);
  const [cancelingId, setCancelingId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const name = user?.name ?? "이름 없음";
  const grade = user?.grade ?? 0;
  const classNum = user?.classNum ?? 0;
  const number = user?.studentId ? parseInt(user.studentId.slice(-2), 10) : undefined;
  const isConfirmed = status === "탑승 완료" || status === "미탑승";

  const fetchRequests = async () => {
    const data = await getMyRequests();
    setRequests(data.filter((r) => r.status !== 'CANCELED'));
  };

  useEffect(() => {
    if (isChecking) return;
    const init = async () => {
      const [s, myStatus] = await Promise.all([getSchedule(), getMyBusStatus()]);
      setSchedule(s);
      if (myStatus) {
        setBusLabel(`${myStatus.busNumber}호차`);
        setCurrentBusNumber(myStatus.busNumber);
      }

      const boarding = await getMyBoarding();
      if (boarding) {
        if (boarding.status === 'BOARDING') {
          setStatus("탑승 완료");
          setTimestamp(formatTime(boarding.checkTime));
        } else if (boarding.status === 'PRE_ABSENT') {
          setStatus("미탑승");
          setTimestamp(formatTime(boarding.checkTime));
          setAbsentReason(boarding.reason);
        }
      }

      await fetchRequests();
      setLoaded(true);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecking]);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleCancel = async (id: number) => {
    setCancelingId(id);
    const ok = await cancelRequest(id);
    if (ok) setRequests((prev) => prev.filter((r) => r.id !== id));
    setCancelingId(null);
  };

  const handleConfirm = async (reason?: string) => {
    if (!schedule) return;
    try {
      if (modal === "checkin") {
        await checkBoarding(schedule.id);
        setStatus("탑승 완료");
        setTimestamp(formatTime(new Date().toISOString()));
      } else if (modal === "absent") {
        await requestAbsent(schedule.id, reason ?? "");
        setStatus("미탑승");
        setAbsentReason(reason);
        setTimestamp(formatTime(new Date().toISOString()));
      }
    } catch {
      // 에러 토스트는 useAttendance 내부에서 처리
    } finally {
      setModal(null);
    }
  };

  const parsed = schedule ? parseSchedule(schedule) : null;

  if (isChecking) return null;

  return (
    <>
      <div className="w-full min-h-screen flex flex-col">
        <div className="bg-[#05A787] pb-[80px]">
          <StudentHeader
            name={name}
            grade={grade}
            classNum={classNum}
            number={number}
            onLogout={() => setLogoutOpen(true)}
            onChangePassword={() => setPasswordChangeOpen(true)}
          />
        </div>

        <div className="flex flex-col mt-[-60px]">
          {loaded && !schedule ? (
            /* 활성 스케줄 없음 */
            <div className="mx-[25px] mt-[20px] bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.08)] px-[24px] py-[32px] flex flex-col items-center gap-[10px]">
              <p className="text-[28px]">🚌</p>
              <p className="text-[16px] font-bold text-[#3C3C3C]">현재 활성화된 버스 회차가 없습니다.</p>
              <p className="text-[13px] text-[#888888] text-center">회차가 활성화 되면 다시 확인해 주세요.</p>
            </div>
          ) : (
            <>
              <BusInfoCard
                busNumber={busLabel}
                week={schedule ? `${schedule.name} (${parsed?.typeLabel})` : "-"}
                departureDate={parsed?.date ?? "-"}
                departureTime={parsed?.time ?? "-"}
                onChangeBus={() => setBusChangeOpen(true)}
              />
              <StatusCard status={status} timestamp={timestamp} reason={absentReason} />
              {!isConfirmed && (
                <ActionButtons
                  onCheckIn={() => setModal("checkin")}
                  onAbsent={() => setModal("absent")}
                />
              )}

              {/* 호차 변경 신청 내역 */}
              {requests.length > 0 && (
                <div className="mx-[25px] mt-[20px]">
                  <h2 className="text-[15px] font-bold text-[#3C3C3C] mb-[10px]">호차 변경 신청 내역</h2>
                  <div className="flex flex-col gap-[10px]">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white rounded-[16px] shadow-[0_4px_10px_0_rgba(0,0,0,0.08)] px-[20px] py-[16px]"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-[4px]">
                            <div className="flex items-center gap-[8px]">
                              <p className="text-[14px] font-bold text-[#3C3C3C]">
                                {req.originalBusNumber}호차 → {req.requestedBusNumber}호차
                              </p>
                              <span
                                className="text-[11px] font-semibold px-[8px] py-[2px] rounded-full"
                                style={{
                                  color: REQUEST_STATUS_COLOR[req.status],
                                  backgroundColor: `${REQUEST_STATUS_COLOR[req.status]}1A`,
                                }}
                              >
                                {REQUEST_STATUS_LABEL[req.status]}
                              </span>
                            </div>
                            <p className="text-[12px] text-[#888888]">
                              {TYPE_LABEL[req.type]}
                              {req.requestedStation ? ` · ${req.requestedStation}` : ""}
                            </p>
                            <p className="text-[11px] text-[#B0B0B0] mt-[2px]">
                              신청일 {formatDate(req.requestedAt)}
                            </p>
                          </div>
                          {req.status === 'PENDING' && (
                            <button
                              onClick={() => handleCancel(req.id)}
                              disabled={cancelingId === req.id}
                              className="text-[12px] font-semibold text-[#EF4444] bg-[#FEF2F2] px-[10px] py-[5px] rounded-[8px] active:opacity-70 transition-opacity disabled:opacity-40 shrink-0 ml-[8px]"
                            >
                              {cancelingId === req.id ? "취소 중..." : "취소"}
                            </button>
                          )}
                        </div>
                        {req.reason && (
                          <p className="text-[12px] text-[#888888] mt-[10px] pt-[10px] border-t border-[#F0F0F0]">
                            사유: {req.reason}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
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
        <BusChangeModal
          onClose={() => setBusChangeOpen(false)}
          onSuccess={fetchRequests}
          scheduleType={schedule?.type ?? "OUTBOUND"}
          currentBusNumber={currentBusNumber ?? undefined}
        />
      )}

      {passwordChangeOpen && (
        <PasswordChangeModal onClose={() => setPasswordChangeOpen(false)} />
      )}

      {logoutOpen && (
        <LogoutModal
          onConfirm={logout}
          onClose={() => setLogoutOpen(false)}
        />
      )}
    </>
  );
}
