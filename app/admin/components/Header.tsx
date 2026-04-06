"use client";

import { LogOut, ChartColumn, CalendarDays, UsersRound } from "lucide-react";

type Menu = "dashboard" | "round";

export default function Header({ selected, onSelect }: { selected: Menu; onSelect: (menu: Menu) => void }) {
  const bg = (key: Menu) => selected === key ? "bg-white" : "bg-[#03977A]";
  const color = (key: Menu) => selected === key ? "#03977A" : "white";
  const text = (key: Menu) => selected === key ? "text-[#03977A]" : "text-white";

  return (
    <div className="w-full h-53.75 bg-[#02AB87] px-6.25 py-5 flex flex-col">
      <div className="w-full h-auto flex flex-row justify-between items-center mt-15">
        <div className="w-auto h-full flex flex-col justify-between gap-2.5">
          <p className="text-[24px] font-bold text-white">관리자</p>
          <p className="text-[14px] font-medium text-white">교사 (username)</p>
        </div>
        <LogOut color="white" size={24} className="cursor-pointer" />
      </div>

      <div className="w-full h-7.5 flex flex-row mt-5 gap-4">
        <div onClick={() => onSelect("dashboard")} className={`w-auto h-full px-2.5 flex justify-center items-center rounded-lg gap-2 cursor-pointer ${bg("dashboard")}`}>
          <ChartColumn color={color("dashboard")} size={12} />
          <p className={`text-[12px] font-medium select-none ${text("dashboard")}`}>대시보드</p>
        </div>

        <div onClick={() => onSelect("round")} className={`w-auto h-full px-2.5 flex justify-center items-center rounded-lg gap-2 cursor-pointer ${bg("round")}`}>
          <CalendarDays color={color("round")} size={12} />
          <p className={`text-[12px] font-medium select-none ${text("round")}`}>회차 관리</p>
        </div>
      </div>
    </div>
  );
}
