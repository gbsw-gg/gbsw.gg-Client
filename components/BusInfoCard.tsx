"use client";

import { CalendarDays, Clock } from "lucide-react";

interface BusInfoCardProps {
  busNumber: string;
  week: string;
  departureDate: string;
  departureTime: string;
  onChangeBus?: () => void;
}

export default function BusInfoCard({
  busNumber,
  week,
  departureDate,
  departureTime,
  onChangeBus,
}: BusInfoCardProps) {
  return (
    <div className="mx-[25px] mt-[20px] bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.15)]">
      <div className="mx-[25px] py-[20px]">
        <div className="pb-[12px] border-b border-[#D2D2D2]">
          <p className="text-[12px] font-medium text-[#474747]">배정 버스</p>
          <div className="flex items-center justify-between mt-[2px]">
            <h2 className="text-[24px] font-bold text-[#3C3C3C]">
              {busNumber}
            </h2>
            {onChangeBus && (
              <button
                onClick={onChangeBus}
                className="text-[12px] font-semibold text-[#05A787] bg-[#E8F8F4] px-[10px] py-[5px] rounded-[8px] active:opacity-70 transition-opacity"
              >
                변경
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[12px] mt-[14px]">
          <div className="flex items-center gap-[8px]">
            <CalendarDays size={16} color="#3C3C3C" />
            <p className="font-medium text-[14px] text-[#3C3C3C]">{week}</p>
          </div>
          <div className="flex items-center gap-[8px]">
            <Clock size={16} color="#3C3C3C" />
            <p className="font-medium text-[14px] text-[#3C3C3C]">
              출발: {departureDate} {departureTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}