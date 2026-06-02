"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAttendance } from "@/hooks/useAttendance";
import { useSchedule, Schedule, parseSchedule } from "@/hooks/useSchedule";
import { useBus, BusMember, BusStatus, MemberStatus } from "@/hooks/useBus";
import { useToast } from "@/context/ToastContext";
import { useUser } from "@/context/UserContext";
import { useRequireRole } from "@/hooks/useRequireRole";
import StudentHeader from "@/components/StudentHeader";
import BusInfoCard from "@/components/BusInfoCard";
import StatusCard from "@/components/StatusCard";
import ActionButtons from "@/components/ActionButtons";
import Notice from "@/components/Notice";
import ConfirmModal from "@/components/modals/ConfirmModal";
import PasswordChangeModal from "@/components/modals/PasswordChangeModal";
import LogoutModal from "@/components/modals/LogoutModal";

type StatusType = "미확인" | "탑승 완료" | "미탑승";
type ModalType = "checkin" | "absent" | null;
type TabType = "checkin" | "members";

type StudentStatus = "사전 미탑승" | "탑승 완료" | "미확인";

const STATUS_LABEL: Record<MemberStatus, StudentStatus> = {
  BOARDING: "탑승 완료",
  PRE_ABSENT: "사전 미탑승",
  ABSENT: "미확인",
};

const STATUS_COLOR: Record<StudentStatus, string> = {
  "사전 미탑승": "#B45309",
  "탑승 완료": "#027A65",
  "미확인": "#767676",
};

const LEADER_TYPE_LABEL: Record<string, string> = {
  OUTBOUND: "귀가 도우미",
  INBOUND: "귀교 도우미",
};

