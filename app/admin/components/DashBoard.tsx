import { ChevronRight } from "lucide-react";

interface Props {
  onSelectBus: (busId: number) => void;
}

const buses: { id: number; leader: string; total: number; boarded: number; preAbsent: number; unknown: number }[] = [];

export default function DashBoard({ onSelectBus }: Props) {
  const total = buses.reduce((s, b) => s + b.total, 0);
  const boarded = buses.reduce((s, b) => s + b.boarded, 0);
  const preAbsent = buses.reduce((s, b) => s + b.preAbsent, 0);
  const unknown = buses.reduce((s, b) => s + b.unknown, 0);

  return (
    <div className="w-full h-auto p-6.25 bg-white flex flex-col">
      <div className="w-full h-auto px-6.25 py-5 bg-white flex flex-col rounded-[20px] shadow-sm">
        <p className="text-[#3c3c3c] text-[20px] font-bold">전체 현황</p>
        <p className="text-[14px] text-[#747474] font-medium mt-4"></p>
        <p className="text-[14px] text-[#747474] font-medium"></p>

        <div className="w-full h-px bg-[#d2d2d2] my-5" />

        <div className="w-full h-auto flex flex-row justify-between">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-black">전체 인원</p>
            <p className="text-[24px] font-bold text-black">{total}명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#10B981]">탑승 완료</p>
            <p className="text-[24px] font-bold text-black">{boarded}명</p>
          </div>
        </div>

        <div className="w-full h-auto flex flex-row justify-between mt-6.25">
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#FACC15]">
              사전 미탑승
            </p>
            <p className="text-[24px] font-bold text-black">{preAbsent}명</p>
          </div>
          <div className="w-[50%] h-auto flex flex-col justify-between">
            <p className="text-[12px] font-medium text-[#EF4444]">미확인</p>
            <p className="text-[24px] font-bold text-black">{unknown}명</p>
          </div>
        </div>
      </div>

      <p className="text-[20px] font-bold text-[#3c3c3c] my-5">호차별 현황</p>

      <div className="w-full h-auto flex flex-col gap-5">
        {buses.map((bus) => (
          <div key={bus.id} onClick={() => onSelectBus(bus.id)} className="w-full h-auto flex flex-col p-5 rounded-[20px] shadow-sm cursor-pointer">
            <div className="w-full flex flex-row justify-between">
              <p className="text-[20px] font-bold text-[#3c3c3c]">{bus.id}호차</p>
              <ChevronRight color="#3c3c3c" />
            </div>
            <p className="text-[12px] text-[#3c3c3c] font-medium">
              대표자: {bus.leader}
            </p>

            <div className="w-full h-auto flex flex-row gap-9 mt-4">
              {[
                { label: '전체', value: bus.total },
                { label: '사전 미탑승', value: bus.preAbsent },
                { label: '미확인', value: bus.unknown },
                { label: '탑승 완료', value: bus.boarded },
              ].map((item) => (
                <div key={item.label} className="w-auto h-auto flex flex-col items-center">
                  <p className="text-[10px] text-black font-medium">{item.label}</p>
                  <p className="text-[14px] text-black font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
