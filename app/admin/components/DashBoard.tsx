import { ChevronRight } from "lucide-react";

interface Props {
  onSelectBus: (busId: number) => void;
}

export default function DashBoard({ onSelectBus }: Props) {
  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="w-full h-auto px-6.25 py-5 bg-white flex flex-col rounded-[20px] shadow-sm">
        <p className="text-[#3c3c3c] text-[20px] font-bold">전체 현황</p>
        <p className="text-[14px] text-[#747474] font-medium mt-4">
          회차 이름 ex) 2026년 3월 2주차 귀가
        </p>
        <p className="text-[14px] text-[#747474] font-medium">
          출발 시간 ex) 출발: 2026-03-20 14:30
        </p>

        <div className="w-full h-px bg-[#d2d2d2] my-5" />

        <div className="w-full h-auto flex flex-row justify-between">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-black">전체 인원</p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#10B981]">탑승 완료</p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
        </div>

        <div className="w-full h-auto flex flex-row justify-between mt-6.25">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#FACC15]">
              사전 미탑승
            </p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#EF4444]">미확인</p>
            <p className="text-[24px] font-bold text-black">N명</p>
          </div>
        </div>
      </div>

      <p className="text-[20px] font-bold text-[#3c3c3c] my-5">호차별 현황</p>

      <div className="w-full h-auto flex flex-col gap-5">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} onClick={() => onSelectBus(item)} className="w-full h-auto flex flex-col p-5 rounded-[20px] shadow-sm cursor-pointer">
            <div className="w-full flex flex-row justify-between">
              <p className="text-[20px] font-bold text-[#3c3c3c]">{item}호차</p>
              <ChevronRight color="#3c3c3c" />
            </div>
            <p className="text-[12px] text-[#3c3c3c] font-medium">
              대표자: LEADER_NAME
            </p>

            <div className="w-full h-auto flex flex-row gap-9 mt-4">
              {["전체", "사전 미탑승", "미확인", "탑승 완료"].map((label) => (
                <div key={label} className="w-auto h-auto flex flex-col items-center">
                  <p className="text-[10px] text-black font-medium">{label}</p>
                  <p className="text-[14px] text-black font-bold">0</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