export default function LeaderPage() {
  const { logout } = useAuth();
  const { getMyBoarding, checkBoarding, requestAbsent } = useAttendance();
  const { getSchedule } = useSchedule();
  const { getMyBusMembers, getMyBusStatus } = useBus();
  const { user } = useUser();
  const { showToast } = useToast();
  const { isChecking } = useRequireRole(['LEADER']);

  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [status, setStatus] = useState<StatusType>("미확인");
  const [timestamp, setTimestamp] = useState<string | undefined>(undefined);
  const [modal, setModal] = useState<ModalType>(null);
  const [absentReason, setAbsentReason] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>("checkin");

  const [busLabel, setBusLabel] = useState<string>("-");
  const [passwordChangeOpen, setPasswordChangeOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [members, setMembers] = useState<BusMember[]>([]);
  const [busStatus, setBusStatus] = useState<BusStatus | null>(null);
  const [loaded, setLoaded] = useState(false);

  // 활성 스케쥴 타입이 도우미의 leaderTypes에 포함될 때만 도우미로 동작
  const isMatchingLeader = !schedule || (user?.leaderTypes?.includes(schedule.type) ?? false);

  const leaderTypeLabel = schedule && user?.leaderTypes?.includes(schedule.type)
    ? LEADER_TYPE_LABEL[schedule.type]
    : user?.leaderTypes?.[0] ? LEADER_TYPE_LABEL[user.leaderTypes[0]] : "도우미";
  const displayName = user
    ? (isMatchingLeader ? `${user.name} (${leaderTypeLabel})` : user.name)
    : "도우미";
  const grade = user?.grade ?? 0;
  const classNum = user?.classNum ?? 0;
  const number = user?.studentId ? parseInt(user.studentId.slice(-2), 10) : undefined;

  const isConfirmed = status === "탑승 완료" || status === "미탑승";

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const loadBusData = async () => {
    const [m, s] = await Promise.all([getMyBusMembers(), getMyBusStatus()]);
    setMembers(m);
    setBusStatus(s);
  };

  useEffect(() => {
    if (isChecking) return;
    const init = async () => {
      const [s, boarding, myStatus] = await Promise.all([
        getSchedule(),
        getMyBoarding(),
        getMyBusStatus(),
      ]);
      setSchedule(s);
      if (myStatus) {
        setBusLabel(`${myStatus.busNumber}호차`);
        setBusStatus(myStatus);
      }

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

      await loadBusData();
      setLoaded(true);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecking]);

  const handleConfirm = async (reason?: string) => {
    if (!schedule) return;
    try {
      if (modal === "checkin") {
        await checkBoarding(schedule.id);
        setStatus("탑승 완료");
        setTimestamp(formatTime(new Date().toISOString()));
        await loadBusData();
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

  const noScheduleCard = (
    <div className="mx-[25px] mt-[20px] bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.08)] px-[24px] py-[32px] flex flex-col items-center gap-[10px]">
      <p className="text-[28px]">🚌</p>
      <p className="text-[16px] font-bold text-[#3C3C3C]">지금은 버스 탑승 시간이 아닙니다</p>
      <p className="text-[13px] text-[#888888] text-center">현재 활성화된 버스 회차가 없습니다.<br />탑승 시간에 다시 확인해 주세요.</p>
    </div>
  );

  const checkinContent = (
    <>
      <BusInfoCard
        busNumber={busLabel}
        week={schedule ? `${schedule.name} (${parsed?.typeLabel})` : "-"}
        departureDate={parsed?.date ?? "-"}
        departureTime={parsed?.time ?? "-"}
      />
      <StatusCard status={status} timestamp={timestamp} reason={absentReason} />
      {!isConfirmed && (
        <ActionButtons
          onCheckIn={() => setModal("checkin")}
          onAbsent={() => setModal("absent")}
          checkStarted={schedule ? new Date() > new Date(schedule.checkStartAt) : false}
          absentExpired={schedule ? new Date() > new Date(schedule.preAbsentDeadline) : false}
        />
      )}
      <Notice />
    </>
  );

  return (
    <>
      <div className="w-full min-h-screen flex flex-col">
        <div className="bg-[#05A787] pb-[80px]">
          <StudentHeader
            name={displayName}
            grade={grade}
            classNum={classNum}
            number={number}
            onLogout={() => setLogoutOpen(true)}
            onChangePassword={() => setPasswordChangeOpen(true)}
          />
        </div>

        <div className="flex flex-col mt-[-60px]">
          {loaded && !schedule ? (
            noScheduleCard
          ) : isMatchingLeader ? (
            /* ── 도우미 모드: 탭 UI ── */
            <>
              <div className="mx-[25px] mt-[20px] flex bg-[#F1F1F1] rounded-[14px] p-[4px]">
                <button
                  onClick={() => setActiveTab("checkin")}
                  className={`flex-1 h-[40px] rounded-[10px] text-[14px] font-semibold transition-colors ${
                    activeTab === "checkin" ? "bg-white text-[#02AB87] shadow-sm" : "text-[#767676]"
                  }`}
                >
                  탑승 체크
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`flex-1 h-[40px] rounded-[10px] text-[14px] font-semibold transition-colors ${
                    activeTab === "members" ? "bg-white text-[#02AB87] shadow-sm" : "text-[#767676]"
                  }`}
                >
                  학생 명단
                </button>
              </div>

              {activeTab === "checkin" && checkinContent}

              {activeTab === "members" && (
                <div className="flex flex-col">
                  <div className="mx-[25px] mt-[20px] bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.15)]">
                    <div className="mx-[25px] py-[20px]">
                      <div className="pb-[12px] border-b border-[#D2D2D2]">
                        <p className="text-[12px] font-medium text-[#474747]">담당 버스</p>
                        <h2 className="text-[24px] font-bold text-[#3C3C3C] mt-[2px]">
                          {busStatus ? `${busStatus.busNumber}호차` : "-"}
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-y-[18px] mt-[16px]">
                        <div>
                          <p className="text-[12px] font-medium text-[#474747]">전체 인원</p>
                          <p className="text-[22px] font-bold text-[#3C3C3C] mt-[2px]">{busStatus?.total ?? "-"}명</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-[#474747]">탑승 완료</p>
                          <p className="text-[22px] font-bold text-[#027A65] mt-[2px]">{busStatus?.boarding ?? "-"}명</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-[#474747]">사전 미탑승</p>
                          <p className="text-[22px] font-bold text-[#B45309] mt-[2px]">{busStatus?.preAbsent ?? "-"}명</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-medium text-[#474747]">미확인</p>
                          <p className="text-[22px] font-bold text-[#EF4444] mt-[2px]">{busStatus ? busStatus.total - busStatus.boarding - busStatus.preAbsent : "-"}명</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mx-[25px] mt-[24px] mb-[30px]">
                    <div className="flex justify-between items-center mb-[14px]">
                      <h2 className="text-[18px] font-bold text-[#3C3C3C]">학생 명단</h2>
                      <span className="text-[13px] font-medium text-[#767676]">{busStatus?.total ?? members.length}명</span>
                    </div>
                    <div className="bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.15)] overflow-hidden">
                      {members.map((member, index) => {
                        const label = STATUS_LABEL[member.status];
                        const copyPhone = async () => {
                          if (!member.phone) return;
                          await navigator.clipboard.writeText(member.phone);
                          showToast('복사되었습니다.', 'success');
                        };
                        return (
                          <div
                            key={member.studentId}
                            className={`px-[20px] py-[16px] flex justify-between items-center ${
                              index !== members.length - 1 ? "border-b border-[#F0F0F0]" : ""
                            }`}
                          >
                            <div className="flex flex-col gap-[3px]">
                              <p className="text-[15px] font-bold text-[#3C3C3C]">{member.name}</p>
                              <p className="text-[12px] font-medium text-[#767676]">
                                {member.grade}학년 {member.classNum}반
                              </p>
                            </div>
                            {member.phone && (
                              <button
                                onClick={copyPhone}
                                className="text-[12px] font-medium text-[#767676] active:opacity-50 transition-opacity mx-[8px]"
                              >
                                {member.phone}
                              </button>
                            )}
                            <p className="text-[13px] font-semibold" style={{ color: STATUS_COLOR[label] }}>
                              {label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ── 학생 모드: 스케쥴 타입 불일치 시 일반 학생처럼 표시 ── */
            checkinContent
          )}
        </div>
      </div>

      {modal && (
        <ConfirmModal
          type={modal}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
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
