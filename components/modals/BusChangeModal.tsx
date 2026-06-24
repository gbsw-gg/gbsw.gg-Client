"use client";

import { ArrowLeft, Bus } from "lucide-react";
import { useEffect, useState } from "react";
import { useBus, Bus as BusType } from "@/hooks/useBus";
import { useToast } from "@/context/ToastContext";
import api, { ApiResponse } from "@/lib/api";

type Step = "bus" | "station" | "confirm" | "success";

// 귀가 버스별 정류장
const STATIONS_OUTBOUND: Record<number, string[]> = {
  1: ["칠곡ic", "북부정류장", "동대구역"],
  2: ["동대구역", "대구공항", "포항"],
  3: ["안동버스터미널", "옥동"],
  4: ["창원종합버스터미널", "진해 석동"],
  5: ["인동-천생초 앞", "인동-인동육교", "석적 3공단부영"],
  6: ["옥계 탑정형외과", "구미시외버스터미널", "구미역"],
};

// 귀교 버스별 정류장 (3호차만 선택지 있음)
const STATIONS_INBOUND: Record<number, string[]> = {
  3: ["진해석동", "창원종합버스터미널"],
};

const BUS_NUMBERS_OUTBOUND = [1, 2, 3, 4, 5, 6];
const BUS_NUMBERS_INBOUND = [1, 2, 3, 4];

const STEP_TITLE: Record<Step, string> = {
  bus: "호차 선택",
  station: "내리는 정류장 선택",
  confirm: "신청 확인",
  success: "신청 완료",
};

interface BusChangeModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  scheduleType: "OUTBOUND" | "INBOUND";
  currentBusNumber?: number;
  currentStation?: string;
}

