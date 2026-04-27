import { CheckCircle, XCircle, Info } from "lucide-react";

type StatusType = "미확인" | "탑승 완료" | "미탑승";

interface StatusCardProps {
  status: StatusType;
  timestamp?: string;
  reason?: string;
}

const statusConfig: Record<
  StatusType,
  {
    color: string;
    borderColor: string;
    bgColor: string;
    icon: React.ReactNode;
  }
> = {
  미확인: {
    color: "#3C3C3C",
    borderColor: "transparent",
    bgColor: "white",
    icon: <Info size={28} color="#B0B0B0" />,
  },
  "탑승 완료": {
    color: "#10B981",
    borderColor: "#10B981",
    bgColor: "white",
    icon: <CheckCircle size={28} color="#10B981" />,
  },
  미탑승: {
    color: "#EF4444",
    borderColor: "#EF4444",
    bgColor: "white",
    icon: <XCircle size={28} color="#EF4444" />,
  },
};

export default function StatusCard({ status, timestamp, reason }: StatusCardProps) {
  const config = statusConfig[status];

  return (
    <div
      className="mx-[25px] mt-[14px] bg-white rounded-[20px] shadow-[0_4px_10px_0_rgba(0,0,0,0.15)]"
      style={{ border: `2px solid ${config.borderColor}` }}
    >
      <div className="mx-[25px] py-[20px] flex justify-between items-center">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[12px] font-medium text-[#474747]">현재 상태</p>
          <h2 className="text-[24px] font-bold" style={{ color: config.color }}>
            {status}
          </h2>
          {timestamp && (
            <p className="text-[12px] text-[#888888] font-medium mt-[2px]">{timestamp}</p>
          )}
          {reason && (
            <p className="text-[12px] text-[#888888] font-medium">사유: {reason}</p>
          )}
        </div>
        <div>{config.icon}</div>
      </div>
    </div>
  );
}