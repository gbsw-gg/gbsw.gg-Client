"use client";

import { ArrowLeft, X, Bus } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Direction = "귀가" | "귀교";
type Step = "direction" | "bus" | "region" | "confirm" | "success";

const BUSES: Record<Direction, string[]> = {
  귀가: [
    "1호차 (대구)",
    "2호차 (대구/포항)",
    "3호차 (안동)",
    "4호차 (경남)",
    "5호차 (구미, 석적)",
    "6호차 (구미)",
  ],
  귀교: [
    "1호차 (대구)",
    "2호차 (포항)",
    "3호차 (경남)",
    "4호차 (구미)",
  ],
};

const REGIONS: Partial<Record<Direction, Record<string, string[]>>> = {
  귀가: {
    "1호차 (대구)": ["칠곡ic", "북부정류장", "동대구역"],
    "2호차 (대구/포항)": ["동대구역", "대구공항", "포항"],
    "3호차 (안동)": ["안동버스터미널", "옥동"],
    "4호차 (경남)": ["창원종합버스터미널", "진해 석동"],
    "5호차 (구미, 석적)": ["인동-천생초 앞", "인동-인동육교", "석적 3공단부영"],
    "6호차 (구미)": ["옥계 탑정형외과", "구미시외버스터미널", "구미역"],
  },
  귀교: {
    "3호차 (경남)": ["진해 석동", "창원종합버스터미널"],
  },
};

const STEP_TITLE: Record<Step, string> = {
  direction: "호차 변경",
  bus: "호차 선택",
  region: "내리는 지역 선택",
  confirm: "신청 확인",
  success: "신청 완료",
};

function needsRegion(direction: Direction | null, bus: string | null): boolean {
  if (!direction || !bus) return false;
  return !!REGIONS[direction]?.[bus];
}

interface BusChangeModalProps {
  onClose: () => void;
}

export default function BusChangeModal({ onClose }: BusChangeModalProps) {
  const [visible, setVisible] = useState(false);
  const [wrapper, setWrapper] = useState<Element | null>(null);
  const [step, setStep] = useState<Step>("direction");
  const [direction, setDirection] = useState<Direction | null>(null);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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

  const handleBack = () => {
    if (step === "bus") {
      setSelectedBus(null);
      setStep("direction");
    } else if (step === "region") {
      setSelectedRegion(null);
      setStep("bus");
    } else if (step === "confirm") {
      setStep("bus");
    }
  };

  const handleNext = () => {
    if (step === "direction" && direction) {
      setSelectedBus(null);
      setSelectedRegion(null);
      setStep("bus");
    } else if (step === "bus" && selectedBus) {
      if (needsRegion(direction, selectedBus)) {
        setStep("region");
      } else {
        setStep("confirm");
      }
    } else if (step === "region" && selectedRegion) {
      setStep("confirm");
    }
  };

  const canNext =
    (step === "direction" && direction !== null) ||
    (step === "bus" && selectedBus !== null) ||
    (step === "region" && selectedRegion !== null);

  const buses = direction ? BUSES[direction] : [];
  const regions =
    direction && selectedBus ? (REGIONS[direction]?.[selectedBus] ?? []) : [];

  const showBack = step !== "direction" && step !== "success";
  const showNext = step === "direction" || step === "bus" || step === "region";

  if (!wrapper) return null;

  return createPortal(
    <>
      {/* 딤 배경 */}
      <div
        className="absolute inset-0 z-40 bg-black/40 rounded-[30px] transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* 바텀시트 */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[28px] px-[25px] pt-[28px] pb-[60px] shadow-[0_-4px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out"
        style={{ transform: `translateY(${visible ? "0%" : "100%"})` }}
      >
        {/* 핸들 */}
        <div className="w-[40px] h-[4px] bg-[#D2D2D2] rounded-full mx-auto mb-[20px]" />

        {/* 헤더 */}
        <div className="relative flex items-center justify-center mb-[24px]">
          {showBack && (
            <button
              onClick={handleBack}
              className="absolute left-0 text-[#B0B0B0]"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-[17px] font-bold text-[#3C3C3C]">
            {STEP_TITLE[step]}
          </h2>
          <button
            onClick={handleClose}
            className="absolute right-0 text-[#B0B0B0]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step: 귀가/귀교 선택 */}
        {step === "direction" && (
          <div className="flex flex-col gap-[12px] mb-[24px]">
            {(["귀가", "귀교"] as Direction[]).map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                className={`w-full h-[60px] rounded-[14px] font-semibold text-[16px] border-2 transition-all ${
                  direction === d
                    ? "bg-[#E8F8F4] border-[#05A787] text-[#05A787]"
                    : "bg-[#F7F7F7] border-transparent text-[#3C3C3C]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Step: 호차 선택 */}
        {step === "bus" && (
          <div className="flex flex-col gap-[10px] mb-[24px]">
            {buses.map((bus) => (
              <button
                key={bus}
                onClick={() => setSelectedBus(bus)}
                className={`w-full h-[56px] rounded-[14px] font-semibold text-[15px] border-2 transition-all ${
                  selectedBus === bus
                    ? "bg-[#E8F8F4] border-[#05A787] text-[#05A787]"
                    : "bg-[#F7F7F7] border-transparent text-[#3C3C3C]"
                }`}
              >
                {bus}
              </button>
            ))}
          </div>
        )}

        {/* Step: 내리는 지역 선택 */}
        {step === "region" && (
          <div className="flex flex-col gap-[10px] mb-[24px]">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`w-full h-[56px] rounded-[14px] font-semibold text-[15px] border-2 transition-all ${
                  selectedRegion === region
                    ? "bg-[#E8F8F4] border-[#05A787] text-[#05A787]"
                    : "bg-[#F7F7F7] border-transparent text-[#3C3C3C]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        )}

        {/* Step: 신청 확인 */}
        {step === "confirm" && (
          <div className="flex flex-col items-center gap-[6px] mb-[28px] py-[20px]">
            <p className="text-[17px] font-bold text-[#3C3C3C]">
              정말 신청하시겠습니까?
            </p>
            <p className="text-[14px] text-[#888888] font-medium mt-[4px]">
              {direction} · {selectedBus}
              {selectedRegion && ` · ${selectedRegion}`}
            </p>
            <p className="text-[12px] text-[#B0B0B0] font-medium mt-[2px]">
              신청 후에는 수정할 수 없습니다.
            </p>
          </div>
        )}

        {/* Step: 신청 완료 */}
        {step === "success" && (
          <div className="flex flex-col items-center gap-[12px] mb-[28px] py-[20px]">
            <div className="w-[60px] h-[60px] bg-[#E8F8F4] rounded-full flex items-center justify-center">
              <Bus size={28} color="#05A787" />
            </div>
            <p className="text-[17px] font-bold text-[#3C3C3C] mt-[4px]">
              신청이 완료되었습니다!
            </p>
            <p className="text-[13px] text-[#888888] font-medium">
              {direction} · {selectedBus}
              {selectedRegion && ` · ${selectedRegion}`}
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
              onClick={() => setStep("success")}
              className="w-full h-[56px] bg-[#05A787] rounded-[14px] text-white font-semibold text-[16px] active:opacity-80 transition-opacity"
            >
              확인
            </button>
            <button
              onClick={handleBack}
              className="w-full h-[56px] bg-[#F0F0F0] rounded-[14px] text-[#3C3C3C] font-semibold text-[16px] active:opacity-80 transition-opacity"
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
    </>,
    wrapper,
  );
}