export default function BusChangeModal({ onClose, onSuccess, scheduleType, currentBusNumber, currentStation }: BusChangeModalProps) {
  const { getBuses } = useBus();
  const { showToast } = useToast();

  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("bus");
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [buses, setBuses] = useState<BusType[]>([]);
  const [loading, setLoading] = useState(false);

  const directionLabel = scheduleType === "OUTBOUND" ? "귀가" : "귀교";
  const stationsMap = scheduleType === "OUTBOUND" ? STATIONS_OUTBOUND : STATIONS_INBOUND;
  const allowedBusNumbers = scheduleType === "OUTBOUND" ? BUS_NUMBERS_OUTBOUND : BUS_NUMBERS_INBOUND;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    getBuses().then((all) =>
      setBuses(all.filter((b) => allowedBusNumbers.includes(b.busNumber)))
    );
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleBack = () => {
    if (step === "station") {
      setSelectedStation(null);
      setStep("bus");
    } else if (step === "confirm") {
      const stations = selectedBus ? (stationsMap[selectedBus.busNumber] ?? []) : [];
      setStep(stations.length > 0 ? "station" : "bus");
    }
  };

  const handleNext = () => {
    if (step === "bus" && selectedBus) {
      const stations = stationsMap[selectedBus.busNumber] ?? [];
      setStep(stations.length > 0 ? "station" : "confirm");
    } else if (step === "station" && selectedStation) {
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
    if (!selectedBus || !reason.trim()) return;
    setLoading(true);
    try {
      const res = await api.post<ApiResponse>("/api/bus-change-requests", {
        requestedBusId: selectedBus.id,
        requestedStation: selectedStation ?? undefined,
        type: scheduleType,
        reason: reason.trim(),
      });
      if (!res.success) throw new Error(res.message);
      setStep("success");
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "호차 변경 신청에 실패했습니다.";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const canNext =
    (step === "bus" && selectedBus !== null) ||
    (step === "station" && selectedStation !== null);

  const allStations = selectedBus ? (stationsMap[selectedBus.busNumber] ?? []) : [];
  // 같은 호차 선택 시 현재 정류장 제외
  const stations = selectedBus?.busNumber === currentBusNumber
    ? allStations.filter(s => s !== currentStation)
    : allStations;
  const showBack = step !== "bus" && step !== "success";
  const showNext = step === "bus" || step === "station";

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

        <div className="relative flex items-center justify-center mb-[24px]">
          {showBack && (
            <button onClick={handleBack} className="absolute left-0 text-[#B0B0B0]">
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-[17px] font-bold text-[#3C3C3C]">{STEP_TITLE[step]}</h2>
        </div>

        {/* Step: 호차 선택 */}
        {step === "bus" && (
          <div className="flex flex-col gap-[10px] mb-[24px]">
            {buses.map((bus) => {
              const isCurrent = bus.busNumber === currentBusNumber;
              const busStations = stationsMap[bus.busNumber] ?? [];
              // 같은 호차라도 정류장 변경 가능한 경우: 현재 정류장 외 다른 정류장이 있을 때
              const otherStations = busStations.filter(s => s !== currentStation);
              const canSelectSameBus = isCurrent && otherStations.length > 0;
              const disabled = isCurrent && !canSelectSameBus;
              return (
                <button
                  key={bus.id}
                  onClick={() => !disabled && setSelectedBus(bus)}
                  disabled={disabled}
                  className={`w-full h-[56px] rounded-[14px] font-semibold text-[15px] border-2 transition-all ${
                    disabled
                      ? "bg-[#F7F7F7] border-transparent text-[#C0C0C0] cursor-not-allowed"
                      : selectedBus?.id === bus.id
                      ? "bg-[#E8F8F4] border-[#05A787] text-[#05A787]"
                      : "bg-[#F7F7F7] border-transparent text-[#3C3C3C]"
                  }`}
                >
                  {bus.name || `${bus.busNumber}호차`}
                  {isCurrent && <span className="ml-[6px] text-[12px] font-normal">
                    {canSelectSameBus ? "(정류장 변경)" : "(변경 불가)"}
                  </span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Step: 정류장 선택 */}
        {step === "station" && (
          <div className="flex flex-col gap-[10px] mb-[24px]">
            {stations.map((station) => (
              <button
                key={station}
                onClick={() => setSelectedStation(station)}
                className={`w-full h-[56px] rounded-[14px] font-semibold text-[15px] border-2 transition-all ${
                  selectedStation === station
                    ? "bg-[#E8F8F4] border-[#05A787] text-[#05A787]"
                    : "bg-[#F7F7F7] border-transparent text-[#3C3C3C]"
                }`}
              >
                {station}
              </button>
            ))}
          </div>
        )}

        {/* Step: 신청 확인 */}
        {step === "confirm" && (
          <div className="flex flex-col gap-[16px] mb-[24px]">
            <div className="flex flex-col items-center gap-[6px] py-[16px]">
              <p className="text-[17px] font-bold text-[#3C3C3C]">정말 신청하시겠습니까?</p>
              <p className="text-[14px] text-[#888888] font-medium mt-[4px]">
                {directionLabel} · {selectedBus?.name || `${selectedBus?.busNumber}호차`}
                {selectedStation && ` · ${selectedStation}`}
              </p>
              <p className="text-[12px] text-[#B0B0B0] font-medium mt-[2px]">
                신청 후에는 수정할 수 없습니다.
              </p>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="변경 사유를 입력해주세요"
              aria-label="호차 변경 사유"
              className="w-full h-[100px] rounded-[14px] border border-[#D2D2D2] px-[16px] py-[12px] text-[14px] text-[#3C3C3C] resize-none outline-none focus:border-[#05A787] transition-colors"
            />
          </div>
        )}

        {/* Step: 신청 완료 */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-[12px] mb-[28px] py-[20px]">
            <div className="w-[60px] h-[60px] bg-[#E8F8F4] rounded-full flex items-center justify-center">
              <Bus size={28} color="#05A787" />
            </div>
            <p className="text-[17px] font-bold text-[#3C3C3C] mt-[4px]">신청이 완료되었습니다!</p>
            <p className="text-[13px] text-[#888888] font-medium">
              {directionLabel} · {selectedBus?.name || `${selectedBus?.busNumber}호차`}
              {selectedStation && ` · ${selectedStation}`}
            </p>
          </div>
        )}

        {/* 다음 버튼 */}
        {showNext && (
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="w-full h-[56px] bg-[#05A787] rounded-[14px] text-white font-semibold text-[16px] transition-opacity disabled:opacity-40 active:enabled:opacity-80"
          >
            다음
          </button>
        )}

        {/* 신청 확인 — 확인/취소 */}
        {step === "confirm" && (
          <div className="flex flex-col gap-[10px]">
            <button
              onClick={handleConfirm}
              disabled={!reason.trim() || loading}
              className="w-full h-[56px] bg-[#05A787] rounded-[14px] text-white font-semibold text-[16px] transition-opacity disabled:opacity-40 active:enabled:opacity-80"
            >
              {loading ? "신청 중..." : "확인"}
            </button>
            <button
              onClick={handleBack}
              disabled={loading}
              className="w-full h-[56px] bg-[#F0F0F0] rounded-[14px] text-[#3C3C3C] font-semibold text-[16px] active:opacity-80 transition-opacity disabled:opacity-40"
            >
              취소
            </button>
          </div>
        )}

        {/* 신청 완료 — 닫기 */}
        {step === "success" && (
          <button
            onClick={handleClose}
            className="w-full h-[56px] bg-[#05A787] rounded-[14px] text-white font-semibold text-[16px] active:opacity-80 transition-opacity"
          >
            확인
          </button>
        )}
      </div>
    </>
  );
}
